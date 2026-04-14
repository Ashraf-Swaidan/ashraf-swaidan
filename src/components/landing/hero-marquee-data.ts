import { COL, RECT_B_MOTION } from "@/components/landing/one-system-flow/colors"

/** Full-strength colors for loud caps; soft/seps use these with opacity in the component. */
export const HERO_MARQUEE_COLOR_CYCLE = [
  COL.plum,
  COL.lavender,
  COL.brown,
  COL.orangeSoft,
  RECT_B_MOTION,
] as const

/** Horizontal wash behind each marquee row (stronger so background hues read clearly). */
export const HERO_ROW_WASHES = [
  "rgb(35 0 42 / 0.2)",
  "rgb(232 168 122 / 0.2)",
  "rgb(231 148 255 / 0.2)",
] as const

/** Micro-animation theme for select loud words (marquee). */
export type HeroMarqueeTheme =
  | "lebanese"
  | "developer"
  | "designer"
  | "animator"
  | "blender"

/** Size emphasis for loud words: primary slightly larger, secondary baseline. */
export type HeroLoudImportance = "primary" | "secondary"

export type HeroMarqueeSeg =
  | { t: "l"; text: string; importance?: HeroLoudImportance; theme?: HeroMarqueeTheme }
  | { t: "s"; text: string }
  | { t: "sep" }
  | { t: "sp" }

export const HERO_MARQUEE_SEGMENTS: HeroMarqueeSeg[] = [
  { t: "l", text: "Developer", importance: "primary", theme: "developer" },
  { t: "sep" },
  { t: "l", text: "Designer", importance: "primary", theme: "designer" },
  { t: "sep" },
  { t: "s", text: "sometime" },
  { t: "sp" },
  { t: "l", text: "Animator", importance: "primary", theme: "animator" },
  { t: "sep" },
  { t: "l", text: "Accidental", importance: "secondary" },
  { t: "sp" },
  { t: "l", text: "Businessman", importance: "secondary" },
  { t: "sep" },
  { t: "l", text: "System", importance: "secondary" },
  { t: "sp" },
  { t: "l", text: "Builder", importance: "primary" },
  { t: "sep" },
  { t: "s", text: "curious" },
  { t: "sp" },
  { t: "l", text: "Human", importance: "secondary" },
  { t: "sep" },
  { t: "l", text: "Occasional", importance: "secondary" },
  { t: "sp" },
  { t: "l", text: "Blender", importance: "primary", theme: "blender" },
  { t: "sp" },
  { t: "l", text: "Hobbyist", importance: "secondary" },
  { t: "sep" },
  { t: "l", text: "Automation", importance: "secondary" },
  { t: "sp" },
  { t: "s", text: "enthusiast" },
  { t: "sep" },
  { t: "l", text: "Science", importance: "secondary" },
  { t: "sp" },
  { t: "s", text: "admirer" },
  { t: "sep" },
  { t: "l", text: "Problem", importance: "secondary" },
  { t: "sp" },
  { t: "s", text: "finder" },
  { t: "sep" },
  { t: "l", text: "Lebanese", importance: "primary", theme: "lebanese" },
  { t: "sep" },
  { t: "s", text: "introvert" },
  { t: "sep" },
  { t: "s", text: "still" },
  { t: "sp" },
  { t: "l", text: "Figuring", importance: "secondary" },
  { t: "sp" },
  { t: "s", text: "out" },
  { t: "sp" },
  { t: "s", text: "the" },
  { t: "sp" },
  { t: "l", text: "Label", importance: "secondary" },
  { t: "sep" },
]
