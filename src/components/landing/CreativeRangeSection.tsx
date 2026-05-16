import { useId, useRef, useEffect, type RefObject } from "react"
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

type AccentKey = "orange" | "cyan" | "plum" | "lime" | "paper"

type HeroItem = {
  id: string
  category: CreativeRangeCategory
  title: string
  headIndex: string
  mediaSrc: string
  mediaAlt: string
  /** Tailwind aspect class for the hero video frame */
  aspectClassName: string
}

type ReelItem = {
  id: string
  category: CreativeRangeCategory
  title: string
  index: string
  accent: AccentKey
  /** Media viewport aspect — premiere 16:9, AE 4:5, stills as prepared */
  mediaAspectClassName: string
  mediaSrc?: string
  mediaAlt?: string
  /** Wide layout: horizontally equals two unit cards + track gap */
  cardSpan?: 1 | 2
}

const DISPLAY_FONT = "'Barlow Condensed', sans-serif"

/** Flex gap `gap-4` (1rem) — wide card width = 28rem + 28rem + 1rem */
const REEL_CARD_W_SINGLE = "w-[min(28rem,calc(100vw-2.5rem))]"
const REEL_CARD_W_DOUBLE = "w-[min(57rem,calc(100vw-2.5rem))]"

const HERO_ITEM: HeroItem = {
  id: "teaching-main",
  category: "teaching",
  title: "Teaching / presenting",
  headIndex: "01 / 06",
  mediaSrc: "/assets/extra-work-assets/presenting-videos.mp4",
  mediaAlt: "Teaching and presentation video collage",
  aspectClassName: "aspect-video",
}

const REEL_ITEMS: ReelItem[] = [
  {
    id: "premiere-edit",
    category: "premiere",
    title: "Video editing",
    index: "02 / 06",
    accent: "cyan",
    mediaAspectClassName: "aspect-video",
    mediaSrc: "/assets/extra-work-assets/premiere-video.mp4",
    mediaAlt: "Premiere Pro editing timeline video",
    cardSpan: 2,
  },
  {
    id: "after-effects-loop",
    category: "after-effects",
    title: "Motion tests",
    index: "03 / 06",
    accent: "plum",
    mediaAspectClassName: "aspect-[4/5]",
    mediaSrc: "/assets/extra-work-assets/ae-videos.mp4",
    mediaAlt: "After Effects motion work video collage",
  },
  {
    id: "photoshop-print-primary",
    category: "photoshop",
    title: "Print banners",
    index: "04 / 06",
    accent: "orange",
    mediaAspectClassName: "aspect-[2/1]",
    cardSpan: 2,
  },
  {
    id: "illustrator-type",
    category: "illustrator",
    title: "Type merges",
    index: "05 / 06",
    accent: "lime",
    mediaAspectClassName: "aspect-[4/5]",
  },
  {
    id: "photoshop-print-secondary",
    category: "photoshop",
    title: "Campaign layouts",
    index: "06 / 06",
    accent: "orange",
    mediaAspectClassName: "aspect-[4/5]",
  },
]

const RIBBON_LOGOS = [
  {
    id: "photoshop",
    name: "Photoshop",
    src: "/assets/extra-work-assets/photoshop-logo.png",
  },
  {
    id: "premiere",
    name: "Premiere Pro",
    src: "/assets/extra-work-assets/premiere-logo.png",
  },
  {
    id: "after-effects",
    name: "After Effects",
    src: "/assets/extra-work-assets/after-effects-logo.png",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    src: "/assets/extra-work-assets/illustrator-logo.png",
  },
] as const

const SOFTWARE_LOGO_SLOTS = RIBBON_LOGOS

function accentTopClass(accent: AccentKey) {
  switch (accent) {
    case "orange":
      return "border-t-[var(--color-drh-accent-orange)]"
    case "cyan":
      return "border-t-[rgb(6_182_212)]"
    case "plum":
      return "border-t-[var(--color-drh-accent-plum)]"
    case "lime":
      return "border-t-[var(--color-drh-accent-lime)]"
    case "paper":
      return "border-t-black/28"
    default:
      return ""
  }
}

