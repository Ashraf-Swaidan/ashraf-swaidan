/**
 * Selected Works video URLs. Kept in a tiny module so main.tsx can inject
 * resource hints without importing GSAP or the full section.
 */
export const SELECTED_WORKS_VIDEOS = {
  papion: "/assets/lap-animation-assets/papion.mp4",
  duwit: "/assets/lap-animation-assets/duwit.mp4",
  ak: "/assets/lap-animation-assets/ak.mp4",
  twodo: "/assets/lap-animation-assets/twodo.mp4",
  luxian: "/assets/lap-animation-assets/luxian-lap.mp4",
} as const

/** Carousel MP4 URLs in section order — low-priority `preload` hints with {@link SELECTED_WORKS_VIDEOS}. */
export const SELECTED_WORKS_VIDEO_PRELOAD_ORDER = [
  SELECTED_WORKS_VIDEOS.luxian,
  SELECTED_WORKS_VIDEOS.papion,
  SELECTED_WORKS_VIDEOS.duwit,
  SELECTED_WORKS_VIDEOS.ak,
  SELECTED_WORKS_VIDEOS.twodo,
] as const
