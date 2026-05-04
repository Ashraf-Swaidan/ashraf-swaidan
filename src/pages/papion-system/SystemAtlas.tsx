import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useId, useRef, useState } from "react"

import {
  ATLAS_ENTRIES,
  BODY_FONT,
  CASE_ASSETS,
  DISPLAY_FONT,
  type AtlasTabId,
} from "./papion-data"
import { CaseStudyFigure } from "./papion-media"
import { Eyebrow, Prose } from "./papion-ui"

export function SystemAtlas() {
  const atlasHeadingId = useId()
  const [activeId, setActiveId] = useState<AtlasTabId>(ATLAS_ENTRIES[0].id)
  const active =
    ATLAS_ENTRIES.find((e) => e.id === activeId) ?? ATLAS_ENTRIES[0]
  const assetSrc = CASE_ASSETS[active.assetKey]
  const panelRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return
      gsap.fromTo(
        panel,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
      )
    },
    { dependencies: [activeId], scope: panelRef, revertOnUpdate: true },
  )

  return (
    <section
      className="border-y border-[var(--color-drh-ink)]/10 bg-white px-5 py-20 sm:px-8 lg:py-28 lg:px-10"
      aria-labelledby={atlasHeadingId}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>System atlas</Eyebrow>
          <h2
            id={atlasHeadingId}
            className="mt-4 text-balance text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-[var(--color-drh-ink)] sm:text-[1.65rem] md:text-[1.85rem]"
            style={{
              fontFamily: BODY_FONT,
              fontVariationSettings: '"opsz" 72, "wght" 520',
            }}
          >
            Walk the product one chapter at a time.
          </h2>
          <Prose className="mt-5 text-center">
            Each tab opens a single surface: proof first, then the story and
            what to notice.
          </Prose>
        </div>

        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,200px)_1fr] lg:gap-12 lg:items-start">
          <div className="lg:hidden">
            <div
              className="-mx-1 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:thin]"
              role="tablist"
              aria-label="Papion system areas"
            >
              {ATLAS_ENTRIES.map((entry) => {
                const isActive = entry.id === activeId
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.68rem] font-medium tracking-[0.12em] uppercase transition ${
                      isActive
                        ? "border-[var(--color-drh-ink)]/25 bg-[var(--color-drh-ink)] text-white shadow-sm"
                        : "border-[var(--color-drh-ink)]/10 bg-white/90 text-[var(--color-drh-ink)]/50"
                    }`}
                    style={{ fontFamily: DISPLAY_FONT }}
                    onClick={() => setActiveId(entry.id)}
                  >
                    {entry.label}
                  </button>
                )
              })}
            </div>
          </div>

          <nav
            className="sticky top-28 hidden lg:block"
            aria-label="Papion system areas"
          >
            <ul className="space-y-0.5 border-l border-[var(--color-drh-ink)]/10 pl-4">
              {ATLAS_ENTRIES.map((entry) => {
                const isActive = entry.id === activeId
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`group flex w-full flex-col items-start gap-0.5 rounded-md py-2 pl-1 text-left transition ${
                        isActive
                          ? "text-[var(--color-drh-ink)]"
                          : "text-[var(--color-drh-ink)]/42 hover:text-[var(--color-drh-ink)]/65"
                      }`}
                      onClick={() => setActiveId(entry.id)}
                    >
                      <span
                        className={`text-[0.65rem] font-medium tracking-[0.16em] uppercase ${
                          isActive
                            ? "text-[var(--color-drh-accent-orange)]"
                            : ""
                        }`}
                        style={{ fontFamily: DISPLAY_FONT }}
                      >
                        {entry.label}
                      </span>
                      <span
                        className="text-[0.8rem] leading-snug text-[var(--color-drh-ink)]/45"
                        style={{ fontFamily: BODY_FONT }}
                      >
                        {entry.short}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div
            ref={panelRef}
            className="mt-8 min-w-0 lg:mt-0"
            role="tabpanel"
            aria-live="polite"
          >
            <div className="space-y-8">
              <CaseStudyFigure
                src={assetSrc}
                alt={`${active.label} — Papion System`}
                caption={
                  active.id === "inventory"
                    ? "Eight inventory families; each obeys its own production rules."
                    : active.id === "responsive"
                      ? "Full desktop / tablet / mobile proof sits below in Interface craft — this slot previews desktop."
                      : undefined
                }
                plannedLabel={active.plannedMedia}
              />
              <div className="mx-auto max-w-prose lg:mx-0">
                <p
                  className="text-[0.64rem] font-medium tracking-[0.18em] text-[var(--color-drh-accent-orange)]/90 uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {active.short}
                </p>
                <h3
                  className="mt-3 text-xl font-medium leading-snug tracking-[-0.02em] text-[var(--color-drh-ink)] sm:text-[1.35rem]"
                  style={{
                    fontFamily: BODY_FONT,
                    fontVariationSettings: '"opsz" 72, "wght" 520',
                  }}
                >
                  {active.label}
                </h3>
                <Prose className="mt-4">{active.body}</Prose>
                <ul className="mt-6 space-y-3">
                  {active.proof.map((line) => (
                    <li
                      key={line}
                      className="border-t border-[var(--color-drh-ink)]/10 pt-3 text-[0.98rem] leading-[1.55] text-[var(--color-drh-ink)]/62 first:border-t-0 first:pt-0"
                      style={{ fontFamily: BODY_FONT }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
