import { SELECTED_WORKS_VIDEO_PRELOAD_ORDER } from "@/constants/selectedWorksVideos"

/**
 * Warm HTTP cache equally for each Selected Works clip (low priority so they
 * race fairly; avoids biasing bandwidth toward a single carousel MP4).
 */
export function injectSelectedWorksVideoHints() {
  for (const href of SELECTED_WORKS_VIDEO_PRELOAD_ORDER) {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = href
    link.as = "video"
    document.head.appendChild(link)
  }
}
