import { motion, useReducedMotion } from "motion/react"
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"

import { ViewportLoopVideo } from "@/components/media/ViewportLoopVideo"

import {
  BODY_FONT,
  CASE_ASSETS,
  DISPLAY_FONT,
  MODULE_EXPLORER_ENTRIES,
  PAPION_MODULE_EXPLORER_ID,
  PAPION_VIDEO_HERO,
  type ExplorerFeatureSpotlight,
  type ExplorerModuleEntry,
  type ExplorerModuleId,
  type ExplorerPrimaryMedia,
} from "./papion-data"
import { CaseStudyFigure } from "./papion-media"
import { Eyebrow, Prose, StoryTitle } from "./papion-ui"

/** Bright soft pastels for uncommon-beat cards (light surfaces). */
const SPOTLIGHT_PASTELS = [
  {
    bg: "#FFF9C4",
    bgOpen: "#FFFBEB",
    hover: "#FEF08A",
  },
  {
    bg: "#DBEAFE",
    bgOpen: "#EFF6FF",
    hover: "#BFDBFE",
  },
  {
    bg: "#CCFBF1",
    bgOpen: "#F0FDFA",
    hover: "#99F6E4",
  },
  {
    bg: "#FFE4E6",
    bgOpen: "#FFF1F2",
    hover: "#FECDD3",
  },
  {
    bg: "#EDE9FE",
    bgOpen: "#F5F3FF",
    hover: "#DDD6FE",
  },
  {
    bg: "#FFEDD5",
    bgOpen: "#FFF7ED",
    hover: "#FED7AA",
  },
] as const

const SPOTLIGHT_AI_SURFACE =
  "linear-gradient(148deg, #FAF5FF 0%, #F0F9FF 42%, #FFFBEB 100%)"

const SPOTLIGHT_AI_SURFACE_OPEN =
  "linear-gradient(148deg, #FFFFFF 0%, #F5F3FF 28%, #ECFEFF 58%, #FFFBEB 100%)"

function spotlightPastel(index: number) {
  return SPOTLIGHT_PASTELS[index % SPOTLIGHT_PASTELS.length]
}

