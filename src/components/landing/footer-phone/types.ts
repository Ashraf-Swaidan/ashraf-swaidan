import type { WorkProject } from "@/data/selectedWorks"

export type AppKind =
  | "chatgpt"
  | "gmail"
  | "instagram"
  | "linkedin"
  | "whatsapp"
  | "media"
  | "settings"
  | "photos"
  | "camera"
  | "files"
  | "notes"
  | "phone"
  | "safari"
  | "project"

export type BaseApp = {
  id: string
  kind: AppKind
  label: string
  iconSrc: string
}

export type StandardApp = BaseApp & {
  kind: Exclude<AppKind, "project">
  title: string
  body: string
  href?: string
  cta?: string
}

export type ProjectApp = BaseApp & {
  kind: "project"
  project: WorkProject
}

export type PhoneApp = StandardApp | ProjectApp

export type PapionMobileTabId = "today" | "sales" | "expenses" | "ai"

export type PapionMobileTab = {
  id: PapionMobileTabId
  label: string
  eyebrow: string
  title: string
  body: string
  accent: string
  proofLabel: string
  media?: {
    kind: "image"
    src: string
    alt: string
  }
  metrics?: { label: string; value: string }[]
  list?: string[]
  query?: string
  answer?: string[]
  ctaLabel?: string
}
