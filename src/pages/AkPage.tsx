import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { appPath } from "@/lib/appPaths"
import { AK_DISPLAY_FONT, AK_LOGO } from "./ak/ak-data"
import { AkScreenshotCollage } from "./ak/AkScreenshotCollage"
import {
  AkFitSection,
  AkFooter,
  AkFrictionSection,
  AkHeroSection,
  AkOfflineLocalSection,
} from "./ak/ak-sections"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function AkPage() {
  const mainRef = useRef<HTMLElement>(null)
  const heroNavRef = useRef<HTMLElement | null>(null)
  const [navDocked, setNavDocked] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = heroNavRef.current
      setNavDocked(Boolean(el && el.getBoundingClientRect().bottom < 0))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useGSAP(
    () => {
      const root = mainRef.current
      if (!root) return
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const heroInner = root.querySelector(".ak-hero-inner")
      if (heroInner && !reduceMotion) {
        gsap.from(heroInner.children, {
          opacity: 0,
          y: 22,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.09,
        })
      }

      if (reduceMotion) return

      const blocks = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".ak-story-block")
      )
      blocks.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 89%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    },
    { scope: mainRef }
  )

  return (
    <main
      ref={mainRef}
      className="relative min-h-svh bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)] antialiased selection:bg-teal-500/15 selection:text-[var(--color-drh-ink)]"
    >
      {navDocked ? (
        <div
          className="fixed top-0 right-0 left-0 z-[60] border-b border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-bg)]/92 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-drh-bg)]/86"
          role="navigation"
          aria-label="Ak case study"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
            <a
              href={appPath("/")}
              className="text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
              style={{ fontFamily: AK_DISPLAY_FONT }}
            >
              Back
            </a>
            <img
              className="h-8 w-8 object-contain opacity-90 sm:h-9 sm:w-9"
              src={AK_LOGO}
              alt="Ak System"
            />
          </div>
        </div>
      ) : null}
      <AkHeroSection heroNavRef={heroNavRef} />
      <AkFrictionSection />
      <AkScreenshotCollage />
      <AkOfflineLocalSection />
      <AkFitSection />
      <AkFooter />
    </main>
  )
}

export default AkPage
