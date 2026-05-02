import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"
import { CursorSvg } from "./CursorSvg"
import { SolutionVisual } from "./SolutionVisual"
import type { Problem } from "./types"

const TEXTURE_CLASS: Record<Problem["tone"], string> = {
  sales:
    "bg-[linear-gradient(90deg,rgb(255_107_53/0.16)_1px,transparent_1px),linear-gradient(0deg,rgb(255_107_53/0.12)_1px,transparent_1px),radial-gradient(circle_at_18%_18%,rgb(255_107_53/0.2),transparent_32%),white]",
  stock:
    "bg-[radial-gradient(circle,rgb(63_159_98/0.1)_1px,transparent_1.6px),linear-gradient(145deg,rgb(63_159_98/0.08),white_58%)] [background-size:16px_16px,100%_100%] [background-position:0_0,0_0]",
  expense:
    "bg-[radial-gradient(circle_at_22%_18%,rgb(201_130_33/0.18),transparent_30%),repeating-linear-gradient(0deg,rgb(10_10_10/0.045)_0_1px,transparent_1px_13px),white]",
}

const CLIP_PATHS: Record<Problem["tone"], string> = {
  sales: "polygon(2% 7%, 96% 0, 100% 86%, 90% 100%, 0 93%)",
  stock: "polygon(0 2%, 92% 7%, 100% 22%, 96% 100%, 7% 95%, 2% 68%)",
  expense: "polygon(5% 0, 100% 8%, 94% 92%, 72% 100%, 0 90%, 3% 34%)",
}

export function ProblemArtifact({ problem, index }: { problem: Problem; index: number }) {
  return (
    <article
      className="ash-problem absolute w-[min(36vw,25rem)] min-w-[18.5rem] origin-center will-change-transform"
      data-problem-index={index}
      aria-label={`Problem ${index + 1}: ${problem.label}. ${problem.steps.length} manual steps required.`}
      style={{
        left: `${problem.position.x}%`,
        top: `${problem.position.y}%`,
        rotate: `${problem.rotate}deg`,
        ["--problem-color" as string]: problem.color,
      } as CSSProperties}
    >
      <div
        className={cn(
          "problem-shell relative min-h-[13.5rem] overflow-hidden p-5 shadow-[0_28px_65px_rgb(10_10_10/0.12)]",
          TEXTURE_CLASS[problem.tone],
        )}
        style={{ clipPath: CLIP_PATHS[problem.tone] }}
      >
        <div className="absolute inset-0 opacity-55 mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_180_180%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.75%22_numOctaves=%223%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.24%22/%3E%3C/svg%3E')]" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p
              className="text-[0.78rem] uppercase tracking-[0.2em] text-[var(--color-drh-ink)]/58"
              style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 72, "wght" 680' }}
            >
              {problem.label}
            </p>
            <span className="h-2 w-8" style={{ backgroundColor: problem.color, opacity: 0.55 }} aria-hidden="true" />
          </div>
          <p
            className="problem-voice mb-4 max-w-[26ch] text-[0.92rem] leading-snug text-[var(--color-drh-ink)]/62 opacity-0"
            style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 50, "wght" 470' }}
          >
            {problem.struggleLine}
          </p>
          <div className="problem-steps space-y-2.5">
            {problem.steps.map((step, stepIndex) => (
              <div
                key={step}
                className="step-item flex items-center gap-3 text-[0.94rem] leading-tight text-[var(--color-drh-ink)]/72"
                style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 60, "wght" 430' }}
              >
                <span 
                  className="grid h-6 w-6 place-items-center bg-[var(--color-drh-ink)]/8 text-[0.65rem] font-semibold text-[var(--color-drh-ink)]/45"
                  aria-hidden="true"
                >
                  {stepIndex + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="solution-visual absolute inset-3 z-20 opacity-0" aria-label={`${problem.label} solution preview`}>
          <SolutionVisual tone={problem.tone} active />
        </div>
        <div
          className="ash-working-skeleton absolute inset-3 z-20 grid place-items-center bg-white/82 opacity-0 backdrop-blur-sm"
          aria-hidden="true"
        >
          <div className="w-full max-w-[18rem]">
            <p
              className="mb-4 text-center text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-drh-ink)]/58"
              style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 64, "wght" 680' }}
            >
              Ash is working on a better way
            </p>
            <div className="space-y-2.5">
              {[0, 1, 2].map((line) => (
                <span
                  key={line}
                  className="block h-3 animate-pulse rounded-full bg-[var(--problem-color)]/20"
                  style={{ width: `${92 - line * 16}%`, animationDelay: `${line * 120}ms` }}
                />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className="h-8 animate-pulse rounded-t-full bg-[var(--color-drh-ink)]/8"
                  style={{ animationDelay: `${bar * 90}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="problem-cursor absolute left-0 top-0 z-30 will-change-transform" aria-hidden="true">
        <CursorSvg type={problem.cursor} color={problem.color} />
      </div>
    </article>
  )
}
