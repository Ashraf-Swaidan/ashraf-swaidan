import { DISPLAY_FONT } from "./papion-data"
import { PapionWordmark } from "./papion-ui"

/** Five desktop captures, full-bleed inside frames (no object-cover cropping). */
const SHOTS = [
  {
    key: "gen-1",
    src: "/assets/papion-page/papion-screenshots/gen-1.png",
    alt: "Papion desktop, main view",
  },
  {
    key: "gen-2",
    src: "/assets/papion-page/papion-screenshots/gen-2.png",
    alt: "Papion desktop, workspace",
  },
  {
    key: "gen-3",
    src: "/assets/papion-page/papion-screenshots/gen-3.png",
    alt: "Papion desktop, module surface",
  },
  {
    key: "gen-4",
    src: "/assets/papion-page/papion-screenshots/gen-4.png",
    alt: "Papion desktop, operational detail",
  },
  {
    key: "gen-5",
    src: "/assets/papion-page/papion-screenshots/gen-5.png",
    alt: "Papion desktop, another module",
  },
] as const

function ScreenshotFrame({
  src,
  alt,
  className = "",
  frameClassName = "",
}: {
  src: string
  alt: string
  className?: string
  /** Wrapper around image (position, shadow, ring). */
  frameClassName?: string
}) {
  return (
    <div className={className}>
      <div
        className={`aspect-[1.607/1] overflow-hidden rounded-[0.95rem] border border-[#263115] bg-white shadow-[0_22px_70px_rgb(23_31_13/0.07)] sm:rounded-[1.35rem] ${frameClassName}`}
      >
        <img
          src={src}
          alt={alt}
          className="block h-full w-full object-contain object-top"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  )
}

export function PapionScreenshotCollage() {
  const [s1, s2, s3, s4, s5] = SHOTS
  const topLeft = s2
  const hero = s1
  const topRight = s3
  const bottomLeft = s4
  const bottomRight = s5

  return (
    <section className="papion-story-block relative isolate overflow-hidden border-y border-rose-900/8 bg-[#fdf8fa]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(200 120 150 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(200 120 150 / 0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 px-5 pt-11 pb-6 text-center sm:pt-14">
        <p
          className="flex flex-col items-center gap-2 text-[0.68rem] font-medium text-rose-900/45"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          <PapionWordmark className="normal-case text-[0.95rem] tracking-[0.06em]" />
          <span className="text-[0.62rem] tracking-[0.2em] text-rose-900/32 uppercase">
            In the product
          </span>
        </p>
      </div>

      {/* Mobile keeps the reference's big framed shots without forcing a tiny collage. */}
      <div className="relative px-4 py-12 lg:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {SHOTS.map((shot, i) => (
            <div
              key={shot.key}
              className="w-[min(92vw,34rem)] shrink-0 snap-center first:ml-1 last:mr-4"
            >
              <ScreenshotFrame
                src={shot.src}
                alt={shot.alt}
                frameClassName={
                  i === 0 ? "shadow-[0_26px_80px_rgb(23_31_13/0.12)]" : ""
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: equal-size browser windows with slight gutters between frames. */}
      <div className="relative mx-auto hidden h-[clamp(760px,58vw,1100px)] max-w-[1920px] lg:block">
        <ScreenshotFrame
          src={topLeft.src}
          alt={topLeft.alt}
          className="absolute top-6 left-[-17vw] z-10 w-[clamp(520px,44vw,840px)]"
          frameClassName="shadow-none"
        />
        <ScreenshotFrame
          src={hero.src}
          alt={hero.alt}
          className="absolute top-6 left-1/2 z-20 w-[clamp(520px,44vw,840px)] -translate-x-1/2"
          frameClassName="shadow-none"
        />
        <ScreenshotFrame
          src={topRight.src}
          alt={topRight.alt}
          className="absolute top-6 right-[-17vw] z-10 w-[clamp(520px,44vw,840px)]"
          frameClassName="shadow-none"
        />
        <ScreenshotFrame
          src={bottomLeft.src}
          alt={bottomLeft.alt}
          className="absolute top-[52%] left-[5.5vw] z-20 w-[clamp(520px,44vw,840px)]"
          frameClassName="shadow-none"
        />
        <ScreenshotFrame
          src={bottomRight.src}
          alt={bottomRight.alt}
          className="absolute top-[52%] right-[5.5vw] z-20 w-[clamp(520px,44vw,840px)]"
          frameClassName="shadow-none"
        />
      </div>
    </section>
  )
}
