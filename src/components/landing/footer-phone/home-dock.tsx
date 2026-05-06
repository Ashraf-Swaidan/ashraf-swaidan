import { cn } from "@/lib/utils"

import { CHATGPT_MARK_SRC } from "./constants"
import type { PhoneApp } from "./types"

/** iOS-style home icon plate: squircle (softer % radius) + centered glyph. */
function iconShellForApp(app: PhoneApp): "white" | "black" | "cream" | null {
  if (app.id === "spotify") return "black"
  if (app.id === "youtube") return "white"
  if (app.kind === "project") {
    if (app.project.id === "duwit") return "cream"
    return "white"
  }
  return null
}

const SQUIRCLE = "rounded-[30%]"

function AppIconImage({
  app,
  frameClass,
  bareImgClass,
}: {
  app: PhoneApp
  frameClass: string
  bareImgClass: string
}) {
  const shell = iconShellForApp(app)
  const needsBoost = app.id === "instagram" || app.id === "gmail"
  if (!shell) {
    return (
      <img
        src={app.iconSrc}
        alt=""
        className={cn(bareImgClass, needsBoost && "scale-[1.14]")}
        loading="lazy"
        decoding="async"
      />
    )
  }
  const shellClass =
    shell === "white"
      ? "bg-white shadow-[0_6px_16px_rgb(0_0_0/0.16)]"
      : shell === "cream"
        ? "bg-[#f5ecd8]"
        : "bg-neutral-950"

  return (
    <span
      className={cn(
        "grid place-items-center overflow-hidden p-[9%]",
        SQUIRCLE,
        shellClass,
        frameClass
      )}
    >
      <img
        src={app.iconSrc}
        alt=""
        className={cn("h-full w-full object-contain", needsBoost && "scale-[1.14]")}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}

export function AppIcon({
  app,
  onOpen,
  draggable,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  app: PhoneApp
  onOpen: () => void
  draggable?: boolean
  onDragStart?: () => void
  onDragEnter?: () => void
  onDragEnd?: () => void
}) {
  return (
    <button
      type="button"
      draggable={draggable}
      onClick={onOpen}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragEnd={onDragEnd}
      className="group flex h-[4.7rem] min-w-0 cursor-pointer flex-col items-center justify-start rounded-[1rem] px-0.5 py-1 text-center transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:outline-none"
      aria-label={`Open ${app.label}`}
    >
      <AppIconImage
        app={app}
        frameClass="h-[3.15rem] w-[3.15rem] transition group-hover:scale-[1.04]"
        bareImgClass="h-[3.15rem] w-[3.15rem] rounded-[30%] object-contain transition group-hover:scale-[1.04]"
      />
      <span className="mt-1.5 w-full truncate font-sans text-[0.64rem] leading-none font-semibold text-white">
        {app.label}
      </span>
    </button>
  )
}

export function DockIcon({ app, onOpen }: { app: PhoneApp; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid aspect-square w-full place-items-center rounded-[1.05rem] transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:outline-none"
      aria-label={`Open ${app.label}`}
    >
      <AppIconImage
        app={app}
        frameClass="h-[3.12rem] w-[3.12rem]"
        bareImgClass="h-[3.12rem] w-[3.12rem] rounded-[30%] object-contain"
      />
    </button>
  )
}

export function HomeWidgets({
  day,
  dateLine,
  ashAiApp,
  onOpenAshAi,
}: {
  day: string
  dateLine: string
  ashAiApp?: PhoneApp
  onOpenAshAi: () => void
}) {
  return (
    <div className="grid grid-cols-[1fr_0.82fr] gap-2">
      <div className="min-h-[5.3rem] rounded-[1.45rem] bg-black/24 px-3 py-3 font-sans text-white shadow-[0_14px_32px_rgb(0_0_0/0.18)] backdrop-blur-xl">
        <p className="text-[0.68rem] tracking-[0.18em] text-white/64 uppercase">
          Today
        </p>
        <p className="mt-1 text-[1.55rem] leading-none font-semibold">{day}</p>
        <p className="mt-1 text-[0.92rem] text-white/70">{dateLine}</p>
      </div>
      <button
        type="button"
        onClick={onOpenAshAi}
        className="flex min-h-[5.3rem] items-center rounded-[1.45rem] bg-white/78 px-3 py-3 text-left text-neutral-900 shadow-[0_14px_32px_rgb(0_0_0/0.08)] ring-1 ring-white/70 backdrop-blur-xl transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-neutral-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-black/15 focus-visible:outline-none"
      >
        <div className="flex w-full items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.85rem] bg-neutral-100/95 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] ring-1 ring-neutral-200/80">
            <img
              src={ashAiApp?.iconSrc ?? CHATGPT_MARK_SRC}
              alt=""
              className="h-6 w-6 object-contain"
              loading="lazy"
              decoding="async"
            />
          </span>
          <p className="min-w-0 flex-1 font-sans text-[1.02rem] leading-tight font-semibold tracking-[-0.02em] text-neutral-900">
            Ask anything
          </p>
        </div>
      </button>
    </div>
  )
}
