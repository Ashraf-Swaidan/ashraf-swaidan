import type { WorkProject } from "@/data/selectedWorks"

export type AppKind =
  | "chatgpt"
  | "gmail"
  | "instagram"
  | "linkedin"
  | "whatsapp"
  | "youtube"
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

/** Spotify playlist session: one iframe owned by the phone shell (best-effort persistence). */
export type SpotifyBackgroundSession = {
  playlistId: string
  embedUrl: string
  openUrl: string
  /** Primary line in notifications (playlist / track name). */
  displayTitle: string
  /** Subtitle (creator or artist). */
  displayArtist: string
  thumb?: string
}

export type SpotifyPlayerDockRect = {
  top: number
  left: number
  width: number
  height: number
}

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
