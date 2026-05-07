import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { flushSync } from "react-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "motion/react"

import { DecorativeSticker } from "@/components/landing/stickers/DecorativeSticker"
import { HOMEPAGE_STICKERS } from "@/data/homepageStickers"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type RailPair = {
  baseIndex: number
  nextIndex: number
}

type SceneZoom = {
  from: number
  to: number
}

type LayoutMetrics = {
  profile: "mobile" | "tablet" | "desktop" | "wide"
  isDesktop: boolean
  isTablet: boolean
  hasHorizontalHandoff: boolean
  headerExitY: number
  mediaStartY: number
  mediaMidY: number
  mediaFinalY: number
  mediaStartScale: number
  mediaFinalScale: number
  mediaShiftX: number
  railStartX: number
  railStartY: number
  railYPercent: number
  cropStart: number
  titleFinalScale: number
  scrollDistanceMultiplier: number
  scrollDistanceMin: number
}

const PROJECTS = SELECTED_WORKS_PROJECTS

const ZONES = {
  groupMoveEnd: 0.1,
  headerExitEnd: 0.21,
  mediaExpandEnd: 0.32,
  handoffEnd: 0.42,
} as const

const RAIL_TEXT_TIMING = {
  outgoingFadeStart: 0.08,
  outgoingFadeEnd: 0.5,
  incomingRevealStart: 0.38,
  incomingRevealEnd: 0.72,
} as const

const PROJECT_ZOOMS = [1.14, 1.03, 1.14, 1.03] as const

const SCREEN_BOX_STYLE: CSSProperties = {
  left: `${(385 / 1600) * 100}%`,
  top: `${(259 / 1200) * 100}%`,
  width: `${(830 / 1600) * 100}%`,
  height: `${(532 / 1200) * 100}%`,
}

type SelectedWorksCarouselVideoProps = {
  videoSrc: string
  inActivePair: boolean
  reduceMotion: boolean
}

/**
 * Inline laptop-screen loops: Safari (iOS) often ignores the `autoplay` attribute
 * when `src` is present from first paint — program `play()` after attributes + load.
 */
function SelectedWorksCarouselVideo({
  videoSrc,
  inActivePair,
  reduceMotion,
}: SelectedWorksCarouselVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const shouldPlay = inActivePair && !reduceMotion

  const tryPlay = useCallback(() => {
    const video = ref.current
    if (!video || !shouldPlay) return
    void video.play().catch(() => {})
  }, [shouldPlay])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.setAttribute("playsinline", "")
    video.setAttribute("webkit-playsinline", "")
    video.defaultMuted = true
    video.muted = true
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (!shouldPlay) {
      video.pause()
      return
    }
    tryPlay()
  }, [shouldPlay, tryPlay])

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={videoSrc}
      muted
      defaultMuted
      loop
      playsInline
      preload="auto"
      fetchPriority="high"
      autoPlay={shouldPlay}
      onLoadedData={tryPlay}
      onCanPlay={tryPlay}
      aria-hidden
    />
  )
}

const DISPLAY_FONT = "'Barlow Condensed', sans-serif"
const BODY_FONT = "var(--font-drh-body)"

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function mapRange(value: number, start: number, end: number) {
  if (end <= start) return 0
  return clamp01((value - start) / (end - start))
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount
}

function easeOutCubic(value: number) {
  const t = clamp01(value)
  return 1 - (1 - t) ** 3
}

function easeInOutSine(value: number) {
  const t = clamp01(value)
  return -(Math.cos(Math.PI * t) - 1) / 2
}

function getScrollDistance() {
  const metrics = getLayoutMetrics()

  return Math.max(
    window.innerHeight * metrics.scrollDistanceMultiplier,
    metrics.scrollDistanceMin
  )
}

