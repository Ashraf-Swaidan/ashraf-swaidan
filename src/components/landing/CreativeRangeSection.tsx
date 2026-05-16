import { useRef, useSyncExternalStore, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type CreativeRangeCategory =
  | "teaching"
  | "photoshop"
  | "premiere"
  | "after-effects"
  | "illustrator"

type CreativeRangeItem = {
  id: string
  category: CreativeRangeCategory
  title: string
  skillLabel: string
  proficiency: string
  assetHint: string
  cropHint: string
  layoutClassName: string
  mobileClassName: string
  visual: "presentation" | "print" | "timeline" | "motion" | "typography"
  tone: "ink" | "orange" | "lime" | "plum" | "paper" | "cyan"
  mediaSrc?: string
  mediaAlt?: string
  zClassName?: string
}

const DISPLAY_FONT = "'Barlow Condensed', sans-serif"
const BODY_FONT = "var(--font-drh-body)"

const CREATIVE_RANGE_ITEMS: CreativeRangeItem[] = [
  {
    id: "teaching-main",
    category: "teaching",
    title: "Teaching / presenting",
    skillLabel: "Excellent presentation",
    proficiency: "Lead proof",
    assetHint: "5-8s speaking loop",
    cropHint: "16:9",
    layoutClassName:
      "md:left-[28%] md:top-[5%] md:w-[42rem] lg:left-[28%] lg:top-[4%] lg:w-[48rem]",
    mobileClassName: "w-full",
    visual: "presentation",
    tone: "ink",
    mediaSrc: "/assets/extra-work-assets/presenting-videos.mp4",
    mediaAlt: "Teaching and presentation video collage",
    zClassName: "z-30",
  },
  {
    id: "photoshop-print-primary",
    category: "photoshop",
    title: "Print banners",
    skillLabel: "Good Photoshop",
    proficiency: "Business print",
    assetHint: "banner / poster image",
    cropHint: "wide strip",
    layoutClassName:
      "md:left-[2%] md:top-[23%] md:w-[23rem] lg:left-[4%] lg:top-[25%] lg:w-[27rem]",
    mobileClassName: "ml-auto w-[92%]",
    visual: "print",
    tone: "orange",
    zClassName: "z-20",
  },
  {
    id: "premiere-edit",
    category: "premiere",
    title: "Video editing",
    skillLabel: "Solid Premiere Pro",
    proficiency: "Cut / pace / rhythm",
    assetHint: "5s edit loop",
    cropHint: "16:9",
    layoutClassName:
      "md:right-[3%] md:top-[42%] md:w-[25rem] lg:right-[4%] lg:top-[43%] lg:w-[30rem]",
    mobileClassName: "w-[96%]",
    visual: "timeline",
    tone: "cyan",
    mediaSrc: "/assets/extra-work-assets/premiere-video.mp4",
    mediaAlt: "Premiere Pro editing timeline video",
    zClassName: "z-40",
  },
  {
    id: "after-effects-loop",
    category: "after-effects",
    title: "Motion tests",
    skillLabel: "Basic After Effects",
    proficiency: "Short loops",
    assetHint: "5s motion clip",
    cropHint: "square / 4:5",
    layoutClassName:
      "md:left-[17%] md:top-[58%] md:w-[19rem] lg:left-[18%] lg:top-[59%] lg:w-[22rem]",
    mobileClassName: "ml-5 w-[78%]",
    visual: "motion",
    tone: "plum",
    mediaSrc: "/assets/extra-work-assets/ae-videos.mp4",
    mediaAlt: "After Effects motion work video collage",
    zClassName: "z-20",
  },
  {
    id: "photoshop-print-secondary",
    category: "photoshop",
    title: "Campaign layouts",
    skillLabel: "Good Photoshop",
    proficiency: "Retail visuals",
    assetHint: "print design still",
    cropHint: "4:5",
    layoutClassName:
      "md:right-[21%] md:top-[63%] md:w-[21rem] lg:right-[23%] lg:top-[64%] lg:w-[24rem]",
    mobileClassName: "ml-auto w-[82%]",
    visual: "print",
    tone: "paper",
    zClassName: "z-10",
  },
  {
    id: "illustrator-type",
    category: "illustrator",
    title: "Type merges",
    skillLabel: "Good+ Illustrator",
    proficiency: "Typography accents",
    assetHint: "type composition",
    cropHint: "compact still",
    layoutClassName:
      "md:right-[3%] md:top-[9%] md:w-[17rem] lg:right-[5%] lg:top-[10%] lg:w-[20rem]",
    mobileClassName: "w-[74%]",
    visual: "typography",
    tone: "lime",
    zClassName: "z-10",
  },
]

const IT_SKILLS = [
  "IT fundamentals",
  "Workshop software",
  "Production workflows",
  "Machine-adjacent tools",
  "Print prep",
]

const SOFTWARE_LOGO_SLOTS = [
  {
    id: "photoshop",
    label: "Ps",
    name: "Photoshop",
    src: "/assets/extra-work-assets/photoshop-logo.png",
  },
  {
    id: "premiere",
    label: "Pr",
    name: "Premiere Pro",
    src: "/assets/extra-work-assets/premiere-logo.png",
  },
  {
    id: "after-effects",
    label: "Ae",
    name: "After Effects",
    src: "/assets/extra-work-assets/after-effects-logo.png",
  },
  {
    id: "illustrator",
    label: "Ai",
    name: "Illustrator",
    src: "/assets/extra-work-assets/illustrator-logo.png",
  },
  { id: "it", label: "IT", name: "IT tools" },
]

function subscribeToMobileCreativeRange(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)")
  media.addEventListener("change", callback)

  return () => {
    media.removeEventListener("change", callback)
  }
}

function getMobileCreativeRangeSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches
}

function getServerMobileCreativeRangeSnapshot() {
  return false
}

function useIsMobileCreativeRange() {
  return useSyncExternalStore(
    subscribeToMobileCreativeRange,
    getMobileCreativeRangeSnapshot,
    getServerMobileCreativeRangeSnapshot
  )
}

function skillLogoForCategory(category: CreativeRangeCategory) {
  return SOFTWARE_LOGO_SLOTS.find((slot) => slot.id === category)?.src
}

function PlaceholderMeta({ item }: { item: CreativeRangeItem }) {
  const logoSrc = skillLogoForCategory(item.category)

  return (
    <div className="relative z-10 flex min-h-0 flex-col justify-between gap-4 p-4 sm:p-5">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt=""
          className="absolute right-4 bottom-4 h-8 w-8 object-contain opacity-90 drop-shadow-[0_10px_18px_rgb(0_0_0/0.22)] sm:h-10 sm:w-10"
          loading="lazy"
          decoding="async"
          aria-hidden
        />
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[0.56rem] font-semibold tracking-[0.18em] text-current/68 uppercase drop-shadow-[0_2px_9px_rgb(0_0_0/0.22)] sm:text-[0.6rem]"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item.skillLabel}
          </p>
          <h3
            className="mt-1.5 max-w-[11ch] text-[clamp(1.55rem,3.6vw,2.55rem)] leading-[0.88] font-semibold tracking-[-0.015em] uppercase drop-shadow-[0_8px_20px_rgb(0_0_0/0.24)]"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item.title}
          </h3>
        </div>
        <span
          className="shrink-0 rounded-full border border-current/18 bg-black/10 px-2.5 py-1 text-[0.54rem] font-semibold tracking-[0.12em] text-current/72 uppercase shadow-[0_8px_18px_rgb(0_0_0/0.08)] backdrop-blur-[2px] sm:text-[0.58rem]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {item.proficiency}
        </span>
      </div>

      <div
        className="grid max-w-[72%] grid-cols-[auto_1fr] gap-x-2.5 gap-y-1 text-[0.68rem] leading-tight text-current/68 drop-shadow-[0_2px_8px_rgb(0_0_0/0.18)] sm:text-[0.72rem]"
        style={{ fontFamily: BODY_FONT }}
      >
        <span className="font-semibold text-current/36">Asset</span>
        <span>{item.assetHint}</span>
        <span className="font-semibold text-current/36">Crop</span>
        <span>{item.cropHint}</span>
      </div>
    </div>
  )
}

function PresentationPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(18_18_18),rgb(42_42_42)_48%,rgb(12_12_12))]" />
      <div className="absolute inset-x-[8%] top-[10%] h-[18%] rounded-[0.35rem] bg-white/10" />
      <div className="absolute right-[8%] bottom-[10%] h-[54%] w-[28%] rounded-t-full bg-white/16 shadow-[0_0_0_1px_rgb(255_255_255/0.12)]" />
      <div className="absolute right-[14%] bottom-[48%] h-[14%] w-[14%] rounded-full bg-white/20" />
      <div className="absolute left-[9%] bottom-[12%] grid w-[43%] gap-2">
        <span className="h-2 rounded-full bg-white/28" />
        <span className="h-2 w-[76%] rounded-full bg-white/18" />
        <span className="h-2 w-[58%] rounded-full bg-[var(--color-drh-accent-orange)]/70" />
      </div>
      <div className="absolute top-[24%] left-[11%] grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className="size-3 rounded-full bg-white/20"
            style={{ opacity: 0.16 + (index % 3) * 0.12 }}
          />
        ))}
      </div>
    </div>
  )
}

function PrintPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_250),rgb(240_235_225))]" />
      <div className="absolute -top-[8%] -right-[10%] h-[52%] w-[55%] rotate-12 bg-[var(--color-drh-accent-orange)]/70" />
      <div className="absolute bottom-[11%] left-[8%] h-[30%] w-[50%] bg-[var(--color-drh-ink)]" />
      <div className="absolute top-[15%] left-[8%] grid w-[62%] gap-2">
        <span className="h-8 w-[72%] bg-[var(--color-drh-ink)]" />
        <span className="h-8 w-[48%] bg-[var(--color-drh-ink)]/82" />
        <span className="mt-1 h-2 w-[90%] rounded-full bg-[var(--color-drh-ink)]/18" />
        <span className="h-2 w-[66%] rounded-full bg-[var(--color-drh-ink)]/14" />
      </div>
      <div className="absolute right-[12%] bottom-[18%] h-14 w-14 rounded-full border-[10px] border-[var(--color-drh-accent-lime)]/80" />
    </div>
  )
}

function TimelinePlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[rgb(18_20_24)]">
      <div className="absolute inset-x-[7%] top-[10%] aspect-video rounded-[0.45rem] bg-[linear-gradient(135deg,rgb(42_84_96),rgb(10_10_10))] shadow-[0_0_0_1px_rgb(255_255_255/0.1)]" />
      <div className="absolute inset-x-[7%] bottom-[12%] grid gap-1.5">
        {[
          "bg-cyan-300/75 w-[88%]",
          "bg-white/20 w-[78%]",
          "bg-[var(--color-drh-accent-orange)]/75 w-[58%]",
          "bg-white/14 w-[92%]",
        ].map((className, index) => (
          <span
            key={index}
            className={cn("block h-4 rounded-sm", className)}
            style={{ marginLeft: `${index * 5}%` }}
          />
        ))}
      </div>
      <div className="absolute top-[10%] bottom-[11%] left-[43%] w-px bg-white/70 shadow-[0_0_18px_rgb(255_255_255/0.38)]" />
    </div>
  )
}

function MotionPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[rgb(25_18_34)]">
      <div className="absolute top-[17%] left-[19%] h-[45%] w-[45%] rounded-full border border-white/20 bg-[radial-gradient(circle,rgb(167_139_250/0.9),transparent_64%)]" />
      <div className="absolute right-[14%] bottom-[16%] h-[42%] w-[18%] rotate-12 rounded-full bg-[var(--color-drh-accent-orange)]/80 blur-[0.3px]" />
      <div className="absolute top-[22%] right-[19%] h-10 w-10 rotate-45 border border-white/34" />
      <div className="absolute bottom-[20%] left-[15%] flex gap-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            className="block w-2 rounded-full bg-white/35"
            style={{ height: `${18 + index * 7}px` }}
          />
        ))}
      </div>
    </div>
  )
}

function TypographyPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[rgb(245_248_238)]">
      <div
        className="absolute top-[12%] left-[8%] text-[5.8rem] leading-[0.72] font-semibold tracking-[-0.05em] text-[var(--color-drh-ink)]/90 uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Aa
      </div>
      <div
        className="absolute right-[8%] bottom-[12%] text-right text-[3.2rem] leading-[0.78] font-light text-[var(--color-drh-accent-lime)] uppercase italic"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Type
        <br />
        Merge
      </div>
      <div className="absolute top-[48%] left-[11%] h-px w-[78%] bg-[var(--color-drh-ink)]/28" />
      <div className="absolute top-[53%] left-[11%] h-px w-[54%] bg-[var(--color-drh-ink)]/18" />
    </div>
  )
}

