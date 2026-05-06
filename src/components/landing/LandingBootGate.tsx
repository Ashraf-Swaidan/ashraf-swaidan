import { useEffect, useId, useState } from "react"
import { useReducedMotion } from "motion/react"

import { waitLandingBoot } from "@/lib/landingBoot"
import { cn } from "@/lib/utils"

export function LandingBootGate({ children }: { children: React.ReactNode }) {
  const labelId = useId()
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)

  const [fadeOut, setFadeOut] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    let cancelled = false
    void waitLandingBoot({ reduceMotion }).then(() => {
      if (!cancelled) setFadeOut(true)
    })
    return () => {
      cancelled = true
    }
  }, [reduceMotion])

  return (
    <div aria-busy={showOverlay} aria-labelledby={showOverlay ? labelId : undefined}>
      {children}

      {showOverlay ? (
        <div
          role="status"
          id={labelId}
          className={cn(
            "fixed inset-0 z-[2147483646] flex flex-col items-center justify-center gap-6 bg-[var(--color-drh-bg)] transition-opacity duration-500 ease-out motion-reduce:transition-none",
            fadeOut ? "pointer-events-none opacity-0" : "opacity-100",
          )}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget) return
            if (event.propertyName === "opacity" && fadeOut) {
              setShowOverlay(false)
            }
          }}
        >
          <span className="sr-only">Loading portfolio…</span>
          <div
            className="flex flex-col items-center gap-4 text-[var(--color-drh-ink)]"
            aria-hidden
          >
            <div
              className={cn(
                "h-1 w-[min(12rem,42vw)] rounded-full bg-[var(--color-drh-accent-orange)]/92 motion-safe:animate-pulse",
                reduceMotion && "motion-reduce:animate-none motion-reduce:opacity-80",
              )}
            />
            <p
              className="text-[0.68rem] font-semibold tracking-[0.38em] text-[var(--color-drh-ink)]/38 uppercase"
              style={{ fontFamily: "var(--font-drh-display)" }}
            >
              Loading
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
