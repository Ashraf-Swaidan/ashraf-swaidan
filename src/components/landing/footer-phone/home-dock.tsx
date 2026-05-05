import { cn } from "@/lib/utils"

import { BODY_FONT, CHATGPT_MARK_SRC, DISPLAY_FONT } from "./constants"
import type { PhoneApp } from "./types"

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
      <img
        src={app.iconSrc}
        alt=""
        className={cn(
          "h-[3.15rem] w-[3.15rem] rounded-[0.96rem] object-contain drop-shadow-[0_12px_18px_rgb(0_0_0/0.26)] transition group-hover:scale-[1.04]",
          app.kind === "project" && "bg-white/92 p-2"
        )}
        loading="lazy"
        decoding="async"
      />
      <span
        className="mt-1.5 w-full truncate text-[0.64rem] leading-none font-semibold text-white drop-shadow-[0_1px_5px_rgb(0_0_0/0.62)]"
        style={{ fontFamily: DISPLAY_FONT }}
      >
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
      <img
        src={app.iconSrc}
        alt=""
        className="h-[3.12rem] w-[3.12rem] rounded-[0.96rem] object-contain drop-shadow-[0_12px_18px_rgb(0_0_0/0.26)]"
        loading="lazy"
        decoding="async"
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
      <div className="min-h-[5.3rem] rounded-[1.45rem] bg-black/24 px-3 py-3 text-white shadow-[0_14px_32px_rgb(0_0_0/0.18)] backdrop-blur-xl">
        <p
          className="text-[0.68rem] tracking-[0.18em] text-white/64 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Today
        </p>
        <p
          className="mt-1 text-[1.55rem] leading-none font-semibold"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {day}
        </p>
        <p
          className="mt-1 text-[0.92rem] text-white/70"
          style={{ fontFamily: BODY_FONT }}
        >
          {dateLine}
        </p>
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
          <p
            className="min-w-0 flex-1 text-[1.02rem] leading-tight font-semibold tracking-[-0.02em] text-neutral-900"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Ask anything
          </p>
        </div>
      </button>
    </div>
  )
}
