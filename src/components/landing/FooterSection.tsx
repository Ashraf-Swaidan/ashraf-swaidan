import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "motion/react"

import { FooterPhone } from "@/components/landing/FooterPhone"
import { DecorativeSticker } from "@/components/landing/stickers/DecorativeSticker"
import { HOMEPAGE_STICKERS } from "@/data/homepageStickers"
import { cn } from "@/lib/utils"
import type { FooterDeviceMode } from "./footer-phone/types"

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
  const phoneUsabilityBadgeRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLParagraphElement>(null)
  const primaryStickerRef = useRef<HTMLDivElement>(null)
  const secondaryStickerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [deviceMode, setDeviceMode] = useState<FooterDeviceMode>("phone")
  const isIpadMode = deviceMode === "ipad"

  useGSAP(
    () => {
      if (prefersReducedMotion) return

      const section = sectionRef.current
      const intro = introRef.current
      const phoneWrap = phoneWrapRef.current
      const note = noteRef.current
      const usabilityBadge = phoneUsabilityBadgeRef.current
      const primarySticker = primaryStickerRef.current
      const secondarySticker = secondaryStickerRef.current

      if (!section || !intro || !phoneWrap || !note || !primarySticker || !secondarySticker) return

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
        .from(
          primarySticker,
          {
            autoAlpha: 0,
            y: 16,
            rotate: 12,
            duration: 0.55,
          },
          0.88
        )
        .from(
          secondarySticker,
          {
            autoAlpha: 0,
            y: 14,
            rotate: -10,
            duration: 0.48,
          },
          0.96
        )

      if (usabilityBadge) {
        tl.fromTo(
          usabilityBadge,
          { autoAlpha: 0, y: 8, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" },
          0.34
        )
          .to(usabilityBadge, { autoAlpha: 1, duration: 5, ease: "none" })
          .to(usabilityBadge, {
            autoAlpha: 0,
            y: -10,
            scale: 0.98,
            duration: 0.42,
            ease: "power2.in",
          })
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  )

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className={cn(
        "relative isolate scroll-mt-24 overflow-hidden bg-[var(--color-drh-bg,#fff)] text-[var(--color-drh-ink,#111)]",
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

      <div
        className={cn(
          "relative z-10 mx-auto px-6 py-18 transition-[max-width] duration-500 ease-out sm:px-8 md:py-24 lg:px-10",
          isIpadMode ? "max-w-7xl" : "max-w-6xl"
        )}
      >
        <div
          className={cn(
            "grid items-end gap-14 transition-[gap] duration-500 ease-out",
            isIpadMode
              ? "lg:grid-cols-1 lg:gap-10"
              : "lg:grid-cols-[minmax(0,1.16fr)_minmax(22rem,0.84fr)] lg:gap-8 xl:gap-12"
          )}
        >
          <div
            ref={introRef}
            className={cn(
              "relative",
              isIpadMode
                ? "mx-auto w-full text-center lg:max-w-[62rem]"
                : "lg:max-w-[46rem]"
            )}
          >
            <p
              className="footer-eyebrow text-[0.68rem] font-semibold tracking-[0.38em] text-[var(--color-drh-ink)]/34 uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Final note
            </p>

            <h2
              className={cn(
                "mt-7 text-[var(--color-drh-ink)]",
                isIpadMode ? "mx-auto lg:max-w-[18ch]" : "lg:max-w-[16ch]"
              )}
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
              <span
                className={cn(
                  "block overflow-hidden pl-[clamp(0px,6vw,5rem)]",
                  isIpadMode ? "lg:pl-0" : "lg:pl-[clamp(1.6rem,2vw,2.4rem)]"
                )}
              >
                <span className="footer-line inline-block font-light text-[var(--color-drh-ink)]/56 italic">
                  let&apos;s make it
                </span>
              </span>
              <span
                className={cn(
                  "block overflow-hidden text-right",
                  isIpadMode
                    ? "lg:text-center"
                    : "lg:pl-[clamp(3rem,4vw,5.5rem)] lg:text-left"
                )}
              >
                <span className="footer-line inline-block">
                  easier to live with.
                </span>
              </span>
            </h2>

            <p
              className={cn(
                "footer-body mt-8 max-w-xl text-[clamp(1rem,1.45vw,1.14rem)] leading-[1.82] text-[var(--color-drh-ink)]/64",
                isIpadMode ? "mx-auto lg:max-w-[40rem]" : "lg:max-w-[32rem]"
              )}
              style={{
                fontFamily: "'Cormorant Garamond', 'Fraunces Variable', serif",
              }}
            >
              Tap around the phone, open a route, and choose the kind of hello
              that fits what you want to build.
            </p>

            <DecorativeSticker
              ref={primaryStickerRef}
              sticker={HOMEPAGE_STICKERS.footerPrimary}
            />
            <DecorativeSticker
              ref={secondaryStickerRef}
              sticker={HOMEPAGE_STICKERS.footerSecondary}
            />
          </div>

          <div
            ref={phoneWrapRef}
            className={cn(
              "relative flex flex-col items-center",
              isIpadMode ? "lg:items-center" : "lg:items-end"
            )}
          >
            <div
              ref={phoneUsabilityBadgeRef}
              className="phone-reveal mb-4 rounded-full border border-[var(--color-drh-ink)]/16 bg-white/80 px-4 py-2 text-center shadow-[0_14px_30px_rgb(0_0_0/0.08)] backdrop-blur-md"
            >
              <p
                className="text-[0.74rem] font-semibold tracking-[0.12em] text-[var(--color-drh-ink)]/82 uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                This is actually fully usable phone btw
              </p>
            </div>
            <FooterPhone
              deviceMode={deviceMode}
              onDeviceModeChange={setDeviceMode}
            />

            <p
              ref={noteRef}
              className={cn(
                "phone-reveal mt-6 text-center text-[0.96rem] leading-[1.7] text-[var(--color-drh-ink)]/48",
                isIpadMode ? "max-w-[40rem]" : "max-w-[22rem] lg:text-right"
              )}
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
