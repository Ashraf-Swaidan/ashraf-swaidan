import {
  authoredAshAiNoteContext,
  type AuthoredAshAiNoteContext,
} from "./ashAiNotes.ts"
import {
  MODULE_EXPLORER_ENTRIES,
  type ExplorerFeatureSpotlight,
} from "../pages/papion-system/papion-data.ts"
import { DUWIT_DESKTOP_APP_URL, DUWIT_TRY_URL } from "../pages/duwit/duwit-data.ts"
import {
  LUXIAN_DEMO_ADMIN_EMAIL,
  LUXIAN_DEMO_ADMIN_PASSWORD,
  LUXIAN_LOGIN_URL,
  LUXIAN_REPO_URL,
  LUXIAN_TRY_URL,
} from "../pages/luxian/luxian-data.ts"
import { TWODO_TRY_URL } from "../pages/twodo/twodo-data.ts"

export type AshAiKnowledgeKind = "profile" | "work" | "note"

export type AshAiKnowledgeSourceMeta = {
  sourceLabel: string
  workId?: string
  noteId?: string
  tags?: string[]
  aliases?: string[]
}

export type AshAiKnowledgeSnippet = {
  id: string
  kind: AshAiKnowledgeKind
  title: string
  content: string
  sourceMeta: AshAiKnowledgeSourceMeta
}

export type AshAiConversationMessage = {
  role: "assistant" | "user"
  content: string
}

type ScoredSnippet = {
  snippet: AshAiKnowledgeSnippet
  score: number
}

const MAX_SELECTED_SNIPPETS = 10
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "he",
  "her",
  "his",
  "how",
  "i",
  "in",
  "into",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "she",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "was",
  "what",
  "who",
  "with",
])

const BASELINE_IDENTITY_SUMMARY =
  "Ashraf Swaidan is a developer from Lebanon who builds real operational software, cares deeply about UX and workflow friction, and uses AI as an accelerator without wanting it to replace judgment or understanding."

const PROFILE_INTENT_PHRASES = [
  "who is ashraf",
  "who is he",
  "about ashraf",
  "about him",
  "how he works",
  "how does he work",
  "work style",
  "education",
  "ai",
  "process",
  "collaboration",
  "background",
  "notes",
]

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (token) => !STOPWORDS.has(token)
  )
}

function wordsFromText(value: string): string[] {
  return tokenize(value)
}

function countTokenOverlap(queryTokens: Set<string>, text: string): number {
  let count = 0
  for (const token of new Set(tokenize(text))) {
    if (queryTokens.has(token)) count += 1
  }
  return count
}

function hasPhrase(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase))
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

function authoredNoteSnippet(note: AuthoredAshAiNoteContext): AshAiKnowledgeSnippet {
  return {
    id: `note-${note.noteId}`,
    kind: "note",
    title: note.title,
    content: note.body,
    sourceMeta: {
      sourceLabel: `${note.folderLabel} note`,
      noteId: note.noteId,
      tags: note.tags,
      aliases: [
        note.title,
        note.folderLabel,
        ...note.tags,
        ...wordsFromText(note.title),
        ...wordsFromText(note.folderLabel),
      ].map((value) => value.toLowerCase()),
    },
  }
}

function featureSpotlightBody(spotlight: ExplorerFeatureSpotlight): string {
  return [spotlight.teaser, ...spotlight.body].join(" ")
}

