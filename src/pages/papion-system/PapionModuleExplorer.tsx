import { motion } from "motion/react"
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"

import {
  BODY_FONT,
  CASE_ASSETS,
  DISPLAY_FONT,
  MODULE_EXPLORER_ENTRIES,
  PAPION_VIDEO_HERO,
  type ExplorerModuleEntry,
  type ExplorerModuleId,
} from "./papion-data"
import { CaseStudyFigure } from "./papion-media"
import { Eyebrow, Prose, StoryTitle } from "./papion-ui"

function ExplorerVideoBlock({
  src,
  posterPlannedLabel,
  posterSrc,
  alt,
}: {
  src: string
  posterPlannedLabel: string
  posterSrc: string
  alt: string
}) {
  const [usePoster, setUsePoster] = useState(false)
  const [useHeroFallback, setUseHeroFallback] = useState(false)

  if (usePoster) {
    return (
      <CaseStudyFigure
        src={posterSrc}
        alt={alt}
        plannedLabel={posterPlannedLabel}
      />
    )
  }

  const effectiveSrc = useHeroFallback ? PAPION_VIDEO_HERO : src

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/10 bg-black shadow-[0_22px_56px_rgb(10_10_10/0.12)]">
      <video
        key={effectiveSrc}
        className="aspect-video w-full object-cover"
        src={effectiveSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => {
          if (!useHeroFallback && effectiveSrc !== PAPION_VIDEO_HERO) {
            setUseHeroFallback(true)
          } else {
            setUsePoster(true)
          }
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.06),transparent_35%,rgb(0_0_0/0.35)_100%)]" />
    </div>
  )
}

function ExplorerPrimaryMedia({
  entry,
}: {
  entry: ExplorerModuleEntry
}) {
  const media = entry.primaryMedia

  if (media.kind === "image") {
    return (
      <CaseStudyFigure
        src={CASE_ASSETS[media.assetKey]}
        alt={`${entry.label} — Papion`}
        caption={media.caption}
        plannedLabel={entry.plannedMediaFallback}
      />
    )
  }

  const posterKey = media.posterAssetKey ?? "sales"
  return (
    <ExplorerVideoBlock
      src={media.src}
      posterSrc={CASE_ASSETS[posterKey]}
      posterPlannedLabel={entry.plannedMediaFallback}
      alt={`${entry.label} workflow — Papion`}
    />
  )
}

