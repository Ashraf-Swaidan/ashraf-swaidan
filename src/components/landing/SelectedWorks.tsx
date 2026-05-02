import { useState, useRef, type CSSProperties } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type SelectedWorksMode = "scroll" | "manual"

type WorkProject = {
  id: string
  title: string
  description: string
  imageSrc: string
  videoSrc: string
  href: string
  eyebrow: string
}

type SelectedWorksProps = {
  mode?: SelectedWorksMode
}

const PROJECTS: WorkProject[] = [
  {
    id: "duwit",
    eyebrow: "AI execution system",
    title: "Duwit",
    description:
      "A goal-to-completion AI product that turns vague ambition into roadmaps, task coaching, memory, and real execution momentum.",
    imageSrc: "/assets/lap-animation-assets/lap1.jpg",
    videoSrc: "/assets/lap-animation-assets/video1.mp4",
    href: "#",
  },
  {
    id: "papion",
    eyebrow: "Operations backbone",
    title: "Papion System",
    description:
      "A business operations platform built around live inventory, finance, customers, suppliers, and practical cross-platform workflows.",
    imageSrc: "/assets/lap-animation-assets/lap2.jpg",
    videoSrc: "/assets/lap-animation-assets/video2.mp4",
    href: "#",
  },
  {
    id: "coducation",
    eyebrow: "Learning surface",
    title: "Coducation",
    description:
      "A teaching-first build that compresses technical onboarding into clearer flows, faster understanding, and stronger learner confidence.",
    imageSrc: "/assets/lap-animation-assets/lap3.jpg",
    videoSrc: "/assets/lap-animation-assets/video1.mp4",
    href: "#",
  },
  {
    id: "akanan",
    eyebrow: "Media and product",
    title: "Akanan TV",
    description:
      "A motion-aware product showcase exploring narrative pacing, clean interface framing, and memorable visual handoff between states.",
    imageSrc: "/assets/lap-animation-assets/lap4.jpg",
    videoSrc: "/assets/lap-animation-assets/video2.mp4",
    href: "#",
  },
]

const INTRO_SHARE = 0.34
const HIDDEN_CLIP = "inset(100% 0% 0% 0%)"
const VISIBLE_CLIP = "inset(0% 0% 0% 0%)"
const SCREEN_BOX_STYLE: CSSProperties = {
  left: `${(385 / 1600) * 100}%`,
  top: `${(259 / 1200) * 100}%`,
  width: `${(830 / 1600) * 100}%`,
  height: `${(532 / 1200) * 100}%`,
}

function getPreviewScale() {
  return window.innerWidth >= 1024 ? 0.46 : window.innerWidth >= 768 ? 0.58 : 0.74
}

function getPreviewYOffset() {
  return window.innerWidth >= 1024 ? 112 : window.innerWidth >= 768 ? 88 : 64
}

function getContentOffsetX() {
  return window.innerWidth >= 1024 ? 72 : 0
}

function getScrollDistance() {
  return Math.max(window.innerHeight * 5.4, 3600)
}

function clampIndex(index: number) {
  return Math.max(0, Math.min(PROJECTS.length - 1, index))
}

