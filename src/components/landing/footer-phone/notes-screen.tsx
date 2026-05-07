import { Fragment, useCallback, useEffect, useMemo, useState } from "react"

import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderPlus,
  ListTodo,
  MoreHorizontal,
  PenLine,
  Search,
  Share,
  SquarePen,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { BODY_FONT, CHAT_APP_UI_FONT, GMAIL_ADDRESS } from "./constants"
import {
  AUTHOR_NOTES,
  NOTES_ACCENT,
  NOTES_FOLDERS,
  NOTES_STATIC_TAGS,
  type AuthorNote,
  authorNoteCountByFolderId,
  authorNotesInFolder,
} from "./notes-data"
import {
  createVisitorNote,
  deleteVisitorNote,
  loadVisitorNotesStore,
  type VisitorNoteRecord,
  visitorNoteCountByFolderId,
  visitorNotesInFolder,
  updateVisitorNote,
} from "./notes-storage"
import {
  requestNotesDeepLink,
  type NotesDeepLinkDetail,
} from "@/lib/notesDeepLink"

const SCROLL_HIDE =
  "overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

const IOS_GROUPED_BG = "#f2f2f7"

type ViewMode = "folders" | "list" | "detail" | "compose"

type UnifiedNote =
  | { source: "author"; note: AuthorNote }
  | { source: "visitor"; note: VisitorNoteRecord }

function formatListDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function noteUpdatedAt(u: UnifiedNote): number {
  return u.source === "author" ? u.note.updatedAt : u.note.updatedAt
}

function noteTitle(u: UnifiedNote): string {
  return u.source === "author" ? u.note.title : u.note.title
}

function noteBody(u: UnifiedNote): string {
  return u.source === "author" ? u.note.body : u.note.body
}

function mergeFolderNotes(
  folderId: string,
  visitorList: VisitorNoteRecord[]
): UnifiedNote[] {
  const author = authorNotesInFolder(folderId).map(
    (note): UnifiedNote => ({ source: "author", note })
  )
  const visitor = visitorNotesInFolder(visitorList, folderId).map(
    (note): UnifiedNote => ({ source: "visitor", note })
  )
  return [...author, ...visitor].sort(
    (a, b) => noteUpdatedAt(b) - noteUpdatedAt(a)
  )
}

function previewBody(text: string, max = 80): string {
  const line = text.replace(/\s+/g, " ").trim()
  if (line.length <= max) return line
  return `${line.slice(0, max - 1)}…`
}

const INLINE_LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g

function renderNoteBody(text: string) {
  const lines = text.split("\n")
  return lines.map((line, lineIndex) => {
    const segments: Array<string | { label: string; href: string }> = []
    let lastIndex = 0
    let match: RegExpExecArray | null = INLINE_LINK_PATTERN.exec(line)

    while (match) {
      const [full, label, href] = match
      const start = match.index
      if (start > lastIndex) segments.push(line.slice(lastIndex, start))
      segments.push({ label, href })
      lastIndex = start + full.length
      match = INLINE_LINK_PATTERN.exec(line)
    }

    if (lastIndex < line.length) segments.push(line.slice(lastIndex))
    INLINE_LINK_PATTERN.lastIndex = 0

    if (segments.length === 0) segments.push(line)

    return (
      <Fragment key={`line-${lineIndex}`}>
        {segments.map((segment, segIndex) =>
          typeof segment === "string" ? (
            <Fragment key={`text-${lineIndex}-${segIndex}`}>{segment}</Fragment>
          ) : (
            <a
              key={`link-${lineIndex}-${segIndex}`}
              href={segment.href}
              className="font-semibold underline underline-offset-2"
              style={{ color: NOTES_ACCENT }}
              onClick={(e) => {
                if (!segment.href.startsWith("note://")) return
                e.preventDefault()
                requestNotesDeepLink({
                  noteId: segment.href.replace("note://", ""),
                })
              }}
            >
              {segment.label}
            </a>
          )
        )}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </Fragment>
    )
  })
}

