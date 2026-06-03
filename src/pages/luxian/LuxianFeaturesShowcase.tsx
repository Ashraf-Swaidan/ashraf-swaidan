import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { HeroLoopVideo } from "@/components/media/HeroLoopVideo"
import { cn } from "@/lib/utils"

import {
  LUXIAN_BODY_FONT,
  LUXIAN_DISPLAY_FONT,
  LUXIAN_FEATURES,
  type LuxianFeature,
  type LuxianFeatureMedia,
  type LuxianFeatureSection,
} from "./luxian-data"
import { LuxianStoryStep } from "./luxian-ui"
import {
  LuxianFeatureVideoLightbox,
  VideoFullscreenIcon,
} from "./LuxianFeatureVideoLightbox"

const PROSE_CLASS =
  "text-[1.05rem] leading-[1.58] text-[var(--color-drh-ink)]/82 sm:text-[1.12rem] sm:leading-[1.62]"

function featureProseStyle() {
  return {
    fontFamily: LUXIAN_BODY_FONT,
    fontVariationSettings: '"opsz" 72, "wght" 460',
  } as const
}

function FeatureVideoBlock({
  item,
  onRequestFullscreen,
}: {
  item: Extract<LuxianFeatureMedia, { type: "video" }>
  onRequestFullscreen: (
    src: string,
    title: string,
    options?: { portrait?: boolean }
  ) => void
}) {
  const isPortrait = item.framing === "portrait"

  return (
    <figure className="flex flex-col gap-2">
      <div
        className={cn(
          "relative overflow-hidden border border-black/8",
          isPortrait
            ? "flex justify-center bg-[rgb(12_12_14)] py-6 sm:py-8"
            : "bg-neutral-100"
        )}
      >
        <HeroLoopVideo
          className={
            isPortrait
              ? "mx-auto aspect-[390/844] w-full max-w-[min(100%,340px)] object-contain"
              : "aspect-video w-full object-cover"
          }
          src={item.src}
          poster={item.poster}
          aria-label={item.alt}
        />
        <button
          type="button"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center border border-white/20 bg-[rgb(12_12_14/0.72)] text-white/90 shadow-[0_8px_24px_rgb(0_0_0/0.35)] backdrop-blur-sm transition hover:border-white/35 hover:bg-[rgb(18_18_20/0.88)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          aria-label={`Watch ${item.alt} in fullscreen`}
          onClick={() =>
            onRequestFullscreen(item.src, item.alt, {
              portrait: isPortrait,
            })
          }
        >
          <VideoFullscreenIcon />
        </button>
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.06),transparent_35%,rgb(0_0_0/0.2)_100%)]"
          aria-hidden
        />
      </div>
      {item.caption ? (
        <figcaption
          className="text-[0.65rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase"
          style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
        >
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function FeatureImageBlock({
  item,
}: {
  item: Extract<LuxianFeatureMedia, { type: "image" }>
}) {
  return (
    <figure className="overflow-hidden border border-black/8 bg-neutral-50">
      <img
        src={item.src}
        alt={item.alt}
        className="block w-full object-cover object-top"
        loading="lazy"
        decoding="async"
      />
    </figure>
  )
}

function FeatureMediaStack({
  items,
  featureTitle,
  onRequestFullscreen,
}: {
  items: readonly LuxianFeatureMedia[]
  featureTitle: string
  onRequestFullscreen: (
    src: string,
    title: string,
    options?: { portrait?: boolean }
  ) => void
}) {
  if (!items.length) return null

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) =>
        item.type === "video" ? (
          <FeatureVideoBlock
            key={item.src}
            item={item}
            onRequestFullscreen={(src, _title, options) =>
              onRequestFullscreen(src, `${featureTitle}: ${item.alt}`, options)
            }
          />
        ) : (
          <FeatureImageBlock key={item.src} item={item} />
        )
      )}
    </div>
  )
}

function LuxianTechnicalBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full border border-black/18 bg-black/[0.04] px-2.5 py-1 text-[0.58rem] leading-none font-semibold tracking-[0.2em] text-black/58 uppercase sm:text-[0.62rem]",
        className
      )}
      style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
    >
      Technical
    </span>
  )
}

function FeatureSectionBlock({
  section,
  featureTitle,
  onRequestFullscreen,
}: {
  section: LuxianFeatureSection
  featureTitle: string
  onRequestFullscreen: (src: string, title: string) => void
}) {
  return (
    <div className="flex flex-col gap-6 border-t border-black/10 pt-8">
      <p className={PROSE_CLASS} style={featureProseStyle()}>
        {section.body}
      </p>
      {section.media?.length ? (
        <FeatureMediaStack
          items={section.media}
          featureTitle={featureTitle}
          onRequestFullscreen={onRequestFullscreen}
        />
      ) : null}
    </div>
  )
}