export function PapionModuleExplorer() {
  const baseId = useId()
  const headingId = `${baseId}-heading`
  const tabIds = MODULE_EXPLORER_ENTRIES.map((e) => `${baseId}-tab-${e.id}`)
  const panelIds = MODULE_EXPLORER_ENTRIES.map((e) => `${baseId}-panel-${e.id}`)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [activeId, setActiveId] = useState<ExplorerModuleId>(
    MODULE_EXPLORER_ENTRIES[0].id,
  )
  const activeIndex = MODULE_EXPLORER_ENTRIES.findIndex(
    (e) => e.id === activeId,
  )
  const active =
    MODULE_EXPLORER_ENTRIES[activeIndex] ?? MODULE_EXPLORER_ENTRIES[0]

  const focusTab = useCallback((index: number) => {
    const len = MODULE_EXPLORER_ENTRIES.length
    const i = ((index % len) + len) % len
    setActiveId(MODULE_EXPLORER_ENTRIES[i].id)
    tabRefs.current[i]?.focus()
  }, [])

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        focusTab(index + 1)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        focusTab(index - 1)
      } else if (e.key === "Home") {
        e.preventDefault()
        focusTab(0)
      } else if (e.key === "End") {
        e.preventDefault()
        focusTab(MODULE_EXPLORER_ENTRIES.length - 1)
      }
    },
    [focusTab],
  )

  return (
    <section
      className="border-y border-[var(--color-drh-ink)]/10 bg-[linear-gradient(180deg,rgb(255_255_253),rgb(250_250_248))] px-5 py-20 sm:px-8 lg:py-28 lg:px-10"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Module explorer</Eyebrow>
          <h2
            id={headingId}
            className="mt-4 text-balance text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-[var(--color-drh-ink)] sm:text-[1.65rem] md:text-[1.85rem]"
            style={{
              fontFamily: BODY_FONT,
              fontVariationSettings: '"opsz" 72, "wght" 520',
            }}
          >
            Pick a part of Papion. One focused read—not the whole system at once.
          </h2>
          <Prose className="mt-5 text-center">
            Use the strip below to jump to the domain you care about. Each tab
            keeps proof, a short story, and a handful of uncommon beats.
          </Prose>
        </div>

        <div className="mt-12">
          <div
            className="-mx-1 border-b border-[var(--color-drh-ink)]/10 pb-2 sm:-mx-2"
            role="tablist"
            aria-label="Papion product areas"
          >
            <div className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:thin] sm:gap-2">
              {MODULE_EXPLORER_ENTRIES.map((entry, index) => {
                const isActive = entry.id === activeId
                return (
                  <button
                    key={entry.id}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    id={tabIds[index]}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelIds[index]}
                    tabIndex={isActive ? 0 : -1}
                    className={`shrink-0 rounded-t-lg border border-b-0 px-3.5 py-2.5 text-[0.68rem] font-medium tracking-[0.14em] uppercase transition sm:px-4 sm:py-3 ${
                      isActive
                        ? "border-[var(--color-drh-ink)]/18 bg-white text-[var(--color-drh-ink)] shadow-[0_-6px_24px_rgb(10_10_10/0.04)]"
                        : "border-transparent bg-white/40 text-[var(--color-drh-ink)]/45 hover:bg-white/70 hover:text-[var(--color-drh-ink)]/65"
                    }`}
                    style={{ fontFamily: DISPLAY_FONT }}
                    onClick={() => setActiveId(entry.id)}
                    onKeyDown={(e) => onTabKeyDown(e, index)}
                  >
                    {entry.label}
                  </button>
                )
              })}
            </div>
          </div>

          <motion.div
            key={active.id}
            role="tabpanel"
            id={panelIds[activeIndex]}
            aria-labelledby={tabIds[activeIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 0.08, 0.19, 1] }}
            className="rounded-b-2xl rounded-tr-2xl border border-[var(--color-drh-ink)]/12 border-t-0 bg-white/95 px-5 py-10 shadow-[0_24px_64px_rgb(10_10_10/0.06)] backdrop-blur-sm sm:px-8 sm:py-12 lg:rounded-tr-none lg:px-10"
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
              <div className="min-w-0">
                <p
                  className="text-[0.64rem] font-medium tracking-[0.2em] text-[var(--color-drh-accent-orange)]/95 uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {active.label}
                </p>
                <StoryTitle as="h3" className="mt-2 !text-left text-left">
                  {active.headline}
                </StoryTitle>
                <Prose className="mt-5 !text-left text-left">
                  {active.intro}
                </Prose>

                <div className="mt-8">
                  <p
                    className="text-[0.65rem] font-medium tracking-[0.18em] text-[var(--color-drh-ink)]/38 uppercase"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    Uncommon beats
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {active.rareFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-full border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-bg)]/80 px-3.5 py-2 text-[0.82rem] leading-snug text-[var(--color-drh-ink)]/72"
                        style={{ fontFamily: BODY_FONT }}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <p
                  className="mt-8 border-t border-[var(--color-drh-ink)]/08 pt-6 text-[0.88rem] leading-relaxed text-[var(--color-drh-ink)]/48 italic"
                  style={{ fontFamily: BODY_FONT }}
                >
                  {active.whyMatters}
                </p>
              </div>

              <div className="min-w-0 lg:sticky lg:top-28">
                <ExplorerPrimaryMedia entry={active} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
