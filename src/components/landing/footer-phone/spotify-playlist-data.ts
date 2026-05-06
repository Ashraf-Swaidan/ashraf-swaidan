export type SpotifyPlaylist = {
  id: string
  title: string
  embedUrl: string
  openUrl: string
  accent: string
  isUserAdded?: boolean
}

const USER_ACCENT_POOL = [
  "from-[#2a1a3a] via-[#1a0d28] to-[#120a1f]",
  "from-[#1a2a3a] via-[#0d1828] to-[#0a121f]",
  "from-[#3a281a] via-[#28180d] to-[#1f120a]",
  "from-[#1a3a35] via-[#0d2824] to-[#0a1f1c]",
  "from-[#2a2a1a] via-[#18180d] to-[#12120a]",
] as const

export const SPOTIFY_CUSTOM_PLAYLISTS_KEY = "phone-spotify-custom-playlists-v1"

export function buildEmbedUrl(id: string): string {
  return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`
}

export function buildOpenUrl(id: string): string {
  return `https://open.spotify.com/playlist/${id}`
}

/** Curated defaults; titles are fallbacks until oEmbed loads. */
export const DEFAULT_SPOTIFY_PLAYLISTS: SpotifyPlaylist[] = [
  {
    id: "737LRch9b0UHtYFOa6kS6V",
    title: "Ashraf Radio",
    embedUrl: buildEmbedUrl("737LRch9b0UHtYFOa6kS6V"),
    openUrl:
      "https://open.spotify.com/playlist/737LRch9b0UHtYFOa6kS6V?si=gtcs8queRZKw5D5-d8Pq_w",
    accent: "from-[#1a3a2a] via-[#0d2818] to-[#0a1f12]",
  },
  {
    id: "6j4Eql5sGouP3ERQSUSkvn",
    title: "Playlist",
    embedUrl: buildEmbedUrl("6j4Eql5sGouP3ERQSUSkvn"),
    openUrl:
      "https://open.spotify.com/playlist/6j4Eql5sGouP3ERQSUSkvn?si=cmPjsVI0R_WksU12Kg0owg",
    accent: "from-[#2a1a3a] via-[#1a0d28] to-[#120a1f]",
  },
]

export function accentForUserIndex(i: number): string {
  return USER_ACCENT_POOL[i % USER_ACCENT_POOL.length]!
}

/**
 * Accepts share URLs, open.spotify.com links, Spotify URIs, or a bare playlist id.
 */
export function parseSpotifyPlaylistId(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null

  const uri = t.match(/spotify:playlist:([a-zA-Z0-9]+)/i)
  if (uri?.[1]) return uri[1]

  const fromUrl = t.match(/\/playlist\/([a-zA-Z0-9]+)/i)
  if (fromUrl?.[1]) return fromUrl[1]

  if (/^[a-zA-Z0-9]{22}$/.test(t)) return t

  return null
}

export function loadCustomSpotifyPlaylistIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(SPOTIFY_CUSTOM_PLAYLISTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === "string")
  } catch {
    return []
  }
}

export function saveCustomSpotifyPlaylistIds(ids: string[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(SPOTIFY_CUSTOM_PLAYLISTS_KEY, JSON.stringify(ids))
  } catch {
    /* ignore quota / private mode */
  }
}

export function mergeSpotifyPlaylists(
  customIds: string[]
): SpotifyPlaylist[] {
  const defaults = DEFAULT_SPOTIFY_PLAYLISTS
  const seen = new Set(defaults.map((p) => p.id))
  const extras: SpotifyPlaylist[] = []
  let userIdx = 0
  for (const id of customIds) {
    if (seen.has(id)) continue
    seen.add(id)
    extras.push({
      id,
      title: "Playlist",
      embedUrl: buildEmbedUrl(id),
      openUrl: buildOpenUrl(id),
      accent: accentForUserIndex(userIdx),
      isUserAdded: true,
    })
    userIdx += 1
  }
  return [...defaults, ...extras]
}