function AiSparkleIcon({
  className = "",
  idSuffix,
}: {
  className?: string
  idSuffix: string
}) {
  const gradA = `papion-ai-sparkle-a-${idSuffix}`
  const gradB = `papion-ai-sparkle-b-${idSuffix}`
  return (
    <svg
      aria-hidden
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 2.5l1.2 4.2 4.2 1.2-4.2 1.2L12 13.3l-1.2-4.2-4.2-1.2 4.2-1.2L12 2.5Z"
        fill={`url(#${gradA})`}
      />
      <path
        d="M19 14l.7 2.4 2.4.7-2.4.7-.7 2.4-.7-2.4-2.4-.7 2.4-.7.7-2.4Z"
        fill={`url(#${gradB})`}
      />
      <defs>
        <linearGradient
          id={gradA}
          x1="7"
          y1="2"
          x2="17"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C084FC" />
          <stop offset="0.45" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient
          id={gradB}
          x1="16"
          y1="14"
          x2="22"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#F9A8D4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function VideoFullscreenIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}

function ExplorerVideoBlock({
  src,
  posterPlannedLabel,
  posterSrc,
  alt,
  videoFraming = "landscape",
  fetchPriority,
  showFullscreenControl = false,
  onRequestFullscreen,
}: {
  src: string
  posterPlannedLabel: string
  posterSrc: string
  alt: string
  videoFraming?: "landscape" | "portrait" | "tablet"
  fetchPriority: "high" | "low"
  showFullscreenControl?: boolean
  /** Receives the URL actually playing (after hero/poster fallbacks). */
  onRequestFullscreen?: (playbackSrc: string) => void
}) {
  const [usePoster, setUsePoster] = useState(false)
  const [useHeroFallback, setUseHeroFallback] = useState(false)

  if (usePoster) {
    return (
      <CaseStudyFigure
        src={posterSrc}
        alt={alt}
        plannedLabel={posterPlannedLabel}
        fetchPriority={fetchPriority}
      />
    )
  }

  const effectiveSrc = useHeroFallback ? PAPION_VIDEO_HERO : src
  const isPortrait = videoFraming === "portrait"
  const isTablet = videoFraming === "tablet"

  return (
    <div
      className={`relative overflow-hidden border border-[var(--color-drh-ink)]/10 bg-black shadow-[0_22px_56px_rgb(10_10_10/0.12)] ${
        isPortrait ? "flex justify-center py-6 sm:py-8" : ""
      }`}
    >
      <ViewportLoopVideo
        key={effectiveSrc}
        className={
          isPortrait
            ? "mx-auto max-h-[min(70vh,620px)] w-auto max-w-full object-contain"
            : isTablet
              ? "aspect-[4/3] w-full object-cover"
              : "aspect-video w-full object-cover"
        }
        src={effectiveSrc}
        poster={posterSrc}
        fetchPriority={fetchPriority}
        onError={() => {
          if (!useHeroFallback && effectiveSrc !== PAPION_VIDEO_HERO) {
            setUseHeroFallback(true)
          } else {
            setUsePoster(true)
          }
        }}
      />
      {showFullscreenControl && onRequestFullscreen ? (
        <button
          type="button"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center border border-white/20 bg-[rgb(12_12_14/0.72)] text-white/90 shadow-[0_8px_24px_rgb(0_0_0/0.35)] backdrop-blur-sm transition hover:border-white/35 hover:bg-[rgb(18_18_20/0.88)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          aria-label={`Watch ${alt} in fullscreen`}
          onClick={(e) => {
            e.stopPropagation()
            onRequestFullscreen(effectiveSrc)
          }}
        >
          <VideoFullscreenIcon />
        </button>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.06),transparent_35%,rgb(0_0_0/0.35)_100%)]" />
    </div>
  )
}

function ExplorerEntryMedia({
  media,
  alt,
  plannedMediaFallback,
  fetchPriority,
  showFullscreenControl = false,
  onRequestFullscreen,
}: {
  media: ExplorerPrimaryMedia
  alt: string
  plannedMediaFallback: string
  fetchPriority: "high" | "low"
  showFullscreenControl?: boolean
  onRequestFullscreen?: (playbackSrc: string) => void
}) {
  if (media.kind === "image") {
    return (
      <CaseStudyFigure
        src={CASE_ASSETS[media.assetKey]}
        alt={alt}
        caption={media.caption}
        plannedLabel={plannedMediaFallback}
        fetchPriority={fetchPriority}
      />
    )
  }

  const posterKey = media.posterAssetKey ?? "sales"
  return (
    <ExplorerVideoBlock
      src={media.src}
      posterSrc={CASE_ASSETS[posterKey]}
      posterPlannedLabel={plannedMediaFallback}
      alt={alt}
      videoFraming={media.videoFraming}
      fetchPriority={fetchPriority}
      showFullscreenControl={showFullscreenControl}
      onRequestFullscreen={onRequestFullscreen}
    />
  )
}

function ExplorerPrimaryMedia({
  entry,
  videoLightboxTitleId,
}: {
  entry: ExplorerModuleEntry
  videoLightboxTitleId: string
}) {
  const [videoLightbox, setVideoLightbox] = useState<{
    src: string
    poster?: string
    title: string
  } | null>(null)

  const alt = `${entry.label} — Papion`
  const media = entry.primaryMedia

  return (
    <>
      <ExplorerEntryMedia
        media={media}
        alt={alt}
        plannedMediaFallback={entry.plannedMediaFallback}
        fetchPriority="high"
        showFullscreenControl={media.kind === "video"}
        onRequestFullscreen={
          media.kind === "video"
            ? (playbackSrc) => {
                const posterKey = media.posterAssetKey ?? "sales"
                setVideoLightbox({
                  src: playbackSrc,
                  poster: CASE_ASSETS[posterKey],
                  title: entry.headline,
                })
              }
            : undefined
        }
      />
      <SpotlightVideoLightbox
        open={videoLightbox !== null}
        onClose={() => setVideoLightbox(null)}
        src={videoLightbox?.src ?? ""}
        poster={videoLightbox?.poster}
        title={videoLightbox?.title ?? ""}
        titleId={videoLightboxTitleId}
      />
    </>
  )
}

function AttachmentPaperclipIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function SpotlightVideoLightbox({
  open,
  onClose,
  src,
  poster,
  title,
  titleId,
}: {
  open: boolean
  onClose: () => void
  src: string
  poster?: string
  title: string
  titleId: string
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playbackSrc, setPlaybackSrc] = useState(src)

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    setPlaybackSrc(src)
  }, [src])

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause()
      return
    }
    closeRef.current?.focus()
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    void video.play().catch(() => {})
  }, [open, playbackSrc])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgb(8_8_10/0.88)] backdrop-blur-[3px]"
        aria-label="Close fullscreen video"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden border border-white/12 bg-[rgb(14_14_16)] shadow-[0_40px_120px_rgb(0_0_0/0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <p
            id={titleId}
            className="min-w-0 truncate text-[0.72rem] font-medium tracking-[0.12em] text-[rgb(252_252_250)]/72 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {title}
          </p>
          <button
            ref={closeRef}
            type="button"
            className="shrink-0 border border-white/14 bg-white/8 px-3 py-1.5 text-[0.78rem] font-medium text-[rgb(252_252_250)]/85 transition hover:bg-white/14"
            style={{ fontFamily: BODY_FONT }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-2 sm:p-4">
          <video
            ref={videoRef}
            key={playbackSrc}
            className="max-h-[min(82vh,900px)] w-full max-w-full object-contain"
            src={playbackSrc}
            poster={poster}
            controls
            playsInline
            loop
            preload="auto"
            onError={() => {
              if (playbackSrc !== PAPION_VIDEO_HERO) {
                setPlaybackSrc(PAPION_VIDEO_HERO)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

function DemoAttachmentLightbox({
  open,
  onClose,
  src,
  alt,
  titleId,
  fetchPriority = "high",
}: {
  open: boolean
  onClose: () => void
  src: string
  alt: string
  titleId: string
  fetchPriority?: "high" | "low"
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgb(10_10_10/0.72)] backdrop-blur-[2px]"
        aria-label="Close receipt preview"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[calc(100vh-2rem)] max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/12 bg-[rgb(252_252_251)] shadow-[0_32px_96px_rgb(0_0_0/0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-drh-ink)]/08 px-4 py-3 sm:px-5">
          <p
            id={titleId}
            className="text-[0.72rem] font-medium tracking-[0.14em] text-[var(--color-drh-ink)]/55 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Full receipt
          </p>
          <button
            ref={closeRef}
            type="button"
            className="rounded-lg border border-[var(--color-drh-ink)]/10 bg-white px-3 py-1.5 text-[0.78rem] font-medium text-[var(--color-drh-ink)]/75 transition hover:bg-[var(--color-drh-bg)]"
            style={{ fontFamily: BODY_FONT }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="overflow-auto p-3 sm:p-5">
          <img
            src={src}
            alt={alt}
            className="mx-auto max-h-[min(85vh,900px)] w-auto max-w-full rounded-lg object-contain"
            loading="eager"
            decoding="async"
            fetchPriority={fetchPriority}
          />
        </div>
      </div>
    </div>
  )
}

function DemoAttachmentMiniCard({
  imageSrc,
  label,
  imageAlt,
  onOpen,
  fetchPriority = "high",
}: {
  imageSrc: string
  label: string
  imageAlt: string
  onOpen: () => void
  fetchPriority?: "high" | "low"
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[6.75rem] max-w-full shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--color-drh-ink)]/12 bg-white/95 text-left shadow-[0_6px_22px_rgb(10_10_10/0.06)] transition hover:border-[var(--color-drh-ink)]/22 hover:shadow-[0_10px_32px_rgb(10_10_10/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-drh-accent-orange)] sm:w-[7.25rem]"
      aria-label={`Open full size: ${label}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-drh-bg)]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover object-top transition duration-200 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
          fetchPriority={fetchPriority}
        />
      </div>
      <div className="flex items-center gap-1.5 border-t border-[var(--color-drh-ink)]/08 px-1.5 py-1.5 text-[var(--color-drh-ink)]/55">
        <AttachmentPaperclipIcon className="h-3 w-3 shrink-0 opacity-70" />
        <span
          className="min-w-0 text-[0.58rem] font-semibold leading-tight tracking-[0.05em] uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

const SPOTLIGHT_EXPAND_MS = 340
const SPOTLIGHT_EXPAND_EASE = "cubic-bezier(0.22, 0.08, 0.19, 1)"

function SpotlightExpandPanel({
  open,
  reduceMotion,
  panelId,
  headerId,
  surfaceBg,
  children,
}: {
  open: boolean
  reduceMotion: boolean
  panelId: string
  headerId: string
  surfaceBg: string
  children: ReactNode
}) {
  const motionStyle = reduceMotion
    ? undefined
    : ({
        transition: `grid-template-rows ${SPOTLIGHT_EXPAND_MS}ms ${SPOTLIGHT_EXPAND_EASE}, opacity ${SPOTLIGHT_EXPAND_MS}ms ${SPOTLIGHT_EXPAND_EASE}`,
      } as const)

  const contentMotionStyle = reduceMotion
    ? undefined
    : ({
        transition: `opacity ${SPOTLIGHT_EXPAND_MS}ms ${SPOTLIGHT_EXPAND_EASE}`,
      } as const)

  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        ...motionStyle,
      }}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          aria-hidden={!open}
          inert={open ? undefined : true}
          className="px-4 py-6 sm:px-5 sm:py-8"
          style={{
            background: surfaceBg,
            opacity: open ? 1 : 0,
            ...contentMotionStyle,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SpotlightChevron({
  open,
  reduceMotion,
  className = "text-[var(--color-drh-ink)]/88",
}: {
  open: boolean
  reduceMotion: boolean
  className?: string
}) {
  return (
    <svg
      aria-hidden
      className={`h-6 w-6 shrink-0 sm:h-7 sm:w-7 ${className} ${
        open ? "rotate-180" : ""
      }`}
      style={
        reduceMotion
          ? undefined
          : {
              transition: `transform ${SPOTLIGHT_EXPAND_MS}ms ${SPOTLIGHT_EXPAND_EASE}`,
            }
      }
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function ExplorerFeatureSpotlights({
  baseId,
  entry,
}: {
  baseId: string
  entry: ExplorerModuleEntry
}) {
  const spotlights = entry.featureSpotlights
  const reduceMotion = useReducedMotion() === true
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [attachmentLightbox, setAttachmentLightbox] = useState<{
    src: string
    alt: string
  } | null>(null)
  const [videoLightbox, setVideoLightbox] = useState<{
    src: string
    poster?: string
    title: string
  } | null>(null)
  const attachmentLightboxTitleId = `${baseId}-receipt-lightbox-title`
  const videoLightboxTitleId = `${baseId}-${entry.id}-spotlight-video-lightbox-title`

  const pastelBySpotlightId = useMemo(() => {
    const map = new Map<string, (typeof SPOTLIGHT_PASTELS)[number]>()
    if (!spotlights?.length) return map
    let slot = 0
    for (const spotlight of spotlights) {
      if (!spotlight.aiPowered) {
        map.set(spotlight.id, spotlightPastel(slot++))
      }
    }
    return map
  }, [spotlights])

  if (!spotlights?.length) return null

  const toggle = (id: string) => {
    setOpen((prev) => {
      const nextOpen = !prev[id]
      if (nextOpen) {
        setRevealed((r) => (r[id] ? r : { ...r, [id]: true }))
      }
      return { ...prev, [id]: nextOpen }
    })
  }

  const sectionHeadingId = `${baseId}-uncommon-beats-heading`

  return (
    <section
      className="mt-10 -mx-5 px-5 py-10 sm:-mx-8 sm:px-8 lg:mt-14 lg:-mx-10 lg:px-10 lg:py-12"
      aria-labelledby={sectionHeadingId}
    >
      <header className="mb-8 max-w-3xl space-y-3 sm:mb-10">
        <h3
          id={sectionHeadingId}
          className="text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-black sm:text-[1.7rem] md:text-[1.9rem]"
          style={{
            fontFamily: BODY_FONT,
            fontVariationSettings: '"opsz" 72, "wght" 520',
          }}
        >
          Uncommon beats
        </h3>
        <p
          className="text-[0.98rem] leading-relaxed text-black sm:text-[1.08rem]"
          style={{ fontFamily: BODY_FONT }}
        >
          Features you wouldn&apos;t see coming.
        </p>
      </header>
      <ul className="list-none flex flex-col gap-3 p-0 sm:gap-3.5">
        {spotlights.map((item) => {
          const isOpen = Boolean(open[item.id])
          const panelId = `${baseId}-spotlight-${entry.id}-${item.id}`
          const headerId = `${panelId}-label`
          const pastel = pastelBySpotlightId.get(item.id) ?? null
          const surfaceBg = item.aiPowered
            ? isOpen
              ? SPOTLIGHT_AI_SURFACE_OPEN
              : SPOTLIGHT_AI_SURFACE
            : isOpen
              ? (pastel?.bgOpen ?? "")
              : (pastel?.bg ?? "")

          const surfaceTransition = reduceMotion
            ? undefined
            : ({
                transition: `background ${SPOTLIGHT_EXPAND_MS}ms ${SPOTLIGHT_EXPAND_EASE}`,
              } as const)

          return (
            <li
              key={item.id}
              className="overflow-hidden"
              style={{ background: surfaceBg, ...surfaceTransition }}
            >
                <button
                  type="button"
                  id={headerId}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left transition sm:gap-4 sm:px-5 sm:py-5"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  onMouseEnter={(e) => {
                    if (isOpen || item.aiPowered || !pastel) return
                    e.currentTarget.style.backgroundColor = pastel.hover
                  }}
                  onMouseLeave={(e) => {
                    if (isOpen || item.aiPowered || !pastel) return
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center self-center sm:h-7 sm:w-7"
                    aria-hidden
                  >
                    <SpotlightChevron open={isOpen} reduceMotion={reduceMotion} />
                  </span>
                  <span className="min-w-0 flex-1 space-y-1.5">
                    <span className="flex flex-wrap items-center gap-2">
                      {item.aiPowered ? (
                        <AiSparkleIcon
                          idSuffix={`${entry.id}-${item.id}`}
                          className="shrink-0"
                        />
                      ) : null}
                      <span
                        className="text-[0.98rem] font-medium leading-snug text-[var(--color-drh-ink)] sm:text-[1.02rem]"
                        style={{ fontFamily: BODY_FONT }}
                      >
                        {item.title}
                      </span>
                    </span>
                    <span
                      className="block text-[0.86rem] leading-relaxed text-[var(--color-drh-ink)]/62 sm:text-[0.9rem]"
                      style={{ fontFamily: BODY_FONT }}
                    >
                      {item.teaser}
                    </span>
                  </span>
                </button>
              <SpotlightExpandPanel
                open={isOpen}
                reduceMotion={reduceMotion}
                panelId={panelId}
                headerId={headerId}
                surfaceBg={surfaceBg}
              >
                {"primaryMedia" in item && item.primaryMedia ? (
                  <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
                    <div className="flex min-w-0 flex-col gap-3">
                      <Prose className="!text-left text-left !text-[var(--color-drh-ink)]/78 [&>p+p]:mt-4">
                        {item.body.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </Prose>
                      {"demoAttachment" in item && item.demoAttachment ? (
                        <DemoAttachmentMiniCard
                          imageSrc={
                            CASE_ASSETS[item.demoAttachment.assetKey]
                          }
                          label={item.demoAttachment.label}
                          imageAlt={item.demoAttachment.imageAlt}
                          fetchPriority="low"
                          onOpen={() =>
                            setAttachmentLightbox({
                              src: CASE_ASSETS[
                                item.demoAttachment!.assetKey
                              ],
                              alt: item.demoAttachment!.imageAlt,
                            })
                          }
                        />
                      ) : null}
                    </div>
                    {revealed[item.id] ? (
                      <div className="min-w-0">
                        <ExplorerEntryMedia
                          media={item.primaryMedia}
                          alt={`${item.title} — ${entry.label}`}
                          plannedMediaFallback={item.plannedMediaFallback}
                          fetchPriority="low"
                          showFullscreenControl
                          onRequestFullscreen={(playbackSrc) => {
                            const posterKey =
                              item.primaryMedia.kind === "video"
                                ? item.primaryMedia.posterAssetKey ?? "sales"
                                : undefined
                            setVideoLightbox({
                              src: playbackSrc,
                              poster:
                                posterKey !== undefined
                                  ? CASE_ASSETS[posterKey]
                                  : undefined,
                              title: item.title,
                            })
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Prose className="max-w-3xl !text-left text-left !text-[var(--color-drh-ink)]/78 [&>p+p]:mt-4">
                    {item.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </Prose>
                )}
              </SpotlightExpandPanel>
            </li>
          )
        })}
      </ul>

      <DemoAttachmentLightbox
        open={attachmentLightbox !== null}
        onClose={() => setAttachmentLightbox(null)}
        src={attachmentLightbox?.src ?? ""}
        alt={attachmentLightbox?.alt ?? ""}
        titleId={attachmentLightboxTitleId}
        fetchPriority="low"
      />

      <SpotlightVideoLightbox
        open={videoLightbox !== null}
        onClose={() => setVideoLightbox(null)}
        src={videoLightbox?.src ?? ""}
        poster={videoLightbox?.poster}
        title={videoLightbox?.title ?? ""}
        titleId={videoLightboxTitleId}
      />
    </section>
  )
}

export function PapionModuleExplorer() {
  const baseId = useId()
  const primaryVideoLightboxTitleId = `${baseId}-primary-video-lightbox-title`
  const headingId = `${baseId}-heading`
  const tabIds = MODULE_EXPLORER_ENTRIES.map((e) => `${baseId}-tab-${e.id}`)
  const panelIds = MODULE_EXPLORER_ENTRIES.map((e) => `${baseId}-panel-${e.id}`)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [activeId, setActiveId] = useState<ExplorerModuleId>(
    MODULE_EXPLORER_ENTRIES[0].id,
  )
  const activeIndex = MODULE_EXPLORER_ENTRIES.findIndex(
    (e) => e.id === activeId,
  )
  const active =
    MODULE_EXPLORER_ENTRIES[activeIndex] ?? MODULE_EXPLORER_ENTRIES[0]

  const focusTab = useCallback((index: number) => {
    const len = MODULE_EXPLORER_ENTRIES.length
    const i = ((index % len) + len) % len
    setActiveId(MODULE_EXPLORER_ENTRIES[i].id)
    tabRefs.current[i]?.focus()
  }, [])

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        focusTab(index + 1)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        focusTab(index - 1)
      } else if (e.key === "Home") {
        e.preventDefault()
        focusTab(0)
      } else if (e.key === "End") {
        e.preventDefault()
        focusTab(MODULE_EXPLORER_ENTRIES.length - 1)
      }
    },
    [focusTab],
  )

  return (
    <section
      id={PAPION_MODULE_EXPLORER_ID}
      className="scroll-mt-[4.5rem] border-y border-[var(--color-drh-ink)]/10 bg-[linear-gradient(180deg,rgb(255_255_253),rgb(250_250_248))] px-5 py-20 sm:px-8 lg:scroll-mt-24 lg:py-28 lg:px-10"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Module explorer</Eyebrow>
          <h2
            id={headingId}
            className="mt-4 text-balance text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-[var(--color-drh-ink)] sm:text-[1.65rem] md:text-[1.85rem]"
            style={{
              fontFamily: BODY_FONT,
              fontVariationSettings: '"opsz" 72, "wght" 520',
            }}
          >
            Pick a part of Papion. One focused read, not the whole system at
            once.
          </h2>
          <Prose className="mt-5 text-center">
            Use the strip below to jump to the domain you care about. Each tab
            keeps proof, a short story, and a handful of uncommon beats.
          </Prose>
        </div>

        <div className="mt-12">
          <div
            className="-mx-1 border-b border-[var(--color-drh-ink)]/10 pb-2 sm:-mx-2"
            role="tablist"
            aria-label="Papion product areas"
          >
            <div className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:thin] sm:gap-2">
              {MODULE_EXPLORER_ENTRIES.map((entry, index) => {
                const isActive = entry.id === activeId
                return (
                  <button
                    key={entry.id}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    id={tabIds[index]}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelIds[index]}
                    tabIndex={isActive ? 0 : -1}
                    className={`shrink-0 border border-b-0 px-3.5 py-2.5 text-[0.68rem] font-medium tracking-[0.14em] uppercase transition sm:px-4 sm:py-3 ${
                      isActive
                        ? "border-[var(--color-drh-ink)]/18 bg-white text-[var(--color-drh-ink)] shadow-[0_-6px_24px_rgb(10_10_10/0.04)]"
                        : "border-transparent bg-white/40 text-[var(--color-drh-ink)]/45 hover:bg-white/70 hover:text-[var(--color-drh-ink)]/65"
                    }`}
                    style={{ fontFamily: DISPLAY_FONT }}
                    onClick={() => setActiveId(entry.id)}
                    onKeyDown={(e) => onTabKeyDown(e, index)}
                  >
                    {entry.label}
                  </button>
                )
              })}
            </div>
          </div>

          <motion.div
            key={active.id}
            role="tabpanel"
            id={panelIds[activeIndex]}
            aria-labelledby={tabIds[activeIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 0.08, 0.19, 1] }}
            className="border border-[var(--color-drh-ink)]/12 border-t-0 bg-white/95 px-5 py-10 shadow-[0_24px_64px_rgb(10_10_10/0.06)] backdrop-blur-sm sm:px-8 sm:py-12 lg:px-10"
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
              <div className="min-w-0">
                <p
                  className="text-[0.64rem] font-medium tracking-[0.2em] text-[var(--color-drh-accent-orange)]/95 uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {active.label}
                </p>
                <StoryTitle as="h3" className="mt-2 !text-left text-left">
                  {active.headline}
                </StoryTitle>
                <Prose className="mt-5 !text-left text-left">
                  {active.intro}
                </Prose>

                {!active.featureSpotlights?.length ? (
                  <>
                    <div className="mt-8">
                      <p
                        className="text-[0.65rem] font-medium tracking-[0.18em] text-[var(--color-drh-ink)]/38 uppercase"
                        style={{ fontFamily: DISPLAY_FONT }}
                      >
                        Uncommon beats
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {active.rareFeatures.map((feature) => (
                          <li
                            key={feature}
                            className="rounded-full border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-bg)]/80 px-3.5 py-2 text-[0.82rem] leading-snug text-[var(--color-drh-ink)]/72"
                            style={{ fontFamily: BODY_FONT }}
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p
                      className="mt-8 border-t border-[var(--color-drh-ink)]/08 pt-6 text-[0.88rem] leading-relaxed text-[var(--color-drh-ink)]/48 italic"
                      style={{ fontFamily: BODY_FONT }}
                    >
                      {active.whyMatters}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="min-w-0 lg:sticky lg:top-28">
                <ExplorerPrimaryMedia
                  entry={active}
                  videoLightboxTitleId={primaryVideoLightboxTitleId}
                />
              </div>
            </div>

            {active.featureSpotlights?.length ? (
              <>
                <ExplorerFeatureSpotlights
                  key={`${active.id}-spotlights`}
                  baseId={baseId}
                  entry={active}
                />
                <p
                  className="mt-10 border-t border-[var(--color-drh-ink)]/08 pt-8 text-[0.88rem] leading-relaxed text-[var(--color-drh-ink)]/48 italic"
                  style={{ fontFamily: BODY_FONT }}
                >
                  {active.whyMatters}
                </p>
              </>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
