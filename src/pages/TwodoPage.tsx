import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { WorkLiveDeviceDemo } from "@/components/work/WorkLiveDeviceDemo"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { appPath } from "@/lib/appPaths"
import { TWODO_DISPLAY_FONT, TWODO_LOGO } from "./twodo/twodo-data"
import { TwodoScreenshotCollage } from "./twodo/TwodoScreenshotCollage"
import {
  TwodoCollaborationSection,
  TwodoFitSection,
  TwodoFooter,
  TwodoFrictionSection,
  TwodoHeroSection,
  TwodoOneClickSection,
} from "./twodo/twodo-sections"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const TWODO_PROJECT = SELECTED_WORKS_PROJECTS.find(
  (project) => project.id === "twodo"
)

export function TwodoPage() {
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

      const heroInner = root.querySelector(".twodo-hero-inner")
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
        root.querySelectorAll(".twodo-story-block")
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
      className="relative min-h-svh bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)] antialiased selection:bg-sky-400/18 selection:text-[var(--color-drh-ink)]"
    >
      {navDocked ? (
        <div
          className="fixed top-0 right-0 left-0 z-[60] border-b border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-bg)]/92 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-drh-bg)]/86"
          role="navigation"
          aria-label="Twodo case study"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
            <a
              href={appPath("/")}
              className="text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
              style={{ fontFamily: TWODO_DISPLAY_FONT }}
            >
              Back
            </a>
            <img
              className="h-8 w-8 object-contain opacity-95 sm:h-9 sm:w-9"
              src={TWODO_LOGO}
              alt="Twodo"
            />
          </div>
        </div>
      ) : null}
      <TwodoHeroSection heroNavRef={heroNavRef} />
      {TWODO_PROJECT ? (
        <WorkLiveDeviceDemo
          project={TWODO_PROJECT}
          theme={{
            title: "Try Twodo in the page.",
            accentClass: "bg-sky-400/24",
            glowClass: "bg-sky-400/14",
            surfaceClass:
              "border-sky-400/40 bg-[rgb(56_189_248/0.12)] text-[var(--color-drh-ink)] hover:border-sky-500/55 hover:bg-[rgb(56_189_248/0.2)]",
            displayFont: "'Barlow Condensed', sans-serif",
          }}
        />
      ) : null}
      <TwodoFrictionSection />
      <TwodoScreenshotCollage />
      <TwodoOneClickSection />
      <TwodoCollaborationSection />
      <TwodoFitSection />
      <TwodoFooter />
    </main>
  )
}

export default TwodoPage