function getLayoutMetrics(): LayoutMetrics {
  const width = window.innerWidth
  const height = window.innerHeight
  const isDesktop = width >= 1024
  const isTablet = width >= 768 && width < 1024
  const isWide = width >= 1680

  if (isWide) {
    return {
      profile: "wide",
      isDesktop,
      isTablet,
      hasHorizontalHandoff: true,
      headerExitY: -Math.min(430, height * 0.5),
      mediaStartY: Math.min(190, height * 0.24),
      mediaMidY: -Math.min(58, height * 0.08),
      mediaFinalY: 0,
      mediaStartScale: 0.62,
      mediaFinalScale: 1,
      mediaShiftX: -Math.min(430, width * 0.2),
      railStartX: 92,
      railStartY: 18,
      railYPercent: -50,
      cropStart: 22,
      titleFinalScale: 0.7,
      scrollDistanceMultiplier: 8.1,
      scrollDistanceMin: 6200,
    }
  }

  if (isDesktop) {
    return {
      profile: "desktop",
      isDesktop,
      isTablet,
      hasHorizontalHandoff: true,
      headerExitY: -Math.min(410, height * 0.5),
      mediaStartY: Math.min(178, height * 0.23),
      mediaMidY: -Math.min(54, height * 0.08),
      mediaFinalY: 0,
      mediaStartScale: width >= 1440 ? 0.64 : width >= 1280 ? 0.66 : 0.68,
      mediaFinalScale: 1,
      mediaShiftX: width >= 1440 ? -330 : width >= 1280 ? -285 : -220,
      railStartX: 82,
      railStartY: 18,
      railYPercent: -50,
      cropStart: 22,
      titleFinalScale: 0.7,
      scrollDistanceMultiplier: 7.8,
      scrollDistanceMin: 5600,
    }
  }

  if (isTablet) {
    return {
      profile: "tablet",
      isDesktop,
      isTablet,
      hasHorizontalHandoff: false,
      headerExitY: -Math.min(360, height * 0.44),
      mediaStartY: Math.min(150, height * 0.2),
      mediaMidY: -Math.min(72, height * 0.09),
      mediaFinalY: -Math.min(150, height * 0.17),
      mediaStartScale: 0.68,
      mediaFinalScale: 0.92,
      mediaShiftX: 0,
      railStartX: 0,
      railStartY: Math.min(96, height * 0.12),
      railYPercent: 0,
      cropStart: 18,
      titleFinalScale: 0.76,
      scrollDistanceMultiplier: 6.8,
      scrollDistanceMin: 4600,
    }
  }

  return {
    profile: "mobile",
    isDesktop,
    isTablet,
    hasHorizontalHandoff: false,
    headerExitY: -Math.min(330, height * 0.44),
    mediaStartY: Math.min(116, height * 0.17),
    mediaMidY: -Math.min(56, height * 0.08),
    mediaFinalY: -Math.min(150, height * 0.18),
    mediaStartScale: width < 390 ? 0.84 : 0.8,
    mediaFinalScale: width < 390 ? 0.9 : 0.88,
    mediaShiftX: 0,
    railStartX: 0,
    railStartY: Math.min(90, height * 0.12),
    railYPercent: 0,
    cropStart: 18,
    titleFinalScale: 0.82,
    scrollDistanceMultiplier: 6.2,
    scrollDistanceMin: 3600,
  }
}

function getCurrentProjectIndex(baseIndex: number, localProgress: number) {
  return Math.min(
    PROJECTS.length - 1,
    baseIndex + (localProgress >= 0.56 ? 1 : 0)
  )
}

function getSceneZoom(index: number, projectFloat: number): SceneZoom {
  const currentZoom = PROJECT_ZOOMS[index] ?? 1
  const previousZoom = PROJECT_ZOOMS[index - 1] ?? currentZoom
  const nextZoom = PROJECT_ZOOMS[index + 1] ?? currentZoom
  const distanceFromProject = projectFloat - index

  if (distanceFromProject >= 0 && distanceFromProject <= 1) {
    return {
      from: currentZoom,
      to: mix(currentZoom, nextZoom, easeInOutSine(distanceFromProject)),
    }
  }

  if (distanceFromProject < 0 && distanceFromProject >= -1) {
    return {
      from: mix(
        previousZoom,
        currentZoom,
        easeInOutSine(distanceFromProject + 1)
      ),
      to: currentZoom,
    }
  }

  return {
    from: currentZoom,
    to: currentZoom,
  }
}

