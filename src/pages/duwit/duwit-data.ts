/** Match Papion case study: Barlow Condensed labels, Fraunces body (`--font-drh-body`). */
export const DUWIT_DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const DUWIT_BODY_FONT = "var(--font-drh-body)"

export const DUWIT_LOGO = "/assets/selected-works-logos/duwit-logo.svg"
export const DUWIT_VIDEO_HERO = "/assets/lap-animation-assets/duwit.mp4"
export const DUWIT_VIDEO_POSTER = "/assets/lap-animation-assets/duwit-lap.webp"

export const DUWIT_TRY_URL = "https://duwit-45a37.web.app/"
/** Windows desktop installer — pinned tag page. */
export const DUWIT_DESKTOP_APP_URL =
  "https://github.com/Ashraf-Swaidan/Duwit/releases/tag/v0.0.1"

/** Add gen-1.webp through gen-5.webp under public/assets/duwit-page/duwit-screenshots/. */
export const DUWIT_SCREENSHOTS = [
  {
    key: "gen-1",
    src: "/assets/duwit-page/duwit-screenshots/gen-1.webp",
    alt: "Duwit product — main view (desktop or web)",
  },
  {
    key: "gen-2",
    src: "/assets/duwit-page/duwit-screenshots/gen-2.webp",
    alt: "Duwit product — planning or goal flow",
  },
  {
    key: "gen-3",
    src: "/assets/duwit-page/duwit-screenshots/gen-3.webp",
    alt: "Duwit product — task or coaching surface",
  },
  {
    key: "gen-4",
    src: "/assets/duwit-page/duwit-screenshots/gen-4.webp",
    alt: "Duwit product — execution detail",
  },
  {
    key: "gen-5",
    src: "/assets/duwit-page/duwit-screenshots/gen-5.webp",
    alt: "Duwit product — another screen",
  },
] as const

/** Friction — “why so serious” meme; revealed via popover on highlighted phrase. */
export const DUWIT_FRICTION_ASSETS = {
  memePop: "/assets/duwit-page/why-so-serious.png",
  youCan: "/assets/duwit-page/you-can.png",
} as const

export const DUWIT_FRICTION_VIBE_PILLS = [
  "Cheerleader defaults",
  "Vague encouragement",
  "One endless thread",
  "All talk, shallow depth",
] as const
