import { cn } from "@/lib/utils"
import type { CursorType } from "./types"

const CURSOR_PATHS: Record<CursorType, string> = {
  arrow:
    "M5 3.4 18.8 16.9c.5.5.1 1.3-.6 1.2l-5.9-.8-3.1 5.2c-.4.7-1.4.4-1.4-.4L5 3.4Z",
  hand:
    "M8.4 13.1V6.4a1.7 1.7 0 0 1 3.4 0v5.1-3a1.65 1.65 0 0 1 3.3 0v3.3-1.9a1.55 1.55 0 0 1 3.1 0v4.4c0 4.6-2.5 7.3-6.5 7.3-2.8 0-4.7-1.1-6.3-3.9l-1.8-3.1a1.55 1.55 0 0 1 2.6-1.7l2.2 2.7Z",
  ibeam:
    "M8 3.6h8v2.2h-2.8v12.4H16v2.2H8v-2.2h2.8V5.8H8V3.6Z",
}

const CURSOR_ASSETS: Partial<Record<CursorType, string>> = {
  arrow: "/assets/cursor-svgs/cursor.svg",
  hand: "/assets/cursor-svgs/pointinghand.svg",
}

export function CursorSvg({
  type,
  color,
  className,
}: {
  type: CursorType
  color: string
  className?: string
}) {
  const asset = CURSOR_ASSETS[type]

  if (asset) {
    return (
      <img
        src={asset}
        className={cn(type === "hand" ? "h-9 w-9" : "h-8 w-8", className)}
        style={{ filter: `drop-shadow(0 7px 10px rgb(0 0 0 / 0.18)) drop-shadow(0 0 0 ${color})` }}
        alt=""
        aria-hidden="true"
      />
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-7 w-7", className)}
      style={{ color, filter: "drop-shadow(0 7px 10px rgb(0 0 0 / 0.18))" }}
      aria-hidden="true"
    >
      <path d={CURSOR_PATHS[type]} fill="currentColor" stroke="white" strokeWidth="1.35" strokeLinejoin="round" />
    </svg>
  )
}
