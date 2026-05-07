import { useEffect, useRef, type VideoHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export type ViewportLoopVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "preload" | "autoPlay"
> & {
  threshold?: number
  rootMargin?: string
}

/**
 * Decorative loop clips: defer download with `preload="none"`, then play/pause from
 * visibility (saves bandwidth when clips are below the fold).
 */
export function ViewportLoopVideo({
  className,
  threshold = 0.32,
  rootMargin = "0px 0px -12% 0px",
  onError,
  muted = true,
  loop = true,
  playsInline = true,
  src,
  ...rest
}: ViewportLoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduce) return

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) void video.play().catch(() => {})
        else {
          video.pause()
          try {
            video.currentTime = 0
          } catch {
            /* ignore */
          }
        }
      },
      { threshold, rootMargin },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [threshold, rootMargin, src])

  return (
    <video
      ref={ref}
      src={src}
      className={cn(className)}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload="none"
      onError={onError}
      {...rest}
    />
  )
}
