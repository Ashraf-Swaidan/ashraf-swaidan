import {
  ASH_AI_SYSTEM_PROMPT,
  isAshStickerId,
  type AshStickerId,
} from "@/lib/ashAiContext"
import {
  normalizeAshAiArtifacts,
  type AshAiUiArtifact,
} from "@/lib/ashAiArtifacts"
import {
  ASH_AI_VISION_MODEL_ID,
  getStoredAshAiModelId,
} from "@/lib/ashAiModels"
import {
  normalizeAshAiWorkLinks,
  type AshAiUiLink,
} from "@/lib/ashAiWorkLinks"
import {
  absolutizePublicAssetUrl,
  fetchImageAsDataUrlForVision,
} from "@/lib/ashAiVisualContext"

const POLLINATIONS_BASE_URL = "https://gen.pollinations.ai"
export const POLLINATIONS_ACCOUNT_DOCS_URL =
  "https://gen.pollinations.ai/docs#tag/account/GET/account/balance"
const MAX_HISTORY_MESSAGES = 10

/** Models that receive optional image_url on the last user turn (Pollinations OpenAI-compatible route). */
const POLLINATIONS_VISION_MODEL_IDS = new Set<string>([ASH_AI_VISION_MODEL_ID])

function resolveChatModelId(
  lastUserImageUrl?: string | null,
  /** When set (e.g. tests), overrides automatic vision routing. */
  modelOverride?: string | null
): string {
  if (modelOverride?.trim()) return modelOverride.trim()
  if (lastUserImageUrl?.trim()) return ASH_AI_VISION_MODEL_ID
  return getStoredAshAiModelId()
}

type ApiMessageContent =
  | string
  | [
      { type: "image_url"; image_url: { url: string } },
      { type: "text"; text: string },
    ]

function visionImageApiUrl(resolvedSrc: string): string {
  const t = resolvedSrc.trim()
  if (
    t.startsWith("data:") ||
    t.startsWith("http://") ||
    t.startsWith("https://")
  ) {
    return t
  }
  return absolutizePublicAssetUrl(t)
}

function mapMessagesForApi(
  recentMessages: AshAiChatMessage[],
  model: string,
  lastUserImageUrl?: string | null
): { role: string; content: ApiMessageContent }[] {
  return recentMessages.map((message, index) => {
    const isLast = index === recentMessages.length - 1
    const useVision =
      message.role === "user" &&
      isLast &&
      Boolean(lastUserImageUrl?.trim()) &&
      POLLINATIONS_VISION_MODEL_IDS.has(model)
    if (useVision) {
      return {
        role: message.role,
        content: [
          {
            type: "image_url",
            image_url: {
              url: visionImageApiUrl(lastUserImageUrl!),
            },
          },
          { type: "text", text: message.content },
        ],
      }
    }
    return { role: message.role, content: message.content }
  })
}

/** These models return 422 with `response_format: json_object` on some Pollinations routes. */
const POLLINATIONS_MODELS_OMIT_JSON_RESPONSE_FORMAT = new Set([
  "mistral",
  "nova-fast",
])

function chatCompletionBody(
  model: string,
  recentMessages: AshAiChatMessage[],
  stream: boolean,
  lastUserImageUrl?: string | null
) {
  const messages: { role: string; content: ApiMessageContent }[] = [
    { role: "system", content: ASH_AI_SYSTEM_PROMPT },
    ...mapMessagesForApi(recentMessages, model, lastUserImageUrl),
  ]
  const base = {
    model,
    temperature: 0.72,
    max_tokens: 320,
    stream,
    messages,
  }
  const hasVisionInput = Boolean(lastUserImageUrl?.trim())
  if (
    POLLINATIONS_MODELS_OMIT_JSON_RESPONSE_FORMAT.has(model) ||
    hasVisionInput
  ) {
    return base
  }
  return { ...base, response_format: { type: "json_object" as const } }
}

async function resolveVisionUrlForApi(
  lastUserImageUrl?: string | null
): Promise<string | null> {
  const raw = lastUserImageUrl?.trim()
  if (!raw) return null
  const dataUrl = await fetchImageAsDataUrlForVision(raw)
  if (dataUrl) return dataUrl
  return absolutizePublicAssetUrl(raw)
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
  artifacts: AshAiUiArtifact[]
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
    return { message: fallbackMessage, sticker: null, links: [], artifacts: [] }
  }

  try {
    const parsed = JSON.parse(content) as {
      message?: unknown
      sticker?: unknown
      links?: unknown
      artifacts?: unknown
    }
    return {
      message:
        typeof parsed.message === "string" && parsed.message.trim()
          ? parsed.message.trim()
          : fallbackMessage,
      sticker: isAshStickerId(parsed.sticker) ? parsed.sticker : null,
      links: normalizeAshAiWorkLinks(parsed.links),
      artifacts: normalizeAshAiArtifacts(parsed.artifacts),
    }
  } catch {
    return { message: fallbackMessage, sticker: null, links: [], artifacts: [] }
  }
}

export async function askAshAi(
  messages: AshAiChatMessage[],
  request?: { lastUserImageUrl?: string | null; modelId?: string | null }
): Promise<AshAiResponse> {
  const apiKey = getPollinationsKey()

  if (!apiKey || !apiKey.startsWith("pk_")) {
    throw new Error("Missing publishable Pollinations API key.")
  }

  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES)
  const model = resolveChatModelId(
    request?.lastUserImageUrl,
    request?.modelId
  )
  const visionUrl = await resolveVisionUrlForApi(request?.lastUserImageUrl)
  const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      chatCompletionBody(model, recentMessages, false, visionUrl ?? undefined)
    ),
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
    lastUserImageUrl?: string | null
    /** Rare override; normally image turns auto-use the vision model (GPT-5.4 Nano). */
    modelId?: string | null
  }
): Promise<AshAiResponse> {
  const apiKey = getPollinationsKey()

  if (!apiKey || !apiKey.startsWith("pk_")) {
    throw new Error("Missing publishable Pollinations API key.")
  }

  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES)
  const model = resolveChatModelId(
    options.lastUserImageUrl,
    options.modelId
  )
  const visionUrl = await resolveVisionUrlForApi(options.lastUserImageUrl)
  const structuredStreamPreview = !visionUrl
  const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: options.signal,
    body: JSON.stringify(
      chatCompletionBody(model, recentMessages, true, visionUrl ?? undefined)
    ),
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
          structuredStreamPreview
            ? previewStreamingAssistantJson(accumulated)
            : accumulated.trim()
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
