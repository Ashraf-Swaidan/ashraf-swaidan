import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Lines start slightly skewed, shifted (x/y), and eased back to neutral as they scroll into place. */
const LINE_SKEW_IN = 18
/** Initial translation (vw); horizontal alternates per row, vertical nudges all rows slightly. */
const LINE_SHIFT_X_VW = 3.2
const LINE_SHIFT_Y_VW = 1.6

const COL = {
  rectA: "#2563EB",
  rectAGreen: "#22C55E",
  rectB: "#F59E0B",
  stamp: "#EF4444",
  rectC: "#14B8A6",
  rectD: "#8B5CF6",
  period: "#F59E0B",
  ink: "#0a0a0a",
  paper: "#ffffff",
} as const

const OSF_STYLE = `
@font-face {
  font-family: "Druk Cond Super";
  src: url("/fonts/DrukCond-Super-Cy-Gr-Web.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.osf-root {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  box-sizing: border-box;
  min-height: min(140vh, 1600px);
  background: ${COL.paper};
  color: ${COL.ink};
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 12vh;
  overflow-x: hidden;
  font-family: "Druk Cond Super", "Anton", ui-sans-serif, sans-serif;
  font-feature-settings: "kern" 1;
  -webkit-font-smoothing: antialiased;
  /* All-caps optical line box; rects use same factor so row height isn’t one full em */
  --osf-cap-line: 0.76;
}

.osf-lines {
  position: relative;
  z-index: 0;
}

.osf-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  width: 100%;
  font-size: clamp(2.75rem, 11vw, 8.5rem);
  line-height: var(--osf-cap-line);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  white-space: nowrap;
  transform-origin: 50% 88%;
}

.osf-line:not(:first-child) {
  margin-top: 0.00em;
}

.osf-line--rect-left {
  flex-direction: row;
}

.osf-word {
  display: inline-block;
}

.osf-rect {
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  height: calc(1em * var(--osf-cap-line));
  width: auto;
  aspect-ratio: 7 / 5.5;
  border-radius: min(0.75vw, 0.06em);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.osf-rect--after {
  margin-left: 0.12em;
}

.osf-rect--before {
  margin-right: 0.12em;
}

.osf-rect-inner {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.osf-footer {
  margin-top: 10vh;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15em;
  padding: 0 4vw;
}

.osf-rule {
  height: 2px;
  width: min(92vw, 1200px);
  background: ${COL.ink};
  transform-origin: center center;
  transform: scaleX(0);
}

.osf-conclusion {
  margin: 0;
  font-size: clamp(2.75rem, 11vw, 8.5rem);
  line-height: var(--osf-cap-line);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  text-align: center;
  width: 100%;
  opacity: 0;
}

.osf-period {
  color: ${COL.period};
}
`