export function SelectedWorks({ mode = "scroll" }: SelectedWorksProps) {
  const rootRef = useRef<HTMLElement>(null)
  const introBlockRef = useRef<HTMLDivElement>(null)
  const topLabelRef = useRef<HTMLDivElement>(null)
  const stageTransformRef = useRef<HTMLDivElement>(null)
  const contentPanelRef = useRef<HTMLDivElement>(null)
  const contentInnerRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const previewGlowRef = useRef<HTMLDivElement>(null)
  const stageCanvasRef = useRef<HTMLDivElement>(null)
  const manualControlsRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const switchProjectRef = useRef<(nextIndex: number) => void>(() => {})
  const activeIndexRef = useRef(0)
  const queuedIndexRef = useRef<number | null>(null)
  const transitioningRef = useRef(false)
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)
  const [activeIndex, setActiveIndex] = useState(0)
  const [contentIndex, setContentIndex] = useState(0)

  useGSAP(
    () => {
      const root = rootRef.current
      const introBlock = introBlockRef.current
      const topLabel = topLabelRef.current
      const stageTransform = stageTransformRef.current
      const contentPanel = contentPanelRef.current
      const contentInner = contentInnerRef.current
      const progressFill = progressFillRef.current
      const previewGlow = previewGlowRef.current
      const stageCanvas = stageCanvasRef.current
      const manualControls = manualControlsRef.current
      const images = imageRefs.current.slice(0, PROJECTS.length).filter(Boolean) as HTMLImageElement[]
      const videos = videoRefs.current.slice(0, PROJECTS.length).filter(Boolean) as HTMLVideoElement[]

      if (
        !root ||
        !introBlock ||
        !topLabel ||
        !stageTransform ||
        !contentPanel ||
        !contentInner ||
        !progressFill ||
        !previewGlow ||
        !stageCanvas ||
        images.length !== PROJECTS.length ||
        videos.length !== PROJECTS.length
      ) {
        return
      }

      const totalProjects = PROJECTS.length
      activeIndexRef.current = 0
      queuedIndexRef.current = null
      transitioningRef.current = false
      transitionTimelineRef.current?.kill()

      const setLayerState = (
        collection: HTMLElement[],
        visibleIndex: number,
        elevatedIndex: number | null = null,
      ) => {
        collection.forEach((element, index) => {
          gsap.set(element, {
            clipPath: index === visibleIndex ? VISIBLE_CLIP : HIDDEN_CLIP,
            autoAlpha: 1,
            zIndex:
              index === elevatedIndex ? 6 : index === visibleIndex ? 4 : 1,
            scale: 1,
            transformOrigin: "50% 50%",
            willChange: "clip-path, transform",
            force3D: true,
          })
        })
      }

      const syncProgressBar = (progress: number) => {
        gsap.set(progressFill, {
          scaleX: gsap.utils.clamp(0, 1, progress),
          transformOrigin: "0% 50%",
        })
      }

      const applyFinalLayout = () => {
        gsap.set(introBlock, {
          autoAlpha: 0,
          y: -220,
          scale: 0.62,
          transformOrigin: "50% 50%",
          pointerEvents: "none",
        })
        gsap.set(topLabel, { autoAlpha: 1, y: 0 })
        gsap.set(stageTransform, {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: "50% 50%",
        })
        gsap.set(contentPanel, { autoAlpha: 1, x: 0, y: 0 })
        gsap.set(previewGlow, { autoAlpha: 0.88, scale: 1 })
      }

      const applyIntroLayout = () => {
        gsap.set(introBlock, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          transformOrigin: "50% 50%",
          pointerEvents: "auto",
        })
        gsap.set(topLabel, { autoAlpha: 0, y: -16 })
        gsap.set(stageTransform, {
          x: 0,
          y: getPreviewYOffset(),
          scale: getPreviewScale(),
          transformOrigin: "50% 50%",
        })
        gsap.set(contentPanel, {
          autoAlpha: 0,
          x: getContentOffsetX(),
          y: 24,
        })
        gsap.set(previewGlow, {
          autoAlpha: 0.64,
          scale: 0.88,
          transformOrigin: "50% 50%",
        })
      }

      const finishTransition = (nextIndex: number) => {
        setLayerState(images, nextIndex)
        setLayerState(videos, nextIndex)
        activeIndexRef.current = nextIndex
        transitioningRef.current = false
        transitionTimelineRef.current = null
        setActiveIndex(nextIndex)

        if (queuedIndexRef.current !== null && queuedIndexRef.current !== nextIndex) {
          const queuedIndex = queuedIndexRef.current
          queuedIndexRef.current = null
          requestProjectChange(queuedIndex)
          return
        }

        queuedIndexRef.current = null
      }

      const requestProjectChange = (nextIndexInput: number) => {
        const nextIndex = clampIndex(nextIndexInput)

        if (nextIndex === activeIndexRef.current && !transitioningRef.current) {
          return
        }

        if (transitioningRef.current) {
          queuedIndexRef.current = nextIndex
          return
        }

        const currentIndex = activeIndexRef.current
        const currentImage = images[currentIndex]
        const nextImage = images[nextIndex]
        const currentVideo = videos[currentIndex]
        const nextVideo = videos[nextIndex]

        if (!currentImage || !nextImage || !currentVideo || !nextVideo) {
          return
        }

        transitioningRef.current = true
        queuedIndexRef.current = null
        transitionTimelineRef.current?.kill()

        gsap.set([currentImage, currentVideo], { zIndex: 4, autoAlpha: 1 })
        gsap.set([nextImage, nextVideo], {
          zIndex: 6,
          clipPath: HIDDEN_CLIP,
          autoAlpha: 1,
          scale: 1,
        })

        const transitionDuration = reduceMotion ? 0.02 : 0.8
        const textFadeDuration = reduceMotion ? 0.01 : 0.2
        const pulseScale = reduceMotion ? 1 : 1.045

        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => finishTransition(nextIndex),
        })

        timeline.to(
          stageTransform,
          {
            scale: pulseScale,
            duration: reduceMotion ? 0.01 : 0.28,
          },
          0,
        )

        timeline.to(
          contentInner,
          {
            autoAlpha: 0,
            y: -16,
            duration: textFadeDuration,
            ease: "power2.out",
          },
          0.02,
        )

        timeline.to(
          [nextImage, nextVideo],
          {
            clipPath: VISIBLE_CLIP,
            duration: transitionDuration,
          },
          0.08,
        )

        timeline.add(() => {
          setContentIndex(nextIndex)
          setActiveIndex(nextIndex)
        }, reduceMotion ? 0.02 : 0.38)

        timeline.fromTo(
          contentInner,
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0.01 : 0.34,
            ease: "power2.out",
          },
          reduceMotion ? 0.02 : 0.45,
        )

        timeline.to(
          stageTransform,
          {
            scale: 1,
            duration: reduceMotion ? 0.01 : 0.36,
          },
          reduceMotion ? 0.02 : 0.44,
        )

        transitionTimelineRef.current = timeline
      }

      switchProjectRef.current = requestProjectChange

      setLayerState(images, 0)
      setLayerState(videos, 0)
      gsap.set(contentInner, { autoAlpha: 1, y: 0 })
      gsap.set(stageCanvas, { transformPerspective: 1200, transformOrigin: "50% 50%" })
      syncProgressBar(0)

      if (mode === "manual") {
        applyFinalLayout()
        gsap.set(manualControls, { autoAlpha: 1, y: 0 })
        return () => {
          transitionTimelineRef.current?.kill()
        }
      }

      gsap.set(manualControls, { autoAlpha: 0, y: 16 })

      let introTimeline: gsap.core.Timeline | null = null

      if (reduceMotion) {
        applyFinalLayout()

        const reducedMotionTrigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = gsap.utils.clamp(0, 1, self.progress)
            syncProgressBar(progress)
            const nextIndex =
              progress >= 1 ? totalProjects - 1 : Math.min(totalProjects - 1, Math.floor(progress * totalProjects))
            requestProjectChange(nextIndex)
          },
        })

        return () => {
          transitionTimelineRef.current?.kill()
          reducedMotionTrigger.kill()
        }
      }

      applyIntroLayout()

      introTimeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const rawProgress = gsap.utils.clamp(0, 1, self.progress)
            const showcaseProgress = gsap.utils.clamp(
              0,
              1,
              (rawProgress - INTRO_SHARE) / (1 - INTRO_SHARE),
            )
            syncProgressBar(showcaseProgress)

            const nextIndex =
              showcaseProgress >= 1
                ? totalProjects - 1
                : Math.min(totalProjects - 1, Math.floor(showcaseProgress * totalProjects))

            requestProjectChange(nextIndex)
          },
        },
      })

      introTimeline.to(
        introBlock,
        {
          y: -240,
          scale: 0.58,
          autoAlpha: 0.18,
          duration: 1,
        },
        0,
      )

      introTimeline.to(
        stageTransform,
        {
          y: 0,
          scale: 1,
          duration: 1.15,
          ease: "power2.inOut",
        },
        0.05,
      )

      introTimeline.to(
        previewGlow,
        {
          autoAlpha: 0.9,
          scale: 1,
          duration: 0.9,
        },
        0.08,
      )

      introTimeline.to(
        topLabel,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
        },
        0.34,
      )

      introTimeline.to(
        contentPanel,
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.92,
        },
        0.28,
      )

      introTimeline.to({}, { duration: 1.85 })

      if ("fonts" in document) {
        void document.fonts.ready.then(() => ScrollTrigger.refresh())
      }

      return () => {
        transitionTimelineRef.current?.kill()
        introTimeline?.kill()
      }
    },
    {
      scope: rootRef,
      dependencies: [mode, reduceMotion],
      revertOnUpdate: true,
    },
  )

  const project = PROJECTS[contentIndex]
  const isManual = mode === "manual"

  return (
    <section
      ref={rootRef}
      className={cn(
        "relative isolate overflow-hidden bg-[#0b0908] text-[#f7eee4]",
        "selection:bg-[#ffb98a]/30 selection:text-white",
      )}
      aria-labelledby="selected-works-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.95]"
        aria-hidden
        style={{
          background: `
            radial-gradient(circle at 18% 22%, rgb(185 113 58 / 0.22) 0%, transparent 28%),
            radial-gradient(circle at 78% 16%, rgb(244 224 197 / 0.08) 0%, transparent 24%),
            radial-gradient(circle at 50% 54%, rgb(255 166 113 / 0.08) 0%, transparent 38%),
            linear-gradient(180deg, #090706 0%, #0d0a09 42%, #080605 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.65'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-[1] min-h-svh">
        <div
          ref={topLabelRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-5 sm:px-7 sm:pt-7 lg:px-10"
        >
          <p
            className="text-[0.7rem] uppercase tracking-[0.32em] text-[#f7eee4]/74"
            style={{ fontFamily: "var(--font-hero-intro)" }}
          >
            Selected work
          </p>
          <p
            className="text-[0.7rem] uppercase tracking-[0.28em] text-[#f7eee4]/48"
            style={{ fontFamily: "var(--font-hero-intro)" }}
          >
            Systems 04
          </p>
        </div>

        <div className="relative flex min-h-svh items-center px-4 py-10 sm:px-6 lg:px-10">
          <div
            ref={introBlockRef}
            className="pointer-events-none absolute inset-x-0 top-[12svh] z-20 mx-auto flex max-w-4xl flex-col items-center px-4 text-center"
          >
            <p
              className="mb-4 text-[0.72rem] uppercase tracking-[0.35em] text-[#f7eee4]/60"
              style={{ fontFamily: "var(--font-hero-intro)" }}
            >
              Product systems, motion, interface craft
            </p>
            <h2
              id="selected-works-heading"
              className="max-w-[10ch] text-balance text-[clamp(3.4rem,8vw,7.9rem)] leading-[0.86] tracking-[-0.06em] text-[#fff4e8]"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              Selected Works
            </h2>
            <p
              className="mt-5 max-w-[44ch] text-pretty text-[clamp(1rem,2.3vw,1.18rem)] leading-[1.62] text-[#f7eee4]/72"
              style={{ fontFamily: "var(--font-hero-quote)", fontOpticalSizing: "auto" }}
            >
              A pinned, state-driven showcase where each project shifts as one scene:
              environment, laptop screen, and story panel moving in lockstep.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.78fr)] lg:gap-10">
            <div className="relative flex min-h-[52svh] items-center justify-center lg:justify-start">
              <div
                ref={stageTransformRef}
                className="relative z-10 w-full max-w-[min(100%,72rem)]"
              >
                <div
                  ref={previewGlowRef}
                  className="pointer-events-none absolute inset-[-8%] -z-10 rounded-[2.75rem] blur-3xl"
                  aria-hidden
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgb(248 168 116 / 0.25) 0%, rgb(248 168 116 / 0.08) 40%, transparent 72%)",
                  }}
                />

                <div
                  ref={stageCanvasRef}
                  className="relative overflow-hidden rounded-[2.1rem] border border-white/10 bg-[#120f0d] shadow-[0_35px_140px_rgb(0_0_0/0.55)]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-20 bg-gradient-to-b from-white/8 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] ring-1 ring-white/10" />

                  <div className="relative aspect-[1600/1200] w-full">
                    <div className="absolute inset-0 z-[2] overflow-hidden">
                      {PROJECTS.map((item, index) => (
                        <img
                          key={item.id}
                          ref={(element) => {
                            imageRefs.current[index] = element
                          }}
                          src={item.imageSrc}
                          alt=""
                          aria-hidden
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{
                            clipPath: index === 0 ? VISIBLE_CLIP : HIDDEN_CLIP,
                            zIndex: index === 0 ? 4 : 1,
                          }}
                        />
                      ))}
                    </div>

                    <div
                      className="absolute z-[4] overflow-hidden rounded-[0.3rem] bg-black shadow-[0_12px_34px_rgb(0_0_0/0.32)]"
                      style={SCREEN_BOX_STYLE}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                        {PROJECTS.map((item, index) => (
                          <video
                            key={`${item.id}-video`}
                            ref={(element) => {
                              videoRefs.current[index] = element
                            }}
                            className="absolute inset-0 h-full w-full object-cover"
                            src={item.videoSrc}
                            muted
                            loop
                            autoPlay
                            playsInline
                            preload="metadata"
                            aria-hidden
                            style={{
                              clipPath: index === 0 ? VISIBLE_CLIP : HIDDEN_CLIP,
                              zIndex: index === 0 ? 4 : 1,
                            }}
                          />
                        ))}
                      </div>
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-screen"
                        aria-hidden
                        style={{
                          background:
                            "linear-gradient(180deg, rgb(255 255 255 / 0.12) 0%, transparent 16%, transparent 78%, rgb(255 255 255 / 0.04) 100%)",
                        }}
                      />
                    </div>

                    <div
                      className="pointer-events-none absolute inset-0 z-[5] rounded-[inherit]"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(180deg, rgb(255 255 255 / 0.08) 0%, transparent 14%, transparent 84%, rgb(255 255 255 / 0.03) 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={contentPanelRef}
              className="relative z-20 self-center lg:max-w-[28rem]"
            >
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_90px_rgb(0_0_0/0.24)] backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.3em] text-[#f7eee4]/56"
                      style={{ fontFamily: "var(--font-hero-intro)" }}
                    >
                      Progress
                    </p>
                    <p
                      className="mt-2 text-[0.98rem] leading-none text-[#fff1e5]"
                      style={{ fontFamily: "var(--font-hero-quote)", fontOpticalSizing: "auto" }}
                    >
                      {String(activeIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="h-px flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      ref={progressFillRef}
                      className="block h-full origin-left bg-[linear-gradient(90deg,#f4d4b8_0%,#f59e72_48%,#ffd1a3_100%)]"
                    />
                  </div>
                </div>

                <div
                  ref={contentInnerRef}
                  className="mt-8 will-change-[transform,opacity]"
                >
                  <p
                    className="text-[0.72rem] uppercase tracking-[0.32em] text-[#f7eee4]/58"
                    style={{ fontFamily: "var(--font-hero-intro)" }}
                  >
                    {project.eyebrow}
                  </p>
                  <h3
                    className="mt-3 text-balance text-[clamp(2rem,4.6vw,3.2rem)] leading-[0.95] tracking-[-0.05em] text-[#fff4e8]"
                    style={{ fontFamily: "var(--font-hero)" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="mt-4 max-w-[30ch] text-pretty text-[1rem] leading-[1.72] text-[#f7eee4]/72 sm:text-[1.05rem]"
                    style={{ fontFamily: "var(--font-hero-quote)", fontOpticalSizing: "auto" }}
                  >
                    {project.description}
                  </p>
                  <a
                    href={project.href}
                    className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#f7d4bb]/18 bg-[#f7d4bb]/8 px-5 py-3 text-[0.82rem] uppercase tracking-[0.22em] text-[#fff4e8] transition hover:bg-[#f7d4bb]/14"
                    style={{ fontFamily: "var(--font-hero-intro)" }}
                  >
                    View case study
                    <span aria-hidden className="text-base leading-none">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={manualControlsRef}
            className={cn(
              "absolute inset-x-0 bottom-6 z-30 flex items-center justify-center",
              isManual ? "" : "pointer-events-none",
            )}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => {
                  switchProjectRef.current(activeIndexRef.current - 1)
                }}
                className="rounded-full border border-white/10 px-3 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-[#f7eee4]/80"
                style={{ fontFamily: "var(--font-hero-intro)" }}
              >
                Prev
              </button>
              <div className="flex items-center gap-2">
                {PROJECTS.map((item, index) => (
                  <button
                    key={`${item.id}-dot`}
                    type="button"
                    onClick={() => {
                      switchProjectRef.current(index)
                    }}
                    className={cn(
                      "h-2.5 rounded-full transition-all",
                      activeIndex === index ? "w-8 bg-[#f7d4bb]" : "w-2.5 bg-white/24",
                    )}
                    aria-label={`Show project ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  switchProjectRef.current(activeIndexRef.current + 1)
                }}
                className="rounded-full border border-white/10 px-3 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-[#f7eee4]/80"
                style={{ fontFamily: "var(--font-hero-intro)" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
