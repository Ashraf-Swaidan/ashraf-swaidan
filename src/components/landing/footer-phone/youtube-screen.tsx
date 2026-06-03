import {
  type RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"

import {
  ChevronLeft,
  ChevronRight,
  Home,
  ListVideo,
  Smartphone,
  UserRound,
} from "lucide-react"

import { SELECTED_WORKS_VIDEOS } from "@/constants/selectedWorksVideos"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { cn } from "@/lib/utils"

import { BODY_FONT, DISPLAY_FONT, PHONE_ASSET_ROOT } from "./constants"
import { useVideoDurationLabel } from "./video-duration"

const YT_SCROLL_HIDE =
  "overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

const YT_BG = "#0f0f0f"
const YT_CARD = "#272727"
const YT_MUTED = "#aaaaaa"

const PAPION_V = "/assets/papion-page/papion-videos"

export type YtVideo = {
  id: string
  title: string
  src: string
  channelId: string
  views: string
  publishedAgo: string
  tags: ("demos" | "ai" | "ops")[]
}

/** Home feed order: Luxian lap → Papion → Duwit → AK → Twodo → Papion feature demos */
const YOUTUBE_VIDEOS: YtVideo[] = [
  {
    id: "luxian-lap",
    title: "Luxian — lap hero",
    src: SELECTED_WORKS_VIDEOS.luxian,
    channelId: "luxian",
    views: "3.8K views",
    publishedAgo: "2 days ago",
    tags: ["demos"],
  },
  {
    id: "papion-lap",
    title: "Papion System — lap hero",
    src: SELECTED_WORKS_VIDEOS.papion,
    channelId: "papion",
    views: "18K views",
    publishedAgo: "1 month ago",
    tags: ["demos"],
  },
  {
    id: "duwit-lap",
    title: "Duwit — lap hero",
    src: SELECTED_WORKS_VIDEOS.duwit,
    channelId: "duwit",
    views: "9.1K views",
    publishedAgo: "3 weeks ago",
    tags: ["demos"],
  },
  {
    id: "ak-lap",
    title: "AK System — lap hero",
    src: SELECTED_WORKS_VIDEOS.ak,
    channelId: "ak-system",
    views: "7.4K views",
    publishedAgo: "2 weeks ago",
    tags: ["demos"],
  },
  {
    id: "twodo-lap",
    title: "Twodo — lap hero",
    src: SELECTED_WORKS_VIDEOS.twodo,
    channelId: "twodo",
    views: "5.2K views",
    publishedAgo: "5 days ago",
    tags: ["demos"],
  },
  {
    id: "papion-ai",
    title: "Papion — AI",
    src: `${PAPION_V}/AI-video.mp4`,
    channelId: "papion",
    views: "12K views",
    publishedAgo: "11 days ago",
    tags: ["ai", "ops"],
  },
  {
    id: "papion-insights",
    title: "Papion — insights",
    src: `${PAPION_V}/insights-video.mp4`,
    channelId: "papion",
    views: "4.8K views",
    publishedAgo: "2 weeks ago",
    tags: ["ops"],
  },
  {
    id: "papion-inventory",
    title: "Papion — inventory",
    src: `${PAPION_V}/inventory-video.mp4`,
    channelId: "papion",
    views: "6.1K views",
    publishedAgo: "9 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-expense",
    title: "Papion — expenses",
    src: `${PAPION_V}/expense-video.mp4`,
    channelId: "papion",
    views: "3.9K views",
    publishedAgo: "16 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-customers",
    title: "Papion — customers",
    src: `${PAPION_V}/customers-video.mp4`,
    channelId: "papion",
    views: "5.5K views",
    publishedAgo: "8 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-supplier",
    title: "Papion — supplier",
    src: `${PAPION_V}/supplier-video.mp4`,
    channelId: "papion",
    views: "4.2K views",
    publishedAgo: "12 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-wallets",
    title: "Papion — wallets",
    src: `${PAPION_V}/wallets-video.mp4`,
    channelId: "papion",
    views: "3.3K views",
    publishedAgo: "20 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-order-agenda",
    title: "Papion — order agenda",
    src: `${PAPION_V}/order-calendar-agenda.mp4`,
    channelId: "papion",
    views: "2.9K views",
    publishedAgo: "1 week ago",
    tags: ["ops"],
  },
  {
    id: "papion-order-draft",
    title: "Papion — load draft",
    src: `${PAPION_V}/order-load-draft.mp4`,
    channelId: "papion",
    views: "3.7K views",
    publishedAgo: "14 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-bulk-pay",
    title: "Papion — bulk pay",
    src: `${PAPION_V}/bulk-pay-order.mp4`,
    channelId: "papion",
    views: "8.4K views",
    publishedAgo: "4 days ago",
    tags: ["ops", "demos"],
  },
  {
    id: "papion-3d",
    title: "Papion — 3D stands",
    src: `${PAPION_V}/3D-model-stands.mp4`,
    channelId: "papion",
    views: "15K views",
    publishedAgo: "6 days ago",
    tags: ["demos", "ops"],
  },
  {
    id: "papion-unifying",
    title: "Papion — unifying loans",
    src: `${PAPION_V}/unifying-loans.mp4`,
    channelId: "papion",
    views: "2.1K views",
    publishedAgo: "22 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-export",
    title: "Papion — inventory export",
    src: `${PAPION_V}/inventory-export.mp4`,
    channelId: "papion",
    views: "2.6K views",
    publishedAgo: "19 days ago",
    tags: ["ops"],
  },
  {
    id: "papion-expense-receipt",
    title: "Papion — expense receipt",
    src: `${PAPION_V}/expense-image-reciept.mp4`,
    channelId: "papion",
    views: "4.0K views",
    publishedAgo: "10 days ago",
    tags: ["ops"],
  },
]

const VIDEO_BY_ID = Object.fromEntries(YOUTUBE_VIDEOS.map((v) => [v.id, v]))

const SHORTS_FEATURE = VIDEO_BY_ID["papion-bulk-pay"]

type BottomTabId = "home" | "shorts" | "subs" | "you"

type ChipId =
  | "all"
  | "papion"
  | "duwit"
  | "ak-system"
  | "twodo"
  | "luxian"
  | "demos"
  | "ai"

const CHIPS: { id: ChipId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "papion", label: "Papion" },
  { id: "duwit", label: "Duwit" },
  { id: "ak-system", label: "AK System" },
  { id: "twodo", label: "Twodo" },
  { id: "luxian", label: "Luxian" },
  { id: "demos", label: "Demos" },
  { id: "ai", label: "AI" },
]

