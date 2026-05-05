import type { AshStickerId } from "@/lib/ashAiContext"
import {
  artifactRefsForPersistence,
  rehydrateAshAiArtifactsFromStorage,
  type AshAiUiArtifact,
} from "@/lib/ashAiArtifacts"
import type { AshAiChatMessage } from "@/lib/pollinationsAshAi"
import type { AshAiUiLink } from "@/lib/ashAiWorkLinks"
import { rehydrateAshAiLinksFromStorage } from "@/lib/ashAiWorkLinks"

import {
  ASH_AI_CHATS_SCHEMA_VERSION,
  ASH_AI_CHATS_STORAGE_KEY,
  ASH_AI_CHAT_STORAGE_KEY,
  ASH_AI_GREETING,
  ASH_AI_MAX_CHATS,
  ASH_AI_NEW_CHAT_TITLE,
} from "./constants"

export type AshAiUiMessage = AshAiChatMessage & {
  id: string
  sticker?: AshStickerId | null
  links?: AshAiUiLink[]
  artifacts?: AshAiUiArtifact[]
  /** Optional image path/URL for user turns — shown in the bubble; not sent as data URLs in storage */
  imageSrc?: string
  failed?: boolean
  streaming?: boolean
}

export type AshAiChatThread = {
  id: string
  title: string
  messages: AshAiUiMessage[]
  updatedAt: number
}

export type AshAiChatsStore = {
  schemaVersion: number
  activeChatId: string
  chats: AshAiChatThread[]
}

function newId(): string {
  return crypto.randomUUID()
}

export function makeAshAiMessage(
  role: AshAiChatMessage["role"],
  content: string,
  options: Pick<
    AshAiUiMessage,
    "failed" | "sticker" | "streaming" | "links" | "artifacts" | "imageSrc"
  > = {}
): AshAiUiMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    ...options,
  }
}

function sanitizeMessages(raw: unknown): AshAiUiMessage[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m, i) => {
    const msg = m as Partial<AshAiUiMessage>
    return {
      id: typeof msg.id === "string" ? msg.id : `r-${Date.now()}-${i}`,
      role: msg.role === "user" ? "user" : "assistant",
      content: typeof msg.content === "string" ? msg.content : "",
      sticker: msg.sticker,
      links: rehydrateAshAiLinksFromStorage(msg.links),
      artifacts: rehydrateAshAiArtifactsFromStorage(msg.artifacts),
      imageSrc:
        msg.role === "user" &&
        typeof msg.imageSrc === "string" &&
        msg.imageSrc.trim() &&
        !msg.imageSrc.startsWith("data:")
          ? msg.imageSrc.trim()
          : undefined,
      failed: Boolean(msg.failed),
      streaming: false,
    }
  })
}

function normalizeThread(thread: AshAiChatThread): AshAiChatThread {
  const messages =
    thread.messages.length > 0
      ? sanitizeMessages(thread.messages)
      : [makeAshAiMessage("assistant", ASH_AI_GREETING)]
  return {
    ...thread,
    messages,
    title:
      typeof thread.title === "string" && thread.title.trim()
        ? thread.title.trim()
        : ASH_AI_NEW_CHAT_TITLE,
  }
}

function trimOldestChats(
  chats: AshAiChatThread[],
  alwaysKeepId?: string
): AshAiChatThread[] {
  if (chats.length <= ASH_AI_MAX_CHATS) return chats
  const keep = alwaysKeepId
    ? chats.find((c) => c.id === alwaysKeepId)
    : undefined
  const rest = chats.filter((c) => c.id !== alwaysKeepId)
  const sorted = [...rest].sort((a, b) => b.updatedAt - a.updatedAt)
  const cap = keep ? ASH_AI_MAX_CHATS - 1 : ASH_AI_MAX_CHATS
  const picked = sorted.slice(0, cap)
  if (keep) return [keep, ...picked]
  return picked.slice(0, ASH_AI_MAX_CHATS)
}

function migrateLegacySessionStore(): AshAiChatsStore | null {
  try {
    const raw = window.sessionStorage.getItem(ASH_AI_CHAT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    const messages = sanitizeMessages(parsed)
    if (messages.length === 0) {
      window.sessionStorage.removeItem(ASH_AI_CHAT_STORAGE_KEY)
      return null
    }
    const id = newId()
    const now = Date.now()
    window.sessionStorage.removeItem(ASH_AI_CHAT_STORAGE_KEY)
    return {
      schemaVersion: ASH_AI_CHATS_SCHEMA_VERSION,
      activeChatId: id,
      chats: [
        {
          id,
          title: ASH_AI_NEW_CHAT_TITLE,
          messages,
          updatedAt: now,
        },
      ],
    }
  } catch {
    return null
  }
}

function parseStore(raw: string | null): AshAiChatsStore | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as Partial<AshAiChatsStore>
    if (
      data.schemaVersion !== ASH_AI_CHATS_SCHEMA_VERSION ||
      typeof data.activeChatId !== "string" ||
      !Array.isArray(data.chats)
    ) {
      return null
    }
    const chats = data.chats
      .map((t) =>
        normalizeThread({
          id: typeof t.id === "string" ? t.id : newId(),
          title:
            typeof t.title === "string" ? t.title : ASH_AI_NEW_CHAT_TITLE,
          messages: sanitizeMessages(
            Array.isArray(t.messages) ? t.messages : []
          ),
          updatedAt:
            typeof t.updatedAt === "number" ? t.updatedAt : Date.now(),
        })
      )
      .filter(Boolean)
    if (chats.length === 0) return null
    let activeChatId = data.activeChatId
    if (!chats.some((c) => c.id === activeChatId)) {
      activeChatId = chats[0]!.id
    }
    return {
      schemaVersion: ASH_AI_CHATS_SCHEMA_VERSION,
      activeChatId,
      chats: trimOldestChats(chats, activeChatId),
    }
  } catch {
    return null
  }
}

