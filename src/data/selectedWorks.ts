import { SELECTED_WORKS_VIDEOS } from "@/constants/selectedWorksVideos"

export type WorkProject = {
  id: string
  title: string
  description: string
  logoSrc: string
  imageSrc: string
  videoSrc: string
  href: string
  /** Public deploy URL — embedded in-phone when set; otherwise the portfolio case study `href`. */
  liveSiteUrl?: string
  /** Highlights the project in Selected Works (e.g. newest case study). */
  isNew?: boolean
}

export const SELECTED_WORKS_PROJECTS: WorkProject[] = [
  {
    id: "luxian",
    title: "Luxian",
    description:
      "Full-stack tropical commerce on NestJS, PostgreSQL, and Next.js. Not a storefront template. Editorial discovery up front, operator-grade admin behind it, one inventory ledger holding both together. Shipped live.",
    logoSrc: "/assets/selected-works-logos/luxian-logo.png",
    imageSrc: "/assets/lap-animation-assets/luxian-lap.webp",
    videoSrc: SELECTED_WORKS_VIDEOS.luxian,
    href: "/works/luxian",
    liveSiteUrl: "https://luxian-three.vercel.app/",
    isNew: true,
  },
  {
    id: "papion",
    title: "Papion System",
    description:
      "A production-grade operations command center built for Papion; a multi-branch event decorations business. It unifies every business aspect into a single, high-performance interface that powers real-world daily execution.",
    logoSrc: "/assets/selected-works-logos/papion-logo.svg",
    imageSrc: "/assets/lap-animation-assets/papion-lap.webp",
    videoSrc: SELECTED_WORKS_VIDEOS.papion,
    href: "/works/papion-system",
  },
  {
    id: "duwit",
    title: "Duwit",
    description:
      "An intelligent execution partner that bridges the gap between ambition and action. Using adaptive AI coaching and durable memory, it turns vague goals into structured, phased roadmaps that evolve with your progress.",
    logoSrc: "/assets/selected-works-logos/duwit-logo.svg",
    imageSrc: "/assets/lap-animation-assets/duwit-lap.webp",
    videoSrc: SELECTED_WORKS_VIDEOS.duwit,
    href: "/works/duwit",
    liveSiteUrl: "https://duwit-45a37.web.app/",
  },
  {
    id: "ak-system",
    title: "Ak System",
    description:
      "A high-performance retail operating system built for an electronics business. It replaces fragmented manual processes with a calm, bilingual workspace that masters inventory precision and storefront control.",
    logoSrc: "/assets/selected-works-logos/ak-logo.svg",
    imageSrc: "/assets/lap-animation-assets/ak-lap.webp",
    videoSrc: SELECTED_WORKS_VIDEOS.ak,
    href: "/works/ak-system",
  },
  {
    id: "twodo",
    title: "Twodo",
    description:
      "A task management experiment focused on absolute simplicity. Built with a 'one-click' mindset, it strips away the noise to provide a collaborative, low-friction surface where focus remains on the work, not the tool.",
    logoSrc: "/assets/selected-works-logos/twodo-logo.png",
    imageSrc: "/assets/lap-animation-assets/twodo-lap.webp",
    videoSrc: SELECTED_WORKS_VIDEOS.twodo,
    href: "/works/twodo",
    liveSiteUrl: "https://twodo.ashraf-swaidan-10.workers.dev/login",
  },
]