function FeaturePanel({
  feature,
  videoLightboxTitleId,
}: {
  feature: LuxianFeature
  videoLightboxTitleId: string
}) {
  const [videoLightbox, setVideoLightbox] = useState<{
    src: string
    title: string
    portrait?: boolean
  } | null>(null)

  const onRequestFullscreen = (
    src: string,
    title: string,
    options?: { portrait?: boolean }
  ) => {
    setVideoLightbox({ src, title, portrait: options?.portrait })
  }

  const introMedia =
    feature.introMedia ??
    (!feature.sections?.length ? feature.media : undefined)

  return (
    <>
      <div className="flex flex-col gap-6 lg:gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p
              className="text-[0.68rem] font-semibold tracking-[0.2em] text-[var(--color-drh-accent-orange)] uppercase"
              style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
            >
              {feature.summary}
            </p>
            {feature.technical ? <LuxianTechnicalBadge /> : null}
          </div>
          <p className={cn("mt-4", PROSE_CLASS)} style={featureProseStyle()}>
            {feature.intro}
          </p>
        </div>

        {introMedia?.length ? (
          <FeatureMediaStack
            items={introMedia}
            featureTitle={feature.title}
            onRequestFullscreen={onRequestFullscreen}
          />
        ) : null}

        {feature.sections?.map((section) => (
          <FeatureSectionBlock
            key={section.body.slice(0, 48)}
            section={section}
            featureTitle={feature.title}
            onRequestFullscreen={onRequestFullscreen}
          />
        ))}
      </div>

      <LuxianFeatureVideoLightbox
        open={videoLightbox !== null}
        onClose={() => setVideoLightbox(null)}
        src={videoLightbox?.src ?? ""}
        title={videoLightbox?.title ?? ""}
        titleId={videoLightboxTitleId}
        portrait={videoLightbox?.portrait}
      />
    </>
  )
}

export function LuxianFeaturesShowcase() {
  const baseId = useId()
  const videoLightboxTitleId = `${baseId}-feature-video-lightbox-title`
  const reduceMotion = useReducedMotion() === true
  const [activeId, setActiveId] = useState(LUXIAN_FEATURES[0]?.id ?? "")
  const active =
    LUXIAN_FEATURES.find((feature) => feature.id === activeId) ??
    LUXIAN_FEATURES[0]

  if (!active) return null

  return (
    <section
      className="luxian-story-block border-t border-[var(--color-drh-ink)]/08 px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <LuxianStoryStep n="03" label="Features" />
          <p
            className="text-[0.68rem] font-medium tracking-[0.22em] text-[var(--color-drh-ink)]/40 uppercase"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            Best of Luxian
          </p>
          <h2
            id={`${baseId}-heading`}
            className="mt-4 text-[clamp(1.65rem,4vw,2.75rem)] leading-[0.92] font-bold tracking-[-0.02em] text-black uppercase"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            What stands out in the product
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-10 lg:mt-14 lg:flex-row lg:gap-0">
          <nav
            className="flex shrink-0 gap-0 overflow-x-auto border-b border-black/10 pb-0 [scrollbar-width:thin] snap-x snap-mandatory lg:w-[min(11.5rem,26%)] lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0 lg:border-black/12 lg:pb-0 lg:pr-6"
            role="tablist"
            aria-orientation="vertical"
            aria-label="Luxian features"
          >
            {LUXIAN_FEATURES.map((feature, index) => {
              const selected = feature.id === active.id
              return (
                <button
                  key={feature.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${feature.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${feature.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(feature.id)}
                  className={cn(
                    "min-w-[min(64vw,14rem)] shrink-0 snap-start border-r border-black/10 py-3 pr-5 text-left transition-colors last:border-r-0 lg:min-w-0 lg:border-r-0 lg:px-0 lg:py-3.5 lg:pr-0",
                    index > 0 && "lg:border-t lg:border-black/10",
                    selected
                      ? "text-black"
                      : "text-black/28 hover:text-black/52"
                  )}
                >
                  <span className="flex flex-col gap-1.5">
                    <span
                      className="block text-[clamp(0.92rem,2vw,1.08rem)] leading-[1.12] font-bold tracking-[0.06em] uppercase"
                      style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
                    >
                      {feature.title}
                    </span>
                    {feature.technical ? (
                      <LuxianTechnicalBadge className="w-fit" />
                    ) : null}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="min-w-0 flex-1 lg:pl-10 xl:pl-14">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                role="tabpanel"
                id={`${baseId}-panel-${active.id}`}
                aria-labelledby={`${baseId}-tab-${active.id}`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 0.08, 0.19, 1] }}
              >
                <FeaturePanel
                  feature={active}
                  videoLightboxTitleId={videoLightboxTitleId}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
