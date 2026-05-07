import { Menu, X } from "lucide-react"
import { type MouseEvent, useCallback, useEffect, useState } from "react"

import { useLenis } from "@/components/SmoothScroll"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#selected-works", label: "Works" },
  { href: "#footer", label: "Ask AI about Me" },
  { href: "#site-footer", label: "Contact Me" },
] as const

const NAV_PANEL_ID = "landing-navigation"
const AI_HINT_STORAGE_KEY = "ash-ai-hint-seen"

const POINTER_SCROLL_OFFSET = -96
const LENIS_SCROLL_DURATION = 1.35

function useMediaMdUp() {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : true,
  )

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = () => setIsMdUp(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return isMdUp
}

export function LandingNav() {
  const [open, setOpen] = useState(false)
  const [showAiHint, setShowAiHint] = useState(false)
  const isMdUp = useMediaMdUp()
  const lenis = useLenis()

  const close = useCallback(() => setOpen(false), [])

  const dismissAiHint = useCallback(() => {
    setShowAiHint(false)
    window.localStorage.setItem(AI_HINT_STORAGE_KEY, "true")
  }, [])

  useEffect(() => {
    if (window.localStorage.getItem(AI_HINT_STORAGE_KEY) === "true") return

    setShowAiHint(true)
    window.localStorage.setItem(AI_HINT_STORAGE_KEY, "true")

    const timeout = window.setTimeout(() => {
      setShowAiHint(false)
    }, 7000)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!open || isMdUp) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, isMdUp])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  useEffect(() => {
    if (window.location.pathname !== "/" || !window.location.hash) return

    const id = window.location.hash.slice(1)
    if (!id) return

    let attempts = 0
    const maxAttempts = 30
    let timer: number | null = null

    const scrollWhenReady = () => {
      const el = document.getElementById(id)
      if (!el) {
        attempts += 1
        if (attempts < maxAttempts) {
          timer = window.setTimeout(scrollWhenReady, 40)
        }
        return
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (lenis && !reducedMotion) {
        lenis.scrollTo(el, {
          offset: POINTER_SCROLL_OFFSET,
          duration: LENIS_SCROLL_DURATION,
        })
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + POINTER_SCROLL_OFFSET
        window.scrollTo({
          top,
          behavior: reducedMotion ? "auto" : "smooth",
        })
      }
    }

    timer = window.setTimeout(scrollWhenReady, 0)
    return () => {
      if (timer !== null) window.clearTimeout(timer)
    }
  }, [lenis])

  const scrollToHash = useCallback(
    (href: string) => {
      if (window.location.pathname !== "/") {
        window.location.assign(`/${href}`)
        return
      }

      const id = href.slice(1)
      const el = document.getElementById(id)
      if (!el) return

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (lenis && !reducedMotion) {
        lenis.scrollTo(el, {
          offset: POINTER_SCROLL_OFFSET,
          duration: LENIS_SCROLL_DURATION,
        })
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + POINTER_SCROLL_OFFSET
        window.scrollTo({
          top,
          behavior: reducedMotion ? "auto" : "smooth",
        })
      }

      window.history.replaceState(null, "", href)
    },
    [lenis],
  )

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToHash(href)
    close()
    dismissAiHint()
  }

  return (
    <>
      <div
        className={cn(
          "fixed left-4 top-4 z-[98] flex max-w-[min(18rem,calc(100vw-5.5rem))] items-start gap-2.5 text-[0.78rem] leading-[1.32] tracking-[0.01em] text-[var(--color-drh-ink)]/50",
          "transition-[opacity,transform] duration-500 ease-out md:left-5 md:top-5 md:max-w-[16rem]",
          showAiHint && !open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        style={{
          fontFamily: "'Cormorant Garamond', 'Fraunces Variable', serif",
        }}
      >
        <img
          src="/assets/ash-stickers/lets-go.webp"
          alt=""
          className="mt-0.5 h-10 w-10 shrink-0 -rotate-6 object-contain drop-shadow-[0_10px_18px_rgb(10_10_10/0.12)]"
          loading="eager"
          decoding="async"
        />
        <p className="pt-1">
          You can actually{" "}
          <a
            href="#footer"
            className="font-semibold text-[var(--color-drh-ink)] underline decoration-[var(--color-drh-accent-orange)]/45 underline-offset-4 transition hover:text-[var(--color-drh-accent-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-accent-orange)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-drh-bg)]"
            onClick={(e) => onNavClick(e, "#footer")}
          >
            ask AI
          </a>{" "}
          about Ashraf.
        </p>
      </div>

      <div className="md:hidden" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        <div
          className={cn(
            "fixed inset-0 z-[99] bg-[var(--color-drh-bg)] transition-[opacity] duration-200 ease-out motion-reduce:transition-none",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden
        />

        <button
          type="button"
          className={cn(
            "fixed right-5 top-5 z-[101] flex h-12 w-12 items-center justify-center rounded-[1.5rem] border text-[var(--color-drh-ink)] shadow-[0_12px_30px_rgb(10_10_10/0.1)] transition-[background-color,border-color,color] duration-150 hover:text-[var(--color-drh-accent-orange)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-accent-orange)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-drh-bg)]",
            open
              ? "border-[var(--color-drh-ink)]/10 bg-white"
              : "border-[var(--color-drh-ink)]/14 bg-white/92",
          )}
          aria-expanded={open}
          aria-controls={NAV_PANEL_ID}
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
        </button>

        <nav
          id={NAV_PANEL_ID}
          aria-label="Portfolio sections"
          inert={!open ? true : undefined}
          className={cn(
            "fixed inset-0 z-[100] flex h-[100dvh] flex-col justify-center gap-1 px-8 pb-16 pt-20 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
          )}
        >
          {LINKS.map(({ href, label }, i) => (
            <a
              key={href}
              href={href}
              className={cn(
                "group relative border-b border-[var(--color-drh-ink)]/08 py-4 text-right text-[clamp(1.65rem,8.5vw,2.85rem)] font-semibold tracking-[0.06em] text-[var(--color-drh-ink)] uppercase transition-colors",
                "hover:text-[var(--color-drh-accent-orange)]",
                "focus-visible:outline-none focus-visible:text-[var(--color-drh-accent-orange)]",
              )}
              style={{
                transitionDelay: open ? `${i * 20}ms` : "0ms",
              }}
              onClick={(e) => onNavClick(e, href)}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={cn(
                    "font-mono text-[0.6rem] font-normal tracking-[0.28em] text-[var(--color-drh-ink)]/38 transition-colors",
                    "group-hover:text-[var(--color-drh-accent-lime)] group-focus-visible:text-[var(--color-drh-accent-lime)]",
                  )}
                  aria-hidden
                >
                  {`0${i + 1}`}
                </span>
                {label}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {/* Desktop: bare pointers — no panel, no glass card */}
      <nav
        aria-label="Portfolio sections"
        className="pointer-events-auto fixed top-5 right-5 z-[99] hidden flex-col items-end gap-4 md:flex"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={cn(
              "group pointer-events-auto flex items-center gap-2.5 rounded-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-accent-orange)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-drh-bg)]",
            )}
            onClick={(e) => onNavClick(e, href)}
          >
            <span
              className="max-w-[12rem] text-right text-[0.68rem] font-semibold tracking-[0.24em] text-[var(--color-drh-ink)]/44 uppercase transition-colors duration-200 group-hover:text-[var(--color-drh-ink)] group-focus-visible:text-[var(--color-drh-ink)]"
            >
              {label}
            </span>
            <span className="relative flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
              <span className="absolute h-px w-3 bg-[var(--color-drh-ink)]/22 transition-all duration-300 group-hover:w-4 group-hover:bg-[var(--color-drh-accent-orange)] group-focus-visible:w-4 group-focus-visible:bg-[var(--color-drh-accent-orange)]" />
              <span
                className="h-1.5 w-1.5 rotate-45 border border-[var(--color-drh-ink)]/35 transition-all duration-300 group-hover:border-[var(--color-drh-accent-orange)] group-hover:bg-[var(--color-drh-accent-orange)]/20 group-focus-visible:border-[var(--color-drh-accent-orange)]"
              />
            </span>
          </a>
        ))}
      </nav>
    </>
  )
}
