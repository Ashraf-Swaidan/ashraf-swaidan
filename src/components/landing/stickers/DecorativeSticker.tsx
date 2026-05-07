import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type PointerEventHandler,
} from "react"
import gsap from "gsap"

import { cn } from "@/lib/utils"

import type { ResponsiveStickerConfig, StickerPlacement } from "./types"

type DecorativeStickerProps = HTMLAttributes<HTMLDivElement> & {
  sticker: ResponsiveStickerConfig
  priority?: boolean
}

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  )

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const sync = () => setIsDesktop(media.matches)

    sync()

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync)
      return () => media.removeEventListener("change", sync)
    }

    media.addListener(sync)
    return () => media.removeListener(sync)
  }, [])

  return isDesktop
}

function getPlacementStyle(
  placement: StickerPlacement,
  zIndex: number | undefined,
  inlineStyle: CSSProperties | undefined
): CSSProperties {
  return {
    top: placement.top,
    right: placement.right,
    bottom: placement.bottom,
    left: placement.left,
    width: placement.width,
    transform: placement.transform,
    zIndex,
    ...inlineStyle,
  }
}

export const DecorativeSticker = forwardRef<
  HTMLDivElement,
  DecorativeStickerProps
>(function DecorativeSticker(
  { sticker, className, style, priority = false, ...props },
  ref
) {
  const isDesktop = useDesktopLayout()
  const rootRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const xRef = useRef(0)
  const yRef = useRef(0)
  const pointerIdRef = useRef<number | null>(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const baseXRef = useRef(0)
  const baseYRef = useRef(0)
  const movedRef = useRef(false)
  const shakeTweenRef = useRef<gsap.core.Timeline | null>(null)
  const placement = isDesktop ? sticker.desktop : sticker.mobile
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, [])

  useEffect(() => {
    if (!dragRef.current || !imgRef.current) return

    gsap.set(dragRef.current, {
      x: xRef.current,
      y: yRef.current,
    })
    gsap.set(imgRef.current, {
      rotation: placement.rotation ?? 0,
    })
  }, [placement.rotation])

  useEffect(() => {
    return () => {
      shakeTweenRef.current?.kill()
    }
  }, [])

  const runShake = () => {
    if (!imgRef.current || reduceMotion) return

    shakeTweenRef.current?.kill()
    const baseRotation = placement.rotation ?? 0
    const tl = gsap.timeline()

    tl.to(imgRef.current, {
      rotation: baseRotation - 5,
      scale: 1.04,
      duration: 0.08,
      ease: "power1.out",
    })
      .to(imgRef.current, {
        rotation: baseRotation + 4,
        duration: 0.08,
        ease: "power1.inOut",
      })
      .to(imgRef.current, {
        rotation: baseRotation - 3,
        duration: 0.08,
        ease: "power1.inOut",
      })
      .to(imgRef.current, {
        rotation: baseRotation,
        scale: 1,
        duration: 0.12,
        ease: "back.out(1.7)",
      })

    shakeTweenRef.current = tl
  }

  const clampPosition = (nextX: number, nextY: number) => {
    const root = rootRef.current
    if (!root) return { x: nextX, y: nextY }

    const rect = root.getBoundingClientRect()
    const minX = -rect.left + 12
    const maxX = window.innerWidth - rect.right - 12
    const minY = -rect.top + 12
    const maxY = window.innerHeight - rect.bottom - 12

    return {
      x: Math.min(Math.max(nextX, minX), maxX),
      y: Math.min(Math.max(nextY, minY), maxY),
    }
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!dragRef.current || !rootRef.current) return

    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startYRef.current = event.clientY
    baseXRef.current = xRef.current
    baseYRef.current = yRef.current
    movedRef.current = false

    rootRef.current.setPointerCapture(event.pointerId)
    gsap.set(dragRef.current, { scale: 1.03 })
  }

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (pointerIdRef.current !== event.pointerId || !dragRef.current) return

    const dx = event.clientX - startXRef.current
    const dy = event.clientY - startYRef.current

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      movedRef.current = true
    }

    const next = clampPosition(baseXRef.current + dx, baseYRef.current + dy)
    xRef.current = next.x
    yRef.current = next.y

    gsap.set(dragRef.current, {
      x: xRef.current,
      y: yRef.current,
    })
  }

  const finishPointer = (pointerId: number) => {
    if (pointerIdRef.current !== pointerId || !dragRef.current || !rootRef.current)
      return

    rootRef.current.releasePointerCapture(pointerId)
    pointerIdRef.current = null
    gsap.to(dragRef.current, {
      scale: 1,
      duration: 0.16,
      ease: "power2.out",
    })

    if (!movedRef.current) {
      runShake()
    }
  }

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    finishPointer(event.pointerId)
  }

  const handlePointerCancel: PointerEventHandler<HTMLDivElement> = (
    event
  ) => {
    finishPointer(event.pointerId)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    runShake()
  }

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label={`${sticker.alt}. Drag or click for a reaction.`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      className={cn(
        "absolute touch-none select-none outline-none",
        "cursor-grab active:cursor-grabbing",
        className
      )}
      style={getPlacementStyle(placement, sticker.zIndex, style)}
      {...props}
    >
      <div ref={dragRef} className="will-change-transform">
        <img
          ref={imgRef}
          src={sticker.src}
          alt={sticker.alt}
          draggable={false}
          loading={priority ? "eager" : "lazy"}
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full drop-shadow-[0_18px_34px_rgb(10_10_10/0.14)]"
        />
      </div>
    </div>
  )
})
