import {
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  ChevronLeft,
  Heart,
  Images,
  Layers2,
  MoreHorizontal,
  Plus,
  Search as SearchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { requestAshAiHandoff } from "@/lib/ashAiVisualContext"

import { ASH_STICKER_ROOT, BODY_FONT, DISPLAY_FONT } from "./constants"
import { useVideoDurationLabel } from "./video-duration"

const PHOTOS_SCROLL_HIDE =
  "overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

const IOS_BLUE = "#007aff"
const IOS_LABEL_SECONDARY = "#8e8e93"
const IOS_BG_GROUPED = "#f2f2f7"

type MediaKind = "image" | "video"

export type PhotosMediaItem = {
  id: string
  kind: MediaKind
  src: string
  alt: string
}

export type PhotosAlbum = {
  id: string
  title: string
  subtitle?: string
  items: PhotosMediaItem[]
}

const STICKER_FILES = [
  "approved.webp",
  "DONE.webp",
  "focus.webp",
  "Got-it.webp",
  "hmm.webp",
  "impressed.webp",
  "lets-go.webp",
  "low-battery-me.webp",
  "Not-sure.webp",
  "On-it.webp",
  "that-works.webp",
  "wait-what.webp",
] as const

function rangeGen(
  root: string,
  prefix: string,
  count: number
): PhotosMediaItem[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    return {
      id: `${prefix}-gen-${n}`,
      kind: "image" as const,
      src: `${root}/gen-${n}.webp`,
      alt: `${prefix} screenshot ${n}`,
    }
  })
}

function videoItem(
  id: string,
  src: string,
  label: string
): PhotosMediaItem {
  return {
    id,
    kind: "video",
    src,
    alt: label,
  }
}

const PHOTOS_ALBUMS: PhotosAlbum[] = [
  {
    id: "stickers",
    title: "Ash Stickers",
    subtitle: "Sticker pack",
    items: STICKER_FILES.map((file) => ({
      id: `sticker-${file}`,
      kind: "image" as const,
      src: `${ASH_STICKER_ROOT}/${file}`,
      alt: file.replace(/\.webp$/i, "").replace(/-/g, " "),
    })),
  },
  {
    id: "duwit",
    title: "Duwit",
    subtitle: "Screenshots",
    items: rangeGen("/assets/duwit-page/duwit-screenshots", "duwit", 5),
  },
  {
    id: "papion",
    title: "Papion",
    subtitle: "Screenshots",
    items: [
      ...rangeGen("/assets/papion-page/papion-screenshots", "papion", 5),
      {
        id: "papion-mob-1",
        kind: "image",
        src: "/assets/papion-page/papion-screenshots/mob-1.webp",
        alt: "Papion mobile 1",
      },
      {
        id: "papion-mob-2",
        kind: "image",
        src: "/assets/papion-page/papion-screenshots/mob-2.webp",
        alt: "Papion mobile 2",
      },
      {
        id: "papion-ipad-1",
        kind: "image",
        src: "/assets/papion-page/papion-screenshots/ipad-1.webp",
        alt: "Papion iPad",
      },
      {
        id: "papion-receipt",
        kind: "image",
        src: "/assets/papion-page/papion-screenshots/reciept-sample.webp",
        alt: "Papion receipt sample",
      },
    ],
  },
  {
    id: "ak",
    title: "AK System",
    subtitle: "Screenshots",
    items: rangeGen("/assets/ak-page", "ak", 5),
  },
  {
    id: "twodo",
    title: "Twodo",
    subtitle: "Screenshots",
    items: rangeGen("/assets/twodo-page", "twodo", 5),
  },
  {
    id: "videos",
    title: "Videos",
    subtitle: "Demos & motion",
    items: [
      videoItem(
        "vid-papion-lap",
        "/assets/lap-animation-assets/papion.mp4",
        "Papion — lap hero"
      ),
      videoItem(
        "vid-duwit-lap",
        "/assets/lap-animation-assets/duwit.mp4",
        "Duwit — lap hero"
      ),
      videoItem(
        "vid-ak-lap",
        "/assets/lap-animation-assets/ak.mp4",
        "AK System — lap hero"
      ),
      videoItem(
        "vid-twodo-lap",
        "/assets/lap-animation-assets/twodo.mp4",
        "Twodo — lap hero"
      ),
      videoItem(
        "vid-papion-ai",
        "/assets/papion-page/papion-videos/AI-video.mp4",
        "Papion — AI"
      ),
      videoItem(
        "vid-papion-insights",
        "/assets/papion-page/papion-videos/insights-video.mp4",
        "Papion — insights"
      ),
      videoItem(
        "vid-papion-inventory",
        "/assets/papion-page/papion-videos/inventory-video.mp4",
        "Papion — inventory"
      ),
      videoItem(
        "vid-papion-expense",
        "/assets/papion-page/papion-videos/expense-video.mp4",
        "Papion — expenses"
      ),
      videoItem(
        "vid-papion-customers",
        "/assets/papion-page/papion-videos/customers-video.mp4",
        "Papion — customers"
      ),
      videoItem(
        "vid-papion-supplier",
        "/assets/papion-page/papion-videos/supplier-video.mp4",
        "Papion — supplier"
      ),
      videoItem(
        "vid-papion-wallets",
        "/assets/papion-page/papion-videos/wallets-video.mp4",
        "Papion — wallets"
      ),
      videoItem(
        "vid-papion-order-agenda",
        "/assets/papion-page/papion-videos/order-calendar-agenda.mp4",
        "Papion — order agenda"
      ),
      videoItem(
        "vid-papion-order-draft",
        "/assets/papion-page/papion-videos/order-load-draft.mp4",
        "Papion — load draft"
      ),
      videoItem(
        "vid-papion-bulk-pay",
        "/assets/papion-page/papion-videos/bulk-pay-order.mp4",
        "Papion — bulk pay"
      ),
      videoItem(
        "vid-papion-3d",
        "/assets/papion-page/papion-videos/3D-model-stands.mp4",
        "Papion — 3D stands"
      ),
      videoItem(
        "vid-papion-unifying",
        "/assets/papion-page/papion-videos/unifying-loans.mp4",
        "Papion — unifying loans"
      ),
      videoItem(
        "vid-papion-export",
        "/assets/papion-page/papion-videos/inventory-export.mp4",
        "Papion — inventory export"
      ),
      videoItem(
        "vid-papion-expense-receipt",
        "/assets/papion-page/papion-videos/expense-image-reciept.mp4",
        "Papion — expense receipt"
      ),
    ],
  },
]

