import { getPollinationsKey } from "@/lib/pollinationsAshAi"
import { resolvePollinationsReferenceImageUrl } from "@/lib/pollinationsMediaUpload"

const POLLINATIONS_BASE_URL = "https://gen.pollinations.ai"

/** @deprecated No longer used in UI; kept so older HMR bundles that import it still load. */
export const POLLINATIONS_ENTER_URL = "https://enter.pollinations.ai"

/** Pollinations name for GPT Image 1 Mini (`gptimage` · aliases include `gpt-image-1-mini`). */
export const POLLINATIONS_GPT_IMAGE_MINI_MODEL = "gptimage" as const

export type PollinationsStickerImageResult =
  | { ok: true; dataUrl: string }
  | {
      ok: false
      code:
        | "no_key"
        | "forbidden"
        | "payment"
        | "bad_request"
        | "empty"
        | "network"
      message: string
    }

function buildStickerPrompt(userIdea: string, hasReference: boolean): string {
  const idea = userIdea.trim()
  const refClause = hasReference
    ? "Use the provided reference image for identity, pose, palette, or composition where it helps; restyle into the sticker treatment below. "
    : ""
  return [
    refClause,
    "Die-cut sticker graphic, similar energy to playful chat reaction stickers:",
    "bold readable silhouette, thick friendly outline, soft cel shading, expressive face or object if applicable,",
    "centered composition, high contrast, works at small sizes.",
    "Plain flat background (solid color or very soft gradient), not transparent — we will cut out mentally.",
    "No phone mockup, no watermark, no UI chrome, no screenshot frame.",
    idea ? `Subject / vibe: ${idea}` : "Subject / vibe: surprise me with a cheerful abstract sticker.",
  ].join(" ")
}

type ImagesResponse = {
  data?: { b64_json?: string; url?: string }[]
  error?: { message?: string; code?: string }
  success?: boolean
  message?: string
}

function formatPollinationsFailureMessage(
  status: number,
  body: Record<string, unknown>
): string {
  const err = body.error
  if (err && typeof err === "object" && err !== null) {
    const msg = (err as { message?: unknown }).message
    if (typeof msg === "string" && msg.trim()) return msg.trim()
  }
  const top = body.message
  if (typeof top === "string" && top.trim()) return top.trim()
  const details = body.details as { fieldErrors?: Record<string, string[]> } | undefined
  const fe = details?.fieldErrors
  if (fe && typeof fe === "object") {
    const first = Object.values(fe).flat()[0]
    if (typeof first === "string" && first.trim()) return first.trim()
  }
  return `Could not generate image (${status}).`
}

export async function generateAshStickerImage(
  userPrompt: string,
  options?: { signal?: AbortSignal; referenceImageDataUrl?: string | null }
): Promise<PollinationsStickerImageResult> {
  const apiKey = getPollinationsKey().trim()
  if (!apiKey) {
    return {
      ok: false,
      code: "no_key",
      message:
        "Missing Pollinations key. Set POLLINATIONS_API_KEY or VITE_POLLINATIONS_API_KEY.",
    }
  }

  const ref = options?.referenceImageDataUrl?.trim() ?? ""
  const hasReference = Boolean(ref)
  const prompt = buildStickerPrompt(userPrompt, hasReference)

  let imageUrl: string | undefined
  if (hasReference) {
    const resolved = await resolvePollinationsReferenceImageUrl(
      ref,
      apiKey,
      options?.signal
    )
    if (!resolved.ok) {
      return { ok: false, code: "bad_request", message: resolved.message }
    }
    imageUrl = resolved.url
  }

  const body: Record<string, unknown> = {
    model: POLLINATIONS_GPT_IMAGE_MINI_MODEL,
    prompt,
    size: "1024x1024",
    quality: "medium",
    response_format: "b64_json",
  }
  /** OpenAPI: `image` is a string of reference URL(s), not an object. */
  if (imageUrl) {
    body.image = imageUrl
  }

  try {
    const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: options?.signal,
      body: JSON.stringify(body),
    })

    const parsed = (await response.json().catch(() => ({}))) as
      | ImagesResponse
      | Record<string, unknown>

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        code: "forbidden",
        message: formatPollinationsFailureMessage(
          response.status,
          parsed as Record<string, unknown>
        ),
      }
    }
    if (response.status === 402) {
      return {
        ok: false,
        code: "payment",
        message: formatPollinationsFailureMessage(
          response.status,
          parsed as Record<string, unknown>
        ),
      }
    }
    if (!response.ok) {
      return {
        ok: false,
        code: "bad_request",
        message: formatPollinationsFailureMessage(
          response.status,
          parsed as Record<string, unknown>
        ),
      }
    }

    const success = parsed as ImagesResponse
    const first = success.data?.[0]
    const b64 = first?.b64_json?.trim()
    if (b64) {
      return { ok: true, dataUrl: `data:image/png;base64,${b64}` }
    }
    const url = first?.url?.trim()
    if (url) {
      return { ok: true, dataUrl: url }
    }
    return {
      ok: false,
      code: "empty",
      message: "The API returned no image data.",
    }
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError"
    if (aborted) {
      return { ok: false, code: "network", message: "Cancelled." }
    }
    return {
      ok: false,
      code: "network",
      message: "Network error while contacting Pollinations.",
    }
  }
}
