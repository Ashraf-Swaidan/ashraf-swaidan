import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FrictionSection } from "./papion-system/FrictionSection"
import {
  ConnectedLayerSection,
  PapionFooter,
  PapionHeroSection,
} from "./papion-system/papion-sections"
import { PapionModuleExplorer } from "./papion-system/PapionModuleExplorer"
import { PapionScreenshotCollage } from "./papion-system/PapionScreenshotCollage"
import { DISPLAY_FONT, PAPION_LOGO } from "./papion-system/papion-data"
import { appPath } from "@/lib/appPaths"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function PapionSystemPage() {
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

      const heroInner = root.querySelector(".papion-hero-inner")
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
        root.querySelectorAll(".papion-story-block")
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
      className="relative min-h-svh bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)]"
    >
      {navDocked ? (
        <div
          className="fixed top-0 right-0 left-0 z-[60] border-b border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-bg)]/92 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-drh-bg)]/86"
          role="navigation"
          aria-label="Papion case study"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
            <a
              href={appPath("/")}
              className="text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Back
            </a>
            <img
              className="h-8 w-8 object-contain opacity-85 sm:h-9 sm:w-9"
              src={PAPION_LOGO}
              alt="Papion"
            />
          </div>
        </div>
      ) : null}
      <PapionHeroSection heroNavRef={heroNavRef} />
      <FrictionSection />
      <PapionScreenshotCollage />
      <div className="papion-story-block">
        <PapionModuleExplorer />
      </div>
      <ConnectedLayerSection />
      <PapionFooter />
    </main>
  )
}

export default PapionSystemPage
