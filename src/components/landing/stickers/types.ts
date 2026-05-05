export type StickerSection =
  | "hero"
  | "manifesto"
  | "selectedWorks"
  | "footer"

export type StickerMotionPreset =
  | "hero-rise"
  | "scroll-note"
  | "swap-float"
  | "footer-settle"

export type StickerPlacement = {
  top?: string
  right?: string
  bottom?: string
  left?: string
  width: string
  transform?: string
  rotation?: number
}

export type ResponsiveStickerConfig = {
  id: string
  src: string
  alt: string
  section: StickerSection
  desktop: StickerPlacement
  mobile: StickerPlacement
  motionPreset: StickerMotionPreset
  zIndex?: number
}
