import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { ArrowUp, ArrowUpRight, Square, Sparkles } from "lucide-react"

import { type AshStickerId } from "@/lib/ashAiContext"
import type { AshAiUiArtifact } from "@/lib/ashAiArtifacts"
import {
  askAshAiStream,
  fetchPollinationsAccountBalance,
  type AshAiChatMessage,
} from "@/lib/pollinationsAshAi"
import { type AshAiUiLink } from "@/lib/ashAiWorkLinks"
import { ashAiNotesContextBlock, type AshAiUiNoteLink } from "@/lib/ashAiNotes"
import { requestNotesDeepLink } from "@/lib/notesDeepLink"
import {
  type AshAiHandoffDetail,
  requestAshAiHandoff,
} from "@/lib/ashAiVisualContext"
import { cn } from "@/lib/utils"

import {
  makeAshAiMessage,
  messagesForPersistence,
  type AshAiChatsStore,
  type AshAiUiMessage,
  withUpdatedThread,
} from "./ash-ai-chat-storage"
import {
  CHAT_APP_ARABIC_FONT,
  ASH_AI_GREETING,
  ASH_AI_STARTER_PROMPTS,
  ASH_STICKER_ROOT,
  CHAT_APP_UI_FONT,
  CHATGPT_MARK_SRC,
} from "./constants"
import { AshAiAssistantRichText } from "./ash-ai-assistant-rich-text"

export type { AshAiUiMessage }

function hasArabicScript(text: string) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text)
}

