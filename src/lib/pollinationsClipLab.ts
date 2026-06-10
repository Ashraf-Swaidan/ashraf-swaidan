import { getPollinationsKey } from "@/lib/pollinationsAshAi"
import { resolvePollinationsReferenceImageUrl } from "@/lib/pollinationsMediaUpload"

const POLLINATIONS_BASE_URL = "https://gen.pollinations.ai"
export const POLLINATIONS_LTX2_MODEL = "ltx-2" as const

export type ClipLabDuration = 4 | 6 | 8

export const CLIP_LAB_DURATIONS: readonly ClipLabDuration[] = [4, 6, 8] as const

export const CLIP_LAB_PLACEHOLDER_HINTS = [
  "rainy desk, warm lamp glow…",
  "city lights through a window…",
  "steam rising from coffee…",
] as const

export type ClipLabGenerateInput = {
  scene: string
  durationSeconds: ClipLabDuration
  referenceImageDataUrl?: string | null
  signal?: AbortSignal
}

export type PollinationsClipLabResult =
  | { ok: true; objectUrl: string; mimeType: string }
  | {
      ok: false
      code: "no_key" | "forbidden" | "payment" | "bad_request" | "empty" | "network"
      message: string
    }

/** User text only — no wrappers. Empty when generating from a reference image alone. */
export function buildClipPrompt(input: {
  scene: string
  hasReferenceImage?: boolean
}): string {
  const scene = input.scene.trim()
  if (!scene && !input.hasReferenceImage) {
    throw new Error("Scene prompt or reference image is required.")
  }
  return scene
}

function normalizeClipLabErrorMessage(message: string): string {
  const trimmed = message.trim()
  if (!trimmed) return "Could not generate clip."
  if (/cancel/i.test(trimmed)) {
    return "LTX-2 cancelled this render — wait a moment and try again."
  }
  return trimmed
}

function formatFailureMessage(status: number, body: Record<string, unknown>): string {
  const err = body.error
  if (err && typeof err === "object" && err !== null) {
    const msg = (err as { message?: unknown }).message
    if (typeof msg === "string" && msg.trim()) return msg.trim()
  }
  const top = body.message
  if (typeof top === "string" && top.trim()) return top.trim()
  return normalizeClipLabErrorMessage(`Could not generate clip (${status}).`)
}

export async function generateClipLabVideo(
  input: ClipLabGenerateInput
): Promise<PollinationsClipLabResult> {
  const apiKey = getPollinationsKey().trim()
  if (!apiKey) {
    return {
      ok: false,
      code: "no_key",
      message:
        "Missing Pollinations key. Set POLLINATIONS_API_KEY or VITE_POLLINATIONS_API_KEY.",
    }
  }

  const ref = input.referenceImageDataUrl?.trim() ?? ""
  const hasReference = Boolean(ref)

  const prompt = buildClipPrompt({
    scene: input.scene,
    hasReferenceImage: hasReference,
  })

  let referenceImageUrl: string | undefined
  if (hasReference) {
    const resolved = await resolvePollinationsReferenceImageUrl(
      ref,
      apiKey,
      input.signal
    )
    if (!resolved.ok) {
      return { ok: false, code: "bad_request", message: resolved.message }
    }
    referenceImageUrl = resolved.url
  }

  const params = new URLSearchParams({
    model: POLLINATIONS_LTX2_MODEL,
    duration: String(input.durationSeconds),
    /** LTX-2 defaults to audio on; Pollinations still may ignore this. */
    audio: "false",
  })
  if (referenceImageUrl) {
    params.set("image", referenceImageUrl)
  }

  const promptSegment = prompt ? encodeURIComponent(prompt) : ""
  const url = `${POLLINATIONS_BASE_URL}/video/${promptSegment}?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: input.signal,
    })

    const contentType = response.headers.get("content-type") ?? ""

    if (response.status === 401 || response.status === 403) {
      const parsed = (await response.json().catch(() => ({}))) as Record<string, unknown>
      return {
        ok: false,
        code: "forbidden",
        message: formatFailureMessage(response.status, parsed),
      }
    }
    if (response.status === 402) {
      const parsed = (await response.json().catch(() => ({}))) as Record<string, unknown>
      return {
        ok: false,
        code: "payment",
        message: formatFailureMessage(response.status, parsed),
      }
    }
    if (!response.ok) {
      const parsed = (await response.json().catch(() => ({}))) as Record<string, unknown>
      return {
        ok: false,
        code: "bad_request",
        message: formatFailureMessage(response.status, parsed),
      }
    }

    if (contentType.includes("application/json")) {
      const parsed = (await response.json()) as {
        url?: string
        data?: { url?: string }[]
        error?: { message?: string }
      }
      const remote =
        parsed.url?.trim() ||
        parsed.data?.[0]?.url?.trim() ||
        parsed.error?.message?.trim()
      if (remote && remote.startsWith("http")) {
        return { ok: true, objectUrl: remote, mimeType: "video/mp4" }
      }
      return {
        ok: false,
        code: "empty",
        message: normalizeClipLabErrorMessage(
          remote || "The API returned no video."
        ),
      }
    }

    const blob = await response.blob()
    if (!blob.size) {
      return { ok: false, code: "empty", message: "The API returned an empty clip." }
    }

    const mimeType = blob.type || "video/mp4"
    const objectUrl = URL.createObjectURL(blob)
    return { ok: true, objectUrl, mimeType }
  } catch (err) {
    const aborted =
      input.signal?.aborted ||
      (err instanceof DOMException && err.name === "AbortError")
    if (aborted) {
      return { ok: false, code: "network", message: "Cancelled." }
    }
    const message =
      err instanceof Error && err.message.trim()
        ? err.message.trim()
        : "Network error while contacting Pollinations."
    return {
      ok: false,
      code: "network",
      message,
    }
  }
}
