import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { forwardRef, useRef } from "react"

import { RECT_C_BG, RECT_C_MOTION } from "./colors"
import "./InsightsRect.css"

export const InsightsRect = forwardRef<HTMLSpanElement>(function InsightsRect(_, ref) {
  const stageRef = useRef<HTMLDivElement>(null)
  const thresholdRef = useRef<SVGLineElement>(null)
  const sparkRef = useRef<SVGPathElement>(null)
  const spark2Ref = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const revRef = useRef<SVGTextElement>(null)
  const dollarRef = useRef<SVGTextElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (thresholdRef.current) {
          const lt = thresholdRef.current.getTotalLength()
          gsap.set(thresholdRef.current, { strokeDashoffset: 0, strokeDasharray: lt })
        }
        for (const p of [sparkRef.current, spark2Ref.current]) {
          if (p) {
            const ls = p.getTotalLength()
            gsap.set(p, { strokeDashoffset: 0, strokeDasharray: ls })
          }
        }
        if (dotRef.current) gsap.set(dotRef.current, { autoAlpha: 1 })
        if (revRef.current) gsap.set(revRef.current, { autoAlpha: 0.75 })
        if (dollarRef.current) gsap.set(dollarRef.current, { autoAlpha: 0.75 })
        return
      }

      const th = thresholdRef.current
      const spark = sparkRef.current
      const spark2 = spark2Ref.current
      const dot = dotRef.current
      const rev = revRef.current
      const dollar = dollarRef.current
      if (!th || !spark || !spark2 || !dot || !rev || !dollar) return

      const lt = th.getTotalLength()
      const ls = spark.getTotalLength()
      const ls2 = spark2.getTotalLength()
      gsap.set(th, { strokeDasharray: lt, strokeDashoffset: lt })
      gsap.set(spark, { strokeDasharray: ls, strokeDashoffset: ls })
      gsap.set(spark2, { strokeDasharray: ls2, strokeDashoffset: ls2 })
      gsap.set(dot, { autoAlpha: 0 })
      gsap.set([rev, dollar], { autoAlpha: 0 })

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, repeat: -1, repeatDelay: 0.45 })

      tl.to(th, { strokeDashoffset: 0, duration: 0.42, ease: "power2.out" })
        .to(spark, { strokeDashoffset: 0, duration: 0.72, ease: "power2.inOut" }, "-=0.1")
        .to(spark2, { strokeDashoffset: 0, duration: 0.68, ease: "power2.inOut" }, "-=0.5")
        .to(dot, { autoAlpha: 1, duration: 0.1, ease: "none" }, "-=0.2")
        .to([rev, dollar], { autoAlpha: 0.72, duration: 0.35, ease: "power2.out", stagger: 0.06 }, "-=0.12")
        .add("afterCross", "+=0.95")
        .to([rev, dollar], { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, "afterCross")
        .to(dot, { autoAlpha: 0, duration: 0.28, ease: "power2.in" }, "afterCross+=0.04")
        .to(spark, { strokeDashoffset: ls, duration: 0.42, ease: "power2.in" }, "afterCross+=0.08")
        .to(spark2, { strokeDashoffset: ls2, duration: 0.4, ease: "power2.in" }, "afterCross+=0.12")
        .to(th, { strokeDashoffset: lt, duration: 0.38, ease: "power2.in" }, "afterCross+=0.16")

      return () => {
        tl.kill()
      }
    },
    { scope: stageRef },
  )

  return (
    <span ref={ref} className="osf-rect osf-rect--c osf-rect--after" style={{ backgroundColor: RECT_C_BG }}>
      <span className="osf-rect-inner">
        <div ref={stageRef} className="insights-rect__stage">
          <svg className="insights-rect__svg" viewBox="0 0 100 56" preserveAspectRatio="xMidYMid meet">
            <line
              ref={thresholdRef}
              x1={10}
              y1={34}
              x2={90}
              y2={34}
              stroke={RECT_C_MOTION}
              strokeWidth={0.9}
              strokeDasharray="4 3"
              opacity={0.65}
            />
            <path
              ref={sparkRef}
              d="M 12 46 L 38 40 L 52 34 L 66 28 L 88 18"
              fill="none"
              stroke={RECT_C_MOTION}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={spark2Ref}
              d="M 14 48 L 34 45 L 50 40 L 68 36 L 86 30"
              fill="none"
              stroke={RECT_C_MOTION}
              strokeWidth={0.95}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.55}
            />
            <circle ref={dotRef} cx={52} cy={34} r={2.4} fill={RECT_C_BG} opacity={0} />
            <text
              ref={revRef}
              x={13}
              y={53.5}
              fill={RECT_C_MOTION}
              className="insights-rect__micro"
              opacity={0}
            >
              rev
            </text>
            <text
              ref={dollarRef}
              x={87}
              y={53.5}
              textAnchor="end"
              fill={RECT_C_MOTION}
              className="insights-rect__micro"
              opacity={0}
            >
              $
            </text>
          </svg>
        </div>
      </span>
    </span>
  )
})
