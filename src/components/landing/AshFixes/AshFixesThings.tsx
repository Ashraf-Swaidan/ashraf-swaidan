import { cn } from "@/lib/utils"
import { ProblemField } from "./ProblemField"

type AshFixesThingsProps = {
  mode?: "default" | "background"
  className?: string
}

export function AshFixesThings({
  mode = "default",
  className,
}: AshFixesThingsProps) {
  const isBackground = mode === "background"

  return (
    <section
      className={cn(
        "relative isolate w-full",
        isBackground ? "h-full overflow-visible" : "overflow-hidden",
        className,
      )}
      aria-hidden={isBackground || undefined}
    >
      <ProblemField />
      <div
        className={cn(
          "text-center",
          isBackground
            ? "absolute inset-x-0 top-full z-[1] mt-6 px-6 md:mt-8"
            : "relative z-10 -mt-4",
        )}
      >
        <p
          className={cn(
            "mb-3 uppercase tracking-[0.48em]",
            isBackground
              ? "text-[0.58rem] text-[var(--color-drh-ink)]/42"
              : "text-[0.68rem] text-[var(--color-drh-ink)]/34",
          )}
          style={{ fontFamily: "var(--font-hero-intro)" }}
        >
          The Logic of Less
        </p>
        <h2
          className={cn(
            "font-normal leading-[0.92] tracking-tight text-[var(--color-drh-ink)]",
            isBackground
              ? "text-[clamp(1.9rem,4.8vw,4rem)] opacity-[0.42]"
              : "text-[clamp(2.25rem,6vw,5rem)]",
          )}
          style={{ fontFamily: "var(--font-drh-display)" }}
        >
          Five steps. <span className="italic opacity-40">Or one.</span>
        </h2>
      </div>
    </section>
  )
}

export default AshFixesThings
