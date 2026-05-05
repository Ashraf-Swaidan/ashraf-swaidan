/** Hardcoded portfolio notes (read-only for visitors). */
export type NotesFolderMeta = {
  id: string
  label: string
  kind: "folder" | "trash"
}

export type AuthorNote = {
  id: string
  folderId: string
  title: string
  body: string
  createdAt: number
  updatedAt: number
  tags?: string[]
}

export const NOTES_ACCENT = "#e1b400"

export const NOTES_FOLDERS: NotesFolderMeta[] = [
  { id: "about-me", label: "About me", kind: "folder" },
  { id: "work", label: "Work", kind: "folder" },
  { id: "principles", label: "Principles", kind: "folder" },
  { id: "process", label: "Process", kind: "folder" },
  { id: "personal", label: "Personal", kind: "folder" },
  { id: "visitor-notes", label: "Visitor notes", kind: "folder" },
  { id: "recently-deleted", label: "Recently deleted", kind: "trash" },
]

const T = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d)).getTime()

export const AUTHOR_NOTES: AuthorNote[] = [
  {
    id: "a-about-1",
    folderId: "about-me",
    title: "Why this portfolio exists",
    body:
      "This site is a working surface — not a billboard. I care about systems that stay calm under real daily use: clear hierarchy, honest copy, and interfaces that respect attention.\n\nIf something here feels unusually detailed, that’s intentional. I’d rather show how I think than claim a slogan.",
    createdAt: T(2025, 11, 2),
    updatedAt: T(2026, 1, 18),
    tags: ["#Portfolio"],
  },
  {
    id: "a-about-2",
    folderId: "about-me",
    title: "How I like to collaborate",
    body:
      "Start messy. I’m comfortable with half-shaped problems, rough screenshots, and voice notes. I’ll help turn that into something shippable — with room to revisit decisions when reality pushes back.\n\nBest outcomes come from a shared language: goals, constraints, and what “done” actually means for users.",
    createdAt: T(2025, 8, 14),
    updatedAt: T(2026, 2, 4),
  },
  {
    id: "a-work-1",
    folderId: "work",
    title: "What I reach for in product UI",
    body:
      "Dense operations (inventory, orders, money-in/money-out) need clarity more than novelty. I aim for legible tables, predictable navigation, and states that don’t hide consequences.\n\nAnimations are for orientation — not decoration that steals focus from the job.",
    createdAt: T(2025, 6, 10),
    updatedAt: T(2025, 12, 1),
    tags: ["#Work"],
  },
  {
    id: "a-work-2",
    folderId: "work",
    title: "Case studies as proof, not theater",
    body:
      "When I write about work, I try to keep the narrative tied to decisions: what we optimized for, what we cut, and what we’d revisit.\n\nIf you’re hiring or partnering, read the cases like a spec review — the interesting parts are usually the constraints.",
    createdAt: T(2025, 9, 22),
    updatedAt: T(2026, 1, 5),
  },
  {
    id: "a-principles-1",
    folderId: "principles",
    title: "Calm is a feature",
    body:
      "Chaos is expensive. A calm interface reduces mistakes, support load, and cognitive debt. I treat quiet spacing, consistent motion, and predictable patterns as part of reliability — not polish added at the end.",
    createdAt: T(2024, 3, 3),
    updatedAt: T(2025, 7, 20),
    tags: ["#Process"],
  },
  {
    id: "a-principles-2",
    folderId: "principles",
    title: "Honest affordances",
    body:
      "If something isn’t available, it should read as unavailable — not like a mystery button. If something is dangerous, it should feel dangerous without being hostile.\n\nTrust is built from small truths repeated everywhere.",
    createdAt: T(2024, 11, 7),
    updatedAt: T(2025, 10, 9),
  },
  {
    id: "a-process-1",
    folderId: "process",
    title: "From fuzzy brief to usable UI",
    body:
      "1) Restate the goal in one sentence.\n2) List constraints (time, tech, people, risk).\n3) Sketch flows before pixels.\n4) Prototype the riskiest assumption first.\n5) Ship a slice; learn; tighten.\n\nRevision is not failure — unmanaged ambiguity is.",
    createdAt: T(2025, 2, 18),
    updatedAt: T(2026, 2, 1),
    tags: ["#Process"],
  },
  {
    id: "a-personal-1",
    folderId: "personal",
    title: "What I’m optimizing for lately",
    body:
      "Deeper craft in fewer projects. Long walks between deep-work blocks. Fewer tabs, more notebooks.\n\nAlso: remembering that tools should disappear while you work — including portfolio phones that happen to run Notes.",
    createdAt: T(2026, 1, 12),
    updatedAt: T(2026, 2, 9),
  },
  {
    id: "a-visitor-1",
    folderId: "visitor-notes",
    title: "Welcome to this folder",
    body:
      "Anything you add here is saved only on your device — a small playful layer, like the Ash AI chats in this phone.\n\nIf you want me to actually read something, use Gmail or WhatsApp from the home screen.",
    createdAt: T(2026, 2, 10),
    updatedAt: T(2026, 2, 10),
    tags: ["#Portfolio"],
  },
]

export function authorNotesInFolder(folderId: string): AuthorNote[] {
  return AUTHOR_NOTES.filter((n) => n.folderId === folderId)
}

export function authorNoteCountByFolderId(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const n of AUTHOR_NOTES) {
    counts[n.folderId] = (counts[n.folderId] ?? 0) + 1
  }
  return counts
}

export const NOTES_STATIC_TAGS = [
  "All tags",
  "#Portfolio",
  "#Process",
  "#Work",
] as const
