import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

import { FrictionSection } from "./papion-system/FrictionSection"
import {
  ConnectedLayerSection,
  PapionFooter,
  PapionHeroSection,
} from "./papion-system/papion-sections"
import { PapionModuleExplorer } from "./papion-system/PapionModuleExplorer"
import { PapionScreenshotCollage } from "./papion-system/PapionScreenshotCollage"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function PapionSystemPage() {
  const mainRef = useRef<HTMLElement>(null)

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
      className="min-h-svh bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)]"
    >
      <PapionHeroSection />
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
