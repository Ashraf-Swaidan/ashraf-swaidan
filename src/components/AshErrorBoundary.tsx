import { Component, type ErrorInfo, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type AshErrorBoundaryProps = {
  children: ReactNode
}

type AshErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

const DISPLAY = "'Barlow Condensed', sans-serif"
const BODY = "var(--font-drh-body)"

/**
 * Catches subtree render errors and shows an Ash-toned fallback (DRH colors, casual copy).
 * Must remain a class — React has no hooks API for error boundaries yet.
 */
export class AshErrorBoundary extends Component<
  AshErrorBoundaryProps,
  AshErrorBoundaryState
> {
  override state: AshErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): Partial<AshErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AshErrorBoundary]", error, info.componentStack)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleHome = () => {
    window.location.href = "/"
  }

  override render() {
    const { hasError, error } = this.state
    if (!hasError) return this.props.children

    return (
      <div
        className={cn(
          "isolate flex min-h-svh flex-col items-center justify-center px-6 py-14",
          "bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)]",
          "selection:bg-[var(--color-drh-accent-orange)]/18 selection:text-[var(--color-drh-ink)]"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-95"
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

        <div className="relative z-[1] mx-auto flex w-full max-w-lg flex-col items-center text-center">
          <img
            src="/assets/ash-stickers/hmm.webp"
            alt=""
            width={120}
            height={120}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="mb-8 h-auto w-[min(120px,32vw)] drop-shadow-[0_18px_34px_rgb(10_10_10/0.14)]"
          />

          <p
            className="text-[0.72rem] font-semibold tracking-[0.22em] text-[var(--color-drh-ink)]/56 uppercase"
            style={{ fontFamily: DISPLAY }}
          >
            Unexpected hiccup
          </p>

          <h1
            className="mt-2 text-[clamp(2rem,8vw,2.75rem)] leading-[0.94] font-semibold tracking-[-0.025em] text-[var(--color-drh-ink)] uppercase sm:text-[2.85rem]"
            style={{ fontFamily: DISPLAY, fontStretch: "condensed" }}
          >
            Ash hit a snag
          </h1>

          <p
            className="mx-auto mt-5 max-w-[26rem] text-[1rem] leading-[1.6] text-[var(--color-drh-ink)]/66 md:text-[1.08rem]"
            style={{
              fontFamily: BODY,
              fontVariationSettings: '"opsz" 64, "wght" 415',
            }}
          >
            Something broke while rendering this screen. Your work is fine — this is on us.
            Reload or hop back home and we&apos;ll pretend it never happened.
          </p>

          {import.meta.env.DEV && error?.message ? (
            <pre
              className="mt-8 max-h-40 w-full overflow-auto rounded-2xl border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] px-4 py-3 text-left text-[0.75rem] leading-snug whitespace-pre-wrap text-[var(--color-drh-ink)]/78"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {error.message}
            </pre>
          ) : null}

          <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              type="button"
              onClick={this.handleRetry}
              className={cn(
                "rounded-full border border-[var(--color-drh-ink)] px-7 py-3 text-[0.82rem] font-semibold tracking-[0.14em] text-[var(--color-drh-ink)] uppercase transition",
                "hover:border-[var(--color-drh-accent-orange)] hover:bg-[var(--color-drh-accent-orange)] hover:text-white"
              )}
              style={{ fontFamily: DISPLAY }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className={cn(
                "rounded-full border border-[var(--color-drh-ink)]/18 bg-[var(--color-drh-surface)] px-7 py-3 text-[0.82rem] font-semibold tracking-[0.14em] text-[var(--color-drh-ink)] uppercase transition",
                "hover:border-[var(--color-drh-ink)]/28"
              )}
              style={{ fontFamily: DISPLAY }}
            >
              Reload page
            </button>
          </div>

          <button
            type="button"
            onClick={this.handleHome}
            className="mt-4 text-[0.92rem] text-[var(--color-drh-ink)]/52 underline-offset-4 transition hover:text-[var(--color-drh-accent-orange)] hover:underline"
            style={{
              fontFamily: BODY,
              fontVariationSettings: '"opsz" 64, "wght" 420',
            }}
          >
            Go to homepage
          </button>
        </div>
      </div>
    )
  }
}
