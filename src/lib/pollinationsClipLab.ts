import { getPollinationsKey } from "@/lib/pollinationsAshAi"
import { resolvePollinationsReferenceImageUrl } from "@/lib/pollinationsMediaUpload"

const POLLINATIONS_BASE_URL = "https://gen.pollinations.ai"
export const POLLINATIONS_LTX2_MODEL = "ltx-2" as const
export const POLLINATIONS_NOVA_REEL_MODEL = "nova-reel" as const

export const CLIP_LAB_MODEL_OPTIONS = [
  {
    id: POLLINATIONS_LTX2_MODEL,
    label: "LTX-2.3",
    shortLabel: "LTX-2",
    description: "Fast clips · lowest pollen cost",
  },
  {
    id: POLLINATIONS_NOVA_REEL_MODEL,
    label: "Nova Reel",
    shortLabel: "Nova Reel",
    description: "720p · higher quality · longer clips",
  },
] as const

export type ClipLabModelId = (typeof CLIP_LAB_MODEL_OPTIONS)[number]["id"]

export const CLIP_LAB_DEFAULT_MODEL: ClipLabModelId = POLLINATIONS_LTX2_MODEL

export type ClipLabDuration = 4 | 6 | 8 | 12 | 18

export const CLIP_LAB_LTX2_DURATIONS: readonly ClipLabDuration[] = [4, 6, 8] as const
export const CLIP_LAB_NOVA_REEL_DURATIONS: readonly ClipLabDuration[] = [6, 12, 18] as const

/** @deprecated Use getClipLabDurationsForModel instead */
export const CLIP_LAB_DURATIONS = CLIP_LAB_LTX2_DURATIONS

export const CLIP_LAB_MODEL_STORAGE_KEY = "clip-lab-model-v1"
export const CLIP_LAB_DURATION_STORAGE_KEY = "clip-lab-duration-v5"

const CLIP_LAB_MODEL_IDS = new Set<string>(CLIP_LAB_MODEL_OPTIONS.map((o) => o.id))

export function getClipLabDurationsForModel(
  model: ClipLabModelId
): readonly ClipLabDuration[] {
  return model === POLLINATIONS_NOVA_REEL_MODEL
    ? CLIP_LAB_NOVA_REEL_DURATIONS
    : CLIP_LAB_LTX2_DURATIONS
}

export function getClipLabModelShortLabel(model: ClipLabModelId): string {
  return (
    CLIP_LAB_MODEL_OPTIONS.find((option) => option.id === model)?.shortLabel ??
    model
  )
}

export function getDefaultClipLabDuration(model: ClipLabModelId): ClipLabDuration {
  return getClipLabDurationsForModel(model)[0]
}

export function normalizeClipLabDuration(
  model: ClipLabModelId,
  duration: number
): ClipLabDuration {
  const allowed = getClipLabDurationsForModel(model)
  if (allowed.includes(duration as ClipLabDuration)) {
    return duration as ClipLabDuration
  }
  return allowed[0]
}

export function getStoredClipLabModel(): ClipLabModelId {
  if (typeof window === "undefined") return CLIP_LAB_DEFAULT_MODEL
  try {
    const raw = window.sessionStorage.getItem(CLIP_LAB_MODEL_STORAGE_KEY)
    if (raw && CLIP_LAB_MODEL_IDS.has(raw)) return raw as ClipLabModelId
  } catch {
    /* private mode / quota */
  }
  return CLIP_LAB_DEFAULT_MODEL
}

export function setStoredClipLabModel(model: ClipLabModelId) {
  if (!CLIP_LAB_MODEL_IDS.has(model)) return
  try {
    window.sessionStorage.setItem(CLIP_LAB_MODEL_STORAGE_KEY, model)
  } catch {
    /* ignore */
  }
}

export function readStoredClipLabDuration(model: ClipLabModelId): ClipLabDuration {
  if (typeof window === "undefined") return getDefaultClipLabDuration(model)
  try {
    const raw = window.sessionStorage.getItem(CLIP_LAB_DURATION_STORAGE_KEY)
    if (!raw) return getDefaultClipLabDuration(model)
    const parsed = JSON.parse(raw) as {
      durations?: Partial<Record<ClipLabModelId, unknown>>
      duration?: unknown
    }
    const fromMap = parsed.durations?.[model]
    if (typeof fromMap === "number") {
      return normalizeClipLabDuration(model, fromMap)
    }
    if (typeof parsed.duration === "number") {
      return normalizeClipLabDuration(model, parsed.duration)
    }
  } catch {
    /* ignore */
  }
  return getDefaultClipLabDuration(model)
}

export function writeStoredClipLabDuration(
  model: ClipLabModelId,
  duration: ClipLabDuration
) {
  if (typeof window === "undefined") return
  try {
    const raw = window.sessionStorage.getItem(CLIP_LAB_DURATION_STORAGE_KEY)
    const parsed = raw
      ? (JSON.parse(raw) as { durations?: Partial<Record<ClipLabModelId, number>> })
      : {}
    const durations = { ...parsed.durations, [model]: duration }
    window.sessionStorage.setItem(
      CLIP_LAB_DURATION_STORAGE_KEY,
      JSON.stringify({ durations })
    )
  } catch {
    /* ignore */
  }
}

export const CLIP_LAB_PLACEHOLDER_HINTS = [
  "rainy desk, warm lamp glow…",
  "city lights through a window…",
  "steam rising from coffee…",
] as const

export type ClipLabGenerateInput = {
  model?: ClipLabModelId
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

function normalizeClipLabErrorMessage(
  message: string,
  model: ClipLabModelId
): string {
  const trimmed = message.trim()
  if (!trimmed) return "Could not generate clip."
  if (/cancel/i.test(trimmed)) {
    const label = getClipLabModelShortLabel(model)
    return `${label} cancelled this render — wait a moment and try again.`
  }
  return trimmed
}

function formatFailureMessage(
  status: number,
  body: Record<string, unknown>,
  model: ClipLabModelId
): string {
  const err = body.error
  if (err && typeof err === "object" && err !== null) {
    const msg = (err as { message?: unknown }).message
    if (typeof msg === "string" && msg.trim()) return msg.trim()
  }
  const top = body.message
  if (typeof top === "string" && top.trim()) return top.trim()
  return normalizeClipLabErrorMessage(`Could not generate clip (${status}).`, model)
}

export async function generateClipLabVideo(
  input: ClipLabGenerateInput
): Promise<PollinationsClipLabResult> {
  const model = input.model ?? CLIP_LAB_DEFAULT_MODEL
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
    model,
    duration: String(input.durationSeconds),
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
        message: formatFailureMessage(response.status, parsed, model),
      }
    }
    if (response.status === 402) {
      const parsed = (await response.json().catch(() => ({}))) as Record<string, unknown>
      return {
        ok: false,
        code: "payment",
        message: formatFailureMessage(response.status, parsed, model),
      }
    }
    if (!response.ok) {
      const parsed = (await response.json().catch(() => ({}))) as Record<string, unknown>
      return {
        ok: false,
        code: "bad_request",
        message: formatFailureMessage(response.status, parsed, model),
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
          remote || "The API returned no video.",
          model
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