export function OneSystemFlow() {
  const rootRef = useRef<HTMLDivElement>(null)
  const rectARef = useRef<HTMLSpanElement>(null)

  const checkPathRef = useRef<SVGPathElement>(null)
  const boxFillRef = useRef<SVGRectElement>(null)
  const boxInARef = useRef<HTMLDivElement>(null)

  const bBoxRef = useRef<HTMLDivElement>(null)
  const bReceiveRef = useRef<HTMLDivElement>(null)
  const bTagRef = useRef<HTMLDivElement>(null)
  const bStampRef = useRef<HTMLDivElement>(null)
  const bCoinRef = useRef<HTMLDivElement>(null)

  const cChartRef = useRef<HTMLDivElement>(null)
  const cDotRef = useRef<HTMLDivElement>(null)
  const cBarsRef = useRef<SVGSVGElement>(null)
  const cLinePathRef = useRef<SVGPathElement>(null)
  const cNumRef = useRef<HTMLSpanElement>(null)

  const dStackRef = useRef<HTMLDivElement>(null)
  const dBalanceRef = useRef<HTMLSpanElement>(null)

  const footerRef = useRef<HTMLElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const conclusionRef = useRef<HTMLParagraphElement>(null)

  const rectLoopTlRef = useRef<gsap.core.Timeline | null>(null)
  const footerTlRef = useRef<gsap.core.Timeline | null>(null)
  const lineTlRef = useRef<gsap.core.Timeline[]>([])

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current
      if (!root || !contextSafe) return

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      const killAll = contextSafe(() => {
        rectLoopTlRef.current?.kill()
        rectLoopTlRef.current = null
        footerTlRef.current?.kill()
        footerTlRef.current = null
        lineTlRef.current.forEach((tl) => tl.kill())
        lineTlRef.current = []
      })

      const applyReducedFinal = contextSafe(() => {
        killAll()
        const linesReduced = root.querySelectorAll(".osf-line")
        const innersReduced = root.querySelectorAll(".osf-rect-inner")
        gsap.set(linesReduced, { skewX: 0, x: 0, y: 0, clearProps: "transform" })
        gsap.set(innersReduced, { skewX: 0, clearProps: "transform" })
        if (checkPathRef.current) gsap.set(checkPathRef.current, { strokeDashoffset: 0 })
        if (boxFillRef.current) gsap.set(boxFillRef.current, { fill: COL.rectAGreen })
        if (boxInARef.current) gsap.set(boxInARef.current, { clearProps: "all" })
        if (bReceiveRef.current) gsap.set(bReceiveRef.current, { y: 0, autoAlpha: 1 })
        if (bBoxRef.current)
          gsap.set(bBoxRef.current, { left: "50%", top: "50%", xPercent: -50, yPercent: -50, y: 0, autoAlpha: 1 })
        if (bTagRef.current) gsap.set(bTagRef.current, { rotationX: 0, autoAlpha: 1 })
        if (bStampRef.current) gsap.set(bStampRef.current, { scale: 1, rotation: -10, autoAlpha: 1 })
        if (bCoinRef.current) gsap.set(bCoinRef.current, { autoAlpha: 0 })
        if (cChartRef.current) gsap.set(cChartRef.current, { y: 0, autoAlpha: 1 })
        if (cDotRef.current) gsap.set(cDotRef.current, { y: 0, autoAlpha: 0 })
        if (cNumRef.current) cNumRef.current.textContent = "128"
        const barR = cBarsRef.current?.querySelector<SVGRectElement>(".osf-bar-right")
        if (barR) gsap.set(barR, { attr: { height: 52, y: 4 } })
        if (cLinePathRef.current) {
          const len = cLinePathRef.current.getTotalLength()
          gsap.set(cLinePathRef.current, { strokeDashoffset: 0, strokeDasharray: len })
        }
        if (dStackRef.current) gsap.set(dStackRef.current, { y: 0, autoAlpha: 1 })
        if (dBalanceRef.current) dBalanceRef.current.textContent = "$4,280"
        const coins = dStackRef.current?.querySelectorAll(".osf-d-coin")
        if (coins) gsap.set(coins, { y: 0, scaleY: 1, autoAlpha: 1 })
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
        const skewInner = -LINE_SKEW_IN
        const xSign = i % 2 === 0 ? 1 : -1
        gsap.set(line, {
          skewX: LINE_SKEW_IN,
          x: `${xSign * LINE_SHIFT_X_VW}vw`,
          y: `${LINE_SHIFT_Y_VW}vw`,
          transformOrigin: "50% 88%",
        })
        gsap.set(inners, { skewX: skewInner, transformOrigin: "50% 88%" })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: "top bottom",
            end: "top 40%",
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
      })

      const buildStoryTimeline = contextSafe(() => {
        const ra = rectARef.current
        const checkPath = checkPathRef.current
        const boxFill = boxFillRef.current
        const boxInA = boxInARef.current
        const bBox = bBoxRef.current
        const bReceive = bReceiveRef.current
        const bTag = bTagRef.current
        const bStamp = bStampRef.current
        const bCoin = bCoinRef.current
        const cChart = cChartRef.current
        const cDot = cDotRef.current
        const cBars = cBarsRef.current
        const cLinePath = cLinePathRef.current
        const cNum = cNumRef.current
        const dStack = dStackRef.current
        const dBalance = dBalanceRef.current
        if (
          !ra ||
          !checkPath ||
          !boxFill ||
          !boxInA ||
          !bBox ||
          !bReceive ||
          !bTag ||
          !bStamp ||
          !bCoin ||
          !cChart ||
          !cDot ||
          !cBars ||
          !cLinePath ||
          !cNum ||
          !dStack ||
          !dBalance
        ) {
          return null
        }

        const barL = cBars.querySelector<SVGRectElement>(".osf-bar-left")
        const barM = cBars.querySelector<SVGRectElement>(".osf-bar-mid")
        const barR = cBars.querySelector<SVGRectElement>(".osf-bar-right")
        if (!barL || !barM || !barR) return null

        const coins = gsap.utils.toArray<HTMLElement>(dStack.querySelectorAll(".osf-d-coin"))

        const pathLen = checkPath.getTotalLength()
        gsap.set(checkPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen })
        gsap.set(boxFill, { fill: "#1e40af" })
        gsap.set(boxInA, { transformOrigin: "50% 50%", y: 0, autoAlpha: 1 })
        gsap.set(bReceive, { autoAlpha: 1 })
        gsap.set(bBox, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          y: "-100%",
          autoAlpha: 0,
        })
        gsap.set(bTag, { rotationX: -88, transformOrigin: "50% 100%", autoAlpha: 0 })
        gsap.set(bStamp, { scale: 0, rotation: -22, autoAlpha: 0 })
        gsap.set(bCoin, { y: 8, autoAlpha: 0, scale: 0.5 })
        gsap.set(cChart, { y: -120, autoAlpha: 0 })
        gsap.set(cDot, { left: "50%", xPercent: -50, top: "8%", y: 0, autoAlpha: 0 })
        gsap.set(barL, { attr: { y: 34, height: 22 } })
        gsap.set(barM, { attr: { y: 24, height: 32 } })
        gsap.set(barR, { attr: { y: 38, height: 18 } })
        const lineLen = cLinePath.getTotalLength()
        gsap.set(cLinePath, { strokeDasharray: lineLen, strokeDashoffset: lineLen })
        cNum.textContent = "0"
        gsap.set(dStack, { y: -100, autoAlpha: 0 })
        dBalance.textContent = "$0"
        coins.forEach((c) => gsap.set(c, { y: -20, scaleY: 0.15, autoAlpha: 0 }))

        const numTick = { v: 0 }
        const balTick = { b: 0 }

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          repeat: -1,
          repeatDelay: 0.45,
        })

        tl.addLabel("rectA")
          .to(checkPath, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" })
          .to(boxFill, { fill: COL.rectAGreen, duration: 0.28 }, "<0.28")
          .to(
            boxInA,
            {
              rotation: 5,
              x: 2,
              duration: 0.05,
              yoyo: true,
              repeat: 5,
              ease: "power1.inOut",
            },
            "-=0.08",
          )
          .add("pauseA", "+=0.4")
          .to(
            boxInA,
            { y: "55%", autoAlpha: 0, duration: 0.42, ease: "power2.in" },
            "pauseA",
          )
          .add("gapAB", "+=0.3")
          .to(bBox, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, "gapAB")
          .to(bBox, { y: 0, duration: 0.48, ease: "power2.out" }, "gapAB+=0.06")

        tl.addLabel("rectB")
          .to(bTag, { rotationX: 0, autoAlpha: 1, duration: 0.42, ease: "back.out(1.35)" }, ">")
          .to(bStamp, { scale: 1.05, rotation: -9, autoAlpha: 1, duration: 0.2, ease: "power4.out" })
          .to(bStamp, { scale: 1, duration: 0.06 })
          .to(bBox, { autoAlpha: 0, duration: 0.26, ease: "power2.out" })
          .to(bCoin, { y: 0, autoAlpha: 1, scale: 1, duration: 0.35, ease: "bounce.out" })
          .to(bCoin, { y: -8, duration: 0.1, ease: "power2.out" })
          .to(bCoin, { y: 0, duration: 0.16, ease: "bounce.out" })
          .add("exitB", "+=0.35")
          .to(bCoin, { y: "120%", autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "exitB")
          .add("gapBC", "+=0.3")
          .to(cChart, { autoAlpha: 1, duration: 0.16, ease: "power2.out" }, "gapBC")
          .to(cChart, { y: 0, duration: 0.5, ease: "power2.out" }, "gapBC+=0.06")

        tl.addLabel("rectC")
          .to(
            barR,
            {
              attr: { height: 52, y: 4 },
              duration: 0.9,
              ease: "elastic.out(1, 0.38)",
            },
            ">",
          )
          .to(cLinePath, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.48")
          .to(
            numTick,
            {
              v: 128,
              duration: 0.72,
              ease: "power1.out",
              onUpdate: () => {
                cNum.textContent = String(Math.round(numTick.v))
              },
            },
            "-=0.38",
          )
          .to(cDot, { autoAlpha: 1, duration: 0.12, ease: "power2.out" }, "-=0.25")
          .add("exitC", "+=0.35")
          .to(cDot, { y: "320%", autoAlpha: 0, duration: 0.48, ease: "power2.in" }, "exitC")
          .to(cChart, { y: "35%", autoAlpha: 0, duration: 0.42, ease: "power2.in" }, "exitC+=0.08")
          .add("gapCD", "+=0.3")
          .to(dStack, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, "gapCD")
          .to(dStack, { y: 0, duration: 0.48, ease: "power2.out" }, "gapCD+=0.06")

        tl.addLabel("rectD")
          .to(
            coins,
            {
              y: 0,
              scaleY: 1,
              autoAlpha: 1,
              duration: 0.2,
              stagger: 0.1,
              ease: "bounce.out",
            },
            ">",
          )
          .to(
            coins,
            {
              scaleY: 0.82,
              duration: 0.05,
              stagger: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            },
            "-=0.28",
          )
          .to(
            balTick,
            {
              b: 4280,
              duration: 0.85,
              ease: "power2.out",
              onUpdate: () => {
                dBalance.textContent = `$${Math.round(balTick.b).toLocaleString("en-US")}`
              },
            },
            "-=0.45",
          )
          .fromTo(
            dStack,
            { boxShadow: "0 0 0 0 rgba(139,92,246,0)" },
            {
              boxShadow: "0 0 36px 14px rgba(139,92,246,0.45)",
              duration: 0.38,
              ease: "power2.out",
            },
            "-=0.15",
          )
          .to(dStack, { boxShadow: "0 0 0 0 rgba(139,92,246,0)", duration: 0.35, ease: "power2.inOut" })

        return tl
      })

      const loopTl = buildStoryTimeline()
      if (loopTl) {
        rectLoopTlRef.current = loopTl
        loopTl.play(0)
      }

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
            end: "top 52%",
            scrub: 1,
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
      <style dangerouslySetInnerHTML={{ __html: OSF_STYLE }} />

      <div className="osf-lines">
        <div className="osf-line">
          <span className="osf-word">CUSTOMERS</span>
        </div>

        <div className="osf-line">
          <span className="osf-word">INVENTORY</span>
          <span
            ref={rectARef}
            className="osf-rect osf-rect--a osf-rect--after"
            style={{ backgroundColor: COL.rectA }}
          >
            <span className="osf-rect-inner">
              <div
                ref={boxInARef}
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="90%" height="90%" viewBox="0 0 40 32" style={{ overflow: "visible" }}>
                  <rect
                    ref={boxFillRef}
                    x="6"
                    y="6"
                    width="28"
                    height="22"
                    rx="2"
                    fill="#1e40af"
                    stroke="rgba(255,255,255,0.35)"
                  />
                  <path
                    ref={checkPathRef}
                    d="M12 17 L18 23 L30 11"
                    stroke="#fafafa"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </span>
          </span>
        </div>

        <div className="osf-line">
          <span className="osf-word">SUPPLIERS</span>
        </div>

        <div className="osf-line osf-line--rect-left">
          <span className="osf-rect osf-rect--b osf-rect--before" style={{ backgroundColor: COL.rectB }}>
            <span className="osf-rect-inner">
              <div
                ref={bReceiveRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  perspective: 400,
                }}
              >
                <div ref={bBoxRef} style={{ position: "absolute", width: "55%", height: "45%" }}>
                  <svg width="100%" height="100%" viewBox="0 0 36 28" preserveAspectRatio="xMidYMid meet">
                    <rect x="0" y="0" width="36" height="28" rx="2" fill="#b45309" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  </svg>
                </div>
                <div ref={bCoinRef} style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="70%" height="70%" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="12" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
                    <text x="14" y="17" textAnchor="middle" fill="#451a03" fontSize="9" fontWeight="700">
                      $
                    </text>
                  </svg>
                </div>
                <div
                  ref={bTagRef}
                  style={{
                    position: "absolute",
                    top: 1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "clamp(8px, 1.8vw, 14px)",
                    padding: "0.1em 0.25em",
                    borderRadius: "0.08em",
                    background: "rgba(254,243,199,0.95)",
                    color: "#78350f",
                    fontFamily: "system-ui,sans-serif",
                    fontWeight: 700,
                  }}
                >
                  SALE
                </div>
                <div
                  ref={bStampRef}
                  style={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.08em 0.2em",
                    border: `0.06em solid ${COL.stamp}`,
                    background: "rgba(239,68,68,0.95)",
                    color: "#fff",
                    fontSize: "clamp(8px, 2vw, 14px)",
                    fontFamily: "system-ui,sans-serif",
                    fontWeight: 900,
                    transform: "rotate(-10deg)",
                  }}
                >
                  SOLD
                </div>
              </div>
            </span>
          </span>
          <span className="osf-word">SALES</span>
        </div>

        <div className="osf-line">
          <span className="osf-word">USER ROLES</span>
        </div>

        <div className="osf-line">
          <span className="osf-word">INSIGHTS</span>
          <span className="osf-rect osf-rect--c osf-rect--after" style={{ backgroundColor: COL.rectC }}>
            <span className="osf-rect-inner">
              <div
                ref={cChartRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 2,
                  opacity: 0,
                }}
              >
                <div
                  ref={cDotRef}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "8%",
                    width: "clamp(6px, 1.2vw, 12px)",
                    height: "clamp(6px, 1.2vw, 12px)",
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                    background: "radial-gradient(circle at 30% 30%, #fde68a, #f59e0b)",
                    boxShadow: "0 0 8px rgba(245, 158, 11, 0.85)",
                  }}
                />
                <span
                  ref={cNumRef}
                  style={{
                    fontSize: "clamp(8px, 1.6vw, 13px)",
                    fontFamily: "system-ui,sans-serif",
                    fontWeight: 700,
                    color: "rgba(240,253,250,0.95)",
                  }}
                >
                  0
                </span>
                <svg ref={cBarsRef} width="95%" height="65%" viewBox="0 0 100 56" preserveAspectRatio="xMidYMax meet">
                  <rect className="osf-bar-left" x="10" y="34" width="16" height="22" rx="2" fill="#0f766e" />
                  <rect className="osf-bar-mid" x="42" y="24" width="16" height="32" rx="2" fill="#2dd4bf" />
                  <rect className="osf-bar-right" x="74" y="38" width="16" height="18" rx="2" fill="#99f6e4" />
                  <path
                    ref={cLinePathRef}
                    d="M 8 40 Q 38 28 52 20 T 94 10"
                    stroke="#ccfbf1"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </span>
          </span>
        </div>

        <div className="osf-line">
          <span className="osf-word">EXPENSES</span>
        </div>

        <div className="osf-line osf-line--rect-left">
          <span className="osf-rect osf-rect--d osf-rect--before" style={{ backgroundColor: COL.rectD }}>
            <span className="osf-rect-inner">
              <div
                ref={dStackRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  opacity: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="osf-d-coin"
                      style={{
                        width: "78%",
                        height: "clamp(3px, 0.9vw, 8px)",
                        borderRadius: "0.03em",
                        border: "1px solid rgba(76,29,149,0.5)",
                        background: "linear-gradient(to bottom, #c4b5fd, #6d28d9)",
                      }}
                    />
                  ))}
                </div>
                <span
                  ref={dBalanceRef}
                  style={{
                    fontSize: "clamp(8px, 1.6vw, 13px)",
                    fontFamily: "system-ui,sans-serif",
                    fontWeight: 700,
                    color: "rgba(245,243,255,0.95)",
                  }}
                >
                  $0
                </span>
              </div>
            </span>
          </span>
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
