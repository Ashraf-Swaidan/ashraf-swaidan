import { SELECTED_WORKS_VIDEO_PRELOAD_ORDER } from "@/constants/selectedWorksVideos"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"

/**
 * Hint the network layer before React mounts: Selected Works WebPs, logos, and
 * carousel MP4s all use high fetch priority. Defer only Papion "Uncommon beats"
 * spotlight media on that case page (see {@link CaseStudyFigure} `fetchPriority`).
 */
export function injectLandingResourceHints() {
  for (const project of SELECTED_WORKS_PROJECTS) {
    for (const href of [project.imageSrc, project.logoSrc]) {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = href
      link.setAttribute("fetchpriority", "high")
      document.head.appendChild(link)
    }
  }

  for (const href of SELECTED_WORKS_VIDEO_PRELOAD_ORDER) {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "video"
    link.type = "video/mp4"
    link.href = href
    link.setAttribute("fetchpriority", "high")
    document.head.appendChild(link)
  }
}
