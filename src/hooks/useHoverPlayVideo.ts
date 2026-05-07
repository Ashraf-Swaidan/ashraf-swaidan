import { useCallback, useRef } from "react"

/**
 * Hover / pointer-driven playback for decorative loops (footer cards): no prefetch
 * until interaction, resets on exit.
 */
export function useHoverPlayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const onPointerEnter = useCallback(() => {
    void videoRef.current?.play().catch(() => {})
  }, [])

  const onPointerLeave = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    try {
      v.currentTime = 0
    } catch {
      /* ignore */
    }
  }, [])

  return { videoRef, onPointerEnter, onPointerLeave }
}
