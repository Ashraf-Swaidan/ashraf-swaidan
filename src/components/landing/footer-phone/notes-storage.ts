export const NOTES_VISITOR_STORAGE_KEY = "footer-phone-visitor-notes-v1"
export const NOTES_VISITOR_SCHEMA_VERSION = 1
export const NOTES_VISITOR_MAX_NOTES = 40

const VISITOR_FOLDER_ID = "visitor-notes"

export type VisitorNoteRecord = {
  id: string
  folderId: string
  title: string
  body: string
  createdAt: number
  updatedAt: number
}

type VisitorNotesStore = {
  schemaVersion: number
  notes: VisitorNoteRecord[]
}

function newId(): string {
  return crypto.randomUUID()
}

function trimOldest(notes: VisitorNoteRecord[]): VisitorNoteRecord[] {
  if (notes.length <= NOTES_VISITOR_MAX_NOTES) return notes
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted.slice(0, NOTES_VISITOR_MAX_NOTES)
}

function sanitizeNote(raw: unknown, i: number): VisitorNoteRecord | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  const id = typeof o.id === "string" && o.id ? o.id : `v-${Date.now()}-${i}`
  const folderId =
    typeof o.folderId === "string" && o.folderId ? o.folderId : VISITOR_FOLDER_ID
  const title = typeof o.title === "string" ? o.title : ""
  const body = typeof o.body === "string" ? o.body : ""
  const createdAt =
    typeof o.createdAt === "number" ? o.createdAt : Date.now()
  const updatedAt =
    typeof o.updatedAt === "number" ? o.updatedAt : createdAt
  return {
    id,
    folderId,
    title,
    body,
    createdAt,
    updatedAt,
  }
}

function parseStore(raw: string | null): VisitorNotesStore | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as Partial<VisitorNotesStore>
    if (
      data.schemaVersion !== NOTES_VISITOR_SCHEMA_VERSION ||
      !Array.isArray(data.notes)
    ) {
      return null
    }
    const notes = data.notes
      .map((n, i) => sanitizeNote(n, i))
      .filter(Boolean) as VisitorNoteRecord[]
    return {
      schemaVersion: NOTES_VISITOR_SCHEMA_VERSION,
      notes: trimOldest(notes),
    }
  } catch {
    return null
  }
}

export function loadVisitorNotesStore(): VisitorNotesStore {
  const fromLocal = parseStore(
    typeof window !== "undefined"
      ? window.localStorage.getItem(NOTES_VISITOR_STORAGE_KEY)
      : null
  )
  if (fromLocal) return fromLocal
  return {
    schemaVersion: NOTES_VISITOR_SCHEMA_VERSION,
    notes: [],
  }
}

export function persistVisitorNotesStore(store: VisitorNotesStore) {
  if (typeof window === "undefined") return
  const trimmed = {
    ...store,
    notes: trimOldest(store.notes),
  }
  window.localStorage.setItem(
    NOTES_VISITOR_STORAGE_KEY,
    JSON.stringify(trimmed)
  )
}

export function visitorNotesInFolder(
  notes: VisitorNoteRecord[],
  folderId: string
): VisitorNoteRecord[] {
  return notes.filter((n) => n.folderId === folderId)
}

export function visitorNoteCountByFolderId(
  notes: VisitorNoteRecord[]
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const n of notes) {
    counts[n.folderId] = (counts[n.folderId] ?? 0) + 1
  }
  return counts
}

export function createVisitorNote(
  store: VisitorNotesStore,
  title: string,
  body: string
): VisitorNotesStore {
  const now = Date.now()
  const note: VisitorNoteRecord = {
    id: newId(),
    folderId: VISITOR_FOLDER_ID,
    title: title.trim() || "New note",
    body,
    createdAt: now,
    updatedAt: now,
  }
  return persistAndReturn({
    ...store,
    notes: trimOldest([note, ...store.notes]),
  })
}

export function updateVisitorNote(
  store: VisitorNotesStore,
  id: string,
  patch: Partial<Pick<VisitorNoteRecord, "title" | "body">>
): VisitorNotesStore {
  const now = Date.now()
  const notes = store.notes.map((n) => {
    if (n.id !== id) return n
    return {
      ...n,
      title:
        typeof patch.title === "string"
          ? patch.title.trim() || n.title
          : n.title,
      body: typeof patch.body === "string" ? patch.body : n.body,
      updatedAt: now,
    }
  })
  return persistAndReturn({ ...store, notes: trimOldest(notes) })
}

export function deleteVisitorNote(
  store: VisitorNotesStore,
  id: string
): VisitorNotesStore {
  const notes = store.notes.filter((n) => n.id !== id)
  return persistAndReturn({ ...store, notes })
}

function persistAndReturn(store: VisitorNotesStore): VisitorNotesStore {
  persistVisitorNotesStore(store)
  return store
}
