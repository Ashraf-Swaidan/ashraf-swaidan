import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { forwardRef, useRef } from "react"

import { RECT_A_BG, RECT_A_MOTION } from "./colors"
import "./InventoryRect.css"

export const InventoryRect = forwardRef<HTMLSpanElement>(function InventoryRect(_, ref) {
  const barcodeGroupRef = useRef<SVGGElement>(null)
  const solidBarGroupRef = useRef<SVGGElement>(null)
  const scannedTextRef = useRef<SVGTextElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const bars = barcodeGroupRef.current?.querySelectorAll<SVGRectElement>(".osf-barcode-bar")
        bars?.forEach((el) => gsap.set(el, { opacity: 1 }))
        if (solidBarGroupRef.current) gsap.set(solidBarGroupRef.current, { scaleX: 1, transformOrigin: "50% 50%" })
        if (scannedTextRef.current) gsap.set(scannedTextRef.current, { autoAlpha: 1 })
        return
      }

      const barcodeG = barcodeGroupRef.current
      const solidG = solidBarGroupRef.current
      const scanned = scannedTextRef.current
      const bars = barcodeG?.querySelectorAll<SVGRectElement>(".osf-barcode-bar")
      if (!barcodeG || !solidG || !scanned || !bars?.length) return

      gsap.set(bars, { opacity: 0 })
      gsap.set(solidG, { scaleX: 0, transformOrigin: "50% 50%" })
      gsap.set(scanned, { autoAlpha: 0 })

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, repeat: -1, repeatDelay: 0.35 })

      tl.to(bars, { opacity: 1, stagger: 0.022, duration: 0.34, ease: "power2.out" })
        .add("resolveSku", "+=0.4")
        .to(bars, { opacity: 0, duration: 0.2, stagger: 0.012, ease: "power2.in" }, "resolveSku")
        .to(solidG, { scaleX: 1, duration: 0.5, ease: "power2.out" }, "resolveSku+=0.05")
        .to(scanned, { autoAlpha: 1, duration: 0.38, ease: "power2.out" }, "resolveSku+=0.18")
        .add("held", "+=1.15")
        .to(scanned, { autoAlpha: 0, duration: 0.32, ease: "power2.in" }, "held")
        .to(solidG, { scaleX: 0, duration: 0.38, ease: "power2.in" }, "held+=0.08")

      return () => {
        tl.kill()
      }
    },
    { scope: barcodeGroupRef },
  )

  return (
    <span ref={ref} className="osf-rect osf-rect--a osf-rect--after" style={{ backgroundColor: RECT_A_BG }}>
      <span className="osf-rect-inner">
        <div className="inv-rect__stage">
          <svg className="inv-rect__svg" viewBox="0 0 100 56" preserveAspectRatio="xMidYMid meet">
            <g ref={barcodeGroupRef}>
              {Array.from({ length: 18 }, (_, i) => {
                const x = 14 + i * 3.95 + (i % 3) * 0.4
                const w = 0.85 + (i % 5) * 0.32
                return (
                  <rect
                    key={i}
                    className="osf-barcode-bar"
                    x={x}
                    y={14}
                    width={w}
                    height={25}
                    rx={0.35}
                    fill={RECT_A_MOTION}
                    opacity={0}
                  />
                )
              })}
            </g>
            <text
              ref={scannedTextRef}
              x={50}
              y={18}
              textAnchor="middle"
              fill={RECT_A_MOTION}
              style={{ fontFamily: "system-ui, sans-serif", fontSize: "6.5px", fontWeight: 650 }}
              opacity={0}
            >
              Scanned
            </text>
            <g ref={solidBarGroupRef} transform="translate(50, 30)">
              <rect x="-36" y="-1.75" width="72" height="3.5" rx={0.75} fill={RECT_A_MOTION} />
            </g>
          </svg>
        </div>
      </span>
    </span>
  )
})
