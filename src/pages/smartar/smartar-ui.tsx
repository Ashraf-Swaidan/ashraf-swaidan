import type { ReactNode } from "react"

import {
  SMARTAR_BODY_FONT,
  SMARTAR_DISPLAY_FONT,
  SMARTAR_LOGO,
} from "./smartar-data"

export function SmartarWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.28em] ${className}`}>
      <span>SMARTAR</span>
      <img
        src={SMARTAR_LOGO}
        alt=""
        className="h-[0.92em] w-[0.92em] shrink-0 translate-y-[0.06em] object-contain opacity-[0.92]"
        aria-hidden
      />
    </span>
  )
}

export function SmartarStoryTitle({
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
        fontFamily: SMARTAR_BODY_FONT,
        fontVariationSettings: '"opsz" 72, "wght" 520',
      }}
    >
      {children}
    </Tag>
  )
}

export function SmartarStoryStep({ n, label }: { n: string; label: string }) {
  return (
    <p
      className="mb-6 text-[0.72rem] tabular-nums tracking-[0.16em] text-[var(--color-drh-ink)]/38"
      style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
    >
      <span className="font-semibold text-[var(--color-drh-ink)]/52">{n}</span>
      <span className="mx-2 text-[var(--color-drh-ink)]/18">·</span>
      <span className="sr-only">Story chapter: </span>
      {label}
    </p>
  )
}

export function SmartarProse({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <p
      className={`text-base leading-[1.75] text-[var(--color-drh-ink-muted)] md:text-[1.05rem] ${className}`}
      style={{ fontFamily: SMARTAR_BODY_FONT }}
    >
      {children}
    </p>
  )
}
