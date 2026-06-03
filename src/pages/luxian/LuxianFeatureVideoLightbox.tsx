import { useEffect, useRef } from "react"

import { LUXIAN_DISPLAY_FONT } from "./luxian-data"

function VideoFullscreenIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}

export function LuxianFeatureVideoLightbox({
  open,
  onClose,
  src,
  poster,
  title,
  titleId,
  portrait = false,
}: {
  open: boolean
  onClose: () => void
  src: string
  poster?: string
  title: string
  titleId: string
  portrait?: boolean
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
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
    if (!open) {
      videoRef.current?.pause()
      return
    }
    closeRef.current?.focus()
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    void video.play().catch(() => {})
  }, [open, src])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgb(8_8_10/0.88)] backdrop-blur-[3px]"
        aria-label="Close fullscreen video"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex max-h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden border border-white/12 bg-[rgb(14_14_16)] shadow-[0_40px_120px_rgb(0_0_0/0.55)] ${
          portrait ? "max-w-[min(100%,400px)]" : "max-w-6xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <p
            id={titleId}
            className="min-w-0 truncate text-[0.72rem] font-medium tracking-[0.12em] text-[rgb(252_252_250)]/72 uppercase"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            {title}
          </p>
          <button
            ref={closeRef}
            type="button"
            className="shrink-0 border border-white/14 bg-white/8 px-3 py-1.5 text-[0.78rem] font-medium text-[rgb(252_252_250)]/85 transition hover:bg-white/14"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-2 sm:p-4">
          <video
            ref={videoRef}
            key={src}
            className={
              portrait
                ? "mx-auto aspect-[390/844] max-h-[min(88vh,920px)] w-auto max-w-full object-contain"
                : "max-h-[min(82vh,900px)] w-full max-w-full object-contain"
            }
            src={src}
            poster={poster}
            controls
            playsInline
            loop
            preload="auto"
          />
        </div>
      </div>
    </div>
  )
}

export { VideoFullscreenIcon }