function slotForCategory(category: CreativeRangeCategory) {
  return SOFTWARE_LOGO_SLOTS.find((s) => s.id === category)
}

function PressSheetNoise({ filterId }: { filterId: string }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id={filterId} x="0" y="0">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  )
}

function PressSheetCard({ category }: { category: Extract<CreativeRangeCategory, "photoshop" | "illustrator"> }) {
  const rawId = useId()
  const noiseFilterId = `cr-noise-${rawId.replace(/:/g, "")}`
  const logo = RIBBON_LOGOS.find((s) => s.id === category)

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--color-drh-surface)] px-6">
      <PressSheetNoise filterId={noiseFilterId} />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: [
            "linear-gradient(rgb(10 10 10 / 0.06) 1px, transparent 1px)",
            "linear-gradient(90deg, rgb(10 10 10 / 0.06) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "14px 14px, 14px 14px",
        }}
      />

      {/* Crop marks */}
      <div className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[var(--color-drh-ink)]/35" />
      <div className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[var(--color-drh-ink)]/35" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[var(--color-drh-ink)]/35" />
      <div className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 border-b-2 border-r-2 border-[var(--color-drh-ink)]/35" />

      <div
        className="absolute inset-0 flex items-center justify-center p-6"
      >
        {logo ? (
          <img
            src={logo.src}
            alt=""
            className="h-[min(11rem,40vw)] w-auto max-w-[85%] object-contain opacity-[0.88]"
            draggable={false}
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        ) : null}
      </div>

    </div>
  )
}

/** Mouse / pen: click-drag to scroll horizontally. Touch: native pan (no duplicate work). */
function usePointerDragScrollX(scrollRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const DRAG_THRESHOLD_PX = 8
    const MOMENTUM_FRICTION = 0.92
    const MIN_MOMENTUM_VELOCITY = 0.18
    let momentumFrame = 0
    let restoreSnapTimeout = 0

    const getMaxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth)
    const clampScroll = (value: number) =>
      Math.max(0, Math.min(getMaxScroll(), value))

    const stopMomentum = () => {
      if (momentumFrame) {
        window.cancelAnimationFrame(momentumFrame)
        momentumFrame = 0
      }
      if (restoreSnapTimeout) {
        window.clearTimeout(restoreSnapTimeout)
        restoreSnapTimeout = 0
      }
    }

    const restoreSnapSoon = () => {
      restoreSnapTimeout = window.setTimeout(() => {
        el.style.scrollSnapType = ""
        restoreSnapTimeout = 0
      }, 120)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      if (e.pointerType === "mouse" && e.button !== 0) return

      stopMomentum()

      const pid = e.pointerId
      const startX = e.clientX
      const startScroll = el.scrollLeft
      let dragging = false
      let lastX = e.clientX
      let lastTime = performance.now()
      let velocity = 0

      try {
        el.setPointerCapture(pid)
      } catch {
        return
      }

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return
        const dx = startX - ev.clientX
        if (!dragging) {
          if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
          dragging = true
          el.style.scrollSnapType = "none"
          el.classList.add("select-none", "cursor-grabbing")
        }

        const now = performance.now()
        const dt = Math.max(16, now - lastTime)
        const pointerDelta = lastX - ev.clientX
        velocity = pointerDelta / dt
        lastX = ev.clientX
        lastTime = now

        el.scrollLeft = clampScroll(startScroll + dx)
        ev.preventDefault()
      }

      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerup", onUp)
        el.removeEventListener("pointercancel", onUp)
        try {
          el.releasePointerCapture(pid)
        } catch {
          /* already released */
        }
        el.classList.remove("select-none", "cursor-grabbing")

        if (!dragging) return

        ev.preventDefault()

        let momentumVelocity = velocity * 16
        const glide = () => {
          momentumVelocity *= MOMENTUM_FRICTION
          const nextScroll = clampScroll(el.scrollLeft + momentumVelocity)

          el.scrollLeft = nextScroll

          const hitEdge = nextScroll <= 0 || nextScroll >= getMaxScroll()
          if (
            hitEdge ||
            Math.abs(momentumVelocity) < MIN_MOMENTUM_VELOCITY
          ) {
            momentumFrame = 0
            restoreSnapSoon()
            return
          }

          momentumFrame = window.requestAnimationFrame(glide)
        }

        if (Math.abs(momentumVelocity) >= MIN_MOMENTUM_VELOCITY) {
          momentumFrame = window.requestAnimationFrame(glide)
        } else {
          restoreSnapSoon()
        }
      }

      el.addEventListener("pointermove", onMove, { passive: false })
      el.addEventListener("pointerup", onUp)
      el.addEventListener("pointercancel", onUp)
    }

    el.addEventListener("pointerdown", onPointerDown)

    return () => {
      stopMomentum()
      el.removeEventListener("pointerdown", onPointerDown)
    }
  }, [scrollRef])
}