export function NotesScreen({
  deepLink,
  onConsumeDeepLink,
}: {
  deepLink?: NotesDeepLinkDetail | null
  onConsumeDeepLink?: () => void
}) {
  const [view, setView] = useState<ViewMode>("folders")
  const [folderId, setFolderId] = useState<string | null>(null)
  const [active, setActive] = useState<UnifiedNote | null>(null)
  const [visitorStore, setVisitorStore] = useState(loadVisitorNotesStore)
  const [listQuery, setListQuery] = useState("")
  const [foldersEdit, setFoldersEdit] = useState(false)
  const [detailMenuOpen, setDetailMenuOpen] = useState(false)

  const [composeId, setComposeId] = useState<string | null>(null)
  const [composeTitle, setComposeTitle] = useState("")
  const [composeBody, setComposeBody] = useState("")

  useEffect(() => {
    setVisitorStore(loadVisitorNotesStore())
  }, [])

  const authorCounts = useMemo(() => authorNoteCountByFolderId(), [])
  const visitorCounts = useMemo(
    () => visitorNoteCountByFolderId(visitorStore.notes),
    [visitorStore.notes]
  )

  const folderDisplayCount = useCallback(
    (id: string) => (authorCounts[id] ?? 0) + (visitorCounts[id] ?? 0),
    [authorCounts, visitorCounts]
  )

  const openFolder = useCallback((id: string) => {
    setFolderId(id)
    setListQuery("")
    setView("list")
  }, [])

  const openDetail = useCallback((u: UnifiedNote) => {
    setActive(u)
    setDetailMenuOpen(false)
    setView("detail")
  }, [])

  const goFolders = useCallback(() => {
    setView("folders")
    setFolderId(null)
    setActive(null)
    setDetailMenuOpen(false)
  }, [])

  const goList = useCallback(() => {
    setActive(null)
    setDetailMenuOpen(false)
    setView("list")
  }, [])

  const openComposeNew = useCallback(() => {
    setComposeId(null)
    setComposeTitle("")
    setComposeBody("")
    setView("compose")
  }, [])

  const openComposeEdit = useCallback((n: VisitorNoteRecord) => {
    setComposeId(n.id)
    setComposeTitle(n.title)
    setComposeBody(n.body)
    setView("compose")
  }, [])

  const saveCompose = useCallback(() => {
    if (composeId) {
      setVisitorStore((s) =>
        updateVisitorNote(s, composeId, {
          title: composeTitle,
          body: composeBody,
        })
      )
    } else {
      setVisitorStore((s) => createVisitorNote(s, composeTitle, composeBody))
    }
    setFolderId("visitor-notes")
    setView("list")
    setComposeId(null)
  }, [composeBody, composeId, composeTitle])

  const deleteActiveVisitor = useCallback(() => {
    if (!active || active.source !== "visitor") return
    setVisitorStore((s) => deleteVisitorNote(s, active.note.id))
    setDetailMenuOpen(false)
    goList()
  }, [active, goList])

  const mergedList = useMemo(() => {
    if (!folderId || folderId === "recently-deleted") return []
    return mergeFolderNotes(folderId, visitorStore.notes)
  }, [folderId, visitorStore.notes])

  const filteredList = useMemo(() => {
    const q = listQuery.trim().toLowerCase()
    if (!q) return mergedList
    return mergedList.filter((u) => {
      const t = noteTitle(u).toLowerCase()
      const b = noteBody(u).toLowerCase()
      return t.includes(q) || b.includes(q)
    })
  }, [mergedList, listQuery])

  useEffect(() => {
    if (!deepLink?.noteId) return
    const noteId = deepLink.noteId
    const author = AUTHOR_NOTES.find((n) => n.id === noteId)
    const visitor = visitorStore.notes.find((n) => n.id === noteId)
    const hit = author
      ? ({ source: "author", note: author } as UnifiedNote)
      : visitor
        ? ({ source: "visitor", note: visitor } as UnifiedNote)
        : null
    if (!hit) return
    setFolderId(hit.note.folderId)
    setListQuery("")
    setActive(hit)
    setDetailMenuOpen(false)
    setView("detail")
    onConsumeDeepLink?.()
  }, [deepLink, onConsumeDeepLink, visitorStore.notes])

  const folderMeta = useMemo(
    () => NOTES_FOLDERS.find((f) => f.id === folderId) ?? null,
    [folderId]
  )

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden text-black"
      style={{ backgroundColor: view === "detail" ? "#fff" : IOS_GROUPED_BG }}
    >
      {view === "folders" ? (
        <>
          <div
            className="flex shrink-0 items-center justify-between px-3 pb-1 pt-0.5"
            style={{ backgroundColor: IOS_GROUPED_BG }}
          >
            <span className="w-14" aria-hidden />
            <h1
              className="text-[1.05rem] font-semibold"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              Folders
            </h1>
            <button
              type="button"
              onClick={() => setFoldersEdit((e) => !e)}
              className="w-14 text-right text-[1rem] font-normal"
              style={{ color: NOTES_ACCENT }}
            >
              {foldersEdit ? "Done" : "Edit"}
            </button>
          </div>

          <div
            className={cn("min-h-0 flex-1 overflow-y-auto px-3 pb-24", SCROLL_HIDE)}
            style={{ backgroundColor: IOS_GROUPED_BG }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-[0.65rem] bg-white shadow-sm ring-1 ring-black/[0.06]">
              {NOTES_FOLDERS.map((f, i) => {
                const isTrash = f.kind === "trash"
                const count = isTrash ? 0 : folderDisplayCount(f.id)
                const showChevron = !isTrash
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      isTrash ? openFolder("recently-deleted") : openFolder(f.id)
                    }
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition active:bg-black/[0.04]",
                      i > 0 && "border-t border-black/[0.07]"
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center">
                      {isTrash ? (
                        <Trash2
                          className="size-6"
                          strokeWidth={1.6}
                          style={{ color: NOTES_ACCENT }}
                        />
                      ) : (
                        <Folder
                          className="size-7"
                          strokeWidth={1.35}
                          style={{ color: NOTES_ACCENT }}
                        />
                      )}
                    </span>
                    <span
                      className="min-w-0 flex-1 text-[1rem] font-normal"
                      style={{ fontFamily: CHAT_APP_UI_FONT }}
                    >
                      {f.label}
                    </span>
                    <span
                      className="shrink-0 text-[1rem] tabular-nums text-[#8e8e93]"
                      style={{ fontFamily: CHAT_APP_UI_FONT }}
                    >
                      {count}
                    </span>
                    {showChevron ? (
                      <ChevronRight
                        className="size-[1.1rem] shrink-0 text-[#c7c7cc]"
                        strokeWidth={2}
                      />
                    ) : (
                      <span className="w-3 shrink-0" aria-hidden />
                    )}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center gap-1 px-1 text-left"
              aria-expanded
            >
              <span
                className="text-[1.35rem] font-bold"
                style={{ fontFamily: CHAT_APP_UI_FONT }}
              >
                Tags
              </span>
              <ChevronRight
                className="size-4 rotate-90"
                style={{ color: NOTES_ACCENT }}
                strokeWidth={2.5}
                aria-hidden
              />
            </button>

            <div className="mt-2 overflow-hidden rounded-[0.65rem] bg-white px-2.5 py-2.5 shadow-sm ring-1 ring-black/[0.06]">
              <div className="flex flex-wrap gap-2">
                {NOTES_STATIC_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#e5e5ea] px-2.5 py-1 text-[0.78rem] font-medium text-[#3a3a3c]"
                    style={{ fontFamily: CHAT_APP_UI_FONT }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p
              className="mt-4 px-1 text-center text-[0.68rem] leading-snug text-[#8e8e93]"
              style={{ fontFamily: BODY_FONT }}
            >
              Visitor notes are saved on this device only — they aren&apos;t sent
              anywhere. Reach me at{" "}
              <a href={`mailto:${GMAIL_ADDRESS}`} className="underline">
                email
              </a>{" "}
              if you want me to read something.
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-between border-t border-black/8 bg-white/92 px-6 py-2.5 backdrop-blur-md">
            <button
              type="button"
              aria-label="New folder"
              className="pointer-events-auto text-[#c7c7cc]"
              disabled
            >
              <FolderPlus className="size-7" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="New note"
              className="pointer-events-auto"
              style={{ color: NOTES_ACCENT }}
              onClick={() => {
                openComposeNew()
                setFolderId("visitor-notes")
              }}
            >
              <SquarePen className="size-7" strokeWidth={1.5} />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-1 z-20 flex justify-center">
            <span className="h-1 w-28 rounded-full bg-neutral-900/22" aria-hidden />
          </div>
        </>
      ) : null}

      {view === "list" && folderId ? (
        <>
          <div className="flex shrink-0 items-center gap-2 border-b border-black/[0.07] bg-white px-2 py-1.5">
            <button
              type="button"
              onClick={goFolders}
              className="flex items-center gap-0 text-[1rem] font-normal"
              style={{ color: NOTES_ACCENT, fontFamily: CHAT_APP_UI_FONT }}
            >
              <ChevronLeft className="size-[1.35rem]" strokeWidth={2} />
              Folders
            </button>
            <span
              className="min-w-0 flex-1 truncate text-center text-[1.05rem] font-semibold"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              {folderMeta?.label ?? "Notes"}
            </span>
            <span className="w-16 shrink-0" aria-hidden />
          </div>

          {folderId === "recently-deleted" ? (
            <div
              className={cn("flex flex-1 flex-col items-center px-6 py-16", SCROLL_HIDE)}
              onWheel={(e) => e.stopPropagation()}
            >
              <Trash2
                className="mb-1 size-12 text-[#c7c7cc]"
                strokeWidth={1.25}
              />
              <p
                className="text-center text-[1rem] font-semibold"
                style={{ fontFamily: CHAT_APP_UI_FONT }}
              >
                Recently deleted
              </p>
              <p
                className="mt-2 text-center text-[0.88rem] text-[#8e8e93]"
                style={{ fontFamily: BODY_FONT }}
              >
                Nothing here yet. Deleted visitor notes aren&apos;t kept in this
                preview.
              </p>
            </div>
          ) : (
            <>
              <div className="shrink-0 bg-white px-3 pb-2 pt-2">
                <div className="flex items-center gap-2 rounded-xl bg-[#e5e5ea]/85 px-3 py-2">
                  <Search className="size-4 shrink-0 text-[#8e8e93]" />
                  <input
                    value={listQuery}
                    onChange={(e) => setListQuery(e.target.value)}
                    placeholder="Search"
                    className="min-w-0 flex-1 bg-transparent text-[1rem] text-black outline-none placeholder:text-[#8e8e93]"
                    style={{ fontFamily: CHAT_APP_UI_FONT }}
                  />
                </div>
              </div>
              <div
                className={cn(
                  "min-h-0 flex-1 overflow-y-auto bg-white px-0 pb-24",
                  SCROLL_HIDE
                )}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {filteredList.length === 0 ? (
                  <p
                    className="px-4 py-10 text-center text-[0.92rem] text-[#8e8e93]"
                    style={{ fontFamily: BODY_FONT }}
                  >
                    No notes match your search.
                  </p>
                ) : (
                  filteredList.map((u, idx) => (
                    <button
                      key={`${u.source}-${u.source === "author" ? u.note.id : u.note.id}`}
                      type="button"
                      onClick={() => openDetail(u)}
                      className={cn(
                        "flex w-full gap-3 px-4 py-3 text-left active:bg-black/[0.04]",
                        idx > 0 && "border-t border-black/[0.06]"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-[1rem] font-semibold"
                          style={{ fontFamily: CHAT_APP_UI_FONT }}
                        >
                          {noteTitle(u)}
                        </p>
                        <p
                          className="mt-0.5 line-clamp-2 text-[0.88rem] text-[#8e8e93]"
                          style={{ fontFamily: CHAT_APP_UI_FONT }}
                        >
                          {previewBody(noteBody(u))}
                        </p>
                      </div>
                      <span
                        className="shrink-0 text-[0.78rem] text-[#8e8e93]"
                        style={{ fontFamily: CHAT_APP_UI_FONT }}
                      >
                        {formatListDate(noteUpdatedAt(u))}
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-black/8 bg-white/92 py-2.5 backdrop-blur-md">
                <div className="pointer-events-auto flex justify-end px-5">
                  <button
                    type="button"
                    aria-label="New note"
                    style={{ color: NOTES_ACCENT }}
                    onClick={() => {
                      setFolderId("visitor-notes")
                      openComposeNew()
                    }}
                  >
                    <SquarePen className="size-7" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-1 z-20 flex justify-center">
                <span className="h-1 w-28 rounded-full bg-neutral-900/22" aria-hidden />
              </div>
            </>
          )}
        </>
      ) : null}

      {view === "detail" && active ? (
        <>
          <div className="relative flex shrink-0 items-center justify-between border-b border-black/[0.07] bg-white px-2 py-1.5">
            <button
              type="button"
              onClick={goList}
              className="flex min-w-0 items-center gap-0 text-[1rem] font-normal"
              style={{ color: NOTES_ACCENT, fontFamily: CHAT_APP_UI_FONT }}
            >
              <ChevronLeft className="size-[1.35rem] shrink-0" strokeWidth={2} />
              <span className="truncate">
                {folderMeta?.label ?? "Notes"}
              </span>
            </button>
            <div className="flex shrink-0 items-center gap-1 pr-1">
              <button
                type="button"
                aria-label="Share"
                className="grid size-9 place-items-center rounded-full active:bg-black/[0.05]"
                style={{ color: NOTES_ACCENT }}
                onClick={() => {
                  setDetailMenuOpen(false)
                  const text = `${noteTitle(active)}\n\n${noteBody(active)}`
                  void navigator.clipboard?.writeText(text)
                }}
              >
                <Share className="size-[1.35rem]" strokeWidth={1.5} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  aria-label="More"
                  className="grid size-9 place-items-center rounded-full active:bg-black/[0.05]"
                  style={{ color: NOTES_ACCENT }}
                  onClick={() => setDetailMenuOpen((o) => !o)}
                >
                  <MoreHorizontal className="size-[1.35rem]" strokeWidth={1.5} />
                </button>
                {detailMenuOpen && active.source === "visitor" ? (
                  <div className="absolute top-full right-0 z-30 mt-1 min-w-[9rem] overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-left text-[0.92rem] active:bg-black/[0.05]"
                      style={{ fontFamily: CHAT_APP_UI_FONT }}
                      onClick={() => {
                        setDetailMenuOpen(false)
                        openComposeEdit(active.note)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-left text-[0.92rem] text-rose-600 active:bg-rose-500/10"
                      style={{ fontFamily: CHAT_APP_UI_FONT }}
                      onClick={deleteActiveVisitor}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
                {detailMenuOpen && active.source === "author" ? (
                  <div className="absolute top-full right-0 z-30 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-black/10 bg-white px-4 py-3 shadow-lg">
                    <p
                      className="text-[0.78rem] leading-snug text-[#8e8e93]"
                      style={{ fontFamily: BODY_FONT }}
                    >
                      Portfolio notes are read-only. Add your own in{" "}
                      <strong>Visitor notes</strong>.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div
            className={cn("min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-3", SCROLL_HIDE)}
            style={{ backgroundColor: "#fff" }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onClick={() => setDetailMenuOpen(false)}
          >
            <h2
              className="text-[1.85rem] font-bold leading-tight tracking-[-0.02em]"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              {noteTitle(active)}
            </h2>
            {active.source === "visitor" ? (
              <p
                className="mt-1 text-[0.72rem] text-[#8e8e93]"
                style={{ fontFamily: CHAT_APP_UI_FONT }}
              >
                Your note — saved on this device only
              </p>
            ) : null}
            <p
              className="mt-4 whitespace-pre-wrap text-[1.05rem] leading-[1.45]"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              {renderNoteBody(noteBody(active))}
            </p>
            {active.source === "author" && active.note.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {active.note.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#f2f2f7] px-2.5 py-1 text-[0.76rem] text-[#636366]"
                    style={{ fontFamily: CHAT_APP_UI_FONT }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-black/8 bg-white/92 px-4 py-2.5 backdrop-blur-md">
            <div
              className="pointer-events-auto flex items-center justify-between"
              style={{ color: NOTES_ACCENT }}
            >
              <ListTodo className="size-6 opacity-35" strokeWidth={1.5} />
              <Camera className="size-6 opacity-35" strokeWidth={1.5} />
              <PenLine className="size-6 opacity-35" strokeWidth={1.5} />
              <button
                type="button"
                aria-label="New note"
                onClick={() => {
                  setFolderId("visitor-notes")
                  openComposeNew()
                }}
              >
                <SquarePen className="size-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-1 z-20 flex justify-center">
            <span className="h-1 w-28 rounded-full bg-neutral-900/22" aria-hidden />
          </div>
        </>
      ) : null}

      {view === "compose" ? (
        <>
          <div className="flex shrink-0 items-center justify-between border-b border-black/[0.07] bg-white px-2 py-1.5">
            <button
              type="button"
              onClick={() => {
                if (composeId) {
                  setView("detail")
                  const n = visitorStore.notes.find((x) => x.id === composeId)
                  if (n) setActive({ source: "visitor", note: n })
                  else goList()
                } else {
                  goList()
                }
              }}
              className="px-2 text-[1rem] font-normal"
              style={{ color: NOTES_ACCENT, fontFamily: CHAT_APP_UI_FONT }}
            >
              Cancel
            </button>
            <span
              className="text-[1.05rem] font-semibold"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              {composeId ? "Edit" : "New note"}
            </span>
            <button
              type="button"
              onClick={saveCompose}
              className="px-2 text-[1rem] font-semibold"
              style={{ color: NOTES_ACCENT, fontFamily: CHAT_APP_UI_FONT }}
            >
              Save
            </button>
          </div>
          <div
            className={cn("min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-8 pt-3", SCROLL_HIDE)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <input
              value={composeTitle}
              onChange={(e) => setComposeTitle(e.target.value)}
              placeholder="Title"
              className="mb-3 w-full border-0 bg-transparent text-[1.65rem] font-bold outline-none placeholder:text-[#c7c7cc]"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            />
            <textarea
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder="Start typing…"
              rows={14}
              className="w-full resize-none border-0 bg-transparent text-[1.05rem] leading-[1.45] outline-none placeholder:text-[#c7c7cc]"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            />
            <p
              className="mt-4 text-[0.72rem] text-[#8e8e93]"
              style={{ fontFamily: BODY_FONT }}
            >
              Saved to <strong>Visitor notes</strong> on this device. Clear site
              data removes them.
            </p>
          </div>
        </>
      ) : null}
    </div>
  )
}
