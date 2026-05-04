import { SELECTED_WORKS_VIDEO_PRELOAD_ORDER } from "@/constants/selectedWorksVideos"

/**
 * Warm HTTP cache for Selected Works clips before the section mounts.
 * Preload = high priority for the first visible video; prefetch = low priority for the rest.
 */
export function injectSelectedWorksVideoHints() {
  const [primary, ...secondary] = SELECTED_WORKS_VIDEO_PRELOAD_ORDER
  if (!primary) return

  const head = document.head

  const preload = document.createElement("link")
  preload.rel = "preload"
  preload.as = "video"
  preload.href = primary
  preload.type = "video/mp4"
  head.appendChild(preload)

  for (const href of secondary) {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = href
    head.appendChild(link)
  }
}