function papionKnowledgeSnippets(): AshAiKnowledgeSnippet[] {
  const snippets: AshAiKnowledgeSnippet[] = [
    {
      id: "papion-availability",
      kind: "work",
      title: "Papion availability",
      content:
        "Papion has a public case study in the portfolio. The portfolio materials do not expose a public live website for Papion. Its surfaces are described as desktop app, web, and installable phone/PWA inside the case study.",
      sourceMeta: {
        sourceLabel: "papion availability facts",
        workId: "papion",
        aliases: ["papion", "website", "live site", "web", "desktop", "pwa", "phone"],
      },
    },
  ]

  for (const entry of MODULE_EXPLORER_ENTRIES) {
    snippets.push({
      id: `papion-module-${entry.id}`,
      kind: "work",
      title: `Papion ${entry.label}`,
      content: `${entry.headline}\n\n${entry.intro}\n\nRare features:\n- ${entry.rareFeatures.join("\n- ")}\n\nWhy it matters:\n${entry.whyMatters}`,
      sourceMeta: {
        sourceLabel: "papion module explorer",
        workId: "papion",
        aliases: [
          "papion",
          "papion system",
          entry.label,
          entry.id,
          ...wordsFromText(entry.label),
          ...entry.rareFeatures.flatMap(wordsFromText),
        ].map((value) => value.toLowerCase()),
      },
    })

    for (const spotlight of entry.featureSpotlights ?? []) {
      snippets.push({
        id: `papion-spotlight-${entry.id}-${spotlight.id}`,
        kind: "work",
        title: `Papion ${entry.label}: ${spotlight.title}`,
        content: featureSpotlightBody(spotlight),
        sourceMeta: {
          sourceLabel: "papion uncommon beats",
          workId: "papion",
          aliases: [
            "papion",
            "papion system",
            entry.label,
            entry.id,
            spotlight.id,
            spotlight.title,
            spotlight.teaser,
            ...wordsFromText(spotlight.title),
            ...wordsFromText(spotlight.teaser),
          ].map((value) => value.toLowerCase()),
        },
      })
    }
  }

  return snippets
}

const OTHER_PROJECT_SNIPPETS: AshAiKnowledgeSnippet[] = [
  {
    id: "duwit-full",
    kind: "work",
    title: "Duwit full project text",
    content: `Duwit is an AI-native execution partner built to move from vague intent to finished outcomes. The project is explicitly about serious-mode execution rather than motivational fluff. It was born from frustration with AI that acts like a cheerleader or hype man instead of a real teacher. Duwit is meant to plan with the user, teach one step at a time, check whether the user actually understood, and keep context until the goal becomes real.\n\nIts product framing includes goal-to-roadmap planning, task-scoped AI, durable memory, web app delivery, and a desktop app variant. The public live website is ${DUWIT_TRY_URL}. The desktop release is ${DUWIT_DESKTOP_APP_URL}.`,
    sourceMeta: {
      sourceLabel: "duwit project text",
      workId: "duwit",
      aliases: [
        "duwit",
        "website",
        "web app",
        "desktop app",
        "serious mode",
        "goal",
        "roadmap",
        "memory",
        "task coaching",
        "teacher",
        "hype man",
      ],
    },
  },
  {
    id: "twodo-full",
    kind: "work",
    title: "Twodo full project text",
    content: `Twodo is a live UX experiment around a one-click mindset: capture, sort, and finish with as little friction as possible. Its philosophy is that simple work should not require a tour of the interface first. Direct controls beat clever chrome, the list stays the hero, collaboration should stay lightweight, and the product should keep tightening the loop instead of becoming a bloated productivity suite.\n\nTwodo has projects and invites, but keeps the surface calm on purpose. It has a public live website at ${TWODO_TRY_URL}.`,
    sourceMeta: {
      sourceLabel: "twodo project text",
      workId: "twodo",
      aliases: [
        "twodo",
        "website",
        "web app",
        "one click",
        "one-click",
        "low friction",
        "projects",
        "invites",
        "collaboration",
      ],
    },
  },
  {
    id: "ak-full",
    kind: "work",
    title: "AK full project text",
    content:
      "AK System is an offline-first desktop operating system for a local electronics store. It replaces spreadsheets and scattered notes with a bilingual-friendly workspace for inventory, sales, customers, and exports. The database is intentionally local and exportable so the business owns the operational truth. The project is explicitly about counter-first speed, working without cloud dependency, and building a boring-in-a-good-way system that survives a busy day. The portfolio materials do not expose a public live website for AK.",
    sourceMeta: {
      sourceLabel: "ak project text",
      workId: "ak-system",
      aliases: [
        "ak",
        "ak system",
        "website",
        "desktop",
        "offline",
        "offline first",
        "local database",
        "exportable database",
        "bilingual",
        "retail",
      ],
    },
  },
  {
    id: "luxian-full",
    kind: "work",
    title: "Luxian full project text",
    content: `Luxian is sculptural streetwear commerce built as one owned stack: editorial homepage and curated collections on the surface, NestJS + PostgreSQL + Next.js underneath. Shoppers browse a merchandised storefront, get behavior-driven recommendations, and checkout against real inventory. Operators get permission-scoped admin (homepage CMS without redeploys, profit-aware dashboard, supplier receiving tied to stock movements, staff roles). Checkout, payment recording, and stock decrements happen in one transaction.\n\nPublic live storefront: ${LUXIAN_TRY_URL}. Login: ${LUXIAN_LOGIN_URL}. Demo admin: ${LUXIAN_DEMO_ADMIN_EMAIL} / ${LUXIAN_DEMO_ADMIN_PASSWORD}. Source: ${LUXIAN_REPO_URL}. Payments are stub only.`,
    sourceMeta: {
      sourceLabel: "luxian project text",
      workId: "luxian",
      aliases: [
        "luxian",
        "fashion",
        "e-commerce",
        "ecommerce",
        "storefront",
        "shop",
        "commerce",
        "nestjs",
        "next.js",
        "inventory",
        "checkout",
        "admin",
      ],
    },
  },
  {
    id: "project-availability",
    kind: "work",
    title: "Project availability quick facts",
    content: `Papion: public case study only, no public live website in the portfolio materials.\nDuwit: public case study, public live website ${DUWIT_TRY_URL}, desktop release ${DUWIT_DESKTOP_APP_URL}.\nTwodo: public case study, public live website ${TWODO_TRY_URL}.\nAK System: public case study only, no public live website in the portfolio materials.\nLuxian: public case study, live site ${LUXIAN_TRY_URL}, admin demo ${LUXIAN_DEMO_ADMIN_EMAIL} / ${LUXIAN_DEMO_ADMIN_PASSWORD} at ${LUXIAN_LOGIN_URL}, repo ${LUXIAN_REPO_URL}.`,
    sourceMeta: {
      sourceLabel: "project availability facts",
      aliases: [
        "website",
        "live site",
        "public app",
        "try",
        "desktop release",
        "browser",
        "web app",
      ],
    },
  },
]

