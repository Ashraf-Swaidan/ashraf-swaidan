import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

import { InsightsRect } from "./InsightsRect"
import { InventoryRect } from "./InventoryRect"
import "./OneSystemFlow.css"
import { SalesRect } from "./SalesRect"
import { WalletsRect } from "./WalletsRect"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LINE_SKEW_IN = 14
const LINE_SHIFT_X_VW = 1.65
const LINE_SHIFT_Y_VW = 1.75

export function OneSystemFlow() {
  const rootRef = useRef<HTMLDivElement>(null)

  const footerRef = useRef<HTMLElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const conclusionRef = useRef<HTMLParagraphElement>(null)

  const footerTlRef = useRef<gsap.core.Timeline | null>(null)
  const lineTlRef = useRef<gsap.core.Timeline[]>([])
  const rectRevealAnimRef = useRef<gsap.core.Animation[]>([])
  const breathAnimRef = useRef<gsap.core.Animation[]>([])

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current
      if (!root || !contextSafe) return

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      const killAll = contextSafe(() => {
        footerTlRef.current?.kill()
        footerTlRef.current = null
        lineTlRef.current.forEach((tl) => tl.kill())
        lineTlRef.current = []
        rectRevealAnimRef.current.forEach((anim) => anim.kill())
        rectRevealAnimRef.current = []
        breathAnimRef.current.forEach((anim) => anim.kill())
        breathAnimRef.current = []
      })

      const applyReducedFinal = contextSafe(() => {
        killAll()
        const linesReduced = root.querySelectorAll(".osf-line")
        const innersReduced = root.querySelectorAll(".osf-rect-inner")
        gsap.set(linesReduced, { skewX: 0, x: 0, y: 0, clearProps: "transform" })
        gsap.set(innersReduced, { skewX: 0, opacity: 1, clearProps: "transform" })
        const rectsReduced = root.querySelectorAll(".osf-rect")
        gsap.set(rectsReduced, { autoAlpha: 1, x: 0, rotation: 0, opacity: 1, clearProps: "clipPath" })
        if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 1 })
        if (conclusionRef.current) gsap.set(conclusionRef.current, { autoAlpha: 1 })
      })

      if (reduceMotion) {
        applyReducedFinal()
        return () => killAll()
      }

      const lines = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".osf-line"))
      lines.forEach((line, i) => {
        const inners = line.querySelectorAll<HTMLElement>(".osf-rect-inner")
        const skewInner = LINE_SKEW_IN
        gsap.set(line, {
          skewX: -LINE_SKEW_IN,
          x: `${LINE_SHIFT_X_VW}vw`,
          y: `${LINE_SHIFT_Y_VW}vw`,
          transformOrigin: "50% 88%",
        })
        gsap.set(inners, { skewX: skewInner, transformOrigin: "50% 88%" })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: "top bottom",
            end: "top 55%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        tl.to(line, { skewX: 0, x: 0, y: 0, duration: 1, ease: "none" }, 0).to(
          inners,
          { skewX: 0, duration: 1, ease: "none" },
          0,
        )
        const st = tl.scrollTrigger
        if (st) st.refreshPriority = i
        lineTlRef.current.push(tl)

        const rectEl = line.querySelector<HTMLElement>(".osf-rect")
        if (rectEl) {
          const before = rectEl.classList.contains("osf-rect--before")
          gsap.set(rectEl, {
            autoAlpha: 0,
            x: before ? -56 : 56,
            rotation: before ? -7 : 7,
            transformOrigin: before ? "0% 50%" : "100% 50%",
            force3D: true,
          })
          const reveal = gsap.to(rectEl, {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            duration: 0.82,
            ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 86%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          })
          const rst = reveal.scrollTrigger
          if (rst) rst.refreshPriority = i + 0.25
          rectRevealAnimRef.current.push(reveal)
        }
      })

      const innersForBreath = root.querySelectorAll<HTMLElement>(".osf-rect-inner")
      innersForBreath.forEach((innerEl, bi) => {
        const b = gsap.to(innerEl, {
          opacity: 0.94,
          duration: 2.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: bi * 0.14,
        })
        breathAnimRef.current.push(b)
      })

      const footer = footerRef.current
      const rule = ruleRef.current
      const conclusion = conclusionRef.current
      if (footer && rule && conclusion) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "center center" })
        gsap.set(conclusion, { autoAlpha: 0 })
        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: "top 88%",
            end: "top 62%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        })
        footerTl.to(rule, { scaleX: 1, duration: 1, ease: "none" }, 0)
        footerTl.to(conclusion, { autoAlpha: 1, duration: 1, ease: "none" }, 0.25)
        footerTlRef.current = footerTl
      }

      const ro = new ResizeObserver(() => {
        ScrollTrigger.refresh()
      })
      ro.observe(root)

      return () => {
        ro.disconnect()
        killAll()
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="osf-root">
      <div className="osf-lines">
        <div className="osf-line">
          <span className="osf-word">CUSTOMERS</span>
        </div>

        <div className="osf-line">
          <span className="osf-word">INVENTORY</span>
          <InventoryRect />
        </div>

        <div className="osf-line">
          <span className="osf-word">SUPPLIERS</span>
        </div>

        <div className="osf-line osf-line--rect-left">
          <SalesRect />
          <span className="osf-word">SALES</span>
        </div>

        <div className="osf-line">
          <span className="osf-word">USER ROLES</span>
        </div>

        <div className="osf-line">
          <span className="osf-word">INSIGHTS</span>
          <InsightsRect />
        </div>

        <div className="osf-line">
          <span className="osf-word">EXPENSES</span>
        </div>

        <div className="osf-line osf-line--rect-left">
          <WalletsRect />
          <span className="osf-word">WALLETS</span>
        </div>
      </div>

      <footer ref={footerRef} className="osf-footer">
        <div ref={ruleRef} className="osf-rule" aria-hidden />
        <p ref={conclusionRef} className="osf-conclusion">
          ONE SYSTEM<span className="osf-period">.</span>
        </p>
      </footer>
    </div>
  )
}

export default OneSystemFlow
