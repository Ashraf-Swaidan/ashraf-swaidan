import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef, type CSSProperties } from "react"

import type { HeroMarqueeTheme } from "@/components/landing/hero-marquee-data"
import { cn } from "@/lib/utils"

export type AnimatedWordProps = {
  text: string
  color: string
  theme: HeroMarqueeTheme
  reduceMotion: boolean
  className?: string
  style?: CSSProperties
}

/** Tiny cedar + flag accent, centered on a letter (Lebanese identity). */
function CedarMark() {
  return (
    <span
      data-cedar
      className="pointer-events-none absolute left-1/2 top-[0.08em] -translate-x-1/2"
      aria-hidden
    >
      <svg
        className="h-[0.5em] w-[0.36em] drop-shadow-[0_1px_2px_rgb(0_0_0_/_12%)]"
        viewBox="0 0 24 40"
        fill="none"
      >
        <path
          d="M12 38V23"
          className="text-[rgb(44,24,16)]"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M12 8 L20 20 H4 Z" fill="rgb(61 138 58)" opacity={0.92} />
        <path d="M12 14 L18.5 24 H5.5 Z" fill="rgb(34 110 38)" opacity={0.94} />
        <path d="M12 20 L16 28 H8 Z" fill="rgb(26 92 32)" opacity={0.96} />
        <rect x="9" y="5" width="6" height="2.2" fill="rgb(218 42 50)" rx="0.6" />
      </svg>
    </span>
  )
}

export function AnimatedWord({
  text,
  color,
  theme,
  reduceMotion,
  className,
  style,
}: AnimatedWordProps) {
  const rootRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (reduceMotion) return
      const root = rootRef.current
      if (!root) return

      const chars = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-aw-char]"),
      )
      if (!chars.length) return

      const killFns: Array<() => void> = []
      const origin = "50% 88%"

      /** Each letter runs its own slow, out-of-phase tween — no whole-word “wave”. */
      if (theme === "developer") {
        chars.forEach((el, i) => {
          const t = gsap.fromTo(
            el,
            { opacity: 0.91 },
            {
              opacity: 1,
              duration: 2.6 + (i % 5) * 0.28,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.52,
            },
          )
          killFns.push(() => t.kill())
        })
      } else if (theme === "designer") {
        chars.forEach((el, i) => {
          gsap.set(el, { transformOrigin: origin })
          const t = gsap.fromTo(
            el,
            { scale: 1 },
            {
              scale: 1.018,
              duration: 3.2 + (i % 4) * 0.35,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.48,
            },
          )
          killFns.push(() => t.kill())
        })
      } else if (theme === "animator") {
        chars.forEach((el, i) => {
          gsap.set(el, { transformOrigin: origin })
          const dir = i % 2 === 0 ? 0.55 : -0.55
          const t = gsap.fromTo(
            el,
            { rotation: -dir * 0.35 },
            {
              rotation: dir,
              duration: 2.9 + (i % 6) * 0.32,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.44,
            },
          )
          killFns.push(() => t.kill())
        })
      } else if (theme === "blender") {
        chars.forEach((el, i) => {
          gsap.set(el, { transformOrigin: origin })
          const t = gsap.fromTo(
            el,
            {
              x: i % 2 === 0 ? "-0.004em" : "0.004em",
              rotation: i % 2 === 0 ? -0.35 : 0.35,
            },
            {
              x: i % 2 === 0 ? "0.006em" : "-0.006em",
              rotation: i % 2 === 0 ? 0.55 : -0.55,
              duration: 3.4 + (i % 7) * 0.22,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.39,
            },
          )
          killFns.push(() => t.kill())
        })
      } else if (theme === "lebanese") {
        const cedar = root.querySelector("[data-cedar]")
        if (cedar) {
          const ct = gsap.to(cedar, {
            scale: 1.035,
            repeat: -1,
            yoyo: true,
            duration: 3.8,
            ease: "sine.inOut",
          })
          killFns.push(() => ct.kill())
        }
      }

      return () => {
        killFns.forEach((k) => k())
      }
    },
    {
      scope: rootRef,
      dependencies: [reduceMotion, theme, text],
      revertOnUpdate: true,
    },
  )

  if (reduceMotion) {
    return (
      <span className={className} style={{ color, ...style }}>
        {text}
      </span>
    )
  }

  const chars = Array.from(text)
  const cedarIndex = Math.floor((chars.length - 1) / 2)

  return (
    <span
      ref={rootRef}
      className={cn(
        "relative inline-flex items-baseline uppercase",
        theme === "designer" &&
          "before:pointer-events-none before:absolute before:inset-[-0.06em_-0.1em_-0.04em_-0.1em] before:-z-10 before:rounded-[0.06em] before:opacity-[0.4] before:content-[''] before:bg-[linear-gradient(90deg,rgb(0_0_0_/_6%)_1px,transparent_1px),linear-gradient(rgb(0_0_0_/_6%)_1px,transparent_1px)] before:[background-size:0.18em_0.18em]",
        className,
      )}
      style={{ color, ...style }}
    >
      {chars.map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          data-aw-char
          className="relative inline-block will-change-[transform,opacity]"
          style={{ color, fontSize: "inherit" }}
        >
          {ch}
          {theme === "lebanese" && i === cedarIndex ? <CedarMark /> : null}
        </span>
      ))}
    </span>
  )
}
