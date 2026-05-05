import {
  ASH_AI_SYSTEM_PROMPT,
  isAshStickerId,
  type AshStickerId,
} from "@/lib/ashAiContext"

const POLLINATIONS_BASE_URL = "https://gen.pollinations.ai"
const POLLINATIONS_MODEL = "qwen-coder"
const MAX_HISTORY_MESSAGES = 10

type ChatRole = "assistant" | "user"

export type AshAiChatMessage = {
  role: ChatRole
  content: string
}

export type AshAiResponse = {
  message: string
  sticker: AshStickerId | null
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

function parseAssistantPayload(content: unknown): AshAiResponse {
  const fallbackMessage =
    typeof content === "string" && content.trim()
      ? content.trim()
      : "I could not shape that answer cleanly. Ask me again in a simpler way?"

  if (typeof content !== "string") {
    return { message: fallbackMessage, sticker: null }
  }

  try {
    const parsed = JSON.parse(content) as {
      message?: unknown
      sticker?: unknown
    }
    return {
      message:
        typeof parsed.message === "string" && parsed.message.trim()
          ? parsed.message.trim()
          : fallbackMessage,
      sticker: isAshStickerId(parsed.sticker) ? parsed.sticker : null,
    }
  } catch {
    return { message: fallbackMessage, sticker: null }
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
  const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: POLLINATIONS_MODEL,
      temperature: 0.55,
      max_tokens: 220,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ASH_AI_SYSTEM_PROMPT },
        ...recentMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    }),
  })

  const body = (await response.json().catch(() => ({}))) as PollinationsResponse

  if (!response.ok) {
    throw new Error(body.error?.message ?? "Pollinations request failed.")
  }

  return parseAssistantPayload(body.choices?.[0]?.message?.content)
}
