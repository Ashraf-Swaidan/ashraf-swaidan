// src/components/landing/ManifestoSection.tsx
//
// Fonts needed — add to your <head> or font config:
//   https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&family=Lora:ital@0;1&display=swap
//
// Uses: GSAP + @gsap/react, motion/react (useReducedMotion), cn util
// CSS vars used: --color-drh-bg, --color-drh-ink (falls back gracefully)

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* ─────────────────────────────────────────────────────────────────
   NOISE TEXTURE — SVG feTurbulence, rendered inline, zero deps
───────────────────────────────────────────────────────────────── */
function NoiseSurface() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
     
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────
   RULED LINE — draws itself on entry
───────────────────────────────────────────────────────────────── */
function RuledLine({ lineRef }: { lineRef: React.RefObject<SVGLineElement | null> }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-full w-px overflow-visible"
      style={{ left: "clamp(24px, 8vw, 96px)" }}
    >
      <line
        ref={lineRef}
        x1="0"
        y1="0"
        x2="0"
        y2="100%"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        className="text-[var(--color-drh-ink,#1a1a1a)] opacity-10"
      />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLParagraphElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)

  const prefersReducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (prefersReducedMotion) return

      const section = sectionRef.current
      if (!section) return

      const st = { trigger: section, start: "top 75%", once: true }

      // Vertical rule draws down
      if (lineRef.current) {
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: st,
        })
      }

      // Tag line fades
      if (tagRef.current) {
        gsap.from(tagRef.current, {
          opacity: 0,
          x: -10,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: st,
        })
      }

      // Headline — each word slides up from below with stagger
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word")
        gsap.from(words, {
          y: "105%",
          opacity: 0,
          duration: 0.7,
          stagger: 0.045,
          ease: "power4.out",
          delay: 0.1,
          scrollTrigger: st,
        })
      }

      // Body paragraph
      if (bodyRef.current) {
        gsap.from(bodyRef.current, {
          opacity: 0,
          y: 18,
          duration: 0.8,
          delay: 0.55,
          ease: "power3.out",
          scrollTrigger: st,
        })
      }

      // Closing line
      if (closingRef.current) {
        gsap.from(closingRef.current, {
          opacity: 0,
          y: 14,
          duration: 0.75,
          delay: 0.75,
          ease: "power3.out",
          scrollTrigger: st,
        })
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  )

  // Split headline text into individually animated words
  // Each word is clip-masked so it appears to rise from a hidden slot
  const headlineWords = [
    { text: "Most", style: {} },
    { text: "of", style: { fontStyle: "italic", fontWeight: 300 } },
    { text: "what", style: {} },
    { text: "you", style: {} },
    { text: "do", style: { fontStyle: "italic", fontWeight: 300 } },
    { text: "—", style: { opacity: 0.3, fontWeight: 300 } },
    { text: "has", style: {} },
    { text: "a", style: { fontStyle: "italic", fontWeight: 300 } },
    { text: "better", style: {} },
    { text: "version.", style: {} },
  ]

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate overflow-hidden",
        "bg-[var(--color-drh-bg,#f7f4ef)]",
        "py-12 md:py-36 lg:py-14",
      )}
      aria-label="Manifesto"
    >
      <NoiseSurface />
      <RuledLine lineRef={lineRef} />

      {/* ── Layout shell — left-padded to respect the rule ── */}
      <div
        className="relative z-10 mx-auto max-w-6xl"
        style={{ paddingLeft: "clamp(48px, 12vw, 140px)", paddingRight: "clamp(24px, 6vw, 80px)" }}
      >

        {/* Tag — small overline */}
        <span
          ref={tagRef}
          className={cn(
            "mb-10 block text-[0.6rem] font-semibold uppercase tracking-[0.4em]",
            "text-[var(--color-drh-ink,#1a1a1a)] opacity-30",
          )}
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          A note on how I work
        </span>

        {/* ── Headline ── */}
        <div ref={headlineRef} aria-label="Most of what you do has a better version.">
          <p
            className="leading-[0.92] tracking-[-0.025em] text-[var(--color-drh-ink,#1a1a1a)]"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(3.2rem, 9vw, 9rem)",
              wordBreak: "break-word",
            }}
          >
            {/* Line 1 */}
            <span className="block overflow-hidden">
              {["Most", "of", "what", "you", "do"].map((w, i) => (
                <span
                  key={i}
                  className="word inline-block mr-[0.2em]"
                  style={i === 1 || i === 3
                    ? { fontStyle: "italic", fontWeight: 300 }
                    : {}}
                >
                  {w}
                </span>
              ))}
            </span>
            {/* Line 2 — indented, lighter weight on "a" */}
            <span
              className="block overflow-hidden"
              style={{ paddingLeft: "clamp(0px, 6vw, 80px)" }}
            >
              {[
                { text: "has", italic: false },
                { text: "a", italic: true },
                { text: "better", italic: false },
              ].map((w, i) => (
                <span
                  key={i}
                  className="word inline-block mr-[0.2em]"
                  style={w.italic ? { fontStyle: "italic", fontWeight: 300 } : {}}
                >
                  {w.text}
                </span>
              ))}
            </span>
            {/* Line 3 — flush right, emphatic */}
            <span className="block overflow-hidden text-right">
              <span className="word inline-block opacity-[0.18] mr-[0.15em]" style={{ fontWeight: 300 }}>—</span>
              <span className="word inline-block">version.</span>
            </span>
          </p>
        </div>

        {/* ── Body ── */}
        <div
          ref={bodyRef}
          className=" max-w-lg md:mt-16"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          <p
            className="text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.8] text-[var(--color-drh-ink,#1a1a1a)]"
            style={{ color: "var(--color-drh-ink,#1a1a1a)", opacity: 0.65 }}
          >
            You're doing it the way it was handed to you. Five tabs open, three tools running, one
            spreadsheet that nobody fully trusts.{" "}
            <em style={{ opacity: 0.5 }}>It works. Barely.</em>
          </p>
          <p
            className="mt-4 text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.8]"
            style={{ color: "var(--color-drh-ink,#1a1a1a)", opacity: 0.65 }}
          >
            I get a little impatient with that. I look at a workflow and immediately see the two
            steps it should actually be. 
          </p>
        </div>

        {/* ── Closing line — shifts right ── */}
        <p
          ref={closingRef}
          className="mt-14 text-right text-[clamp(1.1rem,1.8vw,1.4rem)] font-semibold leading-[1.3] tracking-[-0.015em] md:mt-16"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            color: "var(--color-drh-ink,#1a1a1a)",
            letterSpacing: "-0.01em",
          }}
        >
          If it runs on a screen,{" "}
          <br className="hidden sm:block" />
          <em style={{ fontWeight: 300, opacity: 0.5 }}>I can make it half the work.</em>
        </p>

        {/* ── Decorative bottom rule ── */}
        <div
          className="mt-20 h-px w-full opacity-10"
          style={{ background: "var(--color-drh-ink,#1a1a1a)" }}
          aria-hidden
        />

      </div>
    </section>
  )
}

export default ManifestoSection