import {
  ExternalLink,
  Loader2,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react"
import { useEffect, useState } from "react"

import type { WorkProject } from "@/data/selectedWorks"
import { cn } from "@/lib/utils"
import { usePhoneEmbedFullscreenGuard } from "@/components/landing/footer-phone/phone-web-embed"

type WorkLiveDeviceTheme = {
  title: string
  accentClass: string
  glowClass: string
  surfaceClass: string
  displayFont: string
}

export function WorkLiveDeviceDemo({
  project,
  theme,
}: {
  project: WorkProject
  theme: WorkLiveDeviceTheme
}) {
  const src = project.liveSiteUrl?.trim()
  const [loaded, setLoaded] = useState(false)
  const [showSlowHint, setShowSlowHint] = useState(false)
  const [reloadNonce, setReloadNonce] = useState(0)

  usePhoneEmbedFullscreenGuard()

  useEffect(() => {
    setLoaded(false)
    setShowSlowHint(false)
    if (!src) return
    const slow = window.setTimeout(() => setShowSlowHint(true), 10_000)
    return () => window.clearTimeout(slow)
  }, [src])

  if (!src) return null

  const reloadDemo = () => {
    setLoaded(false)
    setShowSlowHint(false)
    setReloadNonce((n) => n + 1)
  }

  return (
    <section className="duwit-story-block twodo-story-block relative isolate overflow-hidden px-5 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          theme.accentClass
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-[58%] h-[30rem] w-[min(58rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
          theme.glowClass
        )}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <h2
            className="max-w-[13ch] text-balance text-[clamp(2.35rem,5.4vw,5rem)] leading-[0.88] font-semibold tracking-[-0.02em] text-[var(--color-drh-ink)] uppercase"
            style={{ fontFamily: theme.displayFont }}
          >
            {theme.title}
          </h2>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <a
              href={src}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.16em] uppercase transition hover:-translate-y-0.5",
                theme.surfaceClass
              )}
              style={{ fontFamily: theme.displayFont }}
            >
              Open outside
              <ExternalLink className="size-3.5" strokeWidth={2.2} />
            </a>
            {showSlowHint ? (
              <p
                className="max-w-xs text-left text-[0.82rem] leading-snug text-[var(--color-drh-ink)]/44 sm:text-right"
              >
                If the embedded app stays blank, it may be blocking iframe
                previews. The outside link still works.
              </p>
            ) : null}
          </div>
        </header>

        <div className="relative w-full">
          <div
            className={cn(
              "absolute -inset-3 rounded-[2.4rem] opacity-65 blur-2xl",
              theme.glowClass
            )}
            aria-hidden
          />
          <div className="relative mx-auto max-w-[24rem] rounded-[3.25rem] bg-[linear-gradient(135deg,rgb(33_34_34),rgb(10_10_10)_46%,rgb(74_75_72))] p-[0.62rem] shadow-[0_34px_88px_rgb(12_12_12/0.18)] sm:max-w-none sm:rounded-[2rem] sm:p-[0.5rem]">
            <div className="relative aspect-[9/18.8] min-h-[34rem] overflow-hidden rounded-[2.55rem] bg-black sm:aspect-[16/10] sm:min-h-[24rem] sm:rounded-[1.4rem] lg:min-h-[32rem]">
              <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between bg-black/18 px-5 text-white backdrop-blur-sm">
                <div className="flex min-w-0 items-center gap-2.5">
                  <img
                    src={project.logoSrc}
                    alt=""
                    className="size-5 shrink-0 object-contain"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  <p
                    className="min-w-0 truncate text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-white/84"
                    style={{ fontFamily: theme.displayFont }}
                  >
                    {project.title}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={reloadDemo}
                    className="grid size-8 place-items-center rounded-full bg-white/10 text-white/78 transition hover:bg-white/16 hover:text-white focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:outline-none"
                    aria-label={`Reload ${project.title} demo`}
                    title="Reload demo"
                  >
                    <RefreshCw className="size-4" strokeWidth={2.1} />
                  </button>
                  <span className="grid size-8 place-items-center rounded-full bg-white/10 text-white/78">
                    <Smartphone className="size-4 sm:hidden" strokeWidth={2.1} />
                    <Tablet
                      className="hidden size-4 sm:block"
                      strokeWidth={2.1}
                    />
                  </span>
                </div>
              </div>

              <div
                className="absolute inset-x-0 top-11 bottom-0 isolate flex min-h-0 flex-col overflow-hidden overscroll-contain bg-white"
                data-lenis-prevent
              >
                <iframe
                  key={`${src}:${reloadNonce}`}
                  src={src}
                  title={`${project.title} live demo`}
                  className="min-h-0 w-full min-w-0 flex-1 border-0 bg-white"
                  onLoad={() => setLoaded(true)}
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {!loaded ? (
                <div
                  className="absolute inset-x-0 top-11 bottom-0 z-10 flex flex-col items-center justify-center gap-2 bg-white"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <Loader2
                    className="size-5 animate-spin text-[var(--color-drh-ink)]/36 motion-reduce:animate-none"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <p
                    className="text-[0.78rem] font-semibold tracking-[0.14em] text-[var(--color-drh-ink)]/42 uppercase"
                    style={{ fontFamily: theme.displayFont }}
                  >
                    Loading live app
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
