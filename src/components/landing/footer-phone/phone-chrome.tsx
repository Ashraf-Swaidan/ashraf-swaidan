import { useEffect, useRef, useState } from "react"

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
  const startYRef = useRef<number | null>(null)

  return (
    <div
      className="absolute inset-x-0 top-0 z-[45] h-9 cursor-grab touch-none"
      onPointerDown={(event) => {
        startYRef.current = event.clientY
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerUp={(event) => {
        const startY = startYRef.current
        startYRef.current = null
        if (startY !== null && event.clientY - startY > 22) {
          onOpen()
        }
      }}
      onPointerCancel={() => {
        startYRef.current = null
      }}
      aria-label="Drag down for notifications"
      role="button"
      tabIndex={-1}
    />
  )
}

export function NotificationShade({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-2 top-2 z-[60] rounded-[2rem] bg-black/38 px-3 pt-11 pb-4 text-white shadow-[0_22px_54px_rgb(0_0_0/0.28)] backdrop-blur-2xl transition duration-300",
        open
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      )}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-x-0 top-2 mx-auto h-1.5 w-16 rounded-full bg-white/50"
        aria-label="Close notifications"
      />
      <p
        className="text-[0.68rem] tracking-[0.2em] text-white/58 uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Notifications
      </p>
      {[
        ["Papion System", "3 due-date orders need attention before 4 PM."],
        ["Gmail", "A thoughtful project brief would look good here."],
        [
          "Portfolio OS",
          "Drag apps around. The layout remembers this session.",
        ],
      ].map(([title, body]) => (
        <div
          key={title}
          className="mt-2 rounded-[1.15rem] bg-white/16 px-3 py-2"
        >
          <p
            className="text-[0.78rem] font-semibold"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {title}
          </p>
          <p
            className="mt-0.5 text-[0.82rem] leading-[1.25] text-white/72"
            style={{ fontFamily: BODY_FONT }}
          >
            {body}
          </p>
        </div>
      ))}
    </div>
  )
}
