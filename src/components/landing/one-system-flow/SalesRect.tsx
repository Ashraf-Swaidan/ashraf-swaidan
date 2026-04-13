import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { forwardRef, useRef } from "react"

import { RECT_B_BG, RECT_B_MOTION } from "./colors"
import "./SalesRect.css"

const RECEIPT_HIDDEN_Y = 50

/** Thermal slip: zigzag top, straight sides and bottom (viewBox coords). */
const RECEIPT_PAPER_D =
  "M 20 13 L 22.5 9.5 L 25 13 L 27.5 9.5 L 30 13 L 32.5 9.5 L 35 13 L 37.5 9.5 L 40 13 L 42.5 9.5 L 45 13 L 47.5 9.5 L 50 13 L 52.5 9.5 L 55 13 L 57.5 9.5 L 60 13 L 62.5 9.5 L 65 13 L 67.5 9.5 L 70 13 L 72.5 9.5 L 75 13 L 77.5 9.5 L 80 13 L 80 54 L 20 54 Z"

const BTN_CX = 50
/** Vertical center of SELL control (rect y + half height). */
const BTN_CY = 34

export const SalesRect = forwardRef<HTMLSpanElement>(function SalesRect(_, ref) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const orderRef = useRef<SVGGElement>(null)
  const checkoutRef = useRef<SVGGElement>(null)
  const sellBtnRef = useRef<SVGGElement>(null)
  const sellLabelRef = useRef<SVGTextElement>(null)
  const rippleRef = useRef<SVGCircleElement>(null)
  const checkRef = useRef<SVGPathElement>(null)
  const receiptRef = useRef<SVGGElement>(null)
  const receiptPrintRef = useRef<SVGGElement>(null)
  const rLine1Ref = useRef<SVGLineElement>(null)
  const rLine2Ref = useRef<SVGLineElement>(null)
  const rLine3Ref = useRef<SVGLineElement>(null)
  const rLine4Ref = useRef<SVGLineElement>(null)

  useGSAP(
    () => {
      const order = orderRef.current
      const checkout = checkoutRef.current
      const sellBtn = sellBtnRef.current
      const sellLabel = sellLabelRef.current
      const ripple = rippleRef.current
      const check = checkRef.current
      const receipt = receiptRef.current
      const receiptPrint = receiptPrintRef.current
      const rl1 = rLine1Ref.current
      const rl2 = rLine2Ref.current
      const rl3 = rLine3Ref.current
      const rl4 = rLine4Ref.current

      if (!order || !checkout || !sellBtn || !sellLabel || !ripple || !check || !receipt || !receiptPrint || !rl1 || !rl2 || !rl3 || !rl4)
        return

      const rLines = [rl1, rl2, rl3, rl4]
      const rLens = rLines.map((ln) => ln.getTotalLength())
      const checkLen = check.getTotalLength()
      const btnOrigin = `${BTN_CX} ${BTN_CY}`

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(receipt, { y: RECEIPT_HIDDEN_Y })
        gsap.set(order, { autoAlpha: 1, y: 0 })
        gsap.set(checkout, { autoAlpha: 1 })
        gsap.set(sellBtn, { scale: 1, autoAlpha: 1, svgOrigin: btnOrigin })
        gsap.set(sellLabel, { autoAlpha: 0 })
        gsap.set(ripple, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" })
        gsap.set(check, { strokeDashoffset: 0, strokeDasharray: checkLen })
        gsap.set(receiptPrint, { autoAlpha: 1 })
        rLines.forEach((ln, i) => {
          gsap.set(ln, { strokeDashoffset: 0, strokeDasharray: rLens[i] })
        })
        return
      }

      rLines.forEach((ln, i) => {
        gsap.set(ln, { strokeDasharray: rLens[i], strokeDashoffset: rLens[i] })
      })
      gsap.set(check, { strokeDasharray: checkLen, strokeDashoffset: checkLen })

      gsap.set(receipt, { y: RECEIPT_HIDDEN_Y })
      gsap.set(receiptPrint, { autoAlpha: 0 })
      gsap.set(order, { autoAlpha: 0, y: 6 })
      gsap.set(checkout, { autoAlpha: 0 })
      gsap.set(sellBtn, { autoAlpha: 0, scale: 0.92, svgOrigin: btnOrigin })
      gsap.set(sellLabel, { autoAlpha: 1 })
      gsap.set(ripple, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" })

      const strokeEase = "power2.out"

      const tl = gsap.timeline({
        defaults: { ease: strokeEase },
        repeat: -1,
        repeatDelay: 0.55,
      })

      tl.set(check, { strokeDashoffset: checkLen }, 0)
        .set(sellLabel, { autoAlpha: 1 }, 0)
        .set(ripple, { scale: 0, autoAlpha: 0 }, 0)
        .set(sellBtn, { scale: 1, svgOrigin: btnOrigin }, 0)
        .fromTo(order, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.42 }, 0)
        .fromTo(checkout, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34 }, 0.08)
        .fromTo(
          sellBtn,
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, duration: 0.36, ease: "back.out(1.2)", svgOrigin: btnOrigin },
          0.18,
        )
        .add("tap", "+=0.52")
        .to(sellBtn, { scale: 0.9, duration: 0.08, ease: "power2.in", svgOrigin: btnOrigin }, "tap")
        .to(sellBtn, { scale: 1, duration: 0.2, ease: "elastic.out(1,0.35)", svgOrigin: btnOrigin }, ">")
        .fromTo(
          ripple,
          { scale: 0, autoAlpha: 0.42 },
          {
            scale: 2.05,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.out",
            transformOrigin: "50% 50%",
          },
          "<0.02",
        )
        .to(sellLabel, { autoAlpha: 0, duration: 0.11, ease: "power2.in" }, "<0.03")
        .fromTo(
          check,
          { strokeDashoffset: checkLen },
          { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" },
          "<0.06",
        )
        .add("soldHold", "+=0.38")
        .to(order, { autoAlpha: 0, y: -5, duration: 0.32, ease: "power2.in" }, "soldHold")
        .fromTo(
          receipt,
          { y: RECEIPT_HIDDEN_Y },
          { y: 0, duration: 0.62, ease: "power2.out" },
          "-=0.08",
        )
        .add("receiptUp", ">")
        .to(receiptPrint, { autoAlpha: 1, duration: 0.36, ease: "power2.out" }, "receiptUp-=0.3")
        .to(
          rLines,
          { strokeDashoffset: 0, duration: 0.34, stagger: 0.075, ease: "power2.out" },
          "receiptUp-=0.32",
        )
        .add("receiptHold", "+=0.92")
        .to(receiptPrint, { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, "receiptHold")
        .to(rl4, { strokeDashoffset: rLens[3], duration: 0.26, ease: "power2.in" }, "receiptHold+=0.06")
        .to(rl3, { strokeDashoffset: rLens[2], duration: 0.26, ease: "power2.in" }, "receiptHold+=0.1")
        .to(rl2, { strokeDashoffset: rLens[1], duration: 0.26, ease: "power2.in" }, "receiptHold+=0.14")
        .to(rl1, { strokeDashoffset: rLens[0], duration: 0.26, ease: "power2.in" }, "receiptHold+=0.18")
        .to(
          receipt,
          { y: RECEIPT_HIDDEN_Y, duration: 0.52, ease: "power2.in" },
          "receiptHold+=0.36",
        )

      return () => {
        tl.kill()
      }
    },
    { scope: wrapRef },
  )

  const stroke = RECT_B_MOTION
  const btnLabelFill = RECT_B_BG
  const paperFill = "rgba(255, 255, 255, 0.62)"
  const paperEdge = "rgba(35, 0, 42, 0.07)"
  const rowLineOpacity = 0.4

  return (
    <span ref={ref} className="osf-rect osf-rect--b osf-rect--before" style={{ backgroundColor: RECT_B_BG }}>
      <span className="osf-rect-inner">
        <div ref={wrapRef} className="sales-rect__wrap">
          <svg className="sales-rect__svg" viewBox="0 0 100 56" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="sales-receipt-edge" x="-8%" y="-8%" width="116%" height="116%">
                <feDropShadow dx="0" dy="0.8" stdDeviation="0.35" floodColor="rgb(35,0,42)" floodOpacity="0.12" />
              </filter>
            </defs>

            <g ref={orderRef}>
              <g ref={checkoutRef}>
                <text x={9} y={12.6} className="sales-rect__checkout-col">
                  PRODUCT
                </text>
                <text x={91} y={12.6} textAnchor="end" className="sales-rect__checkout-col">
                  QTY
                </text>
                <line x1={9} y1={14.6} x2={91} y2={14.6} stroke={stroke} strokeWidth={0.6} opacity={0.24} />
                <line
                  x1={9}
                  y1={17.2}
                  x2={64}
                  y2={17.2}
                  stroke={stroke}
                  strokeWidth={1.1}
                  strokeLinecap="round"
                  opacity={rowLineOpacity}
                />
                <line
                  x1={9}
                  y1={20.2}
                  x2={52}
                  y2={20.2}
                  stroke={stroke}
                  strokeWidth={1.1}
                  strokeLinecap="round"
                  opacity={rowLineOpacity * 0.85}
                />
                <text x={91} y={20.4} textAnchor="end" className="sales-rect__checkout-qty">
                  1
                </text>

                <g ref={sellBtnRef}>
                  <rect
                    x={20}
                    y={25.5}
                    width={60}
                    height={17}
                    rx={4}
                    fill={stroke}
                    stroke={stroke}
                    strokeWidth={0.4}
                  />
                  <circle ref={rippleRef} cx={BTN_CX} cy={BTN_CY} r={10} fill={btnLabelFill} opacity={0} />
                  <text
                    ref={sellLabelRef}
                    x={BTN_CX}
                    y={BTN_CY + 4.1}
                    textAnchor="middle"
                    className="sales-rect__btn-label"
                  >
                    SELL
                  </text>
                  <path
                    ref={checkRef}
                    d={`M ${BTN_CX - 7.5} ${BTN_CY} L ${BTN_CX - 2.5} ${BTN_CY + 5} L ${BTN_CX + 8.5} ${BTN_CY - 5.8}`}
                    fill="none"
                    stroke={btnLabelFill}
                    strokeWidth={1.65}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>

            <g ref={receiptRef}>
              <g transform="translate(50 33.5) scale(1.07 1.055) translate(-50 -33.5)">
                <path d={RECEIPT_PAPER_D} fill={paperFill} stroke={paperEdge} strokeWidth={0.45} filter="url(#sales-receipt-edge)" />
                <g ref={receiptPrintRef}>
                <text x={50} y={16.2} textAnchor="middle" className="sales-rect__micro sales-rect__micro--header">
                  RECEIPT
                </text>
                <text x={22} y={20} className="sales-rect__micro sales-rect__micro--header">
                  ITEM
                </text>
                <text x={50} y={20} textAnchor="middle" className="sales-rect__micro sales-rect__micro--header">
                  QTY
                </text>
                <text x={77} y={20} textAnchor="end" className="sales-rect__micro sales-rect__micro--header">
                  AMT
                </text>
                <line x1={22} y1={21.2} x2={77} y2={21.2} stroke={stroke} strokeWidth={0.45} opacity={0.28} />

                <line
                  ref={rLine1Ref}
                  x1={22}
                  y1={25.5}
                  x2={58}
                  y2={25.5}
                  stroke={stroke}
                  strokeWidth={1.05}
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <text x={50} y={26.2} textAnchor="middle" className="sales-rect__micro" opacity={0.85}>
                  1
                </text>
                <text x={77} y={26.2} textAnchor="end" className="sales-rect__micro" opacity={0.85}>
                  24.00
                </text>

                <line
                  ref={rLine2Ref}
                  x1={22}
                  y1={32}
                  x2={52}
                  y2={32}
                  stroke={stroke}
                  strokeWidth={0.95}
                  strokeLinecap="round"
                  opacity={0.72}
                />

                <line
                  ref={rLine3Ref}
                  x1={22}
                  y1={38.5}
                  x2={48}
                  y2={38.5}
                  stroke={stroke}
                  strokeWidth={0.95}
                  strokeLinecap="round"
                  opacity={0.52}
                />

                <text x={22} y={43.5} className="sales-rect__micro sales-rect__micro--soft">
                  TOTAL
                </text>
                <text x={77} y={43.5} textAnchor="end" className="sales-rect__micro">
                  $24.00
                </text>
                <line
                  ref={rLine4Ref}
                  x1={22}
                  y1={45.5}
                  x2={77}
                  y2={45.5}
                  stroke={stroke}
                  strokeWidth={1.65}
                  strokeLinecap="round"
                  opacity={0.95}
                />

                <g opacity={0.85} stroke={stroke} strokeWidth={0.95}>
                  {[
                    22.5, 23.6, 24.4, 25.8, 26.3, 27.1, 28.4, 29.2, 30.5, 31.1, 32.0, 33.2, 34.0, 35.1, 36.4, 37.2, 38.0, 39.3,
                    40.1, 41.4, 42.0, 43.2, 44.5, 45.3, 46.8, 47.2, 48.5, 49.1, 50.4, 51.2, 52.0, 53.4, 54.0, 55.2, 56.5, 57.1,
                    58.4, 59.2, 60.0, 61.3, 62.1, 63.4, 64.2, 65.5, 66.3, 67.0, 68.4, 69.2, 70.5, 71.1, 72.3, 73.0, 74.5, 75.2,
                    76.4,
                  ].map((x, i) => (
                    <line key={i} x1={x} y1={48.8} x2={x} y2={53 + (i % 3) * 0.35} strokeLinecap="round" />
                  ))}
                </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </span>
    </span>
  )
})
