import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { SMARTAR_DISPLAY_FONT, SMARTAR_LOGO } from "./smartar/smartar-data"
import {
  SmartarAiSection,
  SmartarComingSoonSection,
  SmartarFooter,
  SmartarHeroSection,
} from "./smartar/smartar-sections"
import { SmartarScreenshotCollage } from "./smartar/SmartarScreenshotCollage"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function SmartarPage() {
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

      const heroInner = root.querySelector(".smartar-hero-inner")
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
        root.querySelectorAll(".smartar-story-block")
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
      className="relative min-h-svh bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)] antialiased selection:bg-[rgb(255_122_0/0.22)] selection:text-[var(--color-drh-ink)]"
    >
      {navDocked ? (
        <div
          className="fixed top-0 right-0 left-0 z-[60] border-b border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-bg)]/92 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-drh-bg)]/86"
          role="navigation"
          aria-label="SMARTAR case study"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
            <a
              href="/"
              className="text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
              style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
            >
              Back
            </a>
            <img
              className="h-8 w-8 object-contain opacity-90 sm:h-9 sm:w-9"
              src={SMARTAR_LOGO}
              alt="SMARTAR"
            />
          </div>
        </div>
      ) : null}
      <SmartarHeroSection heroNavRef={heroNavRef} />
      <SmartarScreenshotCollage />
      <SmartarAiSection />
      <SmartarComingSoonSection />
      <SmartarFooter />
    </main>
  )
}

export default SmartarPage
