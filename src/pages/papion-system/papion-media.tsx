import { useState } from "react"

import { ViewportLoopVideo } from "@/components/media/ViewportLoopVideo"

import {
  CASE_ASSETS,
  DISPLAY_FONT,
  BODY_FONT,
  PAPION_ORDER_SPINE_VIDEO,
  PAPION_VIDEO_HERO,
} from "./papion-data"

/**
 * Shows an image if the file loads; otherwise a calm editorial placeholder.
 */
export function CaseStudyFigure({
  src,
  alt,
  caption,
  plannedLabel,
  className = "",
  fetchPriority = "high",
}: {
  src: string
  alt: string
  caption?: string
  plannedLabel: string
  className?: string
  /** Spotlight / below-the-fold media can yield to critical route assets */
  fetchPriority?: "high" | "low"
}) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className={`space-y-3 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] shadow-[0_22px_56px_rgb(10_10_10/0.08)]">
        {!failed ? (
          <img
            src={src}
            alt={alt}
            className="aspect-[16/10] w-full object-cover object-top"
            loading="lazy"
            decoding="async"
            fetchPriority={fetchPriority}
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="flex aspect-[16/10] flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,rgb(250_250_249),rgb(245_245_244))] px-6 text-center"
            role="img"
            aria-label={alt}
          >
            <span
              className="text-[0.7rem] font-semibold tracking-[0.24em] text-[var(--color-drh-ink)]/38 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Visual forthcoming
            </span>
            <p
              className="max-w-md text-[0.95rem] leading-[1.5] text-[var(--color-drh-ink)]/48"
              style={{ fontFamily: BODY_FONT }}
            >
              {plannedLabel}
            </p>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption
          className="text-[0.82rem] leading-[1.45] text-[var(--color-drh-ink)]/45"
          style={{ fontFamily: BODY_FONT }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function OrderSpineVideo() {
  const [useFallback, setUseFallback] = useState(false)
  const src = useFallback ? PAPION_VIDEO_HERO : PAPION_ORDER_SPINE_VIDEO

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/10 bg-black shadow-[0_28px_72px_rgb(10_10_10/0.16)]">
      <ViewportLoopVideo
        key={src}
        className="aspect-video w-full object-cover"
        src={src}
        onError={() => {
          if (!useFallback) setUseFallback(true)
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.06),transparent_35%,rgb(0_0_0/0.35)_100%)]" />
    </div>
  )
}

export function FinanceVideoStrip() {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="rounded-2xl border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] px-6 py-16 text-center shadow-inner">
        <p
          className="text-[0.72rem] font-semibold tracking-[0.22em] text-[var(--color-drh-ink)]/38 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Finance motion
        </p>
        <p
          className="mx-auto mt-3 max-w-lg text-[0.98rem] text-[var(--color-drh-ink)]/52"
          style={{ fontFamily: BODY_FONT }}
        >
          Add{" "}
          <code className="rounded bg-[var(--color-drh-ink)]/6 px-1.5 py-0.5 text-[0.85rem]">
            papion-finance-control.mp4
          </code>{" "}
          under{" "}
          <code className="rounded bg-[var(--color-drh-ink)]/6 px-1.5 py-0.5 text-[0.85rem]">
            public/assets/lap-animation-assets/
          </code>{" "}
          for a wallets / transfers clip in this band.
        </p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/10 bg-black shadow-[0_22px_56px_rgb(10_10_10/0.12)]">
      <ViewportLoopVideo
        className="aspect-video w-full object-cover"
        src={CASE_ASSETS.financeClip}
        onError={() => setFailed(true)}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(0_0_0/0.45)_100%)]" />
      <p
        className="pointer-events-none absolute bottom-3 left-3 right-3 text-[0.75rem] leading-snug text-white/80 sm:bottom-4 sm:left-4 sm:right-4"
        style={{ fontFamily: BODY_FONT }}
      >
        Wallets, transactions, loans — cash stays traceable.
      </p>
    </div>
  )
}

export function ResponsiveTriptych() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(
        [
          {
            key: "desktop",
            label: "Desktop",
            src: CASE_ASSETS.responsiveDesktop,
            planned: "papion-responsive-sales-desktop.png",
          },
          {
            key: "tablet",
            label: "Tablet",
            src: CASE_ASSETS.responsiveTablet,
            planned: "papion-responsive-sales-tablet.png",
          },
          {
            key: "mobile",
            label: "Mobile / PWA",
            src: CASE_ASSETS.responsiveMobile,
            planned: "papion-responsive-sales-mobile.png",
          },
        ] as const
      ).map((item) => (
        <div key={item.key} className="space-y-2">
          <p
            className="text-[0.68rem] font-semibold tracking-[0.2em] text-[var(--color-drh-ink)]/42 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item.label}
          </p>
          <CaseStudyFigure
            src={item.src}
            alt={`Papion ${item.label} layout`}
            plannedLabel={`Planned asset: ${item.planned}`}
          />
        </div>
      ))}
    </div>
  )
}
