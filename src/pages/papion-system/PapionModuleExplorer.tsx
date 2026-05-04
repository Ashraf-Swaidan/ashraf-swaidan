import { motion } from "motion/react"
import {
  useCallback,
  useEffect,
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
  type ExplorerPrimaryMedia,
} from "./papion-data"
import { CaseStudyFigure } from "./papion-media"
import { Eyebrow, Prose, StoryTitle } from "./papion-ui"

function ExplorerVideoBlock({
  src,
  posterPlannedLabel,
  posterSrc,
  alt,
  videoFraming = "landscape",
}: {
  src: string
  posterPlannedLabel: string
  posterSrc: string
  alt: string
  videoFraming?: "landscape" | "portrait" | "tablet"
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
  const isPortrait = videoFraming === "portrait"
  const isTablet = videoFraming === "tablet"

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/10 bg-black shadow-[0_22px_56px_rgb(10_10_10/0.12)] ${
        isPortrait ? "flex justify-center py-6 sm:py-8" : ""
      }`}
    >
      <video
        key={effectiveSrc}
        className={
          isPortrait
            ? "mx-auto max-h-[min(70vh,620px)] w-auto max-w-full object-contain"
            : isTablet
              ? "aspect-[4/3] w-full object-cover"
              : "aspect-video w-full object-cover"
        }
        src={effectiveSrc}
        poster={posterSrc}
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

function ExplorerEntryMedia({
  media,
  alt,
  plannedMediaFallback,
}: {
  media: ExplorerPrimaryMedia
  alt: string
  plannedMediaFallback: string
}) {
  if (media.kind === "image") {
    return (
      <CaseStudyFigure
        src={CASE_ASSETS[media.assetKey]}
        alt={alt}
        caption={media.caption}
        plannedLabel={plannedMediaFallback}
      />
    )
  }

  const posterKey = media.posterAssetKey ?? "sales"
  return (
    <ExplorerVideoBlock
      src={media.src}
      posterSrc={CASE_ASSETS[posterKey]}
      posterPlannedLabel={plannedMediaFallback}
      alt={alt}
      videoFraming={media.videoFraming}
    />
  )
}

function ExplorerPrimaryMedia({ entry }: { entry: ExplorerModuleEntry }) {
  return (
    <ExplorerEntryMedia
      media={entry.primaryMedia}
      alt={`${entry.label} — Papion`}
      plannedMediaFallback={entry.plannedMediaFallback}
    />
  )
}

function AttachmentPaperclipIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function DemoAttachmentLightbox({
  open,
  onClose,
  src,
  alt,
  titleId,
}: {
  open: boolean
  onClose: () => void
  src: string
  alt: string
  titleId: string
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgb(10_10_10/0.72)] backdrop-blur-[2px]"
        aria-label="Close receipt preview"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[calc(100vh-2rem)] max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/12 bg-[rgb(252_252_251)] shadow-[0_32px_96px_rgb(0_0_0/0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-drh-ink)]/08 px-4 py-3 sm:px-5">
          <p
            id={titleId}
            className="text-[0.72rem] font-medium tracking-[0.14em] text-[var(--color-drh-ink)]/55 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Full receipt
          </p>
          <button
            ref={closeRef}
            type="button"
            className="rounded-lg border border-[var(--color-drh-ink)]/10 bg-white px-3 py-1.5 text-[0.78rem] font-medium text-[var(--color-drh-ink)]/75 transition hover:bg-[var(--color-drh-bg)]"
            style={{ fontFamily: BODY_FONT }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="overflow-auto p-3 sm:p-5">
          <img
            src={src}
            alt={alt}
            className="mx-auto max-h-[min(85vh,900px)] w-auto max-w-full rounded-lg object-contain"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
}

function DemoAttachmentMiniCard({
  imageSrc,
  label,
  imageAlt,
  onOpen,
}: {
  imageSrc: string
  label: string
  imageAlt: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[6.75rem] max-w-full shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--color-drh-ink)]/12 bg-white/95 text-left shadow-[0_6px_22px_rgb(10_10_10/0.06)] transition hover:border-[var(--color-drh-ink)]/22 hover:shadow-[0_10px_32px_rgb(10_10_10/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-drh-accent-orange)] sm:w-[7.25rem]"
      aria-label={`Open full size: ${label}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-drh-bg)]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover object-top transition duration-200 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex items-center gap-1.5 border-t border-[var(--color-drh-ink)]/08 px-1.5 py-1.5 text-[var(--color-drh-ink)]/55">
        <AttachmentPaperclipIcon className="h-3 w-3 shrink-0 opacity-70" />
        <span
          className="min-w-0 text-[0.58rem] font-semibold leading-tight tracking-[0.05em] uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

