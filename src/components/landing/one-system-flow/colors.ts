/** Pair 1: plum + lavender (inverted per rect). Pair 2: brown + soft orange. */

export const COL = {
  plum: "rgb(35, 0, 42)",
  lavender: "rgb(231, 148, 255)",
  brown: "rgb(44, 24, 16)",
  orangeSoft: "rgb(232, 168, 122)",
  period: "rgb(232, 168, 122)",
  ink: "#0a0a0a",
  paper: "#ffffff",
} as const

export const RECT_A_BG = COL.plum
export const RECT_A_MOTION = COL.lavender
/** Sales chip: soft light purple field, dark plum motion. */
export const RECT_B_BG = "rgb(237, 226, 246)"
export const RECT_B_MOTION = COL.plum
export const RECT_C_BG = COL.brown
export const RECT_C_MOTION = COL.orangeSoft
export const RECT_D_BG = COL.orangeSoft
export const RECT_D_MOTION = COL.brown