function PlaceholderVisual({ visual }: { visual: CreativeRangeItem["visual"] }) {
  const visuals: Record<CreativeRangeItem["visual"], ReactNode> = {
    presentation: <PresentationPlaceholder />,
    print: <PrintPlaceholder />,
    timeline: <TimelinePlaceholder />,
    motion: <MotionPlaceholder />,
    typography: <TypographyPlaceholder />,
  }

  return <>{visuals[visual]}</>
}

function CreativeRangeVideo({ item }: { item: CreativeRangeItem }) {
  if (!item.mediaSrc) return null

  return (
    <video
      className={cn(
        "absolute inset-0 h-full w-full object-cover",
        item.category === "after-effects" && "scale-[1.08]"
      )}
      src={item.mediaSrc}
      aria-label={item.mediaAlt}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  )
}

function toneClassName(tone: CreativeRangeItem["tone"]) {
  switch (tone) {
    case "ink":
      return "bg-[var(--color-drh-ink)] text-white"
    case "orange":
      return "bg-[#fff7ed] text-[var(--color-drh-ink)]"
    case "lime":
      return "bg-[#f5f9ea] text-[var(--color-drh-ink)]"
    case "plum":
      return "bg-[#f5f0ff] text-white"
    case "paper":
      return "bg-[#fbfaf5] text-[var(--color-drh-ink)]"
    case "cyan":
      return "bg-[#eefcff] text-white"
  }
}

function CreativeRangeTile({
  item,
  desktop = false,
}: {
  item: CreativeRangeItem
  desktop?: boolean
}) {
  const aspectClass =
    item.visual === "timeline"
      ? "aspect-video"
      : item.visual === "presentation"
        ? "aspect-video"
        : item.visual === "motion"
          ? "aspect-[4/5]"
          : item.visual === "typography"
            ? "aspect-[5/6]"
            : "aspect-[4/5]"

  return (
    <article
      className={cn(
        "creative-range-tile group relative overflow-hidden border border-[var(--color-drh-ink)]/10 shadow-[0_26px_70px_rgb(10_10_10/0.13)]",
        "rounded-[0.55rem] will-change-transform",
        toneClassName(item.tone),
        aspectClass,
        item.zClassName,
        desktop
          ? cn("absolute", item.layoutClassName)
          : cn("relative", item.mobileClassName)
      )}
    >
      {item.mediaSrc ? (
        <CreativeRangeVideo item={item} />
      ) : (
        <PlaceholderVisual visual={item.visual} />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.22),rgb(0_0_0/0.06)_24%,transparent_54%,rgb(0_0_0/0.28))]" />
      <PlaceholderMeta item={item} />
    </article>
  )
}

function CreativeRangeMobile() {
  return (
    <div className="mt-10 flex flex-col gap-5 md:hidden">
      {CREATIVE_RANGE_ITEMS.map((item) => (
        <CreativeRangeTile key={item.id} item={item} />
      ))}
    </div>
  )
}

function CreativeRangeDesktop() {
  return (
    <div className="relative mt-12 hidden min-h-[58rem] md:block lg:min-h-[64rem] xl:min-h-[68rem]">
      {CREATIVE_RANGE_ITEMS.map((item) => (
        <CreativeRangeTile
          key={item.id}
          item={item}
          desktop
        />
      ))}
    </div>
  )
}

