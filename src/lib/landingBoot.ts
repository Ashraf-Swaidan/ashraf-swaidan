import { SELECTED_WORKS_VIDEO_PRELOAD_ORDER } from "@/constants/selectedWorksVideos"
import { HOMEPAGE_STICKERS } from "@/data/homepageStickers"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

/** Warm decode for the first Selected Works clip (HTTP cache may already exist from link preload). */
function primeVideoCanPlay(url: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video")
    video.preload = "auto"
    video.muted = true
    video.playsInline = true
    const finish = () => {
      video.removeAttribute("src")
      video.load()
      resolve()
    }
    video.addEventListener("canplay", finish, { once: true })
    video.addEventListener("error", finish, { once: true })
    video.src = url
    video.load()
  })
}

async function withTimeout(work: Promise<unknown>, ms: number): Promise<void> {
  await Promise.race([work, delay(ms)])
}

export function getLandingBootImageUrls(): readonly string[] {
  const first = SELECTED_WORKS_PROJECTS[0]
  const base = [
    HOMEPAGE_STICKERS.heroPrimary.src,
    HOMEPAGE_STICKERS.heroSecondary.src,
  ] as const
  if (!first) return base
  return [...base, first.imageSrc, first.logoSrc]
}

/** Never block the overlay longer than this, even if asset waits stall. */
const HARD_CAP_MS = 6000

/**
 * Waits for a **small** critical set of landing assets plus bounded timeouts so first visits
 * do not stare at empty videos forever. Reduced-motion uses shorter budgets. Regardless,
 * this function resolves within {@link HARD_CAP_MS} ms so the loader cannot persist longer.
 */
export async function waitLandingBoot(options: {
  reduceMotion: boolean
}): Promise<void> {
  await Promise.race([runLandingBoot(options), delay(HARD_CAP_MS)])
}

async function runLandingBoot(options: { reduceMotion: boolean }): Promise<void> {
  const { reduceMotion } = options
  const start = performance.now()

  const MIN_VISIBLE_MS = reduceMotion ? 0 : 400
  const MAX_TOTAL_MS = reduceMotion ? 700 : 3400
  const FONT_TIMEOUT_MS = reduceMotion ? 450 : 1900
  const VIDEO_TIMEOUT_MS = reduceMotion ? 0 : 2600

  const fontsTask = (async () => {
    if (!("fonts" in document)) return
    await withTimeout(document.fonts.ready.catch(() => {}), FONT_TIMEOUT_MS)
  })()

  const imagesTask = Promise.all(
    getLandingBootImageUrls().map((url) => loadImage(url)),
  )

  const primaryVideo = SELECTED_WORKS_VIDEO_PRELOAD_ORDER[0]
  const videoTask =
    VIDEO_TIMEOUT_MS > 0 && primaryVideo
      ? withTimeout(primeVideoCanPlay(primaryVideo), VIDEO_TIMEOUT_MS)
      : Promise.resolve()

  await Promise.all([fontsTask, imagesTask, videoTask])

  const elapsed = performance.now() - start
  const minRemain = Math.max(0, MIN_VISIBLE_MS - elapsed)
  const maxRemain = Math.max(0, MAX_TOTAL_MS - elapsed)
  const tailMs = Math.min(minRemain, maxRemain)
  const capRemain = Math.max(0, HARD_CAP_MS - (performance.now() - start))
  await delay(Math.min(tailMs, capRemain))
}