type BottomTabId = "library" | "forYou" | "albums" | "search"

function AlbumMosaic({ items }: { items: PhotosMediaItem[] }) {
  const preview = items.slice(0, 4)
  if (preview.length === 0) {
    return (
      <div className="aspect-square w-full rounded-[0.75rem] bg-neutral-200/90" />
    )
  }

  const single = preview.length === 1
  return (
    <div
      className={cn(
        "grid aspect-square w-full overflow-hidden rounded-[0.75rem] bg-neutral-900/8",
        single
          ? "grid-cols-1"
          : "grid-cols-2 grid-rows-2 gap-px bg-neutral-900/18"
      )}
    >
      {single ? (
        <MediaThumb
          item={preview[0]}
          className="h-full w-full rounded-[0.75rem]"
        />
      ) : (
        preview.map((item) => (
          <div
            key={item.id}
            className="relative min-h-0 overflow-hidden bg-neutral-200/40"
          >
            <MediaThumb item={item} className="h-full w-full" square />
          </div>
        ))
      )}
    </div>
  )
}

function PlayBadge({
  className,
  small,
}: {
  className?: string
  small?: boolean
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        className
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-black/44 text-white shadow-lg backdrop-blur-sm",
          small ? "h-7 w-7" : "h-9 w-9"
        )}
      >
        <svg
          width={small ? 11 : 14}
          height={small ? 11 : 14}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </span>
    </div>
  )
}

function VideoDurationTag({
  src,
  dense,
}: {
  src: string
  dense?: boolean
}) {
  const dur = useVideoDurationLabel(src)
  if (!dur) return null
  return (
    <span
      className={cn(
        "pointer-events-none absolute rounded bg-black/58 px-1 py-0.5 text-[0.58rem] font-semibold tabular-nums text-white",
        dense ? "right-0.5 bottom-0.5" : "right-1 bottom-1"
      )}
      style={{ fontFamily: DISPLAY_FONT }}
    >
      {dur}
    </span>
  )
}

