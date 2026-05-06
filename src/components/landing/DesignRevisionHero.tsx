import { useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AshFixesThings } from "./AshFixes/AshFixesThings"
import { DecorativeSticker } from "./stickers/DecorativeSticker"
import { HOMEPAGE_STICKERS } from "@/data/homepageStickers"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

const SHAPE_STORY = "Drawn, then built. The line from intent to object."

function syncCursorToWrap(
  track: HTMLElement | null,
  wrap: HTMLElement | null,
  cursor: HTMLElement | null,
) {
  if (!track || !wrap || !cursor) return
  const wr = wrap.getBoundingClientRect()
  const tr = track.getBoundingClientRect()
  gsap.set(cursor, {
    left: wr.right - tr.left - 1,
    top: wr.top - tr.top,
    height: wr.height,
    autoAlpha: 1,
  })
}

export function DesignRevisionHero() {
  const rootRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const headlineTrackRef = useRef<HTMLDivElement>(null)
  const designWrapRef = useRef<HTMLSpanElement>(null)
  const buildWrapRef = useRef<HTMLSpanElement>(null)
  const highlightDesignRef = useRef<HTMLSpanElement>(null)
  const highlightBuildRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const shapeStoryRef = useRef<HTMLParagraphElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const heroStickerPrimaryRef = useRef<HTMLDivElement>(null)
  const heroStickerSecondaryRef = useRef<HTMLDivElement>(null)
  const highlightPhaseRef = useRef<"design" | "build">("design")
  const ashBgRef = useRef<HTMLDivElement>(null)
  const introCompleteRef = useRef(false)

  // Refs for new animated background elements
  const floatingShapesRef = useRef<HTMLDivElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)

  // Particle system background
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      life: number
      maxLife: number
    }> = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.2 + Math.random() * 0.3
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed - 0.5,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3,
        life: 0,
        maxLife: 200 + Math.random() * 300,
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles = particles.filter(p => p.life < p.maxLife)

      while (particles.length < 50) {
        particles.push(createParticle())
      }

      particles.forEach(p => {
        p.life++
        p.x += p.vx
        p.y += p.vy

        const lifeProgress = p.life / p.maxLife
        const currentOpacity = p.opacity * (1 - lifeProgress)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `var(--color-drh-ink)`
        ctx.globalAlpha = currentOpacity * 0.15
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      let highlightLoop: gsap.core.Timeline | null = null

      const applyReduced = () => {
        gsap.set(eyebrowRef.current, { autoAlpha: 1 })
        gsap.set(h1Ref.current, { autoAlpha: 1, y: 0 })
        gsap.set(taglineRef.current, { autoAlpha: 1 })
        gsap.set(shapeStoryRef.current, { autoAlpha: 1, y: 0 })
        gsap.set(scrollCueRef.current, { autoAlpha: 0.12 })
        gsap.set(heroStickerPrimaryRef.current, { autoAlpha: 1, y: 0, rotation: -7 })
        gsap.set(heroStickerSecondaryRef.current, { autoAlpha: 1, y: 0, rotation: 8 })
        gsap.set(highlightDesignRef.current, { scaleX: 1, opacity: 0.5 })
        gsap.set(highlightBuildRef.current, { opacity: 0.5 })
        gsap.set(ashBgRef.current, { autoAlpha: 0.15 })
        syncCursorToWrap(headlineTrackRef.current, buildWrapRef.current, cursorRef.current)
      }

      if (reduceMotion) {
        applyReduced()
        return
      }

      // ═══════════════════════════════════════════════════════════════
      // INTRO ANIMATION SEQUENCE
      // ═══════════════════════════════════════════════════════════════

      // Phase 0: Set initial states for intro
      gsap.set(ashBgRef.current, { autoAlpha: 1 })        // AshFixesThings fully visible
      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 16 })
      gsap.set(h1Ref.current, { autoAlpha: 0, y: 24 })
      gsap.set(taglineRef.current, { autoAlpha: 0 })
      gsap.set(shapeStoryRef.current, { autoAlpha: 0, y: 8 })
      gsap.set(scrollCueRef.current, { autoAlpha: 0 })
      gsap.set(heroStickerPrimaryRef.current, { autoAlpha: 0, y: 24, rotation: -11 })
      gsap.set(heroStickerSecondaryRef.current, { autoAlpha: 0, y: 18, rotation: 12 })
      gsap.set(highlightDesignRef.current, {
        scaleX: 0.02,
        transformOrigin: "left center",
        opacity: 1,
      })
      gsap.set(highlightBuildRef.current, { opacity: 0 })
      gsap.set(cursorRef.current, { autoAlpha: 0 })

      // Build the intro timeline
      const introTl = gsap.timeline({
        onComplete: () => {
          introCompleteRef.current = true
        }
      })

      // Step 1: Hold AshFixesThings visible for 0.8s so user sees the problems
      introTl.to({}, { duration: 1.4 })

      // Step 2: Fade in eyebrow "Hello World, It's Ashraf Swaidan."
      introTl.to(eyebrowRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      }, "-=0.3")

      // Step 3: Fade in headline "I DESIGN AND BUILD BETTER WAYS."
      introTl.to(h1Ref.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
      }, "-=0.35")

      // Step 4: Fade in tagline / shape story
      introTl.to(taglineRef.current, {
        autoAlpha: 1,
        duration: 0.45,
        ease: "power2.out",
      }, "-=0.25")

      introTl.to(shapeStoryRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      }, "-=0.35")

      // Step 5: Fade AshFixesThings to background opacity
      introTl.to(ashBgRef.current, {
        autoAlpha: 0.35,
        duration: 1.2,
        ease: "power2.inOut",
      }, "-=0.2")

      // Step 6: Show scroll cue
      introTl.to(scrollCueRef.current, {
        autoAlpha: 0.45,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.4")
      introTl.to(heroStickerPrimaryRef.current, {
        autoAlpha: 1,
        y: 0,
        rotation: -7,
        duration: 0.55,
        ease: "back.out(1.35)",
      }, "-=0.12")
      introTl.to(heroStickerSecondaryRef.current, {
        autoAlpha: 1,
        y: 0,
        rotation: 8,
        duration: 0.5,
        ease: "back.out(1.2)",
      }, "-=0.34")

      // ═══════════════════════════════════════════════════════════════
      // FLOATING SHAPES (start after intro)
      // ═══════════════════════════════════════════════════════════════
      if (floatingShapesRef.current) {
        const shapes = floatingShapesRef.current.children

        Array.from(shapes).forEach((shape) => {
          gsap.set(shape, {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            rotation: Math.random() * 360,
            autoAlpha: 0.3 + Math.random() * 0.3,
          })
        })

        Array.from(shapes).forEach((shape, i) => {
          gsap.to(shape, {
            x: `+=${Math.random() * 40 - 20}`,
            y: `+=${Math.random() * 40 - 20}`,
            rotation: `+=${Math.random() * 20 - 10}`,
            duration: 4 + Math.random() * 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5,
          })

          gsap.to(shape, {
            autoAlpha: 0.15 + (i * 0.1),
            duration: 1,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          })
        })
      }

      // ═══════════════════════════════════════════════════════════════
      // SELECTION HIGHLIGHT LOOP (starts after intro)
      // ═══════════════════════════════════════════════════════════════
      const runHighlightSync = (phase: "design" | "build") => {
        highlightPhaseRef.current = phase
        syncCursorToWrap(
          headlineTrackRef.current,
          phase === "design" ? designWrapRef.current : buildWrapRef.current,
          cursorRef.current,
        )
      }

      // Delay highlight loop until intro finishes
      gsap.delayedCall(2.8, () => {
        highlightLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.35 })
        highlightLoop
          .call(() => {
            gsap.set(highlightDesignRef.current, { scaleX: 0.02, opacity: 1, transformOrigin: "left center" })
            gsap.set(highlightBuildRef.current, { opacity: 0 })
            runHighlightSync("design")
          })
          .to(highlightDesignRef.current, { scaleX: 1, duration: 0.42, ease: "power2.out" })
          .to(cursorRef.current, { autoAlpha: 1, duration: 0.18, ease: "power2.out" }, "-=0.25")
          .to({}, { duration: 0.65 })
          .to(highlightDesignRef.current, { opacity: 0.24, duration: 0.32, ease: "power2.inOut" })
          .to(highlightBuildRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" })
          .call(() => runHighlightSync("build"))
          .to({}, { duration: 0.72 })
          .to(highlightBuildRef.current, { opacity: 0.18, duration: 0.26, ease: "power2.inOut" })
          .to(cursorRef.current, { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, "<")
          .set(highlightDesignRef.current, { scaleX: 0.02, opacity: 1 })
          .set(highlightBuildRef.current, { opacity: 0 })
      })

      requestAnimationFrame(() => {
        runHighlightSync("design")
      })

      const ro = new ResizeObserver(() => {
        runHighlightSync(highlightPhaseRef.current)
        ScrollTrigger.refresh()
      })
      ro.observe(root)
      if (headlineTrackRef.current) ro.observe(headlineTrackRef.current)

      void document.fonts.ready.then(() => {
        runHighlightSync(highlightPhaseRef.current)
      })

      /** Ideas + messaging: scroll-revealed only (no pin). */
      const ideasTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "bottom top",
          toggleActions: "play none none none",
          once: true,
        },
      })

      const t0 = 0

      ideasTl.to(taglineRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, t0 + 0.05)
      ideasTl.to(shapeStoryRef.current, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power2.out" }, t0 + 0.08)
      ideasTl.to(scrollCueRef.current, { autoAlpha: 0, duration: 0.35 }, t0 + 0.1)

      return () => {
        ro.disconnect()
        highlightLoop?.kill()
        introTl.kill()
        ideasTl.scrollTrigger?.kill()
      }
    },
    { scope: rootRef },
  )

  return (
    <section
      id="home"
      ref={rootRef}
      role="banner"
      aria-label="Introduction"
      className={cn(
        "relative isolate min-h-[78svh] cursor-default overflow-hidden scroll-mt-24",
        "text-[var(--color-drh-ink)]",
        "selection:bg-[var(--color-drh-accent-orange)]/18",
      )}
    >
      <p className="sr-only">
        Hello World, it is Ashraf Swaidan. I design and build better ways. Design is how it looks, how it works, and
        why it works.
      </p>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ASH FIXES THINGS — Background layer with ref for intro fade */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={ashBgRef}
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        <AshFixesThings mode="background" className="h-full" />
      </div>

      {/* Floating geometric shapes */}
      <div
        ref={floatingShapesRef}
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        aria-hidden
      >
        {/* Circle */}
        <div className="absolute top-1/4 right-[15%] h-32 w-32 rounded-full border border-[var(--color-drh-ink)]/10" />

        {/* Diamond */}
        <div className="absolute bottom-1/3 left-[10%] h-24 w-24 rotate-45 border border-[var(--color-drh-accent-orange)]/10" />

        {/* Cross */}
        <div className="absolute right-[20%] top-2/3">
          <div className="absolute h-16 w-px bg-[var(--color-drh-ink)]/10" style={{ transform: 'translateX(-0.5px)' }} />
          <div className="absolute h-px w-16 bg-[var(--color-drh-ink)]/10" style={{ transform: 'translateY(-0.5px)' }} />
        </div>

        {/* Triangle */}
        <div 
          className="absolute bottom-1/4 left-[20%] h-0 w-0 border-l-[20px] border-r-[20px] border-b-[35px] border-transparent border-b-[var(--color-drh-accent-plum)]/10"
        />

        {/* Arc */}
        <div className="absolute right-[30%] top-[10%] h-20 w-20 rounded-t-full border border-[var(--color-drh-accent-lime)]/10 border-b-0" />

        {/* Small dot grid cluster */}
        <div className="absolute left-[25%] top-[15%] grid grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--color-drh-ink)]/8" />
          ))}
        </div>
      </div>

      {/* Particle canvas */}
      <canvas
        ref={particleCanvasRef}
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      />

      {/* Existing architectural draft background */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-[0.95] mix-blend-multiply"
        aria-hidden
      >
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 900"
        >
          <defs>
            <pattern id="drafting-grid" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
              <path
                d="M 72 0 L 0 0 0 72"
                fill="none"
                stroke="var(--color-drh-ink)"
                strokeWidth="0.4"
                strokeOpacity="0.085"
              />
            </pattern>

            <pattern id="drafting-grid-major" x="0" y="0" width="360" height="360" patternUnits="userSpaceOnUse">
              <rect width="360" height="360" fill="url(#drafting-grid)" />
              <path
                d="M 360 0 L 0 0 0 360"
                fill="none"
                stroke="var(--color-drh-ink)"
                strokeWidth="0.6"
                strokeOpacity="0.135"
              />
            </pattern>
          </defs>

          {/* Base grid */}
          <rect width="1440" height="900" fill="url(#drafting-grid-major)" />

          {/* Vanishing point lines — perspective, from lower-left */}
          <g stroke="var(--color-drh-ink)" strokeOpacity="0.075" fill="none">
            <line x1="180" y1="820" x2="1440" y2="120" strokeWidth="0.7" />
            <line x1="180" y1="820" x2="1440" y2="260" strokeWidth="0.7" />
            <line x1="180" y1="820" x2="1440" y2="440" strokeWidth="0.7" />
            <line x1="180" y1="820" x2="900" y2="-20" strokeWidth="0.5" />
            <line x1="180" y1="820" x2="620" y2="-20" strokeWidth="0.5" />
          </g>

          {/* Construction circle — large, off-center, half-visible */}
          <circle
            cx="1100"
            cy="480"
            r="340"
            fill="none"
            stroke="var(--color-drh-ink)"
            strokeWidth="0.7"
            strokeOpacity="0.12"
            strokeDasharray="4 10"
          />
          {/* Center cross for the circle */}
          <g stroke="var(--color-drh-ink)" strokeOpacity="0.11" strokeWidth="0.6">
            <line x1="1060" y1="480" x2="1140" y2="480" />
            <line x1="1100" y1="440" x2="1100" y2="520" />
          </g>

          {/* Golden section arc — upper-left quadrant */}
          <path
            d="M 60 340 A 280 280 0 0 1 340 60"
            fill="none"
            stroke="var(--color-drh-ink)"
            strokeWidth="0.7"
            strokeOpacity="0.11"
          />
          {/* Bounding rect for the golden arc */}
          <rect
            x="60"
            y="60"
            width="280"
            height="280"
            fill="none"
            stroke="var(--color-drh-ink)"
            strokeWidth="0.45"
            strokeOpacity="0.085"
          />

          {/* Small construction circles — scattered */}
          <circle
            cx="340"
            cy="340"
            r="4"
            fill="none"
            stroke="var(--color-drh-ink)"
            strokeWidth="0.7"
            strokeOpacity="0.14"
          />
          <circle
            cx="60"
            cy="340"
            r="3"
            fill="none"
            stroke="var(--color-drh-ink)"
            strokeWidth="0.7"
            strokeOpacity="0.11"
          />
          <circle
            cx="340"
            cy="60"
            r="3"
            fill="none"
            stroke="var(--color-drh-ink)"
            strokeWidth="0.7"
            strokeOpacity="0.11"
          />

          {/* Tangent lines */}
          <g stroke="var(--color-drh-ink)" strokeOpacity="0.065" strokeWidth="0.6" fill="none">
            <line x1="60" y1="60" x2="340" y2="340" />
            <line x1="340" y1="60" x2="60" y2="340" />
          </g>

          {/* Mid-canvas horizontal datum line */}
          <line
            x1="0"
            y1="450"
            x2="1440"
            y2="450"
            stroke="var(--color-drh-ink)"
            strokeWidth="0.5"
            strokeOpacity="0.095"
            strokeDasharray="12 18"
          />

          {/* Right-side geometric construct — a half-built rectangle with diagonals */}
          <g stroke="var(--color-drh-ink)" strokeOpacity="0.09" strokeWidth="0.6" fill="none">
            <rect x="1240" y="580" width="200" height="130" />
            <line x1="1240" y1="580" x2="1440" y2="710" />
            <line x1="1440" y1="580" x2="1240" y2="710" />
          </g>

          {/* Tick marks on grid axes */}
          <g stroke="var(--color-drh-ink)" strokeOpacity="0.11" strokeWidth="0.5">
            {[72, 144, 216, 288, 360, 432, 504, 576, 648, 720, 792, 864, 936, 1008, 1080, 1152, 1224, 1296, 1368].map(
              (x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="6" />
              ),
            )}
          </g>

          {/* Radial gradient fade so the center (where the text lives) stays clean */}
          <radialGradient id="bg-fade" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="var(--color-drh-bg)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-drh-bg)" stopOpacity="0" />
          </radialGradient>
          <rect width="1440" height="900" fill="url(#bg-fade)" />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_48%,rgb(255_255_255/0.96)_0%,rgb(255_255_255/0.82)_32%,rgb(255_255_255/0.34)_54%,transparent_72%)]"
          aria-hidden
        />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col items-center justify-center px-6 py-16 text-center md:px-10 md:py-20 lg:px-14 lg:py-24",
        )}
      >
        <p
          ref={eyebrowRef}
          className="mb-4 max-w-xl text-[clamp(0.95rem,1.35vw,1.1rem)] leading-snug text-[var(--color-drh-ink)]/80 md:mb-5"
          style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 72, "wght" 480' }}
        >
          Hello World, It&apos;s Ashraf Swaidan.
        </p>

        <h1
          ref={h1Ref}
          aria-label="I design and build better ways."
          className="max-w-[min(100%,52rem)] leading-none text-[var(--color-drh-ink)] uppercase"
          style={{ fontFamily: "var(--font-drh-display)", fontWeight: 400 }}
        >
          <div className="flex flex-col items-center gap-y-1 sm:gap-y-2">
            <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 sm:gap-x-3 lg:flex-nowrap lg:gap-x-4">
              <span className="shrink-0 text-[clamp(0.9rem,1.5vw,1.1rem)] leading-none tracking-[0.1em] text-[var(--color-drh-ink)]/55">
                I
              </span>

              <div
                ref={headlineTrackRef}
                className="relative flex min-w-0 flex-wrap items-baseline justify-center gap-x-2 gap-y-0 sm:gap-x-3 lg:flex-nowrap lg:gap-x-4"
              >
                <span className="inline-flex shrink-0 items-baseline gap-x-2 sm:gap-x-3">
                  <span ref={designWrapRef} className="relative inline-block rounded-[2px] px-[0.14em] py-[0.06em]">
                    <span
                      ref={highlightDesignRef}
                      className="absolute inset-0 z-0 rounded-[2px] bg-[var(--color-drh-accent-orange)]/18"
                      style={{ transformOrigin: "left center" }}
                      aria-hidden
                    />
                    <span className="relative z-[1] text-[clamp(1.45rem,3.4vw,2.75rem)] leading-none tracking-[0.06em]">
                      DESIGN
                    </span>
                  </span>
                  <span className="self-center text-[clamp(0.72rem,1.15vw,0.88rem)] font-normal leading-none tracking-[0.22em] text-[var(--color-drh-ink)]/42">
                    AND
                  </span>
                </span>

                <span ref={buildWrapRef} className="relative inline-block rounded-[2px] px-[0.14em] py-[0.06em]">
                  <span
                    ref={highlightBuildRef}
                    className="absolute inset-0 z-0 rounded-[2px] bg-[var(--color-drh-accent-orange)]/18 opacity-0"
                    aria-hidden
                  />
                  <span className="relative z-[1] text-[clamp(1.45rem,3.4vw,2.75rem)] leading-none tracking-[0.06em]">
                    BUILD
                  </span>
                </span>

                <div
                  ref={cursorRef}
                  className="pointer-events-none absolute z-[2] w-[2px] rounded-full bg-[var(--color-drh-accent-orange)]/85"
                  style={{ left: 0, top: 0 }}
                  aria-hidden
                />
              </div>
            </div>
            <span className="mt-1 shrink-0 text-[clamp(1.35rem,2.8vw,2.2rem)] leading-none tracking-[0.05em] lg:mt-2">
              BETTER WAYS.
            </span>
          </div>
        </h1>

        <p
          ref={shapeStoryRef}
          className="mt-4 max-w-[44ch] text-[clamp(0.92rem,1.05vw,1.02rem)] leading-relaxed text-[var(--color-drh-ink)]/64 md:mt-5"
          style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 64, "wght" 410' }}
        >
          {SHAPE_STORY}
        </p>
      </div>

      <DecorativeSticker
        ref={heroStickerPrimaryRef}
        sticker={HOMEPAGE_STICKERS.heroPrimary}
        priority
      />
      <DecorativeSticker
        ref={heroStickerSecondaryRef}
        sticker={HOMEPAGE_STICKERS.heroSecondary}
        priority
      />

      <div
        ref={scrollCueRef}
        className={cn(
          "pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2",
          "text-[0.64rem] font-medium tracking-[0.2em] text-[var(--color-drh-ink)]/35 uppercase",
        )}
        style={{ fontFamily: "var(--font-drh-display)" }}
      >
        <span>Scroll</span>
        <span className="block h-6 w-px bg-[var(--color-drh-ink)]/25" aria-hidden />
      </div>
    </section>
  )
}