const PROFILE_SNIPPETS: AshAiKnowledgeSnippet[] = [
  {
    id: "profile-biography",
    kind: "profile",
    title: "Ashraf biography",
    content:
      "Ashraf is a developer from Lebanon whose growth came both from formal computer-science study and from working inside real businesses with real operational pressure. His path includes Papion, workshop operations, customer-facing work, fabrication-related workflows, and building software that people genuinely rely on.",
    sourceMeta: {
      sourceLabel: "profile baseline",
      aliases: ["ashraf", "biography", "background", "lebanon", "who is ashraf"],
    },
  },
  {
    id: "profile-work-style",
    kind: "profile",
    title: "Ashraf process and UX mindset",
    content:
      "Ashraf is highly iteration-driven. He starts from friction, researches deeply, chooses tools based on fit, and keeps redesigning until the workflow feels lighter. He cares about smart defaults, suggestions, prefills, calmer interfaces, and reducing cognitive weight rather than just making something technically functional.",
    sourceMeta: {
      sourceLabel: "profile baseline",
      aliases: ["process", "ux", "friction", "iteration", "how he works"],
    },
  },
]

export function authoredNoteKnowledgeSnippets(): AshAiKnowledgeSnippet[] {
  return authoredAshAiNoteContext().map(authoredNoteSnippet)
}

export function allAshAiKnowledgeSnippets(): AshAiKnowledgeSnippet[] {
  return [
    ...PROFILE_SNIPPETS,
    ...papionKnowledgeSnippets(),
    ...OTHER_PROJECT_SNIPPETS,
    ...authoredNoteKnowledgeSnippets(),
  ]
}

function scoreSnippet(
  snippet: AshAiKnowledgeSnippet,
  latestUserText: string,
  recentText: string,
  queryTokens: Set<string>,
  profileIntent: boolean
): number {
  let score = 0
  const aliases = snippet.sourceMeta.aliases ?? []

  for (const alias of aliases) {
    const normalizedAlias = alias.toLowerCase()
    if (!normalizedAlias) continue
    if (latestUserText.includes(normalizedAlias)) score += 18
    else if (recentText.includes(normalizedAlias)) score += 8
  }

  score += Math.min(14, countTokenOverlap(queryTokens, `${snippet.title} ${snippet.content}`))

  if (snippet.kind === "profile" && profileIntent) score += 8
  if (snippet.kind === "note" && latestUserText.includes("note")) score += 6
  if (snippet.kind === "work" && hasPhrase(latestUserText, ["project", "feature", "website", "link", "app"])) {
    score += 4
  }

  return score
}

