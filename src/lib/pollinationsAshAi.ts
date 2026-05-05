import {
  ASH_AI_SYSTEM_PROMPT,
  isAshStickerId,
  type AshStickerId,
} from "@/lib/ashAiContext"
import { getStoredAshAiModelId } from "@/lib/ashAiModels"
import {
  normalizeAshAiWorkLinks,
  type AshAiUiLink,
} from "@/lib/ashAiWorkLinks"

const POLLINATIONS_BASE_URL = "https://gen.pollinations.ai"
export const POLLINATIONS_ACCOUNT_DOCS_URL =
  "https://gen.pollinations.ai/docs#tag/account/GET/account/balance"
const MAX_HISTORY_MESSAGES = 10

/** These models return 422 with `response_format: json_object` on some Pollinations routes. */
const POLLINATIONS_MODELS_OMIT_JSON_RESPONSE_FORMAT = new Set([
  "mistral",
  "nova-fast",
])

function chatCompletionBody(
  model: string,
  recentMessages: AshAiChatMessage[],
  stream: boolean
) {
  const base = {
    model,
    temperature: 0.72,
    max_tokens: 320,
    stream,
    messages: [
      { role: "system" as const, content: ASH_AI_SYSTEM_PROMPT },
      ...recentMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
  }
  if (POLLINATIONS_MODELS_OMIT_JSON_RESPONSE_FORMAT.has(model)) {
    return base
  }
  return { ...base, response_format: { type: "json_object" as const } }
}

type ChatRole = "assistant" | "user"

export type AshAiChatMessage = {
  role: ChatRole
  content: string
}

export type AshAiResponse = {
  message: string
  sticker: AshStickerId | null
  links: AshAiUiLink[]
}

type PollinationsChoice = {
  message?: {
    content?: unknown
  }
}

type PollinationsResponse = {
  choices?: PollinationsChoice[]
  error?: {
    message?: string
  }
}

function getPollinationsKey() {
  return (
    import.meta.env.VITE_POLLINATIONS_API_KEY ??
    import.meta.env.POLLINATIONS_API_KEY ??
    ""
  )
}

export function previewStreamingAssistantJson(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  try {
    const parsed = JSON.parse(trimmed) as { message?: unknown }
    if (typeof parsed.message === "string") return parsed.message
  } catch {
    /* incomplete JSON */
  }
  const key = '"message"'
  const mi = raw.indexOf(key)
  if (mi === -1) return ""
  const colon = raw.indexOf(":", mi + key.length)
  if (colon === -1) return ""
  let i = colon + 1
  while (i < raw.length && /\s/.test(raw[i]!)) i += 1
  if (raw[i] !== '"') return ""
  i += 1
  let out = ""
  while (i < raw.length) {
    const c = raw[i]!
    if (c === "\\") {
      i += 1
      if (i >= raw.length) break
      const e = raw[i]!
      if (e === "n") out += "\n"
      else if (e === "r") out += "\r"
      else if (e === "t") out += "\t"
      else out += e
      i += 1
      continue
    }
    if (c === '"') break
    out += c
    i += 1
  }
  return out
}

function parseAssistantPayload(content: unknown): AshAiResponse {
  const fallbackMessage =
    typeof content === "string" && content.trim()
      ? content.trim()
      : "That came out garbled on my end — mind asking again in simpler words?"

  if (typeof content !== "string") {
    return { message: fallbackMessage, sticker: null, links: [] }
  }

  try {
    const parsed = JSON.parse(content) as {
      message?: unknown
      sticker?: unknown
      links?: unknown
    }
    return {
      message:
        typeof parsed.message === "string" && parsed.message.trim()
          ? parsed.message.trim()
          : fallbackMessage,
      sticker: isAshStickerId(parsed.sticker) ? parsed.sticker : null,
      links: normalizeAshAiWorkLinks(parsed.links),
    }
  } catch {
    return { message: fallbackMessage, sticker: null, links: [] }
  }
}

export async function askAshAi(
  messages: AshAiChatMessage[]
): Promise<AshAiResponse> {
  const apiKey = getPollinationsKey()

  if (!apiKey || !apiKey.startsWith("pk_")) {
    throw new Error("Missing publishable Pollinations API key.")
  }

  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES)
  const model = getStoredAshAiModelId()
  const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chatCompletionBody(model, recentMessages, false)),
  })

  const body = (await response.json().catch(() => ({}))) as PollinationsResponse

  if (!response.ok) {
    throw new Error(body.error?.message ?? "Pollinations request failed.")
  }

  return parseAssistantPayload(body.choices?.[0]?.message?.content)
}

export type PollinationsBalanceResult =
  | { ok: true; balance: number }
  | { ok: false; reason: "no_key" | "forbidden" | "network" }

export async function fetchPollinationsAccountBalance(
  signal?: AbortSignal
): Promise<PollinationsBalanceResult> {
  const apiKey = getPollinationsKey()
  if (!apiKey || !apiKey.startsWith("pk_")) {
    return { ok: false, reason: "no_key" }
  }
  try {
    const response = await fetch(`${POLLINATIONS_BASE_URL}/account/balance`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal,
    })
    if (response.status === 401 || response.status === 403) {
      return { ok: false, reason: "forbidden" }
    }
    if (!response.ok) {
      return { ok: false, reason: "network" }
    }
    const body = (await response.json().catch(() => ({}))) as {
      balance?: unknown
    }
    const balance = typeof body.balance === "number" ? body.balance : NaN
    if (!Number.isFinite(balance)) {
      return { ok: false, reason: "network" }
    }
    return { ok: true, balance }
  } catch {
    return { ok: false, reason: "network" }
  }
}

export async function askAshAiStream(
  messages: AshAiChatMessage[],
  options: {
    onDelta: (accumulatedRaw: string, previewText: string) => void
    signal?: AbortSignal
  }
): Promise<AshAiResponse> {
  const apiKey = getPollinationsKey()

  if (!apiKey || !apiKey.startsWith("pk_")) {
    throw new Error("Missing publishable Pollinations API key.")
  }

  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES)
  const model = getStoredAshAiModelId()
  const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: options.signal,
    body: JSON.stringify(chatCompletionBody(model, recentMessages, true)),
  })

  if (!response.ok) {
    const errBody = (await response.json().catch(() => ({}))) as {
      error?: { message?: string }
    }
    throw new Error(errBody.error?.message ?? "Pollinations request failed.")
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("No response stream.")
  }

  const decoder = new TextDecoder()
  let lineBuffer = ""
  let accumulated = ""

  const flushLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed.startsWith("data:")) return
    const data = trimmed.slice(5).trim()
    if (data === "[DONE]") return
    try {
      const json = JSON.parse(data) as {
        choices?: { delta?: { content?: string } }[]
      }
      const piece = json.choices?.[0]?.delta?.content
      if (typeof piece === "string" && piece.length > 0) {
        accumulated += piece
        options.onDelta(
          accumulated,
          previewStreamingAssistantJson(accumulated)
        )
      }
    } catch {
      /* ignore malformed SSE JSON */
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    lineBuffer += decoder.decode(value, { stream: true })
    let breakAt: number
    while ((breakAt = lineBuffer.indexOf("\n")) !== -1) {
      const rawLine = lineBuffer.slice(0, breakAt)
      lineBuffer = lineBuffer.slice(breakAt + 1)
      flushLine(rawLine)
    }
  }

  if (lineBuffer.trim()) flushLine(lineBuffer)

  return parseAssistantPayload(accumulated)
}