function filterByChip(videos: YtVideo[], chip: ChipId): YtVideo[] {
  if (chip === "all") return videos
  if (chip === "demos") return videos.filter((v) => v.tags.includes("demos"))
  if (chip === "ai") return videos.filter((v) => v.tags.includes("ai"))
  return videos.filter((v) => v.channelId === chip)
}

function YtDurationTag({ src, className }: { src: string; className?: string }) {
  const dur = useVideoDurationLabel(src)
  if (!dur) return null
  return (
    <span
      className={cn(
        "pointer-events-none absolute right-1 bottom-1 rounded bg-black/78 px-1 py-0.5 text-[0.58rem] font-semibold tabular-nums text-white",
        className
      )}
      style={{ fontFamily: DISPLAY_FONT }}
    >
      {dur}
    </span>
  )
}

function VideoThumb({
  src,
  title,
  className,
}: {
  src: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <video
        className="h-full w-full object-cover"
        src={src}
        muted
        playsInline
        preload="metadata"
        aria-label={title}
      />
      <YtDurationTag src={src} />
    </div>
  )
}

function FeedVideoCard({
  video,
  onOpen,
}: {
  video: YtVideo
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <VideoThumb src={video.src} title={video.title} className="h-full w-full" />
      </div>
      <div className="px-2 py-1.5">
        <p
          className="line-clamp-2 text-[0.88rem] leading-tight font-semibold text-white"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          {video.title}
        </p>
        <p
          className="mt-1 text-[0.72rem] leading-snug"
          style={{ color: YT_MUTED, fontFamily: BODY_FONT }}
        >
          {video.views} · {video.publishedAgo}
        </p>
      </div>
    </button>
  )
}