function MediaThumb({
  item,
  className,
  square,
  denseVideo,
}: {
  item: PhotosMediaItem
  className?: string
  square?: boolean
  denseVideo?: boolean
}) {
  if (item.kind === "video") {
    return (
      <div className={cn("relative overflow-hidden bg-neutral-900", className)}>
        <video
          className={cn(
            "h-full w-full object-cover",
            square ? "aspect-square" : ""
          )}
          src={item.src}
          muted
          playsInline
          preload="metadata"
          aria-label={item.alt}
        />
        <VideoDurationTag src={item.src} dense={denseVideo} />
        {!denseVideo ? <PlayBadge small={denseVideo} /> : null}
      </div>
    )
  }
  return (
    <img
      src={item.src}
      alt={item.alt}
      loading="lazy"
      decoding="async"
      className={cn(
        "h-full w-full object-cover",
        square ? "aspect-square" : "",
        className
      )}
    />
  )
}

const ZOOM_MIN = 1
const ZOOM_MAX = 8

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

function touchDistance(t: React.TouchList) {
  if (t.length < 2) return 0
  const a = t[0]
  const b = t[1]
  const dx = a.clientX - b.clientX
  const dy = a.clientY - b.clientY
  return Math.hypot(dx, dy)
}

function ZoomablePhoto({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)

  const scaleRef = useRef(scale)
  const txRef = useRef(tx)
  const tyRef = useRef(ty)
  scaleRef.current = scale
  txRef.current = tx
  tyRef.current = ty

  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originTx: number
    originTy: number
  } | null>(null)

  const pinchRef = useRef<{
    startDist: number
    startScale: number
  } | null>(null)

  const touchPanRef = useRef<{
    startX: number
    startY: number
    originTx: number
    originTy: number
  } | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setScale((prev) => {
        const next = clamp(prev + -e.deltaY * 0.0018, ZOOM_MIN, ZOOM_MAX)
        if (next <= 1.02) {
          setTx(0)
          setTy(0)
        }
        return next
      })
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if (scaleRef.current <= 1.02) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originTx: txRef.current,
      originTy: tyRef.current,
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId || scaleRef.current <= 1.02) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    setTx(d.originTx + dx)
    setTy(d.originTy + dy)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (d && d.pointerId === e.pointerId) dragRef.current = null
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      touchPanRef.current = null
      pinchRef.current = {
        startDist: touchDistance(e.touches),
        startScale: scaleRef.current,
      }
      return
    }
    if (e.touches.length === 1 && scaleRef.current > 1.02) {
      const t = e.touches[0]
      touchPanRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        originTx: txRef.current,
        originTy: tyRef.current,
      }
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault()
      const d = touchDistance(e.touches)
      if (pinchRef.current.startDist > 0) {
        const ratio = d / pinchRef.current.startDist
        const next = clamp(
          pinchRef.current.startScale * ratio,
          ZOOM_MIN,
          ZOOM_MAX
        )
        setScale(next)
      }
      return
    }
    if (
      e.touches.length === 1 &&
      touchPanRef.current &&
      scaleRef.current > 1.02
    ) {
      e.preventDefault()
      const t = e.touches[0]
      const p = touchPanRef.current
      setTx(p.originTx + (t.clientX - p.startX))
      setTy(p.originTy + (t.clientY - p.startY))
    }
  }

  const onTouchEnd = () => {
    pinchRef.current = null
    touchPanRef.current = null
    setScale((s) => {
      if (s <= 1.02) {
        setTx(0)
        setTy(0)
        return 1
      }
      return s
    })
  }

  const onDoubleClick = () => {
    setScale(1)
    setTx(0)
    setTy(0)
  }

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto relative h-full min-h-[40%] w-full touch-none overflow-visible"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: "none" }}
    >
      <button
        type="button"
        className="relative flex h-full min-h-0 w-full items-center justify-center overflow-visible border-0 bg-transparent p-0"
        onDoubleClick={onDoubleClick}
        aria-label="Double-click to reset zoom. Pinch or scroll to zoom."
      >
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          draggable={false}
          className="h-auto w-auto max-h-full max-w-full select-none object-contain"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      </button>
      {scale > 1.02 ? (
        <p
          className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 text-[0.58rem] text-white/92 shadow-lg backdrop-blur-sm"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Scroll to zoom · drag to pan
        </p>
      ) : null}
    </div>
  )
}

