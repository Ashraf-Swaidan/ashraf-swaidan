import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Props = { children: ReactNode }

/**
 * Lenis smooth scrolling: interpolates scroll position so motion eases instead of tracking 1:1 with the wheel.
 * GSAP ticker drives Lenis raf; ScrollTrigger.update keeps scrubbed timelines in sync.
 *
 * ScrollTrigger.scrollerProxy: Lenis drives `window` scroll via `animatedScroll`; without this, pins/scrub
 * can desync (especially on large viewports) and feel like “nothing happens”.
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

    let activeLenis: Lenis | null = lenis

    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length && value != null) {
          const inst = activeLenis
          if (inst) inst.scrollTo(value, { immediate: true, force: true })
          else window.scrollTo(0, value)
        }
        const inst = activeLenis
        return inst ? inst.scroll : window.scrollY || document.documentElement.scrollTop
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
    })

    const onStRefresh = () => {
      activeLenis?.resize()
    }
    ScrollTrigger.addEventListener("refresh", onStRefresh)

    const unsubScroll = lenis.on("scroll", ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener("refresh", onStRefresh)
      unsubScroll()
      gsap.ticker.remove(ticker)
      activeLenis = null
      lenis.destroy()
      ScrollTrigger.scrollerProxy(window, {
        scrollTop(value) {
          if (arguments.length && value != null) {
            window.scrollTo(0, value)
          }
          return window.scrollY || document.documentElement.scrollTop
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
        },
      })
      ScrollTrigger.refresh()
    }
  }, [])

  return <>{children}</>
}
