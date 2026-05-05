/** Match Papion/Duwit case study typography. */
export const AK_DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const AK_BODY_FONT = "var(--font-drh-body)"

export const AK_LOGO = "/assets/selected-works-logos/ak-logo.svg"

/** Hero loop — same source as selected works carousel. */
export const AK_VIDEO_HERO = "/assets/lap-animation-assets/ak.mp4"
export const AK_VIDEO_POSTER = "/assets/lap-animation-assets/ak-lap.jpg"

/** Five desktop captures under `public/assets/ak-page/`. */
export const AK_SCREENSHOTS = [
  {
    key: "gen-1",
    src: "/assets/ak-page/gen-1.png",
    alt: "AK System — desktop storefront overview",
  },
  {
    key: "gen-2",
    src: "/assets/ak-page/gen-2.png",
    alt: "AK System — inventory or catalog surface",
  },
  {
    key: "gen-3",
    src: "/assets/ak-page/gen-3.png",
    alt: "AK System — sales or transaction flow",
  },
  {
    key: "gen-4",
    src: "/assets/ak-page/gen-4.png",
    alt: "AK System — customer or warranty context",
  },
  {
    key: "gen-5",
    src: "/assets/ak-page/gen-5.png",
    alt: "AK System — export or local data tools",
  },
] as const

export const AK_FRICTION_PILLS = [
  "Spotty internet",
  "Spreadsheet drift",
  "Stock never matches the shelf",
  "Warranty trails on paper",
  "No owned data file",
] as const