export function SelectedWorks() {
  const rootRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const mediaShellRef = useRef<HTMLDivElement>(null)
  const mediaCropRef = useRef<HTMLDivElement>(null)
  const primaryStickerRef = useRef<HTMLDivElement>(null)
  const secondaryStickerRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const currentRailRef = useRef<HTMLDivElement>(null)
  const nextRailRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([])
  const sceneContentRefs = useRef<(HTMLDivElement | null)[]>([])
  const paginationRefs = useRef<(HTMLSpanElement | null)[]>([])
  const pairRef = useRef<RailPair>({ baseIndex: 0, nextIndex: 1 })
  const progressIndexRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)
  const [railPair, setRailPair] = useState<RailPair>({
    baseIndex: 0,
    nextIndex: 1,
  })
  const [progressIndex, setProgressIndex] = useState(0)

  useGSAP(
    () => {
      const root = rootRef.current
      const header = headerRef.current
      const title = titleRef.current
      const mediaShell = mediaShellRef.current
      const mediaCrop = mediaCropRef.current
      const primarySticker = primaryStickerRef.current
      const secondarySticker = secondaryStickerRef.current
      const rail = railRef.current
      const currentRail = currentRailRef.current
      const nextRail = nextRailRef.current
      const progressFill = progressFillRef.current
      const scenes = sceneRefs.current.filter(Boolean) as HTMLDivElement[]
      const sceneContents = sceneContentRefs.current.filter(
        Boolean
      ) as HTMLDivElement[]
      const paginationItems = paginationRefs.current.filter(
        Boolean
      ) as HTMLSpanElement[]

      if (
        !root ||
        !header ||
        !title ||
        !mediaShell ||
        !mediaCrop ||
        !primarySticker ||
        !secondarySticker ||
        !rail ||
        !currentRail ||
        !nextRail ||
        !progressFill ||
        scenes.length !== PROJECTS.length ||
        sceneContents.length !== PROJECTS.length ||
        paginationItems.length !== PROJECTS.length
      ) {
        return
      }

      const totalProjects = PROJECTS.length
      let metrics = getLayoutMetrics()

      pairRef.current = { baseIndex: 0, nextIndex: 1 }
      progressIndexRef.current = 0

      gsap.set(rail, {
        opacity: 0,
        pointerEvents: "none",
        visibility: "hidden",
      })

      const setHeaderY = gsap.quickSetter(header, "y", "px")
      // Uniform scale via scaleX/scaleY — quickSetter(..., "scale") can throw InvalidCharacterError
      // in some browsers (setAttribute('scaleX,scaleY', ...)) on HTML elements.
      const setTitleScaleX = gsap.quickSetter(title, "scaleX")
      const setTitleScaleY = gsap.quickSetter(title, "scaleY")
      const setTitleScale = (value: number) => {
        setTitleScaleX(value)
        setTitleScaleY(value)
      }
      const setMediaX = gsap.quickSetter(mediaShell, "x", "px")
      const setMediaY = gsap.quickSetter(mediaShell, "y", "px")
      const setMediaScaleX = gsap.quickSetter(mediaShell, "scaleX")
      const setMediaScaleY = gsap.quickSetter(mediaShell, "scaleY")
      const setMediaScale = (value: number) => {
        setMediaScaleX(value)
        setMediaScaleY(value)
      }
      const setPrimaryStickerOpacity = gsap.quickSetter(primarySticker, "opacity")
      const setSecondaryStickerOpacity = gsap.quickSetter(secondarySticker, "opacity")
      const setPrimaryStickerY = gsap.quickSetter(primarySticker, "y", "px")
      const setSecondaryStickerY = gsap.quickSetter(secondarySticker, "y", "px")
      const setRailX = gsap.quickSetter(rail, "x", "px")
      const setRailY = gsap.quickSetter(rail, "y", "px")
      const setRailYPercent = gsap.quickSetter(rail, "yPercent")
      const setRailOpacity = gsap.quickSetter(rail, "opacity")
      const setProgressScale = gsap.quickSetter(progressFill, "scaleX")

      const setRailPresence = (visibility: number) => {
        const clampedVisibility = clamp01(visibility)

        setRailOpacity(clampedVisibility)
        gsap.set(rail, {
          pointerEvents: clampedVisibility > 0.92 ? "auto" : "none",
          visibility: clampedVisibility > 0.01 ? "visible" : "hidden",
        })
      }

      const setRailLayoutAnchor = () => {
        setRailYPercent(metrics.railYPercent)
      }

      const syncPairState = (baseIndex: number, nextIndex: number) => {
        const currentPair = pairRef.current
        if (
          currentPair.baseIndex === baseIndex &&
          currentPair.nextIndex === nextIndex
        )
          return

        pairRef.current = { baseIndex, nextIndex }
        flushSync(() => {
          setRailPair({ baseIndex, nextIndex })
        })
      }

      const syncProgressIndex = (nextIndex: number) => {
        if (progressIndexRef.current === nextIndex) return
        progressIndexRef.current = nextIndex
        setProgressIndex(nextIndex)
      }

      const setStaticProject = (index: number) => {
        scenes.forEach((element, elementIndex) => {
          gsap.set(element, {
            autoAlpha: elementIndex === index ? 1 : 0,
            clipPath:
              elementIndex === index
                ? "inset(0% 0% 0% 0%)"
                : "inset(100% 0% 0% 0%)",
            zIndex: elementIndex === index ? 4 : 1,
          })
        })
        sceneContents.forEach((element, elementIndex) => {
          gsap.set(element, {
            scale: PROJECT_ZOOMS[elementIndex] ?? 1,
            transformOrigin: "50% 50%",
            force3D: true,
          })
        })
      }

      const setPagination = (activeIndex: number, localProgress: number) => {
        paginationItems.forEach((element, index) => {
          const isActive = index === activeIndex
          const isIncoming = index === activeIndex + 1 && localProgress > 0.74
          const targetScale = isActive
            ? mix(0.45, 1, clamp01(localProgress))
            : isIncoming
              ? 0.36
              : 0.24

          gsap.set(element, {
            opacity: isActive ? 1 : isIncoming ? 0.72 : 0.5,
            scaleY: targetScale,
          })
        })
      }

      const setTextMasks = (localProgress: number) => {
        const outgoingProgress = mapRange(
          localProgress,
          RAIL_TEXT_TIMING.outgoingFadeStart,
          RAIL_TEXT_TIMING.outgoingFadeEnd
        )
        const incomingProgress = mapRange(
          localProgress,
          RAIL_TEXT_TIMING.incomingRevealStart,
          RAIL_TEXT_TIMING.incomingRevealEnd
        )
        const outgoingEase = easeOutCubic(outgoingProgress)
        const outgoingY = easeInOutSine(outgoingProgress)
        const incomingEase = easeOutCubic(incomingProgress)
        const incomingY = easeInOutSine(incomingProgress)

        gsap.set(currentRail, {
          autoAlpha: 1 - outgoingEase,
          y: mix(0, -48, outgoingY),
        })
        gsap.set(nextRail, {
          autoAlpha: incomingEase,
          y: mix(52, 0, incomingY),
        })
      }

      const applyContinuousProjects = (showcaseProgress: number) => {
        const projectFloat = clamp01(showcaseProgress) * (totalProjects - 1)
        const baseIndex = Math.min(totalProjects - 2, Math.floor(projectFloat))
        const nextIndex = Math.min(totalProjects - 1, baseIndex + 1)
        const localProgress = clamp01(projectFloat - baseIndex)
        const revealInset = 100 - localProgress * 100
        const activeIndex = getCurrentProjectIndex(baseIndex, localProgress)

        syncPairState(baseIndex, nextIndex)
        syncProgressIndex(activeIndex)

        scenes.forEach((element, elementIndex) => {
          const sceneZoom = getSceneZoom(elementIndex, projectFloat)
          const clipPath =
            elementIndex === baseIndex
              ? "inset(0% 0% 0% 0%)"
              : elementIndex === nextIndex
                ? `inset(${revealInset}% 0% 0% 0%)`
                : "inset(100% 0% 0% 0%)"

          gsap.set(element, {
            autoAlpha:
              elementIndex === baseIndex || elementIndex === nextIndex ? 1 : 0,
            clipPath,
            zIndex:
              elementIndex === nextIndex
                ? 5
                : elementIndex === baseIndex
                  ? 4
                  : 1,
            force3D: true,
          })
          gsap.set(sceneContents[elementIndex], {
            scale: elementIndex === baseIndex ? sceneZoom.to : sceneZoom.from,
            transformOrigin: "50% 50%",
            force3D: true,
          })
        })

        setPagination(baseIndex, localProgress)
        setTextMasks(localProgress)
      }

      const applyFinalReadableLayout = () => {
        metrics = getLayoutMetrics()
        setHeaderY(metrics.headerExitY)
        setTitleScale(metrics.titleFinalScale)
        setMediaX(metrics.mediaShiftX)
        setMediaY(metrics.mediaFinalY)
        setMediaScale(metrics.mediaFinalScale)
        setPrimaryStickerOpacity(1)
        setSecondaryStickerOpacity(1)
        setPrimaryStickerY(0)
        setSecondaryStickerY(0)
        setRailLayoutAnchor()
        setRailPresence(1)
        setRailX(0)
        setRailY(0)
        setProgressScale(0)
        gsap.set(mediaCrop, { clipPath: "inset(0% 0% 0% 0% round 1.65rem)" })
        gsap.set([currentRail, nextRail], {
          clearProps: "transform,opacity,visibility",
        })
        gsap.set(currentRail, { autoAlpha: 1, y: 0 })
        gsap.set(nextRail, { autoAlpha: 0, y: 52 })
        setStaticProject(0)
        setPagination(0, 0)
      }

      if (reduceMotion) {
        applyFinalReadableLayout()
        return
      }

      const updateScene = (rawProgress: number) => {
        const progress = clamp01(rawProgress)
        const groupMove = mapRange(progress, 0, ZONES.groupMoveEnd)
        const headerExit = mapRange(
          progress,
          ZONES.groupMoveEnd,
          ZONES.headerExitEnd
        )
        const mediaExpand = mapRange(
          progress,
          ZONES.headerExitEnd,
          ZONES.mediaExpandEnd
        )
        const handoff = mapRange(
          progress,
          ZONES.mediaExpandEnd,
          ZONES.handoffEnd
        )
        const showcaseProgress = mapRange(progress, ZONES.handoffEnd, 1)

        const groupLift = mix(0, metrics.mediaMidY, easeInOutSine(groupMove))
        const headerY =
          groupLift + mix(0, metrics.headerExitY, easeInOutSine(headerExit))
        const mediaY =
          progress < ZONES.headerExitEnd
            ? mix(
                metrics.mediaStartY,
                metrics.mediaMidY,
                easeInOutSine(mapRange(progress, 0, ZONES.headerExitEnd))
              )
            : mix(
                metrics.mediaMidY,
                metrics.mediaFinalY,
                easeInOutSine(mediaExpand)
              )
        const mediaScale = mix(
          metrics.mediaStartScale,
          metrics.mediaFinalScale,
          easeOutCubic(mediaExpand)
        )
        const mediaX = metrics.hasHorizontalHandoff
          ? mix(0, metrics.mediaShiftX, easeInOutSine(handoff))
          : 0
        const cropInset = mix(metrics.cropStart, 0, easeInOutSine(mediaExpand))
        const railVisibility = easeOutCubic(handoff)
        const stickerVisibility = easeOutCubic(
          mapRange(progress, ZONES.headerExitEnd, ZONES.handoffEnd)
        )

        setHeaderY(headerY)
        setTitleScale(
          mix(
            1,
            metrics.titleFinalScale,
            easeOutCubic(mapRange(progress, 0, ZONES.headerExitEnd))
          )
        )
        setMediaX(mediaX)
        setMediaY(mediaY)
        setMediaScale(mediaScale)
        setPrimaryStickerOpacity(stickerVisibility)
        setSecondaryStickerOpacity(stickerVisibility)
        setPrimaryStickerY(mix(18, 0, stickerVisibility))
        setSecondaryStickerY(mix(12, 0, stickerVisibility))
        setRailLayoutAnchor()
        setRailPresence(railVisibility)
        setRailX(mix(metrics.railStartX, 0, easeOutCubic(handoff)))
        setRailY(mix(metrics.railStartY, 0, easeOutCubic(handoff)))
        setProgressScale(
          railVisibility > 0
            ? mix(0, 0.16, railVisibility) + showcaseProgress * 0.84
            : 0
        )

        gsap.set(mediaCrop, {
          clipPath: `inset(${cropInset}% 0% ${cropInset}% 0% round 1.65rem)`,
        })

        if (progress < ZONES.handoffEnd) {
          syncPairState(0, 1)
          syncProgressIndex(0)
          setStaticProject(0)
          setPagination(0, 0)
          gsap.set(currentRail, { autoAlpha: 1, y: 0 })
          gsap.set(nextRail, { autoAlpha: 0, y: 52 })
          return
        }

        applyContinuousProjects(showcaseProgress)
      }

      gsap.set(
        [
          header,
          mediaShell,
          rail,
          scenes,
          sceneContents,
          paginationItems,
          currentRail,
          nextRail,
        ],
        {
          force3D: true,
        }
      )
      gsap.set(sceneContents, { transformOrigin: "50% 50%" })
      gsap.set(title, { transformOrigin: "50% 0%" })
      gsap.set(paginationItems, { transformOrigin: "50% 100%" })
      gsap.set(progressFill, { transformOrigin: "0% 50%" })
      updateScene(0)

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 0.22,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          metrics = getLayoutMetrics()
          updateScene(self.progress)
        },
        onUpdate: (self) => updateScene(self.progress),
      })

      if ("fonts" in document) {
        void document.fonts.ready.then(() => ScrollTrigger.refresh())
      }

      return () => {
        trigger.kill()
      }
    },
    {
      scope: rootRef,
      dependencies: [reduceMotion],
      revertOnUpdate: true,
    }
  )

  const currentProject = PROJECTS[railPair.baseIndex]
  const nextProject = PROJECTS[railPair.nextIndex]

  return (
    <section
      id="selected-works"
      ref={rootRef}
      className={cn(
        "relative isolate overflow-hidden scroll-mt-24 bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)]",
        "selection:bg-[var(--color-drh-accent-orange)]/18 selection:text-[var(--color-drh-ink)]"
      )}
      aria-labelledby="selected-works-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-95"
        aria-hidden
        style={{
          background: `
            linear-gradient(90deg, rgb(10 10 10 / 0.055) 1px, transparent 1px),
            linear-gradient(180deg, rgb(10 10 10 / 0.045) 1px, transparent 1px),
            radial-gradient(circle at 78% 24%, rgb(10 10 10 / 0.055) 0%, transparent 24%),
            radial-gradient(circle at 18% 78%, rgb(10 10 10 / 0.035) 0%, transparent 22%),
            linear-gradient(180deg, var(--color-drh-bg) 0%, var(--color-drh-bg) 100%)
          `,
          backgroundSize: "72px 72px, 72px 72px, auto, auto, auto",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-multiply"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E\")",
        }}
      />

      <DecorativeSticker
        ref={primaryStickerRef}
        sticker={HOMEPAGE_STICKERS.selectedWorksPrimary}
      />
      <DecorativeSticker
        ref={secondaryStickerRef}
        sticker={HOMEPAGE_STICKERS.selectedWorksSecondary}
      />

      <div className="relative z-[1] min-h-svh">
        <div
          ref={headerRef}
          className="pointer-events-none absolute inset-x-0 top-[clamp(4.5rem,11vh,7rem)] z-20 mx-auto flex max-w-[96rem] flex-col items-center px-5 text-center"
        >
          <h2
            ref={titleRef}
            id="selected-works-heading"
            className="text-[clamp(3.3rem,18vw,4.75rem)] leading-[0.82] font-semibold tracking-[-0.025em] text-[var(--color-drh-ink)] uppercase sm:text-[5.8rem] sm:whitespace-nowrap md:text-[7.4rem] lg:text-[9rem] xl:text-[10.2rem]"
            style={{ fontFamily: DISPLAY_FONT, fontStretch: "condensed" }}
          >
            <span className="block sm:inline">Selected</span>{" "}
            <span className="block sm:inline">Works</span>
          </h2>
          <p
            className="mt-5 max-w-[42rem] text-[1.08rem] leading-[1.55] text-[var(--color-drh-ink)]/64 md:text-[1.28rem]"
            style={{
              fontFamily: BODY_FONT,
              fontVariationSettings: '"opsz" 64, "wght" 430',
            }}
          >
            Works Made For the Better.
          </p>
        </div>

        <div className="relative mx-auto min-h-svh w-full max-w-[100rem] px-4 py-8 sm:px-6 lg:px-10">
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center justify-center sm:inset-x-6 lg:inset-x-10">
            <div
              ref={mediaShellRef}
              className="relative z-10 w-[min(100%,68rem)] max-w-[calc((100svh-3rem)*1.333)] sm:w-[min(92vw,72rem)] md:w-[min(84vw,76rem)] lg:w-[min(62vw,74rem)] lg:max-w-[calc((100svh-4rem)*1.333)] xl:w-[min(58vw,82rem)] 2xl:w-[min(54vw,92rem)]"
            >
              <div
                ref={mediaCropRef}
                className="overflow-hidden rounded-[1.65rem] shadow-[0_34px_78px_rgb(10_10_10/0.11)]"
              >
                <div className="relative overflow-hidden rounded-[1.65rem] border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)]">
                  <div className="relative aspect-[1600/1200] w-full">
                    {PROJECTS.map((item, index) => {
                      const inActivePair =
                        index === railPair.baseIndex ||
                        index === railPair.nextIndex
                      return (
                      <div
                        key={item.id}
                        ref={(element) => {
                          sceneRefs.current[index] = element
                        }}
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          clipPath:
                            index === 0
                              ? "inset(0% 0% 0% 0%)"
                              : "inset(100% 0% 0% 0%)",
                          zIndex: index === 0 ? 4 : 1,
                        }}
                      >
                        <div
                          ref={(element) => {
                            sceneContentRefs.current[index] = element
                          }}
                          className="absolute inset-0 will-change-transform"
                          style={{
                            transform: `scale(${PROJECT_ZOOMS[index] ?? 1})`,
                            transformOrigin: "50% 50%",
                          }}
                        >
                          <img
                            src={item.imageSrc}
                            alt=""
                            aria-hidden
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div
                            className="absolute z-[2] overflow-hidden rounded-[0.28rem] bg-black"
                            style={SCREEN_BOX_STYLE}
                          >
                            <SelectedWorksCarouselVideo
                              videoSrc={item.videoSrc}
                              inActivePair={inActivePair}
                              reduceMotion={reduceMotion}
                            />
                            <div
                              className="pointer-events-none absolute inset-0 mix-blend-screen"
                              aria-hidden
                              style={{
                                background:
                                  "linear-gradient(180deg, rgb(255 255 255 / 0.16) 0%, transparent 18%, transparent 82%, rgb(255 255 255 / 0.06) 100%)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                    })}

                    <div
                      className="pointer-events-none absolute inset-0 z-[7] rounded-[inherit]"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(180deg, rgb(255 255 255 / 0.12) 0%, transparent 16%, transparent 84%, rgb(10 10 10 / 0.04) 100%)",
                      }}
                    />

                    <div className="absolute bottom-[18%] left-[7.5%] z-10 flex h-16 flex-col items-center justify-end gap-2">
                      {PROJECTS.map((item, index) => (
                        <span
                          key={`${item.id}-pagination`}
                          ref={(element) => {
                            paginationRefs.current[index] = element
                          }}
                          className="block h-11 w-2.5 origin-bottom rounded-full bg-white shadow-[0_1px_8px_rgb(10_10_10/0.22)] will-change-transform"
                          style={{
                            opacity: index === 0 ? 1 : 0.5,
                            transform: `scaleY(${index === 0 ? 0.45 : 0.24})`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside
            ref={railRef}
            className="absolute inset-x-5 bottom-[3.5svh] z-20 mx-auto w-[calc(100vw-2.5rem)] max-w-[34rem] sm:inset-x-8 sm:bottom-[4svh] sm:w-[calc(100vw-4rem)] lg:inset-x-auto lg:top-1/2 lg:right-10 lg:bottom-auto lg:w-[min(33rem,35vw)] lg:max-w-none lg:-translate-y-1/2 xl:right-16 xl:w-[min(36rem,34vw)] 2xl:right-[clamp(4rem,7vw,9rem)] 2xl:w-[min(40rem,32vw)]"
            aria-label="Project information"
          >
            <div className="mb-5 flex items-start gap-3 sm:mb-7 sm:gap-4 lg:mb-11">
              <p
                className="shrink-0 text-[2.65rem] leading-none text-[var(--color-drh-ink)] md:text-[3.35rem] lg:text-[3.9rem] xl:text-[4.35rem] 2xl:text-[4.8rem]"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                {String(progressIndex + 1).padStart(2, "0")}
              </p>
              <p
                className="pt-2 text-[1rem] leading-none text-[var(--color-drh-ink)]/42"
                style={{
                  fontFamily: BODY_FONT,
                  fontVariationSettings: '"opsz" 64, "wght" 420',
                }}
              >
                / {String(PROJECTS.length).padStart(2, "0")}
              </p>
              <div className="mt-5 h-px flex-1 overflow-hidden bg-[var(--color-drh-ink)]/12 sm:mt-6">
                <span
                  ref={progressFillRef}
                  className="block h-full origin-left bg-[var(--color-drh-accent-orange)]"
                />
              </div>
            </div>

            <div className="relative min-h-[18.5rem] overflow-hidden sm:min-h-[21rem] md:min-h-[23rem] lg:min-h-[27rem]">
              <div
                ref={currentRailRef}
                className="absolute inset-x-0 top-0 will-change-transform"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="shrink-0">
                    <img
                      src={currentProject.logoSrc}
                      alt=""
                      width={160}
                      height={160}
                      className="h-12 w-12 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20"
                      aria-hidden
                      fetchPriority="high"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <p
                    className="text-[clamp(1.8rem,8vw,2.4rem)] leading-[0.9] font-semibold tracking-[-0.02em] text-[var(--color-drh-ink)] uppercase md:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.6rem] 2xl:text-[4.2rem]"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    {currentProject.title}
                  </p>
                </div>
                <p
                  className="mt-6 max-w-[27rem] text-[0.96rem] leading-[1.6] text-[var(--color-drh-ink)]/66 sm:mt-8 md:mt-10 md:text-[1.08rem] xl:max-w-[31rem] xl:text-[1.18rem] xl:leading-[1.68] 2xl:max-w-[34rem] 2xl:text-[1.28rem]"
                  style={{
                    fontFamily: BODY_FONT,
                    fontVariationSettings: '"opsz" 64, "wght" 410',
                  }}
                >
                  {currentProject.description}
                </p>
                <a
                  href={currentProject.href}
                  className="mt-6 inline-flex rounded-full border border-[var(--color-drh-ink)] px-6 py-2.5 text-[0.82rem] leading-none font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)] hover:bg-[var(--color-drh-accent-orange)] hover:text-white sm:mt-8 sm:px-7 sm:py-3 sm:text-[0.9rem]"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  Read Use Case
                </a>
              </div>

              <div
                ref={nextRailRef}
                className="absolute inset-x-0 top-0 will-change-transform"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="shrink-0">
                    <img
                      src={nextProject.logoSrc}
                      alt=""
                      width={160}
                      height={160}
                      className="h-12 w-12 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20"
                      aria-hidden
                      fetchPriority="high"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <p
                    className="text-[clamp(1.8rem,8vw,2.4rem)] leading-[0.9] font-semibold tracking-[-0.02em] text-[var(--color-drh-ink)] uppercase md:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.6rem] 2xl:text-[4.2rem]"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    {nextProject.title}
                  </p>
                </div>
                <p
                  className="mt-6 max-w-[27rem] text-[0.96rem] leading-[1.6] text-[var(--color-drh-ink)]/66 sm:mt-8 md:mt-10 md:text-[1.08rem] xl:max-w-[31rem] xl:text-[1.18rem] xl:leading-[1.68] 2xl:max-w-[34rem] 2xl:text-[1.28rem]"
                  style={{
                    fontFamily: BODY_FONT,
                    fontVariationSettings: '"opsz" 64, "wght" 410',
                  }}
                >
                  {nextProject.description}
                </p>
                <a
                  href={nextProject.href}
                  className="mt-6 inline-flex rounded-full border border-[var(--color-drh-ink)] px-6 py-2.5 text-[0.82rem] leading-none font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)] hover:bg-[var(--color-drh-accent-orange)] hover:text-white sm:mt-8 sm:px-7 sm:py-3 sm:text-[0.9rem]"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  Read Use Case
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
