import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { ArrowUp, ArrowUpRight, Square } from "lucide-react"

import {
  askAshAiStream,
  fetchPollinationsAccountBalance,
  type AshAiChatMessage,
} from "@/lib/pollinationsAshAi"
import { type AshStickerId } from "@/lib/ashAiContext"
import { type AshAiUiLink } from "@/lib/ashAiWorkLinks"
import { cn } from "@/lib/utils"

import {
  makeAshAiMessage,
  messagesForPersistence,
  type AshAiChatsStore,
  type AshAiUiMessage,
  withUpdatedThread,
} from "./ash-ai-chat-storage"
import {
  ASH_AI_GREETING,
  ASH_STICKER_ROOT,
  CHAT_APP_UI_FONT,
  CHATGPT_MARK_SRC,
} from "./constants"

export type { AshAiUiMessage }

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
}: {
  chatId: string
  initialMessages: AshAiUiMessage[]
  onPersistStore: (
    updater: (prev: AshAiChatsStore) => AshAiChatsStore
  ) => void
}) {
  const [messages, setMessages] = useState<AshAiUiMessage[]>(() =>
    initialMessages.map((m) => ({ ...m, streaming: false }))
  )
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
    return () => {
      streamAbortRef.current?.abort()
    }
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
    if (!content || awaitingReply) return

    streamAbortRef.current?.abort()
    chatEpochRef.current += 1
    const epoch = chatEpochRef.current
    const ac = new AbortController()
    streamAbortRef.current = ac

    shouldAnchorToBottomRef.current = true
    const userMessage = makeAshAiMessage("user", content)
    const nextMessages = [...messages, userMessage]
    const historyForApi: AshAiChatMessage[] = nextMessages.map(
      ({ role, content: c }) => ({ role, content: c })
    )

    setMessages([
      ...nextMessages,
      makeAshAiMessage("assistant", "", { streaming: true }),
    ])
    setDraft("")
    setAwaitingReply(true)

    try {
      const answer = await askAshAiStream(historyForApi, {
        signal: ac.signal,
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
                    style={{ fontFamily: CHAT_APP_UI_FONT }}
                  >
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
                            message.failed
                              ? "text-rose-700"
                              : "text-neutral-950"
                          )}
                          style={{ fontFamily: CHAT_APP_UI_FONT }}
                        >
                          {assistantTextToShow(message, index)}
                        </div>
                      )}
                      {message.links &&
                      message.links.length > 0 &&
                      !message.streaming &&
                      !message.failed ? (
                        <AshAiWorkLinkCards
                          links={message.links}
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
