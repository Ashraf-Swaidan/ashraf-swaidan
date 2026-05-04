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

type PrioritizedScrollTrigger = ScrollTrigger & { refreshPriority: number }

const LINE_SKEW_IN = 14
const LINE_SHIFT_X_VW = 1.65
const LINE_SHIFT_Y_VW = 1.75

export function OneSystemFlow() {
  const rootRef = useRef<HTMLDivElement>(null)

  const lineTlRef = useRef<gsap.core.Timeline[]>([])
  const rectRevealAnimRef = useRef<gsap.core.Animation[]>([])
  const breathAnimRef = useRef<gsap.core.Animation[]>([])

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current
      if (!root || !contextSafe) return

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const killAll = contextSafe(() => {
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
        const aiReduced = root.querySelector<HTMLElement>(
          ".osf-line--ai-powered"
        )
        gsap.set(linesReduced, {
          skewX: 0,
          x: 0,
          y: 0,
          clearProps: "transform",
        })
        gsap.set(innersReduced, { opacity: 1, clearProps: "transform" })
        if (aiReduced) {
          gsap.set(aiReduced, {
            autoAlpha: 1,
            filter: "none",
            clipPath: "inset(0% 0% 0% 0%)",
          })
          const aiStackReduced = aiReduced.querySelector(".osf-ai-stack")
          if (aiStackReduced) {
            gsap.set(aiStackReduced, {
              scale: 1,
              y: 0,
              clearProps: "transform",
            })
          }
        }
        const rectsReduced = root.querySelectorAll(".osf-rect")
        gsap.set(rectsReduced, {
          autoAlpha: 1,
          x: 0,
          rotation: 0,
          opacity: 1,
          clearProps: "clipPath",
        })
        const centsReduced = root.querySelector<HTMLElement>(
          ".osf-expenses-cents"
        )
        if (centsReduced) {
          centsReduced.textContent = "0.00"
          gsap.set(centsReduced, { autoAlpha: 1, clearProps: "transform" })
        }
      })

      if (reduceMotion) {
        applyReducedFinal()
        return () => killAll()
      }

      const lines = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".osf-line")
      )
      lines.forEach((line, i) => {
        gsap.set(line, {
          skewX: -LINE_SKEW_IN,
          x: `${LINE_SHIFT_X_VW}vw`,
          y: `${LINE_SHIFT_Y_VW}vw`,
          transformOrigin: "50% 88%",
        })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: "top bottom",
            end: "top 55%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        tl.to(line, { skewX: 0, x: 0, y: 0, duration: 1, ease: "none" }, 0)
        const st = tl.scrollTrigger
        if (st) (st as PrioritizedScrollTrigger).refreshPriority = i
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
          if (rst) (rst as PrioritizedScrollTrigger).refreshPriority = i + 0.25
          rectRevealAnimRef.current.push(reveal)
        }
      })

      const centsEl = root.querySelector<HTMLElement>(".osf-expenses-cents")
      if (centsEl) {
        const expensesLine = centsEl.closest<HTMLElement>(".osf-line")
        const counter = { cents: 0 }
        const formatCents = (raw: number) =>
          Math.max(0, Math.min(99.99, raw)).toFixed(2)

        gsap.set(centsEl, {
          autoAlpha: 0,
          textContent: "0.00",
          clearProps: "transform",
        })

        const centsTl = gsap.timeline({
          scrollTrigger: {
            trigger: expensesLine || root,
            start: "top 86%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        })

        /* Fade only — no y/transform while text updates or the line micro-jitters. */
        centsTl.to(centsEl, {
          autoAlpha: 1,
          duration: 0.22,
          ease: "power2.out",
        })
        centsTl.to(
          counter,
          {
            cents: 99.99,
            duration: 1.05,
            ease: "power1.in",
            onUpdate: () => {
              centsEl.textContent = formatCents(counter.cents)
            },
          },
          "-=0.06"
        )
        centsTl.to(counter, {
          cents: 0,
          duration: 0.62,
          ease: "power2.out",
          onUpdate: () => {
            centsEl.textContent = formatCents(counter.cents)
          },
        })

        const cst = centsTl.scrollTrigger
        if (cst) (cst as PrioritizedScrollTrigger).refreshPriority = 0.5
        rectRevealAnimRef.current.push(centsTl)
      }

      const aiLine = root.querySelector<HTMLElement>(".osf-line--ai-powered")
      const nowEl = root.querySelector<HTMLElement>(".osf-now-accent")
      if (aiLine && nowEl) {
        const aiStack = aiLine.querySelector<HTMLElement>(".osf-ai-stack")
        const aiWord = aiLine.querySelector<HTMLElement>(
          ".osf-word--ai-powered"
        )

        gsap.set(aiLine, {
          autoAlpha: 0,
          filter: "blur(18px)",
          clipPath: "inset(0% 0% 100% 0%)",
          force3D: true,
        })
        gsap.set(aiStack, {
          y: "0.52em",
          scale: 0.88,
          transformOrigin: "50% 68%",
          force3D: true,
        })
        gsap.set(aiWord, {
          y: "0.18em",
          scaleX: 0.94,
          transformOrigin: "50% 50%",
          force3D: true,
        })
        gsap.set(nowEl, {
          autoAlpha: 0,
          y: "-0.2em",
          x: "-0.35em",
          scale: 0.72,
          rotation: -5,
          transformOrigin: "50% 50%",
          force3D: true,
        })

        const nowTl = gsap.timeline({
          scrollTrigger: {
            trigger: aiLine,
            start: "top 78%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        })

        nowTl.to(aiLine, {
          autoAlpha: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.76,
          ease: "expo.out",
        })
        if (aiStack) {
          nowTl.to(
            aiStack,
            {
              y: 0,
              scale: 1,
              duration: 0.76,
              ease: "expo.out",
            },
            0
          )
        }
        if (aiWord) {
          nowTl.to(
            aiWord,
            {
              y: 0,
              scaleX: 1,
              duration: 0.62,
              ease: "power3.out",
            },
            0.08
          )
        }
        nowTl.to(
          nowEl,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1.08,
            rotation: 1.5,
            duration: 0.42,
            ease: "back.out(2.8)",
          },
          0.34
        )
        nowTl.to(
          nowEl,
          {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          ">-0.06"
        )

        const nst = nowTl.scrollTrigger
        if (nst)
          (nst as PrioritizedScrollTrigger).refreshPriority = lines.length + 0.5
        rectRevealAnimRef.current.push(nowTl)
      }

      const innersForBreath =
        root.querySelectorAll<HTMLElement>(".osf-rect-inner")
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

      const ro = new ResizeObserver(() => {
        ScrollTrigger.refresh()
      })
      ro.observe(root)

      return () => {
        ro.disconnect()
        killAll()
      }
    },
    { scope: rootRef }
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
          <span className="osf-word osf-word--accent">SALES</span>
        </div>

        <div className="osf-line">
          <span className="osf-word">USER ROLES</span>
        </div>

        <div className="osf-line">
          <span className="osf-word osf-word--accent">INSIGHTS</span>
          <InsightsRect />
        </div>

        <div className="osf-line">
          <span className="osf-word osf-word--expenses" aria-label="EXPENSES">
            <span aria-hidden="true">
              EXPEN<span>S</span>E
              <span className="osf-expenses-last">
                <span className="osf-expenses-final-s">S</span>
                <span className="osf-expenses-cents" aria-hidden="true">
                  0.00
                </span>
              </span>
            </span>
          </span>
        </div>

        <div className="osf-line osf-line--rect-left">
          <WalletsRect />
          <span className="osf-word">WALLETS</span>
        </div>

        <div className="osf-line osf-line--one-system">
          <div className="osf-expand-pin-target">
            <span className="osf-word osf-word--one-system">ONE SYSTEM.</span>
            <div className="osf-expand-anchor">
              <div className="osf-expand-plate" />
            </div>
          </div>
        </div>

        <div className="osf-line osf-line--ai-powered">
          <span className="osf-ai-stack">
            <span className="osf-word osf-word--ai-powered">AI POWERED</span>
            <span className="osf-now-accent">Now!</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default OneSystemFlow