function AshAiArtifactCards({
  artifacts,
  fontFamily,
}: {
  artifacts: AshAiUiArtifact[]
  fontFamily: string
}) {
  const askAbout = (artifact: AshAiUiArtifact) => {
    requestAshAiHandoff({
      userText: `Tell me more about “${artifact.title}” and how it shows up in Ash’s work.`,
      imageSrc: artifact.kind === "image" ? artifact.mediaSrc : undefined,
      sourceLabel: "ash-ai-artifact",
    })
  }

  return (
    <div className="mt-2.5 flex flex-col gap-2">
      {artifacts.map((artifact) => (
        <div
          key={artifact.artifactId}
          className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white to-neutral-50/95 shadow-[0_1px_3px_rgb(0_0_0/0.06)]"
        >
          <div className="relative aspect-[16/9] w-full bg-neutral-900/8">
            {artifact.kind === "video" ? (
              <video
                src={artifact.mediaSrc}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
                aria-label={artifact.mediaAlt}
              />
            ) : (
              <img
                src={artifact.mediaSrc}
                alt={artifact.mediaAlt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <div className="px-3 py-2.5">
            {artifact.subtitle ? (
              <p
                className="text-[0.72rem] font-medium tracking-wide text-neutral-500 uppercase"
                style={{ fontFamily }}
              >
                {artifact.subtitle}
              </p>
            ) : null}
            <p
              className={cn(
                "text-[0.95rem] font-semibold tracking-[-0.02em] text-neutral-950",
                artifact.subtitle ? "mt-0.5" : ""
              )}
              style={{ fontFamily }}
            >
              {artifact.title}
            </p>
            <p
              className="mt-1 text-[0.78rem] leading-snug text-neutral-600"
              style={{ fontFamily }}
            >
              {artifact.description}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {artifact.href ? (
                <a
                  href={artifact.href}
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-950 px-3 py-1.5 text-[0.72rem] font-semibold text-white"
                  style={{ fontFamily }}
                >
                  {artifact.ctaLabel}
                  <ArrowUpRight className="size-3.5" strokeWidth={2.25} />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => askAbout(artifact)}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[0.72rem] font-semibold text-neutral-800 transition hover:border-neutral-300"
                style={{ fontFamily }}
              >
                <Sparkles className="size-3.5 text-amber-500" strokeWidth={2} />
                Ask Ash AI
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AshAiWorkLinkCards({
  links,
  fontFamily,
}: {
  links: AshAiUiLink[]
  fontFamily: string
}) {
  return (
    <div className="mt-2.5 flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.workId}
          href={link.href}
          aria-label={`Open ${link.title} case study`}
          className="group flex min-w-0 items-center gap-3 rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white to-neutral-50/95 px-3 py-2.5 shadow-[0_1px_3px_rgb(0_0_0/0.06)] transition hover:border-neutral-300 hover:shadow-[0_4px_14px_rgb(0_0_0/0.08)]"
        >
          <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]">
            <img
              src={link.logoSrc}
              alt=""
              className="max-h-9 max-w-9 object-contain"
              loading="lazy"
              decoding="async"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[0.9rem] font-semibold tracking-[-0.02em] text-neutral-950"
              style={{ fontFamily }}
            >
              {link.title}
            </p>
            <p
              className="text-[0.72rem] leading-tight text-neutral-500"
              style={{ fontFamily }}
            >
              Open case study
            </p>
          </div>
          <ArrowUpRight
            className="size-4 shrink-0 text-neutral-400 transition group-hover:text-neutral-700"
            strokeWidth={2.25}
            aria-hidden
          />
        </a>
      ))}
    </div>
  )
}

function AshAiNoteCards({ notes, fontFamily }: { notes: AshAiUiNoteLink[]; fontFamily: string }) {
  return (
    <div className="mt-2.5 flex flex-col gap-2">
      {notes.map((note) => (
        <button
          key={note.noteId}
          type="button"
          onClick={() => requestNotesDeepLink({ noteId: note.noteId })}
          className="group flex min-w-0 items-center gap-3 rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white to-neutral-50/95 px-3 py-2.5 text-left shadow-[0_1px_3px_rgb(0_0_0/0.06)] transition hover:border-neutral-300 hover:shadow-[0_4px_14px_rgb(0_0_0/0.08)]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#fff9e6] text-[0.66rem] font-semibold tracking-[0.08em] text-[#7f5a00] uppercase">
            Note
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[0.9rem] font-semibold tracking-[-0.02em] text-neutral-950"
              style={{ fontFamily }}
            >
              {note.title}
            </p>
            <p
              className="text-[0.72rem] leading-tight text-neutral-500"
              style={{ fontFamily }}
            >
              {note.folderLabel} - Open in Notes
            </p>
          </div>
          <ArrowUpRight
            className="size-4 shrink-0 text-neutral-400 transition group-hover:text-neutral-700"
            strokeWidth={2.25}
            aria-hidden
          />
        </button>
      ))}
    </div>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-1.5" aria-label="Typing">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-2 w-2 animate-pulse rounded-full bg-neutral-500"
          style={{ animationDelay: `${dot * 120}ms` }}
        />
      ))}
    </span>
  )
}

function shouldShowAshSticker(
  sticker: AshStickerId | null,
  messages: AshAiUiMessage[]
) {
  if (!sticker) return null
  const recentAssistantMessages = messages
    .filter((message) => message.role === "assistant")
    .slice(-3)
  return recentAssistantMessages.some((message) => message.sticker)
    ? null
    : sticker
}

export function AshAiScreen({
  chatId: _chatId,
  initialMessages,
  onPersistStore,
  bootstrapHandoff,
  onConsumeBootstrapHandoff,
}: {
  chatId: string
  initialMessages: AshAiUiMessage[]
  onPersistStore: (
    updater: (prev: AshAiChatsStore) => AshAiChatsStore
  ) => void
  bootstrapHandoff?: AshAiHandoffDetail | null
  onConsumeBootstrapHandoff?: () => void
}) {
  const [messages, setMessages] = useState<AshAiUiMessage[]>(() =>
    initialMessages.map((m) => ({ ...m, streaming: false }))
  )
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const [draft, setDraft] = useState("")
  const [awaitingReply, setAwaitingReply] = useState(false)
  const [greetingRevealLength, setGreetingRevealLength] = useState<
    number | null
  >(null)
  const [pollenBalance, setPollenBalance] = useState<
    "loading" | { balance: number } | "unavailable" | "no_key" | "forbidden"
  >("loading")

  const scrollFrameRef = useRef<number | null>(null)
  const shouldAnchorToBottomRef = useRef(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const chatEpochRef = useRef(0)
  const streamAbortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => streamAbortRef.current?.abort()
  }, [])

  const scrollToBottom = () => {
    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const area = scrollAreaRef.current
      if (area) {
        area.scrollTop = area.scrollHeight
      }
      scrollFrameRef.current = null
    })
  }

  useEffect(() => {
    const ac = new AbortController()
    void (async () => {
      const result = await fetchPollinationsAccountBalance(ac.signal)
      if (ac.signal.aborted) return
      if (result.ok) {
        setPollenBalance({ balance: result.balance })
      } else if (result.reason === "no_key") {
        setPollenBalance("no_key")
      } else if (result.reason === "forbidden") {
        setPollenBalance("forbidden")
      } else {
        setPollenBalance("unavailable")
      }
    })()
    return () => ac.abort()
  }, [])

  useEffect(() => {
    if (messages.some((m) => m.streaming)) return
    onPersistStore((prev) =>
      withUpdatedThread(prev, prev.activeChatId, {
        messages: messagesForPersistence(messages),
      })
    )
  }, [messages, onPersistStore])

  useEffect(() => {
    if (shouldAnchorToBottomRef.current) {
      scrollToBottom()
    }
  }, [messages, awaitingReply, greetingRevealLength])

  useLayoutEffect(() => {
    const onlyGreeting =
      messages.length === 1 &&
      messages[0].role === "assistant" &&
      messages[0].content === ASH_AI_GREETING

    if (!onlyGreeting) {
      setGreetingRevealLength(null)
      return
    }

    setGreetingRevealLength(1)
    let revealed = 1
    const id = window.setInterval(() => {
      revealed += 1
      setGreetingRevealLength(revealed)
      shouldAnchorToBottomRef.current = true
      scrollToBottom()
      if (revealed >= ASH_AI_GREETING.length) {
        window.clearInterval(id)
        setGreetingRevealLength(null)
      }
    }, 52)

    return () => window.clearInterval(id)
  }, [messages])

  const assistantTextToShow = (
    message: AshAiUiMessage,
    index: number
  ): string => {
    if (
      index === 0 &&
      message.role === "assistant" &&
      message.content === ASH_AI_GREETING &&
      greetingRevealLength !== null
    ) {
      return ASH_AI_GREETING.slice(
        0,
        Math.min(greetingRevealLength, ASH_AI_GREETING.length)
      )
    }
    return message.content
  }

  const runAssistantTurn = async (
    rawContent: string,
    options?: {
      imageSrc?: string | null
      clearDraft?: boolean
    }
  ) => {
    const content = rawContent.trim()
    if (!content) return

    const lastUserImageUrl = options?.imageSrc?.trim()
      ? options.imageSrc.trim()
      : undefined

    streamAbortRef.current?.abort()
    chatEpochRef.current += 1
    const epoch = chatEpochRef.current
    const ac = new AbortController()
    streamAbortRef.current = ac

    shouldAnchorToBottomRef.current = true
    const userMessage = makeAshAiMessage("user", content, {
      imageSrc: options?.imageSrc?.trim() || undefined,
    })
    const nextMessages = [...messagesRef.current, userMessage]
    const historyForApi: AshAiChatMessage[] = nextMessages.map(
      ({ role, content: c }) => ({ role, content: c })
    )

    setMessages([
      ...nextMessages,
      makeAshAiMessage("assistant", "", { streaming: true }),
    ])
    if (options?.clearDraft) setDraft("")
    setAwaitingReply(true)

    try {
      const notesPrompt = [
        "Live notes context (these can be referenced in `notes` by noteId):",
        ashAiNotesContextBlock(),
      ].join("\n")
      const answer = await askAshAiStream(historyForApi, {
        signal: ac.signal,
        lastUserImageUrl,
        supplementalSystemPrompt: notesPrompt,
        onDelta: (_raw, preview) => {
          if (epoch !== chatEpochRef.current) return
          setMessages((current) => {
            const next = [...current]
            const last = next[next.length - 1]
            if (last?.role === "assistant" && last.streaming) {
              next[next.length - 1] = {
                ...last,
                content: preview,
              }
            }
            return next
          })
        },
      })
      if (epoch !== chatEpochRef.current) return
      const sticker = shouldShowAshSticker(answer.sticker, nextMessages)
      setMessages((current) => {
        const next = [...current]
        const last = next[next.length - 1]
        if (last?.role === "assistant" && last.streaming) {
          next[next.length - 1] = {
            ...last,
            content: answer.message,
            sticker,
            links: answer.links.length ? answer.links : undefined,
            notes: answer.notes.length ? answer.notes : undefined,
            artifacts: answer.artifacts.length ? answer.artifacts : undefined,
            streaming: false,
          }
        }
        return next
      })
    } catch (err) {
      if (epoch !== chatEpochRef.current) return
      if (err instanceof Error && err.name === "AbortError") {
        return
      }
      setMessages((current) => {
        const next = [...current]
        const last = next[next.length - 1]
        if (last?.role === "assistant" && last.streaming) {
          next[next.length - 1] = makeAshAiMessage(
            "assistant",
            "Connection hiccup on my side — your message is still there. Try again in a sec?",
            { failed: true }
          )
        }
        return next
      })
    } finally {
      if (streamAbortRef.current === ac) {
        streamAbortRef.current = null
      }
      if (epoch === chatEpochRef.current) {
        setAwaitingReply(false)
      }
    }
  }

  useEffect(() => {
    if (!bootstrapHandoff?.userText?.trim()) return
    onConsumeBootstrapHandoff?.()
    void runAssistantTurn(bootstrapHandoff.userText.trim(), {
      imageSrc: bootstrapHandoff.imageSrc,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot handoff payload per open
  }, [bootstrapHandoff])

  const stopGenerating = () => {
    if (!awaitingReply) return
    chatEpochRef.current += 1
    streamAbortRef.current?.abort()
    setAwaitingReply(false)
    setMessages((current) => {
      const next = [...current]
      const last = next[next.length - 1]
      if (last?.role === "assistant" && last.streaming) {
        if (!last.content.trim()) {
          next.pop()
        } else {
          next[next.length - 1] = { ...last, streaming: false }
        }
      }
      return next
    })
  }

  const sendMessage = async () => {
    const content = draft.trim()
    if (!content) return
    await runAssistantTurn(content, { clearDraft: true })
  }

  const balanceNote = (() => {
    if (pollenBalance === "loading") {
      return "Checking credits…"
    }
    if (pollenBalance === "no_key") {
      return "Add a publishable Pollinations key (VITE_POLLINATIONS_API_KEY) to show credit balance."
    }
    if (pollenBalance === "forbidden") {
      return "This key can’t read balance — check account permissions in the docs."
    }
    if (pollenBalance === "unavailable") {
      return "Couldn’t load balance right now."
    }
    return `Credits ${pollenBalance.balance.toLocaleString()}`
  })()

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-[#101010]">
      <div
        ref={scrollAreaRef}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5",
          "[scrollbar-width:none] [-ms-overflow-style:none]",
          "[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
        )}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
        onScroll={(event) => {
          const target = event.currentTarget
          const remaining =
            target.scrollHeight - target.scrollTop - target.clientHeight
          shouldAnchorToBottomRef.current = remaining < 64
        }}
      >
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => {
            const isUser = message.role === "user"
            const showDots =
              message.role === "assistant" &&
              message.streaming &&
              !message.content.trim()
            const showStarterChips =
              messages.length === 1 &&
              index === 0 &&
              message.role === "assistant" &&
              message.content === ASH_AI_GREETING &&
              greetingRevealLength === null &&
              !message.streaming &&
              !message.failed
            return (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                {isUser ? (
                  <div
                    className="max-w-[82%] rounded-[1.15rem] bg-[#ececea] px-3.5 py-2.5 text-[1.02rem] leading-[1.38] text-neutral-950"
                    style={{
                      fontFamily: hasArabicScript(message.content)
                        ? CHAT_APP_ARABIC_FONT
                        : CHAT_APP_UI_FONT,
                    }}
                    dir="auto"
                    lang={hasArabicScript(message.content) ? "ar" : "en"}
                  >
                    {message.imageSrc ? (
                      <div className="mb-2 overflow-hidden rounded-xl border border-black/8 bg-neutral-200/35">
                        <img
                          src={message.imageSrc}
                          alt=""
                          className="max-h-36 w-full object-cover object-top"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : null}
                    {message.content}
                  </div>
                ) : (
                  <div className="flex max-w-[92%] items-start gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center self-start rounded-full border border-neutral-200/90 bg-white shadow-[0_1px_4px_rgb(0_0_0/0.06)]">
                      <img
                        src={CHATGPT_MARK_SRC}
                        alt=""
                        className="h-[1.125rem] w-[1.125rem] object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <div className="min-w-0 self-start pt-[0.125rem]">
                      {showDots ? (
                        <TypingDots />
                      ) : (
                        <div
                          className={cn(
                            "text-[1.02rem] leading-[1.42]",
                            hasArabicScript(assistantTextToShow(message, index))
                              ? "leading-[1.58]"
                              : "",
                            message.failed
                              ? "text-rose-700"
                              : "text-neutral-950"
                          )}
                          style={{
                            fontFamily: hasArabicScript(
                              assistantTextToShow(message, index)
                            )
                              ? CHAT_APP_ARABIC_FONT
                              : CHAT_APP_UI_FONT,
                          }}
                          dir="auto"
                          lang={
                            hasArabicScript(assistantTextToShow(message, index))
                              ? "ar"
                              : "en"
                          }
                        >
                          <AshAiAssistantRichText
                            text={assistantTextToShow(message, index)}
                          />
                        </div>
                      )}
                      {showStarterChips ? (
                        <div className="mt-3 flex flex-col gap-2">
                          {ASH_AI_STARTER_PROMPTS.map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => void runAssistantTurn(prompt)}
                              disabled={awaitingReply}
                              className="rounded-2xl border border-neutral-200/95 bg-white px-3 py-2.5 text-left text-[0.82rem] leading-snug font-medium text-neutral-900 shadow-[0_1px_3px_rgb(0_0_0/0.05)] transition enabled:hover:border-neutral-300 enabled:hover:shadow-[0_4px_12px_rgb(0_0_0/0.06)] disabled:opacity-45"
                              style={{ fontFamily: CHAT_APP_UI_FONT }}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {message.links &&
                      message.links.length > 0 &&
                      !message.streaming &&
                      !message.failed ? (
                        <AshAiWorkLinkCards
                          links={message.links}
                          fontFamily={CHAT_APP_UI_FONT}
                        />
                      ) : null}
                      {message.notes &&
                      message.notes.length > 0 &&
                      !message.streaming &&
                      !message.failed ? (
                        <AshAiNoteCards
                          notes={message.notes}
                          fontFamily={CHAT_APP_UI_FONT}
                        />
                      ) : null}
                      {message.artifacts &&
                      message.artifacts.length > 0 &&
                      !message.streaming &&
                      !message.failed ? (
                        <AshAiArtifactCards
                          artifacts={message.artifacts}
                          fontFamily={CHAT_APP_UI_FONT}
                        />
                      ) : null}
                      {message.sticker && !message.streaming ? (
                        <img
                          src={`${ASH_STICKER_ROOT}/${message.sticker}.png`}
                          alt=""
                          className="mt-2 h-24 w-24 rounded-[1rem] object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white px-3 pt-1.5 pb-1">
        <p
          className="text-[0.62rem] leading-[1.35] text-neutral-500"
          style={{ fontFamily: CHAT_APP_UI_FONT }}
        >
          {balanceNote}
        </p>
      </div>

      <form
        className="bg-white px-3 pb-5 pt-0"
        onSubmit={(event) => {
          event.preventDefault()
          void sendMessage()
        }}
      >
        <div className="flex items-center gap-1 rounded-full bg-[#f3f3f3] px-1 py-1 pl-[0.85rem]">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Say anything…"
            className="min-w-0 flex-1 bg-transparent py-2 pr-1 text-[0.9rem] leading-normal text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
            style={{ fontFamily: CHAT_APP_UI_FONT }}
            disabled={awaitingReply}
            aria-label="Message to Ash AI"
            dir="auto"
            lang={hasArabicScript(draft) ? "ar" : "en"}
          />
          <button
            type={awaitingReply ? "button" : "submit"}
            disabled={!awaitingReply && !draft.trim()}
            onClick={
              awaitingReply
                ? (event) => {
                    event.preventDefault()
                    stopGenerating()
                  }
                : undefined
            }
            className={cn(
              "grid size-[2.125rem] shrink-0 place-items-center rounded-full text-white transition enabled:active:scale-[0.98] disabled:opacity-40",
              awaitingReply
                ? "bg-rose-600 enabled:hover:bg-rose-700"
                : "bg-neutral-950 enabled:hover:bg-black"
            )}
            aria-label={awaitingReply ? "Stop generating" : "Send message"}
          >
            {awaitingReply ? (
              <Square
                className="size-[0.65rem] shrink-0"
                fill="currentColor"
                strokeWidth={0}
                aria-hidden
              />
            ) : (
              <ArrowUp
                className="size-[1.05rem] shrink-0"
                strokeWidth={2.25}
                aria-hidden
              />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

AshAiScreen.displayName = "AshAiScreen"
