/** Match Papion/Duwit case study typography. */
export const TWODO_DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const TWODO_BODY_FONT = "var(--font-drh-body)"

export const TWODO_LOGO = "/assets/selected-works-logos/twodo-logo.png"

export const TWODO_TRY_URL = "https://twodo.ashraf-swaidan-10.workers.dev/"

/** Hero loop, same source as selected works carousel. */
export const TWODO_VIDEO_HERO = "/assets/lap-animation-assets/twodo.mp4"
export const TWODO_VIDEO_POSTER = "/assets/lap-animation-assets/twodo-lap.webp"

/** Five captures under `public/assets/twodo-page/` (`gen-*.webp`). */
export const TWODO_SCREENSHOTS = [
  {
    key: "gen-1",
    src: "/assets/twodo-page/gen-1.webp",
    alt: "Twodo app: all todos list with sidebar, search, and add task control",
  },
  {
    key: "gen-2",
    src: "/assets/twodo-page/gen-2.webp",
    alt: "Twodo app: task list and inline actions",
  },
  {
    key: "gen-3",
    src: "/assets/twodo-page/gen-3.webp",
    alt: "Twodo app: project or task detail view",
  },
  {
    key: "gen-4",
    src: "/assets/twodo-page/gen-4.webp",
    alt: "Twodo app: tags or filters surface",
  },
  {
    key: "gen-5",
    src: "/assets/twodo-page/gen-5.webp",
    alt: "Twodo app: collaboration or project context",
  },
] as const

export const TWODO_FRICTION_PILLS = [
  "Modal stacks",
  "Nested settings",
  "Slow capture flow",
  "Chrome over clarity",
  "Ten taps to toggle",
] as const