function SmallUpNextCard({
  video,
  onOpen,
}: {
  video: YtVideo
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full shrink-0 gap-2 rounded-lg p-1 text-left transition hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
    >
      <div className="relative aspect-video w-[7.25rem] shrink-0 overflow-hidden rounded-md bg-black">
        <VideoThumb
          src={video.src}
          title={video.title}
          className="h-full w-full"
        />
      </div>
      <div className="min-w-0 py-0.5">
        <p
          className="line-clamp-2 text-[0.78rem] font-semibold text-white"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          {video.title}
        </p>
      </div>
    </button>
  )
}

function WatchOverlay({
  video,
  onClose,
  onOpenVideo,
}: {
  video: YtVideo
  onClose: () => void
  onOpenVideo: (v: YtVideo) => void
}) {
  const [descOpen, setDescOpen] = useState(false)
  const project = SELECTED_WORKS_PROJECTS.find((p) => p.id === video.channelId)
  const upNext = YOUTUBE_VIDEOS.filter(
    (v) => v.channelId === video.channelId && v.id !== video.id
  ).slice(0, 6)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className={cn(
        "absolute inset-0 z-40 flex flex-col overflow-y-auto bg-[#0f0f0f]",
        YT_SCROLL_HIDE
      )}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-black/90 px-2 py-2 backdrop-blur-md">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-0.5 rounded-full py-1 pr-2 pl-1 text-white transition active:opacity-70"
          aria-label="Back to YouTube"
        >
          <ChevronLeft className="size-6" strokeWidth={2.25} aria-hidden />
          <span
            className="text-[0.95rem] font-medium"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            }}
          >
            Back
          </span>
        </button>
        <span
          className="truncate text-[0.72rem] font-medium text-white/80"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          Now playing
        </span>
        <span className="w-16 shrink-0" aria-hidden />
      </div>

      <div className="relative aspect-video w-full shrink-0 bg-black">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 left-2 z-20 grid size-10 place-items-center rounded-full bg-black/55 text-white shadow-lg ring-1 ring-white/12 backdrop-blur-md transition hover:bg-black/65 active:scale-95"
          aria-label="Back to YouTube"
        >
          <ChevronLeft className="size-6" strokeWidth={2.25} aria-hidden />
        </button>
        <video
          key={video.id}
          src={video.src}
          className="h-full w-full object-contain"
          controls
          playsInline
          autoPlay
          preload="metadata"
        />
      </div>

      <div className="px-3 pt-3 pb-2">
        <h2
          className="text-[0.95rem] font-bold leading-snug text-white"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          {video.title}
        </h2>
        <p
          className="mt-1.5 text-[0.75rem]"
          style={{ color: YT_MUTED, fontFamily: BODY_FONT }}
        >
          {video.views} · {video.publishedAgo}
        </p>
      </div>

      {project ? (
        <button
          type="button"
          onClick={() => setDescOpen((o) => !o)}
          className="mx-3 mb-3 rounded-xl bg-white/6 px-3 py-2.5 text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-[0.78rem] leading-relaxed text-white/90",
                !descOpen && "line-clamp-3"
              )}
              style={{ fontFamily: BODY_FONT }}
            >
              {project.description}
            </p>
            <ChevronRight
              className={cn(
                "size-4 shrink-0 text-white/50 transition",
                descOpen && "rotate-90"
              )}
              aria-hidden
            />
          </div>
          <span
            className="mt-1 text-[0.72rem] font-medium text-[#3ea6ff]"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            }}
          >
            {descOpen ? "Show less" : "Tap for more"}
          </span>
        </button>
      ) : null}

      <div className="border-t border-white/10 px-3 pt-3 pb-24">
        <p
          className="mb-2 text-[0.88rem] font-bold text-white"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          Up next
        </p>
        <div className="flex flex-col gap-1">
          {upNext.map((v) => (
            <SmallUpNextCard
              key={v.id}
              video={v}
              onOpen={() => onOpenVideo(v)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function YouTubeTopBar({ onExitApp }: { onExitApp: () => void }) {
  return (
    <div
      className="flex shrink-0 items-center gap-1.5 border-b border-white/10 px-1.5 py-1"
      style={{ backgroundColor: YT_BG }}
    >
      <button
        type="button"
        onClick={onExitApp}
        className="grid size-8 shrink-0 place-items-center rounded-full text-white transition active:bg-white/10"
        aria-label="Back to phone home"
      >
        <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <img
          src={`${PHONE_ASSET_ROOT}/youtube.svg`}
          alt=""
          className="size-[1.35rem] shrink-0"
        />
        <span
          className="truncate text-[0.92rem] font-bold tracking-tight text-white"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          YouTube
        </span>
      </div>
    </div>
  )
}

function ChipRow({
  active,
  onChange,
}: {
  active: ChipId
  onChange: (id: ChipId) => void
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 gap-1.5 overflow-x-auto border-b border-white/8 px-2 py-1",
        YT_SCROLL_HIDE
      )}
      style={{ backgroundColor: YT_BG }}
    >
      {CHIPS.map(({ id, label }) => {
        const on = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-0.5 text-[0.7rem] font-medium transition",
              on
                ? "bg-white text-black"
                : "bg-white/12 text-white hover:bg-white/18"
            )}
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function YouTubeBottomTabs({
  active,
  onChange,
}: {
  active: BottomTabId
  onChange: (id: BottomTabId) => void
}) {
  const tabs: {
    id: BottomTabId
    label: string
    Icon: typeof Home
  }[] = [
    { id: "home", label: "Home", Icon: Home },
    { id: "shorts", label: "Shorts", Icon: Smartphone },
    { id: "subs", label: "Subs", Icon: ListVideo },
    { id: "you", label: "You", Icon: UserRound },
  ]

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/94 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl">
      <nav className="grid grid-cols-4 gap-0 px-1 pt-1 pb-1.5" aria-label="YouTube">
        {tabs.map(({ id, label, Icon }) => {
          const isOn = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-0.5 rounded-lg py-1"
            >
              <Icon
                className="size-[1.35rem]"
                strokeWidth={isOn ? 2.35 : 1.85}
                style={{ color: isOn ? "#fff" : YT_MUTED }}
                aria-hidden
              />
              <span
                className={cn(
                  "max-w-[4rem] truncate text-[0.55rem] font-medium",
                  isOn ? "text-white" : "text-[#717171]"
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
      <div className="mx-auto mb-1 h-1 w-28 rounded-full bg-white/22" />
    </div>
  )
}

function LibraryRow({
  title,
  videos,
  onOpen,
}: {
  title: string
  videos: YtVideo[]
  onOpen: (v: YtVideo) => void
}) {
  return (
    <div className="px-3 py-2">
      <p
        className="mb-2 text-[0.95rem] font-bold text-white"
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        }}
      >
        {title}
      </p>
      <div className={cn("flex gap-2 overflow-x-auto pb-1", YT_SCROLL_HIDE)}>
        {videos.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onOpen(v)}
            className="w-[5.5rem] shrink-0 text-left focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <VideoThumb src={v.src} title={v.title} className="h-full w-full" />
            </div>
            <p
              className="mt-1 line-clamp-2 text-[0.65rem] leading-tight text-white/92"
              style={{ fontFamily: BODY_FONT }}
            >
              {v.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export function YouTubeScreen({
  appPanelRef,
  onExitApp,
}: {
  appPanelRef?: RefObject<HTMLDivElement | null>
  onExitApp: () => void
}) {
  const [tab, setTab] = useState<BottomTabId>("home")
  const [chip, setChip] = useState<ChipId>("all")
  const [subsChannelId, setSubsChannelId] = useState<string | null>(null)
  const [watching, setWatching] = useState<YtVideo | null>(null)

  const openWatch = useCallback((v: YtVideo) => setWatching(v), [])
  const closeWatch = useCallback(() => setWatching(null), [])

  useLayoutEffect(() => {
    const el = appPanelRef?.current
    if (!el) return
    if (watching) {
      el.style.overflow = "hidden"
    } else {
      el.style.overflow = ""
    }
    return () => {
      el.style.overflow = ""
    }
  }, [watching, appPanelRef])

  const homeFeed = useMemo(() => filterByChip(YOUTUBE_VIDEOS, chip), [chip])

  const historyVideos = useMemo(() => YOUTUBE_VIDEOS.slice(0, 3), [])
  const yourVideos = useMemo(() => YOUTUBE_VIDEOS.slice(3, 6), [])
  const watchLater = useMemo(() => YOUTUBE_VIDEOS.slice(6, 9), [])

  const scrollPad = "pb-[4.75rem]"

  if (watching) {
    return (
      <WatchOverlay
        video={watching}
        onClose={closeWatch}
        onOpenVideo={openWatch}
      />
    )
  }

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col text-white"
      style={{ backgroundColor: YT_BG }}
    >
      <YouTubeTopBar onExitApp={onExitApp} />

      {tab === "home" ? (
        <ChipRow active={chip} onChange={setChip} />
      ) : null}

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          YT_SCROLL_HIDE,
          scrollPad
        )}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {tab === "home" ? (
          <div>
            {homeFeed.map((v) => (
              <FeedVideoCard key={v.id} video={v} onOpen={() => openWatch(v)} />
            ))}
          </div>
        ) : tab === "shorts" && SHORTS_FEATURE ? (
          <div className="flex min-h-[70%] flex-col items-center justify-start px-3 pt-4">
            <p
              className="mb-2 self-start text-[0.95rem] font-bold"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Shorts
            </p>
            <div className="relative aspect-[9/16] w-full max-w-[13rem] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/12">
              <video
                className="h-full w-full object-cover"
                src={SHORTS_FEATURE.src}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                aria-label={SHORTS_FEATURE.title}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p
                  className="text-[0.85rem] font-bold leading-tight text-white"
                  style={{
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                  }}
                >
                  {SHORTS_FEATURE.title}
                </p>
              </div>
            </div>
          </div>
        ) : tab === "subs" ? (
          <div>
            <div
              className={cn(
                "flex gap-3 overflow-x-auto border-b border-white/8 px-3 py-3",
                YT_SCROLL_HIDE
              )}
            >
              {SELECTED_WORKS_PROJECTS.map((p) => {
                const count = YOUTUBE_VIDEOS.filter(
                  (v) => v.channelId === p.id
                ).length
                if (count === 0) return null
                const on = subsChannelId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSubsChannelId(on ? null : p.id)}
                    className="flex shrink-0 flex-col items-center gap-1"
                  >
                    <span
                      className={cn(
                        "grid size-14 place-items-center overflow-hidden rounded-full bg-white p-2 ring-2 transition",
                        on ? "ring-red-500" : "ring-transparent"
                      )}
                    >
                      <img
                        src={p.logoSrc}
                        alt=""
                        className="size-full object-contain"
                      />
                    </span>
                    <span
                      className="max-w-[4rem] truncate text-[0.62rem] text-white/88"
                      style={{ fontFamily: BODY_FONT }}
                    >
                      {p.title.replace(" System", "")}
                    </span>
                  </button>
                )
              })}
            </div>
            {subsChannelId ? (
              <div>
                <div className="border-t border-white/8">
                  {YOUTUBE_VIDEOS.filter((v) => v.channelId === subsChannelId).map(
                    (v) => (
                      <FeedVideoCard
                        key={v.id}
                        video={v}
                        onOpen={() => openWatch(v)}
                      />
                    )
                  )}
                </div>
              </div>
            ) : (
              <div
                className="px-4 py-10 text-center"
                style={{ color: YT_MUTED, fontFamily: BODY_FONT }}
              >
                Tap a channel to see uploads.
              </div>
            )}
          </div>
        ) : (
          <div className="pt-2" style={{ backgroundColor: YT_BG }}>
            <LibraryRow
              title="History"
              videos={historyVideos}
              onOpen={openWatch}
            />
            <LibraryRow
              title="Your videos"
              videos={yourVideos}
              onOpen={openWatch}
            />
            <LibraryRow
              title="Watch later"
              videos={watchLater}
              onOpen={openWatch}
            />
            <div
              className="mx-3 mt-4 rounded-xl p-4"
              style={{ backgroundColor: YT_CARD }}
            >
              <p
                className="text-[0.88rem] font-semibold text-white"
                style={{ fontFamily: BODY_FONT }}
              >
                Portfolio previews only — not connected to a Google account.
              </p>
            </div>
          </div>
        )}
      </div>

      <YouTubeBottomTabs active={tab} onChange={setTab} />
    </div>
  )
}
