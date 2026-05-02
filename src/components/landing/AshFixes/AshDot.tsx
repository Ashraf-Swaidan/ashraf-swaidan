import type { RefObject } from "react"
import { cn } from "@/lib/utils"

export function AshDot({
  refProp,
  bubbleRef,
}: {
  refProp: RefObject<HTMLDivElement | null>
  bubbleRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div 
      ref={refProp} 
      className="ash-dot pointer-events-none absolute z-50 will-change-transform" 
      style={{ left: "50%", top: "50%" }}
      role="img"
      aria-label="Ash automation agent"
    >
      <div className="relative">
        <div className="h-3.5 w-3.5 rounded-full bg-[var(--color-drh-ink)] shadow-[0_0_0_7px_rgb(10_10_10/0.05),0_18px_28px_rgb(10_10_10/0.22)]" />
        <div className="absolute inset-[-7px] rounded-full border border-[var(--color-drh-ink)]/10" />
      </div>
      <div
        ref={bubbleRef}
        id="ash-bubble"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "absolute left-6 top-1/2 w-max max-w-[13rem] -translate-y-1/2",
          "bg-[var(--color-drh-ink)] px-3 py-2 text-[0.68rem] leading-tight text-white shadow-2xl",
          "opacity-0 [clip-path:polygon(0_8%,100%_0,96%_100%,4%_92%)]",
        )}
        style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 56, "wght" 540' }}
      />
    </div>
  )
}

type AshLegendProps = {
  expanded?: boolean
  fixed?: boolean
  onClick?: () => void
}

export function AshLegend({ expanded = false, fixed = false, onClick }: AshLegendProps) {
  const Comp = onClick ? "button" : "div"

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-expanded={onClick ? expanded : undefined}
      aria-controls={onClick ? "ash-navigation" : undefined}
      className={cn(
        "ash-legend flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-drh-ink)]/62",
        "transition-[color,opacity,transform] duration-300 hover:text-[var(--color-drh-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-ink)]/25",
        fixed
          ? "fixed left-5 top-5 z-[100] rounded-full bg-white/72 px-3 py-2 shadow-[0_16px_40px_rgb(10_10_10/0.08)] backdrop-blur-md"
          : "absolute left-5 top-5 z-40",
        onClick && "cursor-pointer",
      )}
      style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 64, "wght" 620' }}
      aria-label="Legend: Ash represents the automation agent"
    >
      <span className="ash-legend-dot h-2.5 w-2.5 rounded-full bg-[var(--color-drh-ink)] shadow-[0_0_0_5px_rgb(10_10_10/0.05)]" />
      Ash
    </Comp>
  )
}
