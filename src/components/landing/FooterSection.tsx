import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "motion/react"

import { FooterPhone } from "@/components/landing/FooterPhone"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

function NoiseGrid() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgb(10 10 10 / 0.08) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgb(10 10 10 / 0.08) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize:
            "clamp(2.8rem, 7vw, 4.6rem) clamp(2.8rem, 7vw, 4.6rem)",
          maskImage:
            "linear-gradient(180deg, transparent, black 10%, black 86%, transparent)",
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-multiply"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="footer-noise-grid">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.88"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#footer-noise-grid)"
          opacity="0.2"
        />
      </svg>
    </>
  )
}

export function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const phoneWrapRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLParagraphElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (prefersReducedMotion) return

      const section = sectionRef.current
      const intro = introRef.current
      const phoneWrap = phoneWrapRef.current
      const note = noteRef.current

      if (!section || !intro || !phoneWrap || !note) return

      const headlineLines = intro.querySelectorAll(".footer-line")
      const eyebrow = intro.querySelector(".footer-eyebrow")
      const body = intro.querySelector(".footer-body")
      const phoneElements = phoneWrap.querySelectorAll(".phone-reveal")

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      })

      tl.from(eyebrow, {
        autoAlpha: 0,
        x: -16,
        duration: 0.45,
      })
        .from(
          headlineLines,
          {
            autoAlpha: 0,
            yPercent: 110,
            duration: 0.82,
            stagger: 0.08,
          },
          0.1
        )
        .from(
          body,
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.65,
          },
          0.38
        )
        .from(
          phoneElements,
          {
            autoAlpha: 0,
            y: 26,
            scale: 0.988,
            duration: 0.7,
            stagger: 0.08,
          },
          0.24
        )
        .from(
          note,
          {
            autoAlpha: 0,
            y: 12,
            duration: 0.55,
          },
          0.76
        )
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  )

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className={cn(
        "relative isolate overflow-hidden bg-[var(--color-drh-bg,#fff)] text-[var(--color-drh-ink,#111)]",
        "selection:bg-[var(--color-drh-ink)]/12 selection:text-[var(--color-drh-ink,#111)]"
      )}
      aria-label="Footer"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: [
            "radial-gradient(circle at 18% 20%, rgb(10 10 10 / 0.032) 0%, transparent 24%)",
            "radial-gradient(circle at 84% 14%, rgb(10 10 10 / 0.024) 0%, transparent 22%)",
            "linear-gradient(180deg, rgb(255 255 255) 0%, rgb(252 252 252) 100%)",
          ].join(", "),
        }}
      />
      <NoiseGrid />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-drh-ink)]/10"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-18 sm:px-8 md:py-24 lg:px-10">
        <div className="grid items-end gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-8 xl:gap-12">
          <div ref={introRef} className="lg:max-w-[42rem]">
            <p
              className="footer-eyebrow text-[0.68rem] font-semibold tracking-[0.38em] text-[var(--color-drh-ink)]/34 uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Final note
            </p>

            <h2
              className="mt-7 text-[var(--color-drh-ink)] lg:max-w-[16ch]"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "clamp(3.4rem, 8vw, 7.25rem)",
                fontWeight: 600,
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
              }}
            >
              <span className="block overflow-hidden">
                <span className="footer-line inline-block">
                  If the work matters,
                </span>
              </span>
              <span className="block overflow-hidden pl-[clamp(0px,6vw,5rem)] lg:pl-[clamp(1.6rem,2vw,2.4rem)]">
                <span className="footer-line inline-block font-light text-[var(--color-drh-ink)]/56 italic">
                  let&apos;s make it
                </span>
              </span>
              <span className="block overflow-hidden text-right lg:pl-[clamp(3rem,4vw,5.5rem)] lg:text-left">
                <span className="footer-line inline-block">
                  easier to live with.
                </span>
              </span>
            </h2>

            <p
              className="footer-body mt-8 max-w-xl text-[clamp(1rem,1.45vw,1.14rem)] leading-[1.82] text-[var(--color-drh-ink)]/64 lg:max-w-[29rem]"
              style={{
                fontFamily: "'Cormorant Garamond', 'Fraunces Variable', serif",
              }}
            >
              Tap around the phone, open a route, and choose the kind of hello
              that fits what you want to build.
            </p>
          </div>

          <div
            ref={phoneWrapRef}
            className="flex flex-col items-center lg:items-end"
          >
            <FooterPhone />

            <p
              ref={noteRef}
              className="phone-reveal mt-6 max-w-[22rem] text-center text-[0.96rem] leading-[1.7] text-[var(--color-drh-ink)]/48 lg:text-right"
              style={{
                fontFamily: "'Cormorant Garamond', 'Fraunces Variable', serif",
              }}
            >
              Open to thoughtful product, system, and interface work. The
              contact routes stay light, but the work itself can be serious.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
