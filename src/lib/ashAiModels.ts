/** Pollinations chat model ids — labels match gen.pollinations.ai text model catalog. */
export const ASH_AI_CHAT_MODEL_OPTIONS = [
  { id: "qwen-coder", label: "Qwen3 Coder 30B" },
  { id: "openai", label: "GPT-5.4 Nano" },
] as const

export type AshAiChatModelId = (typeof ASH_AI_CHAT_MODEL_OPTIONS)[number]["id"]

/** Pollinations id for “GPT-5.4 Nano” in settings — supports `image_url` on the last user turn. */
export const ASH_AI_VISION_MODEL_ID: AshAiChatModelId = "openai"

const DEFAULT_MODEL: AshAiChatModelId = "qwen-coder"

export const ASH_AI_MODEL_STORAGE_KEY = "ash-ai-chat-model-id"

const ALLOWED = new Set<string>(
  ASH_AI_CHAT_MODEL_OPTIONS.map((o) => o.id)
)

export function getStoredAshAiModelId(): AshAiChatModelId {
  if (typeof window === "undefined") return DEFAULT_MODEL
  try {
    const raw = window.localStorage.getItem(ASH_AI_MODEL_STORAGE_KEY)
    if (raw && ALLOWED.has(raw)) return raw as AshAiChatModelId
  } catch {
    /* private mode / quota */
  }
  return DEFAULT_MODEL
}

export function setStoredAshAiModelId(id: AshAiChatModelId) {
  if (!ALLOWED.has(id)) return
  try {
    window.localStorage.setItem(ASH_AI_MODEL_STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function isAshAiChatModelId(value: string): value is AshAiChatModelId {
  return ALLOWED.has(value)
}
