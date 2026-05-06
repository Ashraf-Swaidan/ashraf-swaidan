import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { ChevronLeft, Link2, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { DISPLAY_FONT, PHONE_ASSET_ROOT } from "./constants"
import {
  DEFAULT_SPOTIFY_PLAYLISTS,
  loadCustomSpotifyPlaylistIds,
  mergeSpotifyPlaylists,
  parseSpotifyPlaylistId,
  saveCustomSpotifyPlaylistIds,
} from "./spotify-playlist-data"
import { spotifyOembedToNotificationLines } from "./spotify-oembed-parse"
import type {
  SpotifyBackgroundSession,
  SpotifyPlayerDockRect,
} from "./types"

const SPOTIFY_BG = "#121212"
const SPOTIFY_GREEN = "#1DB954"

const SCROLL_HIDE =
  "overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

type Phase = "browse" | "add" | "playlist"

type OEmbedMeta = { thumb?: string; title?: string }

async function fetchSpotifyOEmbed(openUrl: string): Promise<OEmbedMeta> {
  try {
    const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(openUrl)}`
    const res = await fetch(endpoint)
    if (!res.ok) return {}
    const data = (await res.json()) as {
      thumbnail_url?: string
      title?: string
    }
    return {
      thumb: data.thumbnail_url,
      title: data.title,
    }
  } catch {
    return {}
  }
}

export function SpotifyScreen({
  onExitApp,
  phoneBezelRef,
  session,
  setSession,
  setDockRect,
  resumeNonce,
}: {
  onExitApp: () => void
  phoneBezelRef: RefObject<HTMLDivElement | null>
  session: SpotifyBackgroundSession | null
  setSession: Dispatch<SetStateAction<SpotifyBackgroundSession | null>>
  setDockRect: Dispatch<SetStateAction<SpotifyPlayerDockRect | null>>
  resumeNonce: number
}) {
  const [phase, setPhase] = useState<Phase>("browse")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [metaById, setMetaById] = useState<Record<string, OEmbedMeta>>({})
  const [customPlaylistIds, setCustomPlaylistIds] = useState<string[]>(
    () => loadCustomSpotifyPlaylistIds()
  )
  const [linkInput, setLinkInput] = useState("")
  const [addMessage, setAddMessage] = useState<{
    tone: "error" | "ok"
    text: string
  } | null>(null)

  const slotRef = useRef<HTMLDivElement>(null)
  const lastResumeAppliedRef = useRef(-1)

  const playlists = useMemo(
    () => mergeSpotifyPlaylists(customPlaylistIds),
    [customPlaylistIds]
  )

  const active = useMemo(() => {
    if (!selectedId) return null
    return playlists.find((p) => p.id === selectedId) ?? null
  }, [selectedId, playlists])

  useEffect(() => {
    if (!session) {
      setPhase("browse")
      setSelectedId(null)
    }
  }, [session])

  useEffect(() => {
    if (resumeNonce <= lastResumeAppliedRef.current) return
    lastResumeAppliedRef.current = resumeNonce
    if (!session) return
    setSelectedId(session.playlistId)
    setPhase("playlist")
  }, [resumeNonce, session])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const entries = await Promise.all(
        playlists.map(async (pl) => {
          const meta = await fetchSpotifyOEmbed(pl.openUrl)
          return [pl.id, meta] as const
        })
      )
      if (cancelled) return
      setMetaById(Object.fromEntries(entries))
    })()
    return () => {
      cancelled = true
    }
  }, [playlists])

  useEffect(() => {
    if (phase !== "playlist" || !active) return
    const m = metaById[active.id]
    setSession((prev) => {
      if (!prev || prev.playlistId !== active.id) return prev
      const raw = m?.title ?? active.title
      const { title: displayTitle, artist: displayArtist } =
        spotifyOembedToNotificationLines(raw, active.title)
      const thumb = m?.thumb
      if (
        prev.displayTitle === displayTitle &&
        prev.displayArtist === displayArtist &&
        prev.thumb === thumb
      ) {
        return prev
      }
      return {
        ...prev,
        displayTitle,
        displayArtist,
        thumb,
      }
    })
  }, [phase, active, metaById, setSession])

  useLayoutEffect(() => {
    if (phase !== "playlist") {
      setDockRect(null)
      return
    }
    const bezel = phoneBezelRef.current
    const slot = slotRef.current
    if (!bezel || !slot) {
      setDockRect(null)
      return
    }
    const measure = () => {
      const br = bezel.getBoundingClientRect()
      const sr = slot.getBoundingClientRect()
      setDockRect({
        top: sr.top - br.top,
        left: sr.left - br.left,
        width: sr.width,
        height: sr.height,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(bezel)
    ro.observe(slot)
    window.addEventListener("scroll", measure, true)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", measure, true)
      setDockRect(null)
    }
  }, [phase, phoneBezelRef, setDockRect])

  const openPlaylist = (id: string) => {
    const pl = playlists.find((p) => p.id === id)
    if (!pl) return
    const meta = metaById[pl.id]
    const raw = meta?.title ?? pl.title
    const { title: displayTitle, artist: displayArtist } =
      spotifyOembedToNotificationLines(raw, pl.title)
    setSession({
      playlistId: pl.id,
      embedUrl: pl.embedUrl,
      openUrl: pl.openUrl,
      displayTitle,
      displayArtist,
      thumb: meta?.thumb,
    })
    setSelectedId(id)
    setPhase("playlist")
  }

  const headerBack = () => {
    if (phase === "playlist") {
      setPhase("browse")
      setSelectedId(null)
    } else if (phase === "add") {
      setPhase("browse")
      setAddMessage(null)
    } else {
      onExitApp()
    }
  }

  const headerAria =
    phase === "playlist"
      ? "Back to playlists"
      : phase === "add"
        ? "Back to playlists"
        : "Close"

  const tryAddPlaylist = () => {
    const id = parseSpotifyPlaylistId(linkInput)
    if (!id) {
      setAddMessage({
        tone: "error",
        text: "Paste a Spotify playlist link or URI (from Share).",
      })
      return
    }
    if (playlists.some((p) => p.id === id)) {
      setAddMessage({ tone: "error", text: "That playlist is already here." })
      return
    }
    const next = [...customPlaylistIds, id]
    setCustomPlaylistIds(next)
    saveCustomSpotifyPlaylistIds(next)
    setLinkInput("")
    setAddMessage({
      tone: "ok",
      text: "Added. It will show up with art and title in a moment.",
    })
  }

  const removeUserPlaylist = (id: string) => {
    if (!DEFAULT_SPOTIFY_PLAYLISTS.some((p) => p.id === id)) {
      const next = customPlaylistIds.filter((x) => x !== id)
      setCustomPlaylistIds(next)
      saveCustomSpotifyPlaylistIds(next)
    }
  }

  return (
    <div
      className="flex min-h-0 flex-1 flex-col text-white"
      style={{ backgroundColor: SPOTIFY_BG }}
    >
      <div className="shrink-0 px-3 pb-2 pt-1">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={headerBack}
            className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-white/90 transition active:bg-white/10"
            aria-label={headerAria}
          >
            <ChevronLeft className="size-7" strokeWidth={2.25} />
          </button>
          <div className="min-w-0 flex-1 pt-1">
            <p
              className="text-[0.72rem] font-medium text-white/55"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
              }}
            >
              Good evening
            </p>
            <div className="mt-1 flex items-center gap-2">
              <img
                src={`${PHONE_ASSET_ROOT}/spotify.svg`}
                alt=""
                className="size-8 shrink-0 rounded-lg object-contain"
              />
              <h1
                className="min-w-0 text-[1.35rem] font-bold leading-tight tracking-tight"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
                }}
              >
                Ashraf&apos;s Spotify
              </h1>
            </div>
          </div>
          {phase === "browse" ? (
            <button
              type="button"
              onClick={() => {
                setPhase("add")
                setAddMessage(null)
              }}
              className="mt-2 grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/16 active:scale-[0.96]"
              aria-label="Add playlist from link"
            >
              <Plus className="size-5" strokeWidth={2.25} />
            </button>
          ) : (
            <span className="w-9 shrink-0" aria-hidden />
          )}
        </div>
      </div>

      {phase === "browse" ? (
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
            SCROLL_HIDE
          )}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <p
            className="mb-3 text-[0.78rem] font-semibold text-white/70"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            }}
          >
            Playlists
          </p>

          <div className="grid grid-cols-2 gap-3">
            {playlists.map((pl) => {
              const meta = metaById[pl.id]
              const label = meta?.title ?? pl.title
              const thumb = meta?.thumb
              const hasArt = Boolean(thumb)
              const canRemove = Boolean(pl.isUserAdded)
              return (
                <div key={pl.id} className="relative">
                  <button
                    type="button"
                    onClick={() => openPlaylist(pl.id)}
                    className="group relative aspect-square w-full overflow-hidden rounded-xl text-left ring-1 ring-white/12 transition active:scale-[0.98]"
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-95 transition",
                        pl.accent,
                        hasArt && "opacity-40"
                      )}
                      aria-hidden
                    />
                    {hasArt ? (
                      <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-2.5 pt-10">
                      <p
                        className="line-clamp-3 text-[0.78rem] font-bold leading-tight text-white"
                        style={{
                          fontFamily:
                            "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                        }}
                      >
                        {label}
                      </p>
                    </div>
                  </button>
                  {canRemove ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeUserPlaylist(pl.id)
                      }}
                      className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/55 text-white/90 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/70"
                      aria-label={`Remove ${label} from your list`}
                    >
                      <X className="size-3.5" strokeWidth={2.5} />
                    </button>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {phase === "add" ? (
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
            SCROLL_HIDE
          )}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <p
            className="mb-3 text-[0.78rem] font-semibold text-white/70"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            }}
          >
            Add a playlist
          </p>
          <div
            className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            }}
          >
            <div className="mb-2 flex items-center gap-2 text-white/80">
              <Link2 className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <p className="text-[0.72rem] font-semibold">
                From Spotify share link
              </p>
            </div>
            <p className="mb-2 text-[0.65rem] leading-snug text-white/50">
              In Spotify, open a playlist →{" "}
              <span className="text-white/65">Share</span> → copy link. Your
              extras are saved on this device only.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                name="spotify-playlist-link"
                autoComplete="off"
                placeholder="https://open.spotify.com/playlist/…"
                value={linkInput}
                onChange={(e) => {
                  setLinkInput(e.target.value)
                  if (addMessage) setAddMessage(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") tryAddPlaylist()
                }}
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/35 px-2.5 py-2 text-[0.72rem] text-white outline-none placeholder:text-white/35 focus:border-white/35"
              />
              <button
                type="button"
                onClick={tryAddPlaylist}
                className="shrink-0 rounded-lg bg-white/12 px-3 py-2 text-[0.7rem] font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/16 active:scale-[0.98]"
              >
                Add
              </button>
            </div>
            {addMessage ? (
              <p
                className={cn(
                  "mt-2 text-[0.62rem] leading-snug",
                  addMessage.tone === "error"
                    ? "text-red-300/95"
                    : "text-[#1DB954]/95"
                )}
              >
                {addMessage.text}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {phase === "playlist" && active ? (
        <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
          <div
            ref={slotRef}
            className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#1a1a1a] ring-1 ring-white/10"
            aria-hidden
          >
            <div className="h-full min-h-[17.5rem] w-full" />
          </div>

          <div className="mt-3 shrink-0 space-y-1.5 px-1">
            <p
              className="px-1 text-center text-[0.58rem] leading-snug text-white/42"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              The player stays in one place while you browse or leave the app
              (same embed). The browser may still pause audio in the
              background.
            </p>
            <a
              href={active.openUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-full py-2.5 text-center text-[0.72rem] font-bold tracking-wide text-black uppercase transition hover:brightness-110 active:scale-[0.99]"
              style={{
                backgroundColor: SPOTIFY_GREEN,
                fontFamily: DISPLAY_FONT,
              }}
            >
              Open in Spotify
            </a>
            <p
              className="text-center text-[0.62rem] text-white/45"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Playback is powered by Spotify.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
