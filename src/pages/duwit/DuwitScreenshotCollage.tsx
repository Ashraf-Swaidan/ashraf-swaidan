import {
  DUWIT_BODY_FONT,
  DUWIT_DESKTOP_APP_URL,
  DUWIT_DISPLAY_FONT,
  DUWIT_SCREENSHOTS,
  DUWIT_TRY_URL,
} from "./duwit-data"
import { DuwitWordmark } from "./duwit-ui"

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
        className={`aspect-[1.607/1] overflow-hidden rounded-[0.95rem] border border-[var(--color-drh-ink)]/14 bg-white shadow-[0_22px_70px_rgb(10_10_10/0.06)] sm:rounded-[1.35rem] ${frameClassName}`}
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

/** Five captures — same layout as Papion collage; files in `public/assets/duwit-page/duwit-screenshots/gen-*.webp`. */
export function DuwitScreenshotCollage() {
  const [s1, s2, s3, s4, s5] = DUWIT_SCREENSHOTS
  const topLeft = s2
  const hero = s1
  const topRight = s3
  const bottomLeft = s4
  const bottomRight = s5

  return (
    <section className="duwit-story-block relative isolate overflow-hidden border-y border-orange-950/8 bg-[#fff8f4]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 122 0 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 122 0 / 0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 px-5 pt-11 pb-4 text-center sm:pt-14">
        <p
          className="flex flex-col items-center gap-2 text-[0.68rem] font-medium text-orange-950/50"
          style={{ fontFamily: DUWIT_DISPLAY_FONT }}
        >
          <DuwitWordmark className="normal-case text-[0.95rem] tracking-[0.06em]" />
          <span className="text-[0.62rem] tracking-[0.2em] text-orange-950/38 uppercase">
            In the product
          </span>
        </p>
        <p
          className="mx-auto mt-4 max-w-md text-[0.78rem] leading-relaxed text-[var(--color-drh-ink-muted)]"
          style={{ fontFamily: DUWIT_BODY_FONT }}
        >
          Same execution loop on the{" "}
          <span className="text-[var(--color-drh-ink)]/80">web</span> and as a{" "}
          <span className="text-[var(--color-drh-ink)]/80">Windows desktop</span>{" "}
          app.
          <span className="mt-2 block text-[0.72rem] font-normal tracking-[0.06em] text-orange-950/45 normal-case">
            <a
              href={DUWIT_TRY_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-orange-950/25 underline-offset-4 transition hover:text-[var(--color-drh-accent-orange)]"
            >
              Try live
            </a>
            <span className="mx-2 text-orange-950/25">·</span>
            <a
              href={DUWIT_DESKTOP_APP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-orange-950/25 underline-offset-4 transition hover:text-[var(--color-drh-accent-orange)]"
            >
              Desktop releases
            </a>
          </span>
        </p>
      </div>

      <div className="relative px-4 py-12 lg:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {DUWIT_SCREENSHOTS.map((shot, i) => (
            <div
              key={shot.key}
              className="w-[min(92vw,34rem)] shrink-0 snap-center first:ml-1 last:mr-4"
            >
              <ScreenshotFrame
                src={shot.src}
                alt={shot.alt}
                frameClassName={
                  i === 0 ? "shadow-[0_26px_80px_rgb(10_10_10/0.1)]" : ""
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
