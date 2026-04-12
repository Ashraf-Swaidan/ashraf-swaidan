import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { forwardRef, useRef } from "react"

import { RECT_B_BG, RECT_B_MOTION } from "./colors"
import "./SalesRect.css"

export const SalesRect = forwardRef<HTMLSpanElement>(function SalesRect(_, ref) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<SVGLineElement>(null)
  const line2Ref = useRef<SVGLineElement>(null)
  const line3Ref = useRef<SVGLineElement>(null)
  const line4Ref = useRef<SVGLineElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const lines = [line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current].filter(Boolean) as SVGLineElement[]
        lines.forEach((ln) => {
          const len = ln.getTotalLength()
          gsap.set(ln, { strokeDashoffset: 0, strokeDasharray: len })
        })
        return
      }

      const l1 = line1Ref.current
      const l2 = line2Ref.current
      const l3 = line3Ref.current
      const l4 = line4Ref.current
      if (!l1 || !l2 || !l3 || !l4) return

      const len1 = l1.getTotalLength()
      const len2 = l2.getTotalLength()
      const len3 = l3.getTotalLength()
      const len4 = l4.getTotalLength()
      const lines = [
        { el: l1, len: len1 },
        { el: l2, len: len2 },
        { el: l3, len: len3 },
        { el: l4, len: len4 },
      ]

      lines.forEach(({ el, len }) => {
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, repeat: -1, repeatDelay: 0.5 })

      tl.to(lines.map((x) => x.el), {
        strokeDashoffset: 0,
        duration: 0.36,
        stagger: 0.08,
        ease: "power2.out",
      })
        .add("hold", "+=0.9")
        .to(l4, { strokeDashoffset: len4, duration: 0.28, ease: "power2.in" }, "hold")
        .to(l3, { strokeDashoffset: len3, duration: 0.28, ease: "power2.in" }, "hold+=0.06")
        .to(l2, { strokeDashoffset: len2, duration: 0.28, ease: "power2.in" }, "hold+=0.12")
        .to(l1, { strokeDashoffset: len1, duration: 0.28, ease: "power2.in" }, "hold+=0.18")

      return () => {
        tl.kill()
      }
    },
    { scope: wrapRef },
  )

  const stroke = RECT_B_MOTION

  return (
    <span ref={ref} className="osf-rect osf-rect--b osf-rect--before" style={{ backgroundColor: RECT_B_BG }}>
      <span className="osf-rect-inner">
        <div ref={wrapRef} className="sales-rect__wrap">
          <svg className="sales-rect__svg" viewBox="0 0 100 56" preserveAspectRatio="xMidYMid meet">
            <line
              ref={line1Ref}
              x1={18}
              y1={20}
              x2={64}
              y2={20}
              stroke={stroke}
              strokeWidth={1.1}
              strokeLinecap="round"
            />
            <line
              ref={line2Ref}
              x1={18}
              y1={27}
              x2={56}
              y2={27}
              stroke={stroke}
              strokeWidth={1.1}
              strokeLinecap="round"
            />
            <line
              ref={line3Ref}
              x1={18}
              y1={34}
              x2={72}
              y2={34}
              stroke={stroke}
              strokeWidth={1.1}
              strokeLinecap="round"
            />
            <line
              ref={line4Ref}
              x1={18}
              y1={43}
              x2={84}
              y2={43}
              stroke={stroke}
              strokeWidth={1.65}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </span>
    </span>
  )
})
