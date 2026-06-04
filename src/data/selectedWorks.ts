import { SELECTED_WORKS_VIDEOS } from "@/constants/selectedWorksVideos"

export type WorkProjectTag = {
  label: string
  className: string
}

export type WorkProject = {
  id: string
  title: string
  description: string
  logoSrc: string
  imageSrc: string
  videoSrc: string
  href: string
  /** Minimal uppercase pills — case study hero + Selected Works rail. */
  tags?: readonly WorkProjectTag[]
  /** Public deploy URL — embedded in-phone when set; otherwise the portfolio case study `href`. */
  liveSiteUrl?: string
  /** Case study page is live but still being expanded — show In Progress badge in Selected Works. */
  caseStudyInProgress?: boolean
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
    id: "smartar",
    title: "SMARTAR",
    description:
      "A Shopify store on a custom Liquid theme we built from scratch—not a known theme reskin. AI is integrated into the shopping journey so the storefront feels guided and brand-owned while checkout stays on Shopify.",
    logoSrc: "/assets/selected-works-logos/smartar-logo.png",
    imageSrc: "/assets/lap-animation-assets/smartar-lap.webp",
    videoSrc: SELECTED_WORKS_VIDEOS.smartar,
    href: "/works/smartar",
    liveSiteUrl: "https://vxjspu-kw.myshopify.com/",
    caseStudyInProgress: true,
    tags: [
      {
        label: "Shopify",
        className: "bg-emerald-300 text-emerald-950",
      },
      {
        label: "AI Powered",
        className:
          "border border-[var(--color-drh-ink)]/10 bg-white text-[var(--color-drh-ink)]/85 shadow-[0_6px_18px_rgb(10_10_10/0.05)]",
      },
    ],
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
    tags: [
      {
        label: "Goal → roadmap",
        className:
          "border border-orange-200/90 bg-orange-50 text-orange-950 shadow-[0_6px_18px_rgb(255_122_0/0.12)]",
      },
      {
        label: "AI Powered",
        className:
          "border border-[var(--color-drh-ink)]/10 bg-white text-[var(--color-drh-ink)]/85 shadow-[0_6px_18px_rgb(10_10_10/0.05)]",
      },
    ],
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
