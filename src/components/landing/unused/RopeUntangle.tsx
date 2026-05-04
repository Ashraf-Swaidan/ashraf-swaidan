import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { interpolate } from "flubber"
import { useId, useRef } from "react"

gsap.registerPlugin(useGSAP)

/**
 * Overhand knot — rope enters from left, stays horizontal through the
 * crossing zone (x≈262-266, y=185), makes a compact loop (CW), returns
 * back through the crossing, threads rightward and exits. The path
 * self-intersects at ≈(265, 185) which is what creates the knot visual.
 *
 * Loop metrics (800×360 viewBox):
 *   Top  ≈ y 108   Bottom ≈ y 265   Width ≈ 162 px   Height ≈ 157 px
 *   Centered at ≈ (343, 185)
 */
const PATH_KNOTTED =
  "M 60 185" +
  " C 130 185 200 185 262 185" +    // horizontal approach through crossing zone
  " C 288 185 304 162 316 140" +    // curve up into loop
  " C 332 114 362 108 388 124" +    // over the top
  " C 414 140 424 166 420 194" +    // right side coming down
  " C 416 223 400 246 372 256" +    // bottom-right
  " C 345 265 315 260 296 244" +    // bottom, heading left
  " C 276 228 265 208 266 186" +    // returning up — crosses horizontal at ≈(265,185)
  " C 270 162 296 152 322 163" +    // thread-through to the right
  " C 352 175 410 181 510 182" +    // exit stream
  " C 620 183 685 184 740 185"      // far-right tail

/** Single relaxed S-curve — matching endpoints (60,185) → (740,185). */
const PATH_RESOLVED =
  "M 60 185 C 228 50 572 320 740 185"

const STROKE_TENSE = "#C44B37"
const STROKE_FREE = "#1D9E75"

const LABEL = "I untangle what others gave up on."

function lerpRgb(t: number, a: readonly [number, number, number], b: readonly [number, number, number]) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r} ${g} ${bl})`
}

const RGB_TENSE: readonly [number, number, number] = [196, 75, 55]
const RGB_FREE: readonly [number, number, number] = [29, 158, 117]

export function RopeUntangle() {
  const filterId = `ut-rope-${useId().replace(/:/g, "")}`
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const ropeGroupRef = useRef<SVGGElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const playRef = useRef<() => void>(() => {})

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current
      const path = pathRef.current
      const ropeGroup = ropeGroupRef.current
      if (!root || !path || !ropeGroup || !contextSafe) return

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      const applyReduced = contextSafe(() => {
        path.setAttribute("d", PATH_RESOLVED)
        path.setAttribute("stroke", STROKE_FREE)
        gsap.set(root.querySelectorAll(".ut-char"), { opacity: 1, y: 0 })
      })

      const play = contextSafe(() => {
        timelineRef.current?.kill()

        if (reduceMotion) {
          applyReduced()
          return
        }

        const mix = interpolate(PATH_KNOTTED, PATH_RESOLVED, { maxSegmentLength: 5 })
        const morph = { t: 0 }

        path.setAttribute("d", PATH_KNOTTED)
        path.setAttribute("stroke", STROKE_TENSE)

        const chars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".ut-char"))

        const tl = gsap.timeline({ defaults: { ease: "none" } })

        tl.set(chars, { opacity: 0, y: 6 })
          .set(ropeGroup, { scaleX: 1, scaleY: 1, rotation: 0, transformOrigin: "343px 185px" })
          .to(morph, {
            t: 1,
            duration: 5.1,
            ease: "power2.inOut",
            onUpdate: () => {
              path.setAttribute("d", mix(morph.t))
              path.setAttribute("stroke", lerpRgb(morph.t, RGB_TENSE, RGB_FREE))
            },
          })
          .to(
            chars,
            {
              opacity: 1,
              y: 0,
              duration: 0.42,
              stagger: 0.022,
              ease: "power2.out",
            },
            0.25,
          )
          .to(
            ropeGroup,
            {
              scaleY: 1.04,
              scaleX: 0.985,
              duration: 0.14,
              ease: "power1.out",
            },
            "-=0.02",
          )
          .to(ropeGroup, {
            scaleY: 1,
            scaleX: 1,
            duration: 0.95,
            ease: "elastic.out(1.15, 0.38)",
          })

        timelineRef.current = tl
      })

      playRef.current = play
      play()

      return () => {
        timelineRef.current?.kill()
        timelineRef.current = null
      }
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-10 font-sans text-foreground"
    >
      <p
        className="min-h-14 text-center text-lg leading-snug font-medium tracking-tight text-balance md:text-xl"
        aria-label={LABEL}
      >
        {LABEL.split("").map((ch, i) => (
          <span key={i} className="ut-char inline-block whitespace-pre opacity-0">
            {ch === " " ? "\u00a0" : ch}
          </span>
        ))}
      </p>

      <svg
        className="w-full max-w-[800px] select-none"
        viewBox="0 0 800 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.12" />
          </filter>
        </defs>
        <g ref={ropeGroupRef}>
          <path
            ref={pathRef}
            d={PATH_KNOTTED}
            stroke={STROKE_TENSE}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${filterId})`}
          />
        </g>
      </svg>

      <p className="max-w-md text-center text-sm text-muted-foreground">
        Loops work through each other — no cuts, no fades — until one calm line remains.
      </p>

      <button
        type="button"
        className="rounded-md border border-border bg-transparent px-6 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
        onClick={() => playRef.current()}
      >
        Replay unknot
      </button>
    </div>
  )
}

export default RopeUntangle