function CreativeRangeVideo({
  src,
  alt,
  className,
  aeScale,
}: {
  src: string
  alt: string
  className?: string
  aeScale?: boolean
}) {
  return (
    <video
      className={cn("absolute inset-0 h-full w-full object-cover", aeScale && "scale-[1.08]", className)}
      src={src}
      aria-label={alt}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  )
}

function SoftwareRibbon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "creative-range-ribbon flex flex-wrap items-center justify-end gap-x-3 gap-y-2 border-0 p-0 md:max-w-[min(42rem,48%)] lg:shrink-0",
        className
      )}
    >
      {RIBBON_LOGOS.map((slot) => (
        <img
          key={slot.id}
          src={slot.src}
          alt={slot.name}
          className="h-12 w-auto max-w-[9rem] object-contain opacity-95 sm:h-14 md:h-16"
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  )
}

function HeroBand({
  heroRef,
  heroMediaRef,
}: {
  heroRef: React.RefObject<HTMLDivElement | null>
  heroMediaRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={heroRef}
      className="creative-range-hero mt-8 md:mt-10"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,62%)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div
          ref={heroMediaRef}
          className={cn(
            "relative overflow-hidden rounded-[2px] border border-[var(--color-drh-ink)]/12 bg-[var(--color-drh-ink)] shadow-[0_28px_80px_rgb(10_10_10/0.1)]",
            HERO_ITEM.aspectClassName
          )}
        >
          <CreativeRangeVideo
            src={HERO_ITEM.mediaSrc}
            alt={HERO_ITEM.mediaAlt}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.18),transparent_42%,rgb(0_0_0/0.12))]" />
        </div>

        <div className="flex flex-col gap-3 lg:max-w-md lg:pl-2 lg:pt-1">
          <div className="creative-range-hero-copy">
            <p
              className="text-[0.68rem] font-semibold tracking-[0.32em] text-[var(--color-drh-ink)]/38 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {HERO_ITEM.headIndex}
            </p>
            <h3
              className="mt-2 text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-[var(--color-drh-ink)] uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {HERO_ITEM.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReelCard({
  item,
  className,
}: {
  item: ReelItem
  className?: string
}) {
  const slot = slotForCategory(item.category)
  const showPress =
    !item.mediaSrc &&
    (item.category === "photoshop" || item.category === "illustrator")

  return (
    <article
      className={cn(
        "reel-card creative-range-reel-card relative flex h-fit shrink-0 snap-center flex-col overflow-hidden rounded-[2px] border border-[var(--color-drh-ink)]/12 bg-[var(--color-drh-surface)] shadow-[0_22px_64px_rgb(10_10_10/0.08)]",
        (item.cardSpan ?? 1) === 2 ? REEL_CARD_W_DOUBLE : REEL_CARD_W_SINGLE,
        "border-t-2",
        accentTopClass(item.accent),
        className
      )}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden bg-[var(--color-drh-ink)]",
          item.mediaAspectClassName
        )}
      >
        {item.mediaSrc ? (
          <CreativeRangeVideo
            src={item.mediaSrc}
            alt={item.mediaAlt ?? ""}
            aeScale={item.category === "after-effects"}
          />
        ) : showPress ? (
          <PressSheetCard
            category={
              item.category === "illustrator" ? "illustrator" : "photoshop"
            }
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.2),transparent_38%,rgb(0_0_0/0.12))]" />
      </div>

      <div className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-t border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-bg)] px-4 py-3.5">
        <div className="min-w-0 flex-1 pr-2">
          <p
            className="text-[0.62rem] font-semibold tracking-[0.14em] text-[var(--color-drh-ink)]/32 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item.index}
          </p>
          <h4
            className="mt-1 text-[1.15rem] leading-[1.1] font-semibold tracking-[-0.015em] text-[var(--color-drh-ink)] uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item.title}
          </h4>
        </div>
        {slot ? (
          <img
            src={slot.src}
            alt=""
            className="h-11 w-auto max-w-[8.5rem] shrink-0 object-contain opacity-95 sm:h-12 md:h-14"
            draggable={false}
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        ) : null}
      </div>
    </article>
  )
}