export function CreativeRangeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)
  const isMobile = useIsMobileCreativeRange()

  useGSAP(
    () => {
      if (reduceMotion) return

      const section = sectionRef.current
      if (!section) return

      const header = section.querySelector(".creative-range-header")
      const tiles = gsap.utils.toArray<HTMLElement>(".creative-range-tile")
      const tagStrip = section.querySelector(".creative-range-tags")

      const ctx = gsap.context(() => {
        gsap.from(header, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            once: true,
          },
        })

        gsap.from(tiles, {
          autoAlpha: 0,
          y: 34,
          rotate: 0,
          scale: 0.96,
          duration: 0.82,
          ease: "power3.out",
          stagger: { amount: 0.42, from: "center" },
          scrollTrigger: {
            trigger: section,
            start: "top 62%",
            once: true,
          },
        })

        tiles.forEach((tile, index) => {
          gsap.to(tile, {
            y: index % 2 === 0 ? -18 : 18,
            x: index % 3 === 0 ? 10 : -8,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          })
        })

        if (tagStrip) {
          gsap.from(tagStrip, {
            autoAlpha: 0,
            y: 18,
            duration: 0.62,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tagStrip,
              start: "top 84%",
              once: true,
            },
          })
        }
      }, section)

      return () => ctx.revert()
    },
    { scope: sectionRef, dependencies: [reduceMotion], revertOnUpdate: true }
  )

  return (
    <section
      id="creative-range"
      ref={sectionRef}
      className={cn(
        "relative isolate overflow-hidden bg-[var(--color-drh-bg)] px-4 py-20 text-[var(--color-drh-ink)] sm:px-6 sm:py-24 lg:px-10",
        "selection:bg-[var(--color-drh-accent-orange)]/18 selection:text-[var(--color-drh-ink)]"
      )}
      aria-labelledby="creative-range-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.72]"
        aria-hidden
        style={{
          background: [
            "linear-gradient(90deg, rgb(10 10 10 / 0.04) 1px, transparent 1px)",
            "linear-gradient(180deg, rgb(10 10 10 / 0.035) 1px, transparent 1px)",
            "radial-gradient(circle at 12% 18%, rgb(255 122 0 / 0.12), transparent 28%)",
            "radial-gradient(circle at 82% 58%, rgb(132 204 22 / 0.1), transparent 26%)",
          ].join(", "),
          backgroundSize: "56px 56px, 56px 56px, auto, auto",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-drh-ink)]/10"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[92rem]">
        <div className="creative-range-header mx-auto max-w-6xl text-center">
          <div>
            <p
              className="text-[0.68rem] font-semibold tracking-[0.36em] text-[var(--color-drh-ink)]/36 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Creative range
            </p>
            <h2
              id="creative-range-heading"
              className="mx-auto mt-4 max-w-[12ch] text-balance text-[clamp(2.65rem,8vw,5.35rem)] leading-[0.9] font-semibold tracking-[-0.025em] text-[var(--color-drh-ink)] uppercase lg:max-w-[18ch]"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              More Work Around The Work
            </h2>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[var(--color-drh-ink)]">
            <span
              className="mr-1 text-[clamp(1.02rem,1.8vw,1.28rem)] leading-none text-[var(--color-drh-ink)]/62"
              style={{
                fontFamily: BODY_FONT,
                fontVariationSettings: '"opsz" 64, "wght" 420',
              }}
            >
              I worked with
            </span>
            {SOFTWARE_LOGO_SLOTS.map((slot) => (
              <span
                key={slot.id}
                className="inline-flex h-12 min-w-12 items-center justify-center text-[0.88rem] font-semibold tracking-[0.02em] text-[var(--color-drh-ink)]/72"
                style={{ fontFamily: DISPLAY_FONT }}
                aria-label={slot.src ? slot.name : `${slot.name} logo placeholder`}
                title={slot.src ? slot.name : `${slot.name} logo placeholder`}
              >
                {slot.src ? (
                  <img
                    src={slot.src}
                    alt=""
                    className="h-10 w-10 object-contain drop-shadow-[0_10px_18px_rgb(10_10_10/0.12)]"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                ) : (
                  slot.label
                )}
              </span>
            ))}
          </div>
        </div>

        {isMobile ? <CreativeRangeMobile /> : <CreativeRangeDesktop />}

        <div className="creative-range-tags mt-10 flex flex-wrap items-center gap-2 border-t border-[var(--color-drh-ink)]/10 pt-6 md:mt-0 md:max-w-[52rem]">
          <span
            className="mr-2 text-[0.68rem] font-semibold tracking-[0.22em] text-[var(--color-drh-ink)]/38 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            IT / production fluency
          </span>
          {IT_SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[var(--color-drh-ink)]/12 bg-white/75 px-3.5 py-2 text-[0.78rem] leading-none text-[var(--color-drh-ink)]/66 shadow-[0_8px_24px_rgb(10_10_10/0.045)] backdrop-blur-sm"
              style={{
                fontFamily: BODY_FONT,
                fontVariationSettings: '"opsz" 64, "wght" 450',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CreativeRangeSection
