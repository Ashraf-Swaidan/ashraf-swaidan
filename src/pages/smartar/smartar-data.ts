/** Match portfolio case studies: Barlow Condensed labels, Fraunces body. */
export const SMARTAR_DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const SMARTAR_BODY_FONT = "var(--font-drh-body)"

export const SMARTAR_LOGO = "/assets/Smartar-page/SMARTAR-logo.png"
export const SMARTAR_VIDEO_HERO = "/assets/lap-animation-assets/Smartar-lap.mp4"
export const SMARTAR_VIDEO_POSTER = "/assets/lap-animation-assets/smartar-lap.webp"
export const SMARTAR_AI_VIDEO = "/assets/Smartar-page/ai-smartar.mp4"

export const SMARTAR_STORE_URL = "https://smartar-avdenwy1.myshopify.com/"
export const SMARTAR_ENTRY_PASSWORD = "ashraf123"

export const SMARTAR_SCREENSHOTS = [
  {
    key: "s1",
    src: "/assets/Smartar-page/s1.png",
    alt: "SMARTAR homepage with hero headline and featured merchandising sections",
  },
  {
    key: "s2",
    src: "/assets/Smartar-page/s2.png",
    alt: "SMARTAR collection page with filters and sort toolbar",
  },
  {
    key: "s3",
    src: "/assets/Smartar-page/s3.png",
    alt: "SMARTAR product page with tag-driven badges and gallery",
  },
  {
    key: "s4",
    src: "/assets/Smartar-page/s4.png",
    alt: "SMARTAR AI assistant showing an in-chat product card",
  },
  {
    key: "s5",
    src: "/assets/Smartar-page/s5.png",
    alt: "SMARTAR AI compare or collection widget inside the chat panel",
  },
] as const

export const SMARTAR_HERO_PILLS = [
  {
    label: "Shopify",
    className: "bg-emerald-300 text-emerald-950",
  },
  {
    label: "AI Powered",
    className:
      "border border-[var(--color-drh-ink)]/10 bg-white text-[var(--color-drh-ink)]/85 shadow-[0_6px_18px_rgb(10_10_10/0.05)]",
  },
  {
    label: "Custom theme",
    className:
      "border border-emerald-200/90 bg-emerald-50 text-emerald-950 shadow-[0_6px_18px_rgb(16_185_129/0.12)]",
  },
] as const