function photosHandoffUserText(
  item: PhotosMediaItem,
  albumTitle?: string
): string {
  const kindLabel = item.kind === "image" ? "screenshot" : "video"
  return [
    `Explain this ${kindLabel} from my Photos library.`,
    `Caption: ${item.alt}`,
    albumTitle ? `Album: ${albumTitle}.` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

function PhotosMediaViewer({
  item,
  albumTitle,
  onClose,
}: {
  item: PhotosMediaItem
  albumTitle?: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const isImage = item.kind === "image"

  const askAshAi = () => {
    requestAshAiHandoff({
      userText: photosHandoffUserText(item, albumTitle),
      imageSrc: item.kind === "image" ? item.src : undefined,
      sourceLabel: "photos",
    })
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className={cn(
        "absolute inset-0 z-40 flex flex-col",
        isImage ? "overflow-visible bg-black" : "overflow-hidden bg-black"
      )}
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      {isImage ? (
        <>
          <div className="pointer-events-none absolute inset-0 overflow-visible">
            <div className="pointer-events-auto absolute inset-0 overflow-visible">
              <ZoomablePhoto src={item.src} alt={item.alt} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-end gap-2 bg-gradient-to-b from-black/55 to-transparent px-2 pt-2 pb-8">
            <button
              type="button"
              onClick={askAshAi}
              className="pointer-events-auto rounded-full bg-white/14 px-3 py-1.5 text-[0.78rem] font-semibold text-white ring-1 ring-white/22 backdrop-blur-md transition hover:bg-white/22"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Ask Ash AI
            </button>
            <button
              type="button"
              onClick={onClose}
              className="pointer-events-auto rounded-full px-3 py-1.5 text-[0.88rem] font-semibold text-[#0a84ff]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Done
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/65 via-black/35 to-transparent px-3 pt-10 pb-3">
            <p
              className="text-center text-[0.78rem] text-white/88 [text-shadow:0_1px_6px_rgb(0_0_0/0.75)]"
              style={{ fontFamily: BODY_FONT }}
            >
              {item.alt}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 items-center justify-end gap-2 px-2 py-2 pt-1">
            <button
              type="button"
              onClick={askAshAi}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[0.78rem] font-semibold text-white ring-1 ring-white/22 backdrop-blur-md transition hover:bg-white/16"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Ask Ash AI
            </button>
            <span className="w-6 shrink-0" aria-hidden />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3 py-1.5 text-[0.88rem] font-semibold text-[#0a84ff]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Done
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 flex-col items-center justify-center px-1 pb-1"
            onClick={onClose}
            role="presentation"
          >
            <div
              className="flex min-h-0 w-full flex-1 items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <video
                src={item.src}
                className="max-h-full max-w-full rounded-md object-contain shadow-xl"
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </div>
          <p
            className="shrink-0 px-4 pb-3 text-center text-[0.78rem] text-white/68"
            style={{ fontFamily: BODY_FONT }}
          >
            {item.alt}
          </p>
        </>
      )}
    </div>
  )
}

function MediaGridTile({
  item,
  onOpen,
  title: tileTitle,
  dense,
}: {
  item: PhotosMediaItem
  onOpen: () => void
  title?: string
  dense?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title={tileTitle}
      className={cn(
        "relative aspect-square w-full overflow-hidden p-0 focus-visible:ring-2 focus-visible:ring-[#007aff] focus-visible:ring-offset-2 focus-visible:outline-none",
        dense
          ? "rounded-none bg-neutral-100 ring-[0.5px] ring-neutral-200/90"
          : "rounded-[0.35rem] bg-neutral-200 ring-0"
      )}
    >
      <MediaThumb
        item={item}
        className="h-full w-full"
        square
        denseVideo={dense}
      />
    </button>
  )
}

function PhotosBottomTabs({
  active,
  onChange,
}: {
  active: BottomTabId
  onChange: (id: BottomTabId) => void
}) {
  const tabs: { id: BottomTabId; label: string; Icon: typeof Images }[] = [
    { id: "library", label: "Library", Icon: Images },
    { id: "forYou", label: "For You", Icon: Heart },
    { id: "albums", label: "Albums", Icon: Layers2 },
    { id: "search", label: "Search", Icon: SearchIcon },
  ]

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 border-t border-black/8 bg-white/94 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl">
      <nav
        className="grid grid-cols-4 gap-0 px-1 pt-1.5 pb-2"
        aria-label="Photos"
      >
        {tabs.map(({ id, label, Icon }) => {
          const isOn = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-0.5 rounded-lg py-0.5"
            >
              <span
                className={cn(
                  "flex h-8 w-14 items-center justify-center rounded-[0.65rem] transition-colors",
                  isOn ? "bg-[#007aff]/14" : "bg-transparent"
                )}
              >
                <Icon
                  className="size-[1.35rem]"
                  strokeWidth={isOn ? 2.25 : 1.85}
                  style={{ color: isOn ? IOS_BLUE : IOS_LABEL_SECONDARY }}
                  aria-hidden
                />
              </span>
              <span
                className={cn(
                  "max-w-[4.5rem] truncate text-[0.58rem] font-medium leading-tight",
                  isOn ? "text-[#007aff]" : "text-[#8e8e93]"
                )}
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>
      <div className="mx-auto mb-1 h-1 w-28 rounded-full bg-neutral-900/22" />
    </div>
  )
}

export function PhotosScreen({
  appPanelRef,
}: {
  appPanelRef?: RefObject<HTMLDivElement | null>
}) {
  const [bottomTab, setBottomTab] = useState<BottomTabId>("albums")
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null)
  const [viewerOpen, setViewerOpen] = useState<{
    item: PhotosMediaItem
    albumTitle?: string
  } | null>(null)

  const viewerItem = viewerOpen?.item ?? null

  useLayoutEffect(() => {
    const el = appPanelRef?.current
    if (!el) return
    if (viewerItem?.kind === "image") {
      el.style.overflow = "visible"
    } else {
      el.style.overflow = ""
    }
    return () => {
      el.style.overflow = ""
    }
  }, [viewerItem, appPanelRef])

  const openAlbum = useMemo(
    () => PHOTOS_ALBUMS.find((a) => a.id === openAlbumId) ?? null,
    [openAlbumId]
  )

  const libraryItems = useMemo(() => {
    const out: { albumTitle: string; item: PhotosMediaItem }[] = []
    for (const album of PHOTOS_ALBUMS) {
      for (const item of album.items) {
        out.push({ albumTitle: album.title, item })
      }
    }
    return out
  }, [])

  const photoCount = useMemo(
    () => libraryItems.filter(({ item }) => item.kind === "image").length,
    [libraryItems]
  )
  const videoCount = useMemo(
    () => libraryItems.filter(({ item }) => item.kind === "video").length,
    [libraryItems]
  )

  const handleAlbumOpen = useCallback((id: string) => {
    setOpenAlbumId(id)
  }, [])

  const handleAlbumsBack = useCallback(() => {
    setOpenAlbumId(null)
  }, [])

  const closeViewer = useCallback(() => setViewerOpen(null), [])

  const onBottomTab = useCallback((id: BottomTabId) => {
    setBottomTab(id)
    setOpenAlbumId(null)
  }, [])

  const scrollPadClass = "pb-[4.75rem]"

  const albumSurface =
    bottomTab === "albums" && !openAlbum
      ? "bg-white"
      : bottomTab === "library" && !openAlbum
        ? "bg-white"
        : IOS_BG_GROUPED

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col text-[#1c1c1e]",
        openAlbum ? "bg-white" : albumSurface,
        viewerItem?.kind === "image" ? "overflow-visible" : "overflow-hidden"
      )}
    >
      {!openAlbum && bottomTab === "albums" ? (
        <div className="flex shrink-0 items-center justify-between px-3 pt-1.5 pb-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#007aff] transition active:opacity-70"
            aria-label="Add album"
          >
            <Plus className="size-7" strokeWidth={2} />
          </button>
          <span className="w-9" aria-hidden />
        </div>
      ) : null}

      {!openAlbum && bottomTab === "albums" ? (
        <div className="shrink-0 px-4 pb-2">
          <h1
            className="text-[2rem] font-bold leading-none tracking-[-0.02em] text-black"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            }}
          >
            Albums
          </h1>
        </div>
      ) : null}

      {!openAlbum && bottomTab === "library" ? (
        <div className="shrink-0 bg-white px-4 pt-3 pb-2">
          <h1
            className="text-[2rem] font-bold leading-none tracking-[-0.02em] text-black"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            }}
          >
            Library
          </h1>
          <p
            className="mt-2 text-[0.78rem]"
            style={{ fontFamily: BODY_FONT, color: IOS_LABEL_SECONDARY }}
          >
            All photos and videos in one grid.
          </p>
        </div>
      ) : null}

      {!openAlbum && bottomTab === "forYou" ? (
        <div className="shrink-0 px-4 pt-3 pb-2">
          <h1
            className="text-[2rem] font-bold leading-none tracking-[-0.02em] text-black"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            }}
          >
            For You
          </h1>
          <p
            className="mt-2 text-[0.82rem]"
            style={{ fontFamily: BODY_FONT, color: IOS_LABEL_SECONDARY }}
          >
            Memories and featured picks will live here — a calm placeholder for
            now.
          </p>
        </div>
      ) : null}

      {!openAlbum && bottomTab === "search" ? (
        <div className="shrink-0 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 rounded-xl bg-[#e5e5ea] px-3 py-2.5">
            <SearchIcon
              className="size-4 shrink-0 text-[#8e8e93]"
              aria-hidden
            />
            <span
              className="text-[0.95rem] text-[#8e8e93]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Search your library
            </span>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-0",
          PHOTOS_SCROLL_HIDE,
          scrollPadClass,
          !openAlbum && bottomTab === "library"
            ? "bg-white"
            : !openAlbum && bottomTab !== "albums"
              ? "px-4"
              : "",
          openAlbum ? "px-0" : ""
        )}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        {openAlbum ? (
          <div className="flex min-h-full flex-col bg-white">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-2 border-b border-black/8 bg-white/88 px-3 py-2 backdrop-blur-md">
              <button
                type="button"
                onClick={handleAlbumsBack}
                className="flex items-center gap-0.5 text-[0.95rem] font-medium text-[#007aff]"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                <ChevronLeft className="size-5 -ml-1" strokeWidth={2.25} />
                Albums
              </button>
              <div className="flex items-center gap-1.5">
                <span
                  className="rounded-full bg-[#e5e5ea] px-2.5 py-1 text-[0.72rem] font-semibold text-black/78"
                  style={{
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                  }}
                >
                  Select
                </span>
                <button
                  type="button"
                  className="grid size-8 place-items-center rounded-full bg-[#e5e5ea] text-neutral-700"
                  aria-label="More"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </div>
            </div>
            <div className="px-4 pt-3 pb-2">
              <h2
                className="text-[1.75rem] font-bold leading-none tracking-[-0.02em] text-black"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
                }}
              >
                {openAlbum.title}
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-px bg-neutral-200">
              {openAlbum.items.map((item) => (
                <MediaGridTile
                  key={item.id}
                  item={item}
                  dense
                  onOpen={() =>
                    setViewerOpen({ item, albumTitle: openAlbum.title })
                  }
                />
              ))}
            </div>
            <div className="mt-auto border-t border-black/6 bg-[#f9f9fb] px-4 py-3 text-center">
              <p
                className="text-[0.82rem] font-semibold text-black"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                {openAlbum.items.filter((i) => i.kind === "image").length}{" "}
                Photos,{" "}
                {openAlbum.items.filter((i) => i.kind === "video").length}{" "}
                Videos
              </p>
              <p
                className="mt-1 text-[0.72rem]"
                style={{ color: IOS_LABEL_SECONDARY }}
              >
                Portfolio preview — not synced to iCloud.
              </p>
            </div>
          </div>
        ) : bottomTab === "albums" ? (
          <div className={cn("px-4", scrollPadClass)}>
            <div className="flex items-baseline justify-between pb-3 pt-1">
              <h2
                className="text-[1.35rem] font-bold text-black"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                My Albums
              </h2>
              <button
                type="button"
                className="text-[1rem] font-normal"
                style={{ color: IOS_BLUE }}
              >
                See All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 pb-6">
              {PHOTOS_ALBUMS.map((album) => (
                <button
                  key={album.id}
                  type="button"
                  onClick={() => handleAlbumOpen(album.id)}
                  className="text-left"
                >
                  <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/[0.06]">
                    <AlbumMosaic items={album.items} />
                  </div>
                  <p
                    className="mt-2 truncate text-[0.92rem] font-medium text-black"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    {album.title}
                  </p>
                  <p
                    className="mt-0.5 text-[0.78rem]"
                    style={{ color: IOS_LABEL_SECONDARY }}
                  >
                    {album.items.length.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>

            <h2
              className="pb-3 text-[1.35rem] font-bold text-black"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              People &amp; Places
            </h2>
            <div className="flex gap-3 pb-4">
              <div className="flex-1 rounded-2xl bg-[#e5e5ea] p-4 text-center">
                <p
                  className="text-[0.72rem] font-semibold tracking-wide text-[#8e8e93] uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  People
                </p>
                <p
                  className="mt-2 text-[0.8rem] text-[#636366]"
                  style={{ fontFamily: BODY_FONT }}
                >
                  Faces you save will appear here.
                </p>
              </div>
              <div className="flex-1 rounded-2xl bg-[#d1d1d6] p-4 text-center">
                <p
                  className="text-[0.72rem] font-semibold tracking-wide text-[#636366] uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  Places
                </p>
                <p
                  className="mt-2 text-[0.8rem] text-[#636366]"
                  style={{ fontFamily: BODY_FONT }}
                >
                  Map albums will sit in this row.
                </p>
              </div>
            </div>
          </div>
        ) : bottomTab === "library" ? (
          <div className="flex min-h-full flex-col">
            <div className="grid grid-cols-4 gap-px bg-neutral-200">
              {libraryItems.map(({ albumTitle, item }) => (
                <MediaGridTile
                  key={`${albumTitle}-${item.id}`}
                  item={item}
                  dense
                  title={`${albumTitle} — ${item.alt}`}
                  onOpen={() =>
                    setViewerOpen({ item, albumTitle })
                  }
                />
              ))}
            </div>
            <div className="bg-[#f9f9fb] px-4 py-4 text-center">
              <p
                className="text-[0.82rem] font-semibold text-black"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                {photoCount.toLocaleString()} Photos,{" "}
                {videoCount.toLocaleString()} Videos
              </p>
              <p
                className="mt-1 text-[0.72rem]"
                style={{ color: IOS_LABEL_SECONDARY }}
              >
                Portfolio preview — not synced to iCloud.
              </p>
            </div>
          </div>
        ) : bottomTab === "forYou" ? (
          <div
            className={cn(
              "flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-black/12 bg-white/80 px-6 text-center",
              scrollPadClass
            )}
          >
            <p className="text-[0.9rem]" style={{ fontFamily: BODY_FONT, color: IOS_LABEL_SECONDARY }}>
              Highlights from your work will eventually stack here like iOS
              Memories.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "rounded-2xl bg-[#f2f2f7] px-4 py-8 text-center",
              scrollPadClass
            )}
          >
            <p
              className="text-[0.88rem]"
              style={{ fontFamily: BODY_FONT, color: IOS_LABEL_SECONDARY }}
            >
              Type in the search field above to filter — wiring can hook into
              album names later.
            </p>
          </div>
        )}
      </div>

      {!openAlbum && !viewerItem ? (
        <PhotosBottomTabs active={bottomTab} onChange={onBottomTab} />
      ) : null}

      {viewerOpen ? (
        <PhotosMediaViewer
          item={viewerOpen.item}
          albumTitle={viewerOpen.albumTitle}
          onClose={closeViewer}
        />
      ) : null}
    </div>
  )
}
