import { SELECTED_WORKS_PROJECTS, type WorkProject } from "@/data/selectedWorks"

import papionLogoFromContext from "../../context-ai/works/papion-system/papion-logo.svg?url"

export type AshAiWorkId = WorkProject["id"]

export type AshAiUiLink = {
  workId: AshAiWorkId
  href: string
  title: string
  logoSrc: string
  liveSiteUrl?: string
  availabilityLabel: string
}

const projectsById = Object.fromEntries(
  SELECTED_WORKS_PROJECTS.map((p) => [p.id, p])
) as Record<AshAiWorkId, WorkProject>

const LOGO_SRC_BY_WORK: Partial<Record<AshAiWorkId, string>> = {
  papion: papionLogoFromContext,
}

export function resolveAshAiWorkLink(workId: string): AshAiUiLink | null {
  const project = projectsById[workId as AshAiWorkId]
  if (!project) return null
  return {
    workId: project.id,
    href: project.href,
    title: project.title,
    logoSrc: LOGO_SRC_BY_WORK[project.id] ?? project.logoSrc,
    liveSiteUrl: project.liveSiteUrl,
    availabilityLabel: project.liveSiteUrl
      ? "Case study + live site"
      : "Case study",
  }
}

const MAX_LINKS = 6

export function normalizeAshAiWorkLinks(raw: unknown): AshAiUiLink[] {
  if (!Array.isArray(raw)) return []
  const out: AshAiUiLink[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const workId = (item as { workId?: unknown }).workId
    if (typeof workId !== "string") continue
    const resolved = resolveAshAiWorkLink(workId)
    if (!resolved || seen.has(resolved.workId)) continue
    seen.add(resolved.workId)
    out.push(resolved)
    if (out.length >= MAX_LINKS) break
  }
  return out
}

export function rehydrateAshAiLinksFromStorage(
  raw: unknown
): AshAiUiLink[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  const ids = raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null
      const w = (entry as { workId?: unknown }).workId
      return typeof w === "string" ? { workId: w } : null
    })
    .filter((x): x is { workId: string } => x !== null)
  const normalized = normalizeAshAiWorkLinks(ids)
  return normalized.length ? normalized : undefined
}
