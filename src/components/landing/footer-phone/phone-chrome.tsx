import { useEffect, useState } from "react"

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react"
import { ExternalLink, Play, SkipBack, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { BODY_FONT, DISPLAY_FONT, PHONE_ASSET_ROOT } from "./constants"

export function usePhoneClock() {
  const [date, setDate] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setDate(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return {
    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
    day: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date),
    dateLine: new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
    }).format(date),
  }
}

function SignalBars() {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {[4, 6, 8, 10].map((height) => (
        <span
          key={height}
          className="w-[3px] rounded-full bg-white/90"
          style={{ height }}
        />
      ))}
    </span>
  )
}

function BatteryIcon() {
  return (
    <span className="flex items-center gap-[2px]" aria-hidden>
      <span className="h-[0.62rem] w-[1.32rem] rounded-[0.2rem] border border-white/80 p-[2px]">
        <span className="block h-full w-[72%] rounded-[0.1rem] bg-white/90" />
      </span>
      <span className="h-[0.28rem] w-[2px] rounded-r-full bg-white/72" />
    </span>
  )
}

export function StatusBar({ time }: { time: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-3 text-white drop-shadow-[0_1px_4px_rgb(0_0_0/0.32)]">
      <span
        className="text-[0.72rem] font-semibold tracking-[0.02em]"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {time}
      </span>
      <span className="flex items-center gap-2">
        <SignalBars />
        <img
          src={`${PHONE_ASSET_ROOT}/wifi.svg`}
          alt=""
          className="h-3.5 w-3.5 brightness-0 invert"
          aria-hidden
        />
        <BatteryIcon />
      </span>
    </div>
  )
}

export function NotificationDragHandle({ onOpen }: { onOpen: () => void }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className="absolute inset-x-0 top-0 z-[45] h-12 cursor-grab touch-none active:cursor-grabbing"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ bottom: reduceMotion ? 0 : 0.52, top: 0 }}
      onDragEnd={(_, info) => {
        if (reduceMotion) return
        if (info.offset.y > 10 || info.velocity.y > 120) onOpen()
      }}
      aria-label="Drag down for notifications"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen()
        }
      }}
    />
  )
}

export type PhoneNotification = {
  id: string
  layout?: "default" | "media"
  title: string
  body?: string
  /** Second line for `layout: "media"` (artist / creator). */
  artist?: string
  thumbUrl?: string
  /** Open in Spotify (browser) — optional control target. */
  openUrl?: string
  onClick?: () => void
  /** Dismiss (e.g. clear background session). */
  onDismiss?: () => void
  actions?: {
    label: string
    variant?: "default" | "danger"
    onClick: () => void
  }[]
}

