const PHONE_APPS_ROOT = "/assets/phone-apps"
const FOOTER_ILLUSTRATION = "/assets/ashraf-footer.png"

/** Uniform hit-box for every icon (px). SVGs scale inside with object-contain. */
const ICON_BOX_CLASS =
  "h-12 w-12 shrink-0 object-contain sm:h-[3.25rem] sm:w-[3.25rem]"

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Ashraf-Swaidan",
    iconSrc: `${PHONE_APPS_ROOT}/github-white.svg`,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ashraf-swaidan-9aaa612b1/",
    iconSrc: `${PHONE_APPS_ROOT}/linkedIn.svg`,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_ashraf_swaidan_/",
    iconSrc: `${PHONE_APPS_ROOT}/instagram.svg`,
  },
  {
    label: "Gmail",
    href: "mailto:ashraf.swaidan.13@gmail.com",
    iconSrc: `${PHONE_APPS_ROOT}/gmail.svg`,
  },
] as const

const PHONE = {
  href: "tel:+96176350373",
  display: "+961 76 350 373",
  iconSrc: `${PHONE_APPS_ROOT}/phone.svg`,
} as const

function IconLink({
  href,
  label,
  iconSrc,
}: {
  href: string
  label: string
  iconSrc: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      className="grid h-12 w-12 place-items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] focus-visible:outline-none sm:h-[3.25rem] sm:w-[3.25rem]"
    >
      <img
        src={iconSrc}
        alt=""
        className={`${ICON_BOX_CLASS} drop-shadow-[0_10px_20px_rgb(0_0_0/0.35)]`}
        loading="lazy"
        decoding="async"
      />
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      aria-label="Contact footer"
      className="relative isolate overflow-x-clip overflow-y-visible bg-[#0b0b0b] text-white selection:bg-white/18 selection:text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        aria-hidden
        style={{
          background: [
            "radial-gradient(circle at 18% 18%, rgb(255 122 0 / 0.16), transparent 28%)",
            "radial-gradient(circle at 78% 10%, rgb(132 204 22 / 0.12), transparent 24%)",
            "linear-gradient(180deg, rgb(11 11 11), rgb(5 5 5))",
          ].join(", "),
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "clamp(2.5rem, 7vw, 5rem) clamp(2.5rem, 7vw, 5rem)",
          maskImage:
            "linear-gradient(180deg, transparent, black 12%, black 88%, transparent)",
        }}
      />

      {/* Illustration: anchored bottom-right; eager load avoids Lenis + native lazy IO bugs.
          lg+: extend the paint box above/below the footer so the figure can break out of the dark panel. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] z-[8] min-h-[min(58vh,28rem)]
          sm:top-[22%] sm:min-h-[min(62vh,32rem)]
          md:top-[20%] md:min-h-[min(64vh,34rem)]
          lg:inset-x-0 lg:-top-[clamp(2.5rem,7.5vh,5.5rem)] lg:-bottom-[clamp(2rem,6.5vh,4.75rem)] lg:flex lg:min-h-0 lg:items-end lg:justify-end"
      >
        <div
          className="flex h-full w-full min-h-[min(58vh,28rem)] items-end justify-end sm:min-h-[min(62vh,32rem)] md:min-h-[min(64vh,34rem)] lg:min-h-0"
        >
          <img
            src={FOOTER_ILLUSTRATION}
            alt="Ashraf — footer illustration"
            width={900}
            height={1200}
            className="shrink-0 origin-bottom-right select-none object-contain object-[right_bottom] opacity-[0.97]
              h-[min(94vh,58rem)] w-auto max-w-[min(calc(100vw-1rem),62rem)]
              translate-x-[6%] sm:h-[min(96vh,72rem)] sm:max-w-[min(calc(100vw-1rem),76rem)] sm:translate-x-[8%]
              md:h-[min(96vh,68rem)] md:max-w-[min(calc(100vw-1rem),78rem)] md:translate-x-[7%]
              lg:h-[min(112vh,102rem)] lg:max-h-none lg:w-auto lg:max-w-[min(calc(100vw-2.5rem),94rem)] lg:translate-x-[2%]
              xl:h-[min(116vh,112rem)] xl:max-w-[min(calc(100vw-3rem),108rem)]
              2xl:h-[min(120vh,124rem)] 2xl:max-w-[min(calc(100vw-4rem),122rem)]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Copy stays readable above / left of the figure */}
      <div
        className="relative z-20 mx-auto max-w-7xl px-6 pt-14 pb-12 sm:px-8 sm:pt-18 sm:pb-14 md:pt-20 md:pb-[4.25rem] lg:grid lg:min-h-[min(100vh,96rem)] lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:px-10 lg:pt-22 lg:pb-16 xl:min-h-[min(100vh,112rem)] xl:px-12"
      >
        <div className="relative z-20 lg:col-span-7 xl:col-span-6 2xl:col-span-5">
          <p
            className="text-[0.72rem] font-semibold tracking-[0.36em] text-white/38 uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Available for the right build
          </p>
          <h2
            className="mt-5 max-w-[18ch] text-[clamp(2rem,7vw,4.75rem)] leading-[0.88] font-semibold tracking-[-0.045em] text-balance uppercase sm:max-w-[16ch] sm:text-[clamp(2.35rem,6vw,5.5rem)] lg:max-w-[15ch] lg:text-[clamp(2.5rem,5.5vw,6rem)]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Let&apos;s Work Together
          </h2>
          <p
            className="mt-6 max-w-xl text-[clamp(1rem,1.35vw,1.18rem)] leading-[1.72] text-white/58 sm:max-w-2xl sm:text-[clamp(1.05rem,1.45vw,1.22rem)]"
            style={{
              fontFamily: "'Cormorant Garamond', 'Fraunces Variable', serif",
            }}
          >
            Bring the messy idea, the half-working workflow, or the product that
            needs a sharper interface. I can help turn it into something useful,
            calm, and well-built.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3 sm:mt-9 sm:gap-x-4">
            {SOCIAL_LINKS.map((link) => (
              <IconLink
                key={link.label}
                href={link.href}
                label={link.label}
                iconSrc={link.iconSrc}
              />
            ))}
            <a
              href={PHONE.href}
              className="inline-flex min-h-12 items-center gap-3 rounded-lg py-1 pr-2 pl-0 text-white transition duration-200 hover:text-white/90 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] focus-visible:outline-none sm:min-h-[3.25rem] sm:gap-3.5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center sm:h-[3.25rem] sm:w-[3.25rem]">
                <img
                  src={PHONE.iconSrc}
                  alt=""
                  className={`${ICON_BOX_CLASS} drop-shadow-[0_10px_20px_rgb(0_0_0/0.35)]`}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span
                className="text-[1.05rem] font-medium tracking-[0.025em] tabular-nums lining-nums sm:text-[1.22rem]"
                style={{
                  fontFamily: "var(--font-drh-body)",
                  fontVariationSettings: '"opsz" 32, "wght" 580',
                }}
              >
                {PHONE.display}
              </span>
            </a>
          </div>
        </div>

        <div
          className="pointer-events-none hidden lg:col-span-5 xl:col-span-6 2xl:col-span-7 lg:block"
          aria-hidden
        />
      </div>
    </footer>
  )
}

export default SiteFooter