function ReelTrack() {
  const reelScrollRef = useRef<HTMLDivElement>(null)
  usePointerDragScrollX(reelScrollRef)

  return (
    <div className="mt-10 md:mt-12">
      <div className="relative isolate max-w-full">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-[var(--color-drh-bg)] to-transparent sm:w-12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-[var(--color-drh-bg)] to-transparent sm:w-12"
          aria-hidden
        />
        <div
          ref={reelScrollRef}
          className={cn(
            "creative-range-reel-scroll cursor-grab max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 pb-3",
            "snap-x snap-proximity touch-pan-x [-ms-overflow-style:none]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-ink)]/10 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-drh-bg)]",
            "[scrollbar-width:thin]",
            "[scrollbar-color:rgb(10_10_10/0.12)_transparent]"
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
          tabIndex={0}
          role="region"
          aria-label="Work samples — drag or scroll sideways to see more"
        >
          <div className="flex w-max items-end gap-4 pr-1">
            {REEL_ITEMS.map((item) => (
              <ReelCard key={item.id} item={item} />
            ))}
            <div className="w-px shrink-0" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreativeRangeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroMediaRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const header = section.querySelector(".creative-range-header")
      const ribbon = section.querySelector(".creative-range-ribbon")
      const hero = heroRef.current
      const heroMedia = heroMediaRef.current

      const ctx = gsap.context(() => {
        if (header) {
          gsap.from(header, {
            autoAlpha: 0,
            y: 24,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 74%",
              once: true,
            },
          })
        }

        if (ribbon) {
          gsap.from(ribbon, {
            autoAlpha: 0,
            y: 20,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 68%",
              once: true,
            },
          })
        }

        if (!reduceMotion && heroMedia) {
          gsap.fromTo(
            heroMedia,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: hero ?? section,
                start: "top 72%",
                once: true,
              },
            }
          )

          if (hero) {
            gsap.from(hero.querySelectorAll(".creative-range-hero-copy"), {
              autoAlpha: 0,
              y: 14,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: hero,
                start: "top 70%",
                once: true,
              },
            })
          }
        }

      }, section)

      return () => ctx.revert()
    },
    {
      scope: sectionRef,
      dependencies: [reduceMotion],
      revertOnUpdate: true,
    }
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
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-drh-ink)]/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-[clamp(1rem,6vw,5rem)] w-px bg-[var(--color-drh-ink)]/8"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[92rem] pl-[clamp(0.25rem,3vw,2.5rem)]">
        <div className="mb-8 flex flex-col gap-5 sm:gap-6 md:mb-10 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-12">
          <div className="creative-range-header min-w-0 max-w-6xl shrink-0 text-left md:max-w-[min(32rem,58%)]">
            <p
              className="text-[0.68rem] font-semibold tracking-[0.36em] text-[var(--color-drh-ink)]/36 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Creative range
            </p>
            <h2
              id="creative-range-heading"
              className="mt-2 max-w-[20ch] text-balance text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.02em] text-[var(--color-drh-ink)] uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              More Work Around The Work
            </h2>
          </div>
          <SoftwareRibbon />
        </div>

        <HeroBand
          heroRef={heroRef}
          heroMediaRef={heroMediaRef}
        />

        <ReelTrack />

      </div>
    </section>
  )
}

export default CreativeRangeSection
