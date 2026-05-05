import {
  TWODO_BODY_FONT,
  TWODO_DISPLAY_FONT,
  TWODO_SCREENSHOTS,
} from "./twodo-data"
import { TwodoWordmark } from "./twodo-ui"

function ScreenshotFrame({
  src,
  alt,
  className = "",
  frameClassName = "",
}: {
  src: string
  alt: string
  className?: string
  frameClassName?: string
}) {
  return (
    <div className={className}>
      <div
        className={`aspect-[1.607/1] overflow-hidden rounded-[0.95rem] border border-sky-900/14 bg-white shadow-[0_22px_70px_rgb(15_55_95/0.06)] sm:rounded-[1.35rem] ${frameClassName}`}
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

/** Five captures, same layout as other case study collages. */
export function TwodoScreenshotCollage() {
  const [s1, s2, s3, s4, s5] = TWODO_SCREENSHOTS
  const topLeft = s2
  const hero = s1
  const topRight = s3
  const bottomLeft = s4
  const bottomRight = s5

  return (
    <section className="twodo-story-block relative isolate overflow-hidden border-y border-sky-900/10 bg-[#f8fbff]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(56 189 248 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(56 189 248 / 0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 px-5 pt-11 pb-4 text-center sm:pt-14">
        <p
          className="flex flex-col items-center gap-2 text-[0.68rem] font-medium text-sky-950/45"
          style={{ fontFamily: TWODO_DISPLAY_FONT }}
        >
          <TwodoWordmark className="normal-case text-[0.95rem] tracking-[0.06em]" />
          <span className="text-[0.62rem] tracking-[0.2em] text-sky-950/28 uppercase">
            In the product
          </span>
        </p>
        <p
          className="mx-auto mt-4 max-w-md text-[0.78rem] leading-relaxed text-[var(--color-drh-ink-muted)]"
          style={{ fontFamily: TWODO_BODY_FONT }}
        >
          Thin chrome, direct controls, and a list that stays readable when the
          day gets loud. The goal is simple:{" "}
          <span className="text-[var(--color-drh-ink)]/82">
            finish the task, not tour the app.
          </span>
        </p>
      </div>

      <div className="relative px-4 py-12 lg:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {TWODO_SCREENSHOTS.map((shot, i) => (
            <div
              key={shot.key}
              className="w-[min(92vw,34rem)] shrink-0 snap-center first:ml-1 last:mr-4"
            >
              <ScreenshotFrame
                src={shot.src}
                alt={shot.alt}
                frameClassName={
                  i === 0
                    ? "shadow-[0_26px_80px_rgb(15_55_95/0.1)]"
                    : ""
                }
              />
            </div>
          ))}
        </div>
      </div>

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