export function NotificationShade({
  open,
  onClose,
  notifications,
}: {
  open: boolean
  onClose: () => void
  notifications: PhoneNotification[]
}) {
  const reduceMotion = useReducedMotion()
  const spring = reduceMotion
    ? { duration: 0.22 }
    : { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.82 }

  const handlePanelDragEnd = (
    _: unknown,
    info: { offset: { y: number }; velocity: { y: number } }
  ) => {
    const { offset, velocity } = info
    if (offset.y < -36 || velocity.y < -420) onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="notif-scrim"
            type="button"
            aria-label="Close notifications"
            className="absolute inset-0 z-[58] bg-black/42 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reduceMotion ? { duration: 0.15 } : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
            }
            onClick={onClose}
          />

          <motion.div
            key="notif-panel"
            role="dialog"
            aria-label="Notifications"
            className="absolute inset-x-2 top-2 z-[60] max-h-[min(78%,22rem)] overflow-hidden rounded-[2rem] bg-black/44 px-3 pb-4 text-white shadow-[0_22px_54px_rgb(0_0_0/0.28)] backdrop-blur-2xl will-change-transform"
            initial={{ y: "-108%", opacity: 0.96 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-108%", opacity: 0.94 }}
            transition={spring}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: -24, bottom: 48 }}
            dragElastic={{ top: 0.05, bottom: 0.28 }}
            dragMomentum
            onDragEnd={handlePanelDragEnd}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 flex-col items-center pt-2.5 pb-3">
              <span className="h-1 w-10 rounded-full bg-white/55" aria-hidden />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2 right-2 grid size-8 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
              aria-label="Close notifications"
            >
              <span className="text-lg leading-none">×</span>
            </button>

            <p
              className="px-1 pb-2 text-[0.68rem] tracking-[0.2em] text-white/58 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Notifications
            </p>
            <div
              className="max-h-[min(60vh,17rem)] space-y-2 overflow-y-auto overscroll-contain pr-0.5 [scrollbar-width:thin]"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {notifications.map((n) =>
                n.layout === "media" ? (
                  <div
                    key={n.id}
                    className="relative overflow-hidden rounded-[1.15rem] bg-white/16"
                  >
                    {n.onDismiss ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          n.onDismiss?.()
                          onClose()
                        }}
                        className="absolute top-1.5 right-1.5 z-[1] grid size-7 place-items-center rounded-full text-white/70 transition hover:bg-white/12 hover:text-white"
                        aria-label="Dismiss"
                      >
                        <X className="size-3.5" strokeWidth={2.25} />
                      </button>
                    ) : null}
                    <div className="flex items-center gap-2.5 px-2.5 py-2.5 pr-10">
                      {n.thumbUrl ? (
                        <button
                          type="button"
                          disabled={!n.onClick}
                          onClick={() => {
                            n.onClick?.()
                            onClose()
                          }}
                          className={cn(
                            "shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15 transition",
                            n.onClick && "hover:brightness-110 active:scale-[0.98]"
                          )}
                          aria-label="Open now playing"
                        >
                          <img
                            src={n.thumbUrl}
                            alt=""
                            className="h-12 w-12 object-cover"
                            loading="lazy"
                          />
                        </button>
                      ) : (
                        <div
                          className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-[#1DB954]/35 to-neutral-900 ring-1 ring-white/12"
                          aria-hidden
                        />
                      )}
                      <button
                        type="button"
                        disabled={!n.onClick}
                        onClick={() => {
                          n.onClick?.()
                          onClose()
                        }}
                        className={cn(
                          "min-w-0 flex-1 py-0.5 text-left font-sans transition",
                          n.onClick
                            ? "cursor-pointer hover:opacity-95"
                            : "cursor-default opacity-90"
                        )}
                      >
                        <p className="line-clamp-2 text-[0.74rem] font-semibold leading-snug tracking-tight text-white">
                          {n.title}
                        </p>
                        {n.artist ? (
                          <p className="mt-0.5 line-clamp-1 text-[0.64rem] leading-tight text-white/52">
                            {n.artist}
                          </p>
                        ) : null}
                      </button>
                      <div
                        className="flex shrink-0 items-center gap-0.5 pl-0.5"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          disabled
                          className="grid size-8 place-items-center rounded-full text-white/35"
                          aria-label="Previous track unavailable in embed"
                          title="Not available in web embed"
                        >
                          <SkipBack className="size-4" strokeWidth={2.25} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            n.onClick?.()
                            onClose()
                          }}
                          className="grid size-9 place-items-center rounded-full bg-white/18 text-white shadow-inner ring-1 ring-white/22 transition hover:bg-white/26 active:scale-95"
                          aria-label="Open in Spotify app"
                        >
                          <Play
                            className="ml-0.5 size-4 fill-white text-white"
                            strokeWidth={0}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (n.openUrl) {
                              window.open(
                                n.openUrl,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            onClose()
                          }}
                          disabled={!n.openUrl}
                          className="grid size-8 place-items-center rounded-full text-white/80 transition hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="Open in Spotify in browser"
                          title="Open in Spotify"
                        >
                          <ExternalLink className="size-3.5" strokeWidth={2.25} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={n.id}
                    className="overflow-hidden rounded-[1.15rem] bg-white/16"
                  >
                    <button
                      type="button"
                      disabled={!n.onClick}
                      onClick={() => {
                        n.onClick?.()
                        onClose()
                      }}
                      className={cn(
                        "flex w-full gap-2.5 px-3 py-2.5 text-left transition active:scale-[0.99]",
                        n.onClick
                          ? "cursor-pointer hover:bg-white/10"
                          : "cursor-default opacity-90"
                      )}
                    >
                      {n.thumbUrl ? (
                        <img
                          src={n.thumbUrl}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-[0.78rem] font-semibold"
                          style={{ fontFamily: DISPLAY_FONT }}
                        >
                          {n.title}
                        </p>
                        {n.body ? (
                          <p
                            className="mt-0.5 text-[0.82rem] leading-[1.25] text-white/72"
                            style={{ fontFamily: BODY_FONT }}
                          >
                            {n.body}
                          </p>
                        ) : null}
                      </div>
                    </button>
                    {n.actions?.length ? (
                      <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-2 py-2">
                        {n.actions.map((a) => (
                          <button
                            key={a.label}
                            type="button"
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[0.62rem] font-semibold transition hover:brightness-110",
                              a.variant === "danger"
                                ? "bg-red-500/28 text-red-50 ring-1 ring-red-400/35"
                                : "bg-white/14 text-white ring-1 ring-white/18"
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              a.onClick()
                              onClose()
                            }}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