function SpotlightChevron({
  open,
  className = "text-[var(--color-drh-ink)]/40",
}: {
  open: boolean
  className?: string
}) {
  return (
    <svg
      aria-hidden
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${className} ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ExplorerFeatureSpotlights({
  baseId,
  entry,
}: {
  baseId: string
  entry: ExplorerModuleEntry
}) {
  const spotlights = entry.featureSpotlights
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [attachmentLightbox, setAttachmentLightbox] = useState<{
    src: string
    alt: string
  } | null>(null)
  const attachmentLightboxTitleId = `${baseId}-receipt-lightbox-title`

  if (!spotlights?.length) return null

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const sectionHeadingId = `${baseId}-uncommon-beats-heading`

  return (
    <section
      className="mt-10 -mx-5 border-y border-white/[0.09] px-5 py-10 sm:-mx-8 sm:px-8 lg:mt-14 lg:-mx-10 lg:px-10 lg:py-12"
      aria-labelledby={sectionHeadingId}
    >
      <header className="mb-8 max-w-3xl space-y-3 sm:mb-10">
        <h3
          id={sectionHeadingId}
          className="text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-black sm:text-[1.7rem] md:text-[1.9rem]"
          style={{
            fontFamily: BODY_FONT,
            fontVariationSettings: '"opsz" 72, "wght" 520',
          }}
        >
          Uncommon beats
        </h3>
        <p
          className="text-[0.98rem] leading-relaxed text-black sm:text-[1.08rem]"
          style={{ fontFamily: BODY_FONT }}
        >
          Features you wouldn&apos;t see coming.
        </p>
      </header>
      <ul className="list-none space-y-0 divide-y divide-white/[0.08] rounded-none border border-white/[0.1] p-0 shadow-[0_24px_56px_rgb(0_0_0/0.35)]">
        {spotlights.map((item) => {
          const isOpen = Boolean(open[item.id])
          const panelId = `${baseId}-spotlight-${entry.id}-${item.id}`
          const headerId = `${panelId}-label`
          return (
            <li key={item.id} className="overflow-hidden bg-[rgb(18_18_20)]">
              <button
                type="button"
                id={headerId}
                className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-white/[0.04] sm:px-5 sm:py-5"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <SpotlightChevron
                  open={isOpen}
                  className="text-[rgb(252_252_250)]/45"
                />
                <span className="min-w-0 flex-1 space-y-1">
                  <span
                    className="block text-[0.98rem] font-medium leading-snug text-[rgb(252_252_250)] sm:text-[1.02rem]"
                    style={{ fontFamily: BODY_FONT }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="block text-[0.86rem] leading-relaxed text-[rgb(252_252_250)]/58 sm:text-[0.9rem]"
                    style={{ fontFamily: BODY_FONT }}
                  >
                    {item.teaser}
                  </span>
                </span>
              </button>
              {isOpen ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="border-t border-white/[0.08] bg-[rgb(22_22_24)] px-4 py-6 sm:px-5 sm:py-8"
                >
                  {"primaryMedia" in item && item.primaryMedia ? (
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
                      <div className="flex min-w-0 flex-col gap-3">
                        <Prose className="!text-left text-left !text-[rgb(245_245_243/0.82)] [&>p+p]:mt-4">
                          {item.body.map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </Prose>
                        {item.demoAttachment ? (
                          <DemoAttachmentMiniCard
                            imageSrc={
                              CASE_ASSETS[item.demoAttachment.assetKey]
                            }
                            label={item.demoAttachment.label}
                            imageAlt={item.demoAttachment.imageAlt}
                            onOpen={() =>
                              setAttachmentLightbox({
                                src: CASE_ASSETS[
                                  item.demoAttachment!.assetKey
                                ],
                                alt: item.demoAttachment!.imageAlt,
                              })
                            }
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <ExplorerEntryMedia
                          media={item.primaryMedia}
                          alt={`${item.title} — ${entry.label}`}
                          plannedMediaFallback={item.plannedMediaFallback}
                        />
                      </div>
                    </div>
                  ) : (
                    <Prose className="max-w-3xl !text-left text-left !text-[rgb(245_245_243/0.82)] [&>p+p]:mt-4">
                      {item.body.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </Prose>
                  )}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      <DemoAttachmentLightbox
        open={attachmentLightbox !== null}
        onClose={() => setAttachmentLightbox(null)}
        src={attachmentLightbox?.src ?? ""}
        alt={attachmentLightbox?.alt ?? ""}
        titleId={attachmentLightboxTitleId}
      />
    </section>
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

                {!active.featureSpotlights?.length ? (
                  <>
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
                  </>
                ) : null}
              </div>

              <div className="min-w-0 lg:sticky lg:top-28">
                <ExplorerPrimaryMedia entry={active} />
              </div>
            </div>

            {active.featureSpotlights?.length ? (
              <>
                <ExplorerFeatureSpotlights
                  key={`${active.id}-spotlights`}
                  baseId={baseId}
                  entry={active}
                />
                <p
                  className="mt-10 border-t border-[var(--color-drh-ink)]/08 pt-8 text-[0.88rem] leading-relaxed text-[var(--color-drh-ink)]/48 italic"
                  style={{ fontFamily: BODY_FONT }}
                >
                  {active.whyMatters}
                </p>
              </>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
