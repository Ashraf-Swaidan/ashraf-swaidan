import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { WorkLiveDeviceDemo } from "@/components/work/WorkLiveDeviceDemo"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { appPath } from "@/lib/appPaths"
import { LuxianDemoAccess } from "./luxian/LuxianDemoAccess"
import { LUXIAN_DISPLAY_FONT, LUXIAN_LOGO } from "./luxian/luxian-data"
import { LuxianFeaturesShowcase } from "./luxian/LuxianFeaturesShowcase"
import {
  LuxianFooter,
  LuxianHeroSection,
  LuxianSystemSection,
} from "./luxian/luxian-sections"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LUXIAN_PROJECT = SELECTED_WORKS_PROJECTS.find(
  (project) => project.id === "luxian"
)

export function LuxianPage() {
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

      const heroInner = root.querySelector(".luxian-hero-inner")
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
        root.querySelectorAll(".luxian-story-block")
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
          aria-label="Luxian case study"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
            <a
              href={appPath("/")}
              className="text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
              style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
            >
              Back
            </a>
            <img
              className="h-8 w-8 object-contain opacity-95 sm:h-9 sm:w-9"
              src={LUXIAN_LOGO}
              alt="Luxian"
            />
          </div>
        </div>
      ) : null}
      <LuxianHeroSection heroNavRef={heroNavRef} />
      {LUXIAN_PROJECT ? (
        <WorkLiveDeviceDemo
          project={LUXIAN_PROJECT}
          accessNote={<LuxianDemoAccess />}
          theme={{
            title: "Browse Luxian without leaving the story.",
            titleClassName:
              "max-w-[28ch] text-balance text-[clamp(1.05rem,2.4vw,1.45rem)] leading-[1.15] font-semibold tracking-[0.1em] text-[var(--color-drh-ink)] uppercase",
            accentClass: "bg-[rgb(255_122_0/0.2)]",
            glowClass: "bg-[rgb(255_122_0/0.12)]",
            surfaceClass:
              "border-[var(--color-drh-accent-orange)]/35 bg-[rgb(255_122_0/0.1)] text-[var(--color-drh-ink)] hover:border-[var(--color-drh-accent-orange)]/55 hover:bg-[rgb(255_122_0/0.16)]",
            displayFont: "'Barlow Condensed', sans-serif",
          }}
        />
      ) : null}
      <LuxianSystemSection />
      <LuxianFeaturesShowcase />
      <LuxianFooter />
    </main>
  )
}

export default LuxianPage
