const POLLINATIONS_BASE_URL = "https://gen.pollinations.ai"
const POLLINATIONS_MEDIA_UPLOAD_URL = "https://media.pollinations.ai/upload"

function absolutizeMediaUrl(url: string): string {
  const t = url.trim()
  if (t.startsWith("https://") || t.startsWith("http://")) return t
  if (t.startsWith("/")) return `https://media.pollinations.ai${t}`
  return `https://media.pollinations.ai/${t}`
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl)
  if (!res.ok) throw new Error("Could not read image data")
  return res.blob()
}

/**
 * Upload a data URL (or pass through https) so Pollinations APIs receive a normal image URL.
 */
export async function resolvePollinationsReferenceImageUrl(
  ref: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const trimmed = ref.trim()
  if (!trimmed) return { ok: false, message: "Missing reference image." }

  if (trimmed.startsWith("https://")) {
    return { ok: true, url: trimmed }
  }
  if (trimmed.startsWith("http://")) {
    return { ok: true, url: trimmed.replace(/^http:\/\//i, "https://") }
  }

  if (!trimmed.startsWith("data:")) {
    return {
      ok: false,
      message: "Reference must be a photo (data URL or https link).",
    }
  }

  try {
    const blob = await dataUrlToBlob(trimmed)
    const uploadTargets = [
      POLLINATIONS_MEDIA_UPLOAD_URL,
      `${POLLINATIONS_BASE_URL}/upload`,
    ]

    let lastFail = "Could not upload reference image."

    for (const uploadUrl of uploadTargets) {
      const form = new FormData()
      form.append("file", blob, "reference.jpg")

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal,
      })

      const uploadBody = (await uploadRes.json().catch(() => ({}))) as {
        url?: unknown
        error?: { message?: string }
        message?: string
      }

      if (!uploadRes.ok) {
        const fromErr =
          typeof uploadBody.error?.message === "string"
            ? uploadBody.error.message.trim()
            : ""
        const fromTop =
          typeof uploadBody.message === "string" ? uploadBody.message.trim() : ""
        lastFail =
          fromErr ||
          fromTop ||
          `Could not upload reference image (${uploadRes.status}).`
        continue
      }

      const rawUrl = uploadBody.url
      if (typeof rawUrl === "string" && rawUrl.trim()) {
        return { ok: true, url: absolutizeMediaUrl(rawUrl) }
      }
      lastFail = "Upload succeeded but no image URL returned."
    }

    return { ok: false, message: lastFail }
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === "AbortError"
    if (aborted) return { ok: false, message: "Cancelled." }
    return {
      ok: false,
      message: "Could not upload reference image for generation.",
    }
  }
}
