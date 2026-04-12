import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import type { CSSProperties } from "react"
import { forwardRef, useRef } from "react"

import { RECT_D_BG, RECT_D_MOTION } from "./colors"
import "./WalletsRect.css"

export const WalletsRect = forwardRef<HTMLSpanElement>(function WalletsRect(_, ref) {
  const stackRef = useRef<HTMLDivElement>(null)
  const balanceRef = useRef<HTMLSpanElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[]
        rows.forEach((r) => gsap.set(r, { autoAlpha: 1 }))
        if (rowRefs.current[3]) {
          gsap.set(rowRefs.current[3], { backgroundColor: RECT_D_MOTION, color: RECT_D_BG })
        }
        if (balanceRef.current) balanceRef.current.textContent = "$4,280"
        return
      }

      const dBal = balanceRef.current
      const rows = rowRefs.current.filter((r): r is HTMLDivElement => r != null)
      if (rows.length < 4 || !dBal) return

      const rowTotal = rows[3]
      const rTop = [rows[0], rows[1], rows[2]]
      const balTick = { b: 0 }

      gsap.set(rows, { autoAlpha: 1 })
      rowTotal.style.backgroundColor = "transparent"
      rowTotal.style.color = RECT_D_MOTION
      dBal.textContent = "$0"

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, repeat: -1, repeatDelay: 0.35 })

      tl.to(rTop, { autoAlpha: 1, duration: 0.28, stagger: 0.1, ease: "power2.out" })
        .to(rowTotal, { autoAlpha: 1, duration: 0.22, ease: "power2.out" }, "<0.06")
        .to(
          rowTotal,
          { backgroundColor: RECT_D_MOTION, color: RECT_D_BG, duration: 0.35, ease: "power2.out" },
          "+=0.25",
        )
        .to(
          balTick,
          {
            b: 4280,
            duration: 0.85,
            ease: "power2.out",
            onUpdate: () => {
              dBal.textContent = `$${Math.round(balTick.b).toLocaleString("en-US")}`
            },
          },
          "-=0.1",
        )
        .add("peak", "+=1.35")
        .to(
          balTick,
          {
            b: 0,
            duration: 0.95,
            ease: "power2.inOut",
            onUpdate: () => {
              dBal.textContent = `$${Math.round(balTick.b).toLocaleString("en-US")}`
            },
          },
          "peak",
        )
        .to(rowTotal, { backgroundColor: "transparent", color: RECT_D_MOTION, duration: 0.4, ease: "power2.inOut" }, "peak+=0.55")
        .add("rest", "+=0.65")
        .add(() => {
          balTick.b = 0
          dBal.textContent = "$0"
        }, "rest")

      return () => {
        tl.kill()
      }
    },
    { scope: stackRef },
  )

  return (
    <span
      ref={ref}
      className="osf-rect osf-rect--d osf-rect--before"
      style={
        {
          backgroundColor: RECT_D_BG,
          "--wallets-line": RECT_D_MOTION,
        } as CSSProperties
      }
    >
      <span className="osf-rect-inner">
        <div ref={stackRef} className="wallets-rect__stack">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              className="wallets-rect__row"
            >
              — — —
            </div>
          ))}
          <div
            ref={(el) => {
              rowRefs.current[3] = el
            }}
            className="wallets-rect__total"
          >
            <span>Total</span>
            <span ref={balanceRef} className="wallets-rect__amount">
              $0
            </span>
          </div>
        </div>
      </span>
    </span>
  )
})
