import type { WorkProject } from "@/data/selectedWorks"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"

import type { AshAiWorkId } from "@/lib/ashAiWorkLinks"

const projectsById = Object.fromEntries(
  SELECTED_WORKS_PROJECTS.map((p) => [p.id, p])
) as Record<AshAiWorkId, WorkProject>

export type AshAiUiArtifact = {
  artifactId: string
  title: string
  subtitle?: string
  description: string
  kind: "video" | "image"
  mediaSrc: string
  mediaAlt: string
  ctaLabel: string
  href?: string
  workId?: AshAiWorkId
}

type CatalogEntry = Omit<AshAiUiArtifact, "artifactId">

const CATALOG: Record<string, CatalogEntry> = {
  "papion-uncommon-beat": {
    title: "Papion — execution pulse",
    subtitle: "Uncommon beat",
    description:
      "Operations density that still reads calm: orders, money, branches, and follow-ups in one pass — the kind of “boring” reliability that takes real product craft.",
    kind: "video",
    mediaSrc: "/assets/papion-page/papion-videos/insights-video.mp4",
    mediaAlt: "Papion operations insights preview",
    ctaLabel: "Open Papion case study",
    workId: "papion",
    href: projectsById.papion?.href,
  },
  "duwit-execution-loop": {
    title: "Duwit — goals into motion",
    subtitle: "Execution loop",
    description:
      "Turning fuzzy ambition into phased steps you can actually move — coaching, memory, and a UI that keeps the roadmap from dissolving.",
    kind: "video",
    mediaSrc: "/assets/lap-animation-assets/duwit.mp4",
    mediaAlt: "Duwit product motion preview",
    ctaLabel: "Open Duwit case study",
    workId: "duwit",
    href: projectsById.duwit?.href,
  },
  "ak-system-surface-calm": {
    title: "AK System — bilingual retail OS",
    subtitle: "Calm under inventory load",
    description:
      "A storefront + back-office rhythm built for precision: inventory truth, bilingual clarity, and controls that don’t panic when the day gets loud.",
    kind: "video",
    mediaSrc: "/assets/lap-animation-assets/ak.mp4",
    mediaAlt: "AK System preview",
    ctaLabel: "Open AK System case study",
    workId: "ak-system",
    href: projectsById["ak-system"]?.href,
  },
}

/** Human-readable list for the system prompt — model must only use these IDs. */
export function ashAiArtifactPromptTable(): string {
  return Object.entries(CATALOG)
    .map(
      ([id, e]) =>
        `- artifactId "${id}" — ${e.title}${e.workId ? ` (${e.workId})` : ""}`
    )
    .join("\n")
}

export function isAshAiArtifactId(value: string): value is keyof typeof CATALOG {
  return Object.prototype.hasOwnProperty.call(CATALOG, value)
}

export function resolveAshAiArtifact(artifactId: string): AshAiUiArtifact | null {
  const entry = CATALOG[artifactId]
  if (!entry) return null
  return { artifactId, ...entry }
}

const MAX_ARTIFACTS = 2

export function normalizeAshAiArtifacts(raw: unknown): AshAiUiArtifact[] {
  if (!Array.isArray(raw)) return []
  const out: AshAiUiArtifact[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const artifactId = (item as { artifactId?: unknown }).artifactId
    if (typeof artifactId !== "string" || !artifactId.trim()) continue
    const resolved = resolveAshAiArtifact(artifactId.trim())
    if (!resolved || seen.has(resolved.artifactId)) continue
    seen.add(resolved.artifactId)
    out.push(resolved)
    if (out.length >= MAX_ARTIFACTS) break
  }
  return out
}

/** Restore from localStorage (artifactId blobs or legacy full objects). */
export function rehydrateAshAiArtifactsFromStorage(
  raw: unknown
): AshAiUiArtifact[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  const ids = raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null
      const o = entry as { artifactId?: unknown }
      if (typeof o.artifactId === "string") return { artifactId: o.artifactId }
      return null
    })
    .filter((x): x is { artifactId: string } => x !== null)
  const normalized = normalizeAshAiArtifacts(ids)
  return normalized.length ? normalized : undefined
}

/** Strip to persistable shape (IDs only). */
export function artifactRefsForPersistence(
  artifacts: AshAiUiArtifact[] | undefined
): { artifactId: string }[] | undefined {
  if (!artifacts?.length) return undefined
  return artifacts.map((a) => ({ artifactId: a.artifactId }))
}
