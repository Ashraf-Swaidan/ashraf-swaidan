import { useMemo, useState } from "react"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { PanelRightOpen, Plus, Search, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"

import type { AshAiChatThread } from "./ash-ai-chat-storage"
import {
  ASH_AI_NEW_CHAT_TITLE,
  CHAT_APP_UI_FONT,
  PHONE_APP_CONTENT_PT_CLASS,
} from "./constants"

export function AshAiChatSidebar({
  open,
  onClose,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: {
  open: boolean
  onClose: () => void
  chats: AshAiChatThread[]
  activeChatId: string
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const [query, setQuery] = useState("")
  const sorted = useMemo(
    () => [...chats].sort((a, b) => b.updatedAt - a.updatedAt),
    [chats]
  )
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter((c) => {
      if (c.title.toLowerCase().includes(q)) return true
      return c.messages.some((m) => m.content.toLowerCase().includes(q))
    })
  }, [sorted, query])

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.85 }
  const fadeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="ash-sb-backdrop"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            className="absolute inset-0 z-[60] bg-black/35 backdrop-blur-[1px]"
            aria-label="Close chat list"
            onClick={onClose}
          />
          <motion.aside
            key="ash-sb-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
            className={cn(
              "absolute inset-0 z-[61] flex min-h-0 flex-col bg-white shadow-[inset_0_1px_0_rgb(0_0_0/0.04)]"
            )}
            aria-label="Chats"
          >
            <div
              className={cn(
                "flex shrink-0 items-center justify-between gap-2 border-b border-neutral-100/90 px-3 pb-2.5",
                PHONE_APP_CONTENT_PT_CLASS
              )}
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <PanelRightOpen
                  className="size-[1.05rem] shrink-0 text-neutral-500"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-[0.82rem] font-semibold text-neutral-900">
                  Chats
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full px-2.5 py-1 text-[0.78rem] font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                aria-label="Back to chat"
              >
                Done
              </button>
            </div>

            <div className="shrink-0 space-y-2 px-2.5 pb-2 pt-2">
              <div className="flex gap-1.5">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-[0.85rem] -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50 py-2 pr-2 pl-8 text-[0.8rem] text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none"
                    style={{ fontFamily: CHAT_APP_UI_FONT }}
                    aria-label="Search chats"
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={() => {
                    onNewChat()
                    setQuery("")
                    onClose()
                  }}
                  whileTap={
                    prefersReducedMotion ? undefined : { scale: 0.94 }
                  }
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral-950 text-white transition hover:bg-black focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                  aria-label="New chat"
                >
                  <Plus className="size-[1.05rem]" strokeWidth={2.25} aria-hidden />
                </motion.button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 [scrollbar-width:thin]">
              <ul className="divide-y divide-neutral-100">
                {filtered.map((c) => {
                  const active = c.id === activeChatId
                  return (
                    <li key={c.id}>
                      <div className="group flex items-stretch">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectChat(c.id)
                            onClose()
                          }}
                          className="min-w-0 flex-1 py-3.5 pr-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                          style={{ fontFamily: CHAT_APP_UI_FONT }}
                        >
                          <p
                            className={cn(
                              "truncate text-[1.05rem] leading-snug tracking-[-0.02em]",
                              active
                                ? "font-semibold text-neutral-950"
                                : "font-medium text-neutral-700"
                            )}
                          >
                            {c.title || ASH_AI_NEW_CHAT_TITLE}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(c.id)
                          }}
                          className="grid w-10 shrink-0 place-items-center border-l border-neutral-100 text-neutral-400 transition hover:bg-rose-50/80 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:outline-none"
                          aria-label={`Delete ${c.title || "chat"}`}
                        >
                          <Trash2 className="size-4" strokeWidth={2} aria-hidden />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
              {filtered.length === 0 ? (
                <p
                  className="px-2 pt-4 text-center text-[0.78rem] text-neutral-500"
                  style={{ fontFamily: CHAT_APP_UI_FONT }}
                >
                  Nothing matches “{query.trim()}”.
                </p>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
