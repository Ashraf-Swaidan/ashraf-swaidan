import type { ReactNode } from "react"

import { BODY_FONT, DISPLAY_FONT } from "./papion-data"

export function Eyebrow({ children }: { children: string }) {
  return (
    <p
      className="text-[0.68rem] font-medium tracking-[0.22em] text-[var(--color-drh-ink)]/40 uppercase"
      style={{ fontFamily: DISPLAY_FONT }}
    >
      {children}
    </p>
  )
}

/** Calm, readable titles — sentence case, human scale. */
export function StoryTitle({
  as: Tag = "h2",
  children,
  className = "",
}: {
  as?: "h1" | "h2" | "h3"
  children: string
  className?: string
}) {
  return (
    <Tag
      className={`mt-4 text-balance text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-[var(--color-drh-ink)] sm:text-[1.65rem] md:text-[1.85rem] ${className}`}
      style={{
        fontFamily: BODY_FONT,
        fontVariationSettings: '"opsz" 72, "wght" 520',
      }}
    >
      {children}
    </Tag>
  )
}

export function StoryStep({ n, label }: { n: string; label: string }) {
  return (
    <p
      className="mb-6 text-[0.72rem] tabular-nums tracking-[0.16em] text-[var(--color-drh-ink)]/35"
      style={{ fontFamily: DISPLAY_FONT }}
    >
      <span className="font-semibold text-[var(--color-drh-ink)]/55">{n}</span>
      <span className="mx-2 text-[var(--color-drh-ink)]/20">·</span>
      <span className="sr-only">Story chapter: </span>
      {label}
    </p>
  )
}

export function Prose({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <p
      className={`text-base leading-[1.75] text-[var(--color-drh-ink)]/65 md:text-[1.05rem] ${className}`}
      style={{ fontFamily: BODY_FONT }}
    >
      {children}
    </p>
  )
}