export function loadAshAiChatsStore(): AshAiChatsStore {
  const fromLocal = parseStore(
    window.localStorage.getItem(ASH_AI_CHATS_STORAGE_KEY)
  )
  if (fromLocal) return fromLocal
  const migrated = migrateLegacySessionStore()
  if (migrated) {
    persistAshAiChatsStore(migrated)
    return migrated
  }
  const id = newId()
  const now = Date.now()
  const fresh: AshAiChatsStore = {
    schemaVersion: ASH_AI_CHATS_SCHEMA_VERSION,
    activeChatId: id,
    chats: [
      {
        id,
        title: ASH_AI_NEW_CHAT_TITLE,
        messages: [makeAshAiMessage("assistant", ASH_AI_GREETING)],
        updatedAt: now,
      },
    ],
  }
  persistAshAiChatsStore(fresh)
  return fresh
}

export function persistAshAiChatsStore(store: AshAiChatsStore) {
  const trimmed: AshAiChatsStore = {
    ...store,
    chats: trimOldestChats(store.chats, store.activeChatId),
  }
  if (!trimmed.chats.some((c) => c.id === trimmed.activeChatId)) {
    trimmed.activeChatId = trimmed.chats[0]?.id ?? trimmed.activeChatId
  }
  window.localStorage.setItem(
    ASH_AI_CHATS_STORAGE_KEY,
    JSON.stringify(trimmed)
  )
}

function persistUserImageSrc(m: AshAiUiMessage): string | undefined {
  if (m.role !== "user") return undefined
  const s = m.imageSrc?.trim()
  if (!s || s.startsWith("data:")) return undefined
  return s
}

export function messagesForPersistence(
  messages: AshAiUiMessage[]
): AshAiUiMessage[] {
  return messages.map((m) => ({
    ...m,
    streaming: false,
    artifacts: artifactRefsForPersistence(m.artifacts) as
      | AshAiUiArtifact[]
      | undefined,
    imageSrc: persistUserImageSrc(m),
  }))
}

const TITLE_MIN_USER_MESSAGES = 2
const TITLE_MAX_LEN = 40

function truncateTitle(text: string): string {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= TITLE_MAX_LEN) return t
  return `${t.slice(0, TITLE_MAX_LEN - 1)}…`
}

/** Auto-title from conversation once there are enough user turns (local, no API). */
export function inferChatTitle(messages: AshAiUiMessage[]): string | null {
  const userMsgs = messages.filter(
    (m) => m.role === "user" && m.content.trim().length > 0
  )
  if (userMsgs.length < TITLE_MIN_USER_MESSAGES) return null
  const first = userMsgs[0]!.content.trim()
  if (first.length < 2) return null
  return truncateTitle(first)
}

export function withUpdatedThread(
  store: AshAiChatsStore,
  chatId: string,
  patch: Partial<Pick<AshAiChatThread, "messages" | "title">> & {
    messages?: AshAiUiMessage[]
  }
): AshAiChatsStore {
  const now = Date.now()
  const chats = store.chats.map((c) => {
    if (c.id !== chatId) return c
    let nextTitle = patch.title ?? c.title
    let nextMessages = patch.messages ?? c.messages
    if (patch.messages) {
      const inferred = inferChatTitle(patch.messages)
      if (
        inferred &&
        (c.title === ASH_AI_NEW_CHAT_TITLE || c.title.trim().length === 0)
      ) {
        nextTitle = inferred
      }
    }
    return {
      ...c,
      title: nextTitle,
      messages: nextMessages,
      updatedAt: now,
    }
  })
  return {
    ...store,
    chats: trimOldestChats(chats, store.activeChatId),
  }
}

export function createNewChatThread(): AshAiChatThread {
  const now = Date.now()
  return {
    id: newId(),
    title: ASH_AI_NEW_CHAT_TITLE,
    messages: [makeAshAiMessage("assistant", ASH_AI_GREETING)],
    updatedAt: now,
  }
}

export function addChatAndActivate(
  store: AshAiChatsStore,
  thread: AshAiChatThread
): AshAiChatsStore {
  const chats = trimOldestChats([thread, ...store.chats], thread.id)
  return {
    ...store,
    chats,
    activeChatId: thread.id,
  }
}

export function setActiveChat(store: AshAiChatsStore, chatId: string) {
  if (!store.chats.some((c) => c.id === chatId)) return store
  return { ...store, activeChatId: chatId }
}

export function deleteChat(store: AshAiChatsStore, chatId: string) {
  const chats = store.chats.filter((c) => c.id !== chatId)
  if (chats.length === 0) {
    const n = createNewChatThread()
    return {
      ...store,
      chats: [n],
      activeChatId: n.id,
    }
  }
  let activeChatId = store.activeChatId
  if (activeChatId === chatId) {
    const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)
    activeChatId = sorted[0]!.id
  }
  return {
    ...store,
    chats: trimOldestChats(chats, activeChatId),
    activeChatId,
  }
}