function previewContent(text: string, max = 650): string {
  const normalized = normalizeWhitespace(text)
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1)}…`
}

export function selectAshAiKnowledge(messages: AshAiConversationMessage[]): ScoredSnippet[] {
  const latestUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.content ?? ""
  const latestUserText = normalizeWhitespace(latestUserMessage).toLowerCase()
  const recentText = normalizeWhitespace(
    messages
      .slice(-6)
      .map((message) => message.content)
      .join(" ")
  ).toLowerCase()
  const queryTokens = new Set(tokenize(`${latestUserText} ${recentText}`))
  const profileIntent = hasPhrase(latestUserText, PROFILE_INTENT_PHRASES)

  const scored = allAshAiKnowledgeSnippets()
    .map((snippet) => ({
      snippet,
      score: scoreSnippet(snippet, latestUserText, recentText, queryTokens, profileIntent),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.snippet.title.localeCompare(b.snippet.title))

  return dedupeById(scored.map((entry) => entry.snippet))
    .map((snippet) => scored.find((entry) => entry.snippet.id === snippet.id)!)
    .slice(0, MAX_SELECTED_SNIPPETS)
}

function formatSelectedSnippet(entry: ScoredSnippet): string {
  const { snippet } = entry
  const metaParts = [
    `kind=${snippet.kind}`,
    snippet.sourceMeta.workId ? `workId="${snippet.sourceMeta.workId}"` : null,
    snippet.sourceMeta.noteId ? `noteId="${snippet.sourceMeta.noteId}"` : null,
    `source="${snippet.sourceMeta.sourceLabel}"`,
  ].filter(Boolean)
  return `- ${snippet.title} | ${metaParts.join(" | ")}\n  ${previewContent(snippet.content)}`
}

function allAuthoredNoteCatalogLines(): string[] {
  return authoredAshAiNoteContext().map(
    (note) =>
      `- noteId "${note.noteId}" | folder="${note.folderLabel}" | title="${note.title}"${note.tags.length ? ` | tags="${note.tags.join(", ")}"` : ""}`
  )
}

function allAuthoredNoteBodyBlocks(): string[] {
  return authoredAshAiNoteContext().map(
    (note) =>
      `## noteId "${note.noteId}" | ${note.title}\nFolder: ${note.folderLabel}\nTags: ${note.tags.join(", ") || "none"}\nBody:\n${note.body}`
  )
}

function allProjectBodyBlocks(): string[] {
  return allAshAiKnowledgeSnippets()
    .filter((snippet) => snippet.kind === "work")
    .map((snippet) => {
      const header = [
        `## ${snippet.title}`,
        snippet.sourceMeta.workId ? `workId: ${snippet.sourceMeta.workId}` : null,
        `source: ${snippet.sourceMeta.sourceLabel}`,
      ]
        .filter(Boolean)
        .join("\n")
      return `${header}\n${snippet.content}`
    })
}

export function buildAshAiSupplementalContext(
  messages: AshAiConversationMessage[]
): string {
  const selected = selectAshAiKnowledge(messages)
  const selectedBlocks = selected.map(formatSelectedSnippet)

  return [
    "Live Ash AI retrieval context:",
    `Baseline identity: ${BASELINE_IDENTITY_SUMMARY}`,
    "",
    "Highest-priority materials for this turn:",
    ...(selectedBlocks.length > 0
      ? selectedBlocks
      : ["- No strong direct match was found. Use the full materials below carefully and say when the portfolio materials do not show a detail."]),
    "",
    "All authored notes eligible for `notes` links:",
    ...allAuthoredNoteCatalogLines(),
    "",
    "Full authored note bodies (do not ignore these; they are part of the source of truth):",
    ...allAuthoredNoteBodyBlocks(),
    "",
    "Full project materials (do not reduce these to generic blurbs if the user asks for specifics):",
    ...allProjectBodyBlocks(),
    "",
    "Rules for this turn:",
    "- You have full access to all authored notes above. Treat all of them as valid source material.",
    "- You have full access to all project materials above. Use specific project details when the user asks for a feature, website, workflow, or uncommon capability.",
    "- Visitor-authored notes are intentionally excluded from this knowledge layer.",
    "- If a detail is not present here or in the base prompt, say it is not in the portfolio materials.",
  ].join("\n")
}

export function selectedKnowledgeTitles(messages: AshAiConversationMessage[]): string[] {
  return selectAshAiKnowledge(messages).map((entry) => entry.snippet.title)
}
