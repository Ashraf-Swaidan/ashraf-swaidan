import { SELECTED_WORKS_VIDEOS } from "@/constants/selectedWorksVideos"

export type WorkProject = {
  id: string
  title: string
  description: string
  logoSrc: string
  imageSrc: string
  videoSrc: string
  href: string
}

export const SELECTED_WORKS_PROJECTS: WorkProject[] = [
  {
    id: "papion",
    title: "Papion System",
    description:
      "A production-grade operations command center built for Papion; a multi-branch event decorations business. It unifies every business aspect into a single, high-performance interface that powers real-world daily execution.",
    logoSrc: "/assets/selected-works-logos/papion-logo.svg",
    imageSrc: "/assets/lap-animation-assets/papion-lap.jpg",
    videoSrc: SELECTED_WORKS_VIDEOS.papion,
    href: "/works/papion-system",
  },
  {
    id: "duwit",
    title: "Duwit",
    description:
      "An intelligent execution partner that bridges the gap between ambition and action. Using adaptive AI coaching and durable memory, it turns vague goals into structured, phased roadmaps that evolve with your progress.",
    logoSrc: "/assets/selected-works-logos/duwit-logo.svg",
    imageSrc: "/assets/lap-animation-assets/duwit-lap.jpg",
    videoSrc: SELECTED_WORKS_VIDEOS.duwit,
    href: "/works/duwit",
  },
  {
    id: "ak-system",
    title: "Ak System",
    description:
      "A high-performance retail operating system built for an electronics business. It replaces fragmented manual processes with a calm, bilingual workspace that masters inventory precision and storefront control.",
    logoSrc: "/assets/selected-works-logos/ak-logo.svg",
    imageSrc: "/assets/lap-animation-assets/ak-lap.jpg",
    videoSrc: SELECTED_WORKS_VIDEOS.ak,
    href: "/works/ak-system",
  },
  {
    id: "twodo",
    title: "Twodo",
    description:
      "A task management experiment focused on absolute simplicity. Built with a 'one-click' mindset, it strips away the noise to provide a collaborative, low-friction surface where focus remains on the work, not the tool.",
    logoSrc: "/assets/selected-works-logos/twodo-logo.png",
    imageSrc: "/assets/lap-animation-assets/twodo-lap.jpg",
    videoSrc: SELECTED_WORKS_VIDEOS.twodo,
    href: "/works/twodo",
  },
]
