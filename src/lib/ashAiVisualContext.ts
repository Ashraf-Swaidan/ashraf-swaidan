export const ASH_AI_HANDOFF_EVENT = "footer-phone:ash-ai-handoff" as const

export type AshAiHandoffDetail = {
  /** Full user message sent to the model (includes context). */
  userText: string
  /** Optional same-origin asset path or absolute URL for vision-capable models. */
  imageSrc?: string
  /** Short label for debugging / future UI. */
  sourceLabel?: string
}

export function requestAshAiHandoff(detail: AshAiHandoffDetail) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent<AshAiHandoffDetail>(ASH_AI_HANDOFF_EVENT, { detail })
  )
}

export function absolutizePublicAssetUrl(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src
  if (typeof window === "undefined") return src
  const path = src.startsWith("/") ? src : `/${src}`
  return `${window.location.origin}${path}`
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error ?? new Error("read failed"))
    r.readAsDataURL(blob)
  })
}

/**
 * Loads an image from the app (same-origin paths or absolute URLs the browser can read)
 * and returns a data URL so Pollinations can ingest pixels without fetching your dev server.
 */
export async function fetchImageAsDataUrlForVision(
  src: string
): Promise<string | null> {
  if (typeof window === "undefined") return null
  const t = src.trim()
  if (!t) return null
  if (t.startsWith("data:")) return t
  const url = absolutizePublicAssetUrl(t)
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" })
    if (!res.ok) return null
    const blob = await res.blob()
    if (!blob.size) return null
    return await blobToDataUrl(blob)
  } catch {
    return null
  }
}
