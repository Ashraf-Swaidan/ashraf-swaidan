import { useEffect } from "react"

import { cn } from "@/lib/utils"

/**
 * Embedded sites sometimes call the Fullscreen API on the iframe element. That
 * can leave the phone shell laid out wrong until a hard refresh. Exit iframe
 * fullscreen on the host document as soon as it activates.
 */
export function usePhoneEmbedFullscreenGuard() {
  useEffect(() => {
    const onFullscreenChange = () => {
      const el = document.fullscreenElement
      if (el && el instanceof HTMLIFrameElement) {
        try {
          void document.exitFullscreen()
        } catch {
          /* ignore */
        }
      }
    }

    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange)
      try {
        const el = document.fullscreenElement
        if (el && el instanceof HTMLIFrameElement) {
          void document.exitFullscreen()
        }
      } catch {
        /* ignore */
      }
    }
  }, [])
}

/**
 * Live site preview inside the phone. Uses normal flow sizing (not absolute
 * inset-0-only) so the iframe gets height from flex parents — otherwise the
 * wrapper collapses to 0px and every embed looks “blank”.
 */
export function PhoneWebEmbed({
  src,
  title,
  onLoad,
  className,
}: {
  src: string
  title: string
  onLoad?: () => void
  className?: string
}) {
  usePhoneEmbedFullscreenGuard()

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain bg-white isolate",
        className
      )}
    >
      <iframe
        src={src}
        title={title}
        className="min-h-0 w-full min-w-0 flex-1 border-0 bg-white"
        onLoad={onLoad}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
