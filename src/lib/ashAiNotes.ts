import {
  AUTHOR_NOTES,
  NOTES_FOLDERS,
  type AuthorNote,
} from "@/components/landing/footer-phone/notes-data"
import {
  loadVisitorNotesStore,
  type VisitorNoteRecord,
} from "@/components/landing/footer-phone/notes-storage"

type AnyNote = (AuthorNote | VisitorNoteRecord) & { source: "author" | "visitor" }

export type AshAiUiNoteLink = {
  noteId: string
  title: string
  folderId: string
  folderLabel: string
  source: "author" | "visitor"
  excerpt: string
}

function previewBody(text: string, max = 110): string {
  const line = text.replace(/\s+/g, " ").trim()
  if (line.length <= max) return line
  return `${line.slice(0, max - 1)}…`
}

function listNotes(): AnyNote[] {
  const visitor = loadVisitorNotesStore().notes.map(
    (note): AnyNote => ({ ...note, source: "visitor" })
  )
  const author = AUTHOR_NOTES.map((note): AnyNote => ({ ...note, source: "author" }))
  return [...author, ...visitor].sort((a, b) => b.updatedAt - a.updatedAt)
}

export function ashAiNotesContextBlock(): string {
  const folderLabelById = Object.fromEntries(
    NOTES_FOLDERS.map((folder) => [folder.id, folder.label])
  ) as Record<string, string>

  const notes = listNotes()
  if (notes.length === 0) {
    return "No notes available right now."
  }

  const rows = notes.map((note) => {
    const folderLabel = folderLabelById[note.folderId] ?? note.folderId
    return `- noteId "${note.id}" | source=${note.source} | folder="${folderLabel}" | title="${note.title}" | excerpt="${previewBody(note.body)}"`
  })
  return rows.join("\n")
}

export function resolveAshAiNoteLink(noteId: string): AshAiUiNoteLink | null {
  const folderLabelById = Object.fromEntries(
    NOTES_FOLDERS.map((folder) => [folder.id, folder.label])
  ) as Record<string, string>
  const note = listNotes().find((entry) => entry.id === noteId)
  if (!note) return null
  return {
    noteId: note.id,
    title: note.title,
    folderId: note.folderId,
    folderLabel: folderLabelById[note.folderId] ?? note.folderId,
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
    if (out.length >= 2) break
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
