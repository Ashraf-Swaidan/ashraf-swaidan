import {
  AUTHOR_NOTES,
  NOTES_FOLDERS,
  type AuthorNote,
} from "../components/landing/footer-phone/notes-data.ts"
import {
  loadVisitorNotesStore,
  type VisitorNoteRecord,
} from "../components/landing/footer-phone/notes-storage.ts"

type AnyNote = (AuthorNote | VisitorNoteRecord) & { source: "author" | "visitor" }

export type AshAiUiNoteLink = {
  noteId: string
  title: string
  folderId: string
  folderLabel: string
  source: "author" | "visitor"
  excerpt: string
}

export type AuthoredAshAiNoteContext = {
  noteId: string
  folderId: string
  folderLabel: string
  title: string
  body: string
  excerpt: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

function previewBody(text: string, max = 110): string {
  const line = text.replace(/\s+/g, " ").trim()
  if (line.length <= max) return line
  return `${line.slice(0, max - 1)}…`
}

function folderLabelById(): Record<string, string> {
  return Object.fromEntries(
    NOTES_FOLDERS.map((folder) => [folder.id, folder.label])
  ) as Record<string, string>
}

export function listAuthoredNotes(): AuthorNote[] {
  return [...AUTHOR_NOTES].sort((a, b) => b.updatedAt - a.updatedAt)
}

export function listVisitorNotes(): VisitorNoteRecord[] {
  return [...loadVisitorNotesStore().notes].sort((a, b) => b.updatedAt - a.updatedAt)
}

function listNotes(): AnyNote[] {
  const visitor = listVisitorNotes().map(
    (note): AnyNote => ({ ...note, source: "visitor" })
  )
  const author = listAuthoredNotes().map(
    (note): AnyNote => ({ ...note, source: "author" })
  )
  return [...author, ...visitor].sort((a, b) => b.updatedAt - a.updatedAt)
}

export function authoredAshAiNoteContext(): AuthoredAshAiNoteContext[] {
  const labels = folderLabelById()
  return listAuthoredNotes().map((note) => ({
    noteId: note.id,
    folderId: note.folderId,
    folderLabel: labels[note.folderId] ?? note.folderId,
    title: note.title,
    body: note.body,
    excerpt: previewBody(note.body, 180),
    tags: note.tags ?? [],
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }))
}

export function resolveAshAiNoteLink(noteId: string): AshAiUiNoteLink | null {
  const labels = folderLabelById()
  const note = listNotes().find((entry) => entry.id === noteId)
  if (!note) return null
  return {
    noteId: note.id,
    title: note.title,
    folderId: note.folderId,
    folderLabel: labels[note.folderId] ?? note.folderId,
    source: note.source,
    excerpt: previewBody(note.body),
  }
}

export function normalizeAshAiNoteLinks(raw: unknown): AshAiUiNoteLink[] {
  if (!Array.isArray(raw)) return []
  const out: AshAiUiNoteLink[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const noteId = (item as { noteId?: unknown }).noteId
    if (typeof noteId !== "string") continue
    const resolved = resolveAshAiNoteLink(noteId)
    if (!resolved || seen.has(resolved.noteId)) continue
    seen.add(resolved.noteId)
    out.push(resolved)
    if (out.length >= 8) break
  }
  return out
}

export function noteRefsForPersistence(
  links: AshAiUiNoteLink[] | undefined
): { noteId: string }[] | undefined {
  if (!links?.length) return undefined
  return links.map((link) => ({ noteId: link.noteId }))
}

export function rehydrateAshAiNoteLinksFromStorage(
  raw: unknown
): AshAiUiNoteLink[] | undefined {
  const normalized = normalizeAshAiNoteLinks(raw)
  return normalized.length ? normalized : undefined
}
