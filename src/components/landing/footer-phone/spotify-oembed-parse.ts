/**
 * Split Spotify oEmbed `title` into a primary line (playlist / track name)
 * and a subtitle (creator or artist), for compact “now playing” UI.
 */
export function spotifyOembedToNotificationLines(
  raw: string | undefined,
  fallbackTitle: string
): { title: string; artist: string } {
  const t = (raw ?? "").trim() || fallbackTitle.trim()
  if (!t) return { title: fallbackTitle, artist: "Spotify" }

  const dot = t.indexOf(" · ")
  if (dot >= 0) {
    const left = t.slice(0, dot).trim()
    const right = t.slice(dot + 3).trim()
    const byInRight = right.match(/\bby\s+(.+)/i)
    if (byInRight) {
      return { title: left || fallbackTitle, artist: byInRight[1]!.trim() }
    }
    return { title: left || fallbackTitle, artist: right || "Spotify" }
  }

  const byMatch = t.match(/^(.+?)\s+by\s+(.+)$/i)
  if (byMatch) {
    return {
      title: byMatch[1]!.trim() || fallbackTitle,
      artist: byMatch[2]!.trim(),
    }
  }

  const dash = t.match(/^(.+?)\s*[–—-]\s*(.+)$/)
  if (dash) {
    const left = dash[1]!.trim()
    const right = dash[2]!.trim()
    if (left && right) return { title: left, artist: right }
  }

  return { title: t, artist: "Spotify" }
}
