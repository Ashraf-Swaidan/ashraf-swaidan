import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Props = { children: ReactNode }

/**
 * Lenis smooth scrolling: interpolates scroll position so motion eases instead of tracking 1:1 with the wheel.
 * GSAP ticker drives Lenis raf; ScrollTrigger.update keeps scrubbed timelines in sync.
 */
export function SmoothScroll({ children }: Props) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.92,
      smoothWheel: true,
      touchMultiplier: 1.15,
    })

    const unsubScroll = lenis.on("scroll", () => {
      ScrollTrigger.update()
    })

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      unsubScroll()
      gsap.ticker.remove(ticker)
      lenis.destroy()
      ScrollTrigger.refresh()
    }
  }, [])

  return <>{children}</>
}
