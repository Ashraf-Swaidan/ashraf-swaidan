import { useCallback, useEffect, useState } from "react"

import { PanelRightOpen, Plus, Settings } from "lucide-react"

import type { AshAiHandoffDetail } from "@/lib/ashAiVisualContext"
import { cn } from "@/lib/utils"

import { AshAiChatSidebar } from "./ash-ai-chat-sidebar"
import { AshAiSettingsPanel } from "./ash-ai-settings-panel"
import {
  addChatAndActivate,
  createNewChatThread,
  deleteChat,
  loadAshAiChatsStore,
  persistAshAiChatsStore,
  setActiveChat,
  type AshAiChatsStore,
} from "./ash-ai-chat-storage"
import { AshAiScreen } from "./ash-ai-screen"
import { ASH_AI_NEW_CHAT_TITLE, CHAT_APP_UI_FONT } from "./constants"
import { ChevronBackIcon } from "./chevron-back-icon"

export function AshAiWorkspace({
  onClose,
  bootstrapHandoff,
  onConsumeBootstrapHandoff,
}: {
  onClose: () => void
  bootstrapHandoff?: AshAiHandoffDetail | null
  onConsumeBootstrapHandoff?: () => void
}) {
  const [store, setStore] = useState<AshAiChatsStore>(loadAshAiChatsStore)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    persistAshAiChatsStore(store)
  }, [store])

  const onPersistStore = useCallback(
    (updater: (prev: AshAiChatsStore) => AshAiChatsStore) => {
      setStore(updater)
    },
    []
  )

  const activeThread =
    store.chats.find((c) => c.id === store.activeChatId) ?? store.chats[0]

  const openNewChat = useCallback(() => {
    const thread = createNewChatThread()
    setStore((s) => addChatAndActivate(s, thread))
    setSidebarOpen(false)
    setSettingsOpen(false)
  }, [])

  const selectChat = useCallback((id: string) => {
    setStore((s) => setActiveChat(s, id))
  }, [])

  const removeChat = useCallback((id: string) => {
    setStore((s) => deleteChat(s, id))
  }, [])

  if (!activeThread) {
    return null
  }

  const headerTitle = activeThread.title ?? ASH_AI_NEW_CHAT_TITLE

  return (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-9 z-20 grid h-11 grid-cols-[2.25rem_1fr_auto] items-center gap-1 px-2"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center justify-self-start rounded-full text-neutral-950 transition hover:bg-neutral-200/70 focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:outline-none"
          aria-label="Back"
        >
          <ChevronBackIcon className="text-neutral-950" />
        </button>
        <span
          className="min-w-0 truncate text-center text-[0.92rem] font-semibold tracking-[-0.01em] text-neutral-950"
          style={{ fontFamily: CHAT_APP_UI_FONT }}
          title={headerTitle}
        >
          {headerTitle}
        </span>
        <div className="flex shrink-0 items-center justify-end gap-0.5 justify-self-end">
          <button
            type="button"
            onClick={openNewChat}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 transition hover:bg-neutral-200/70 focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:outline-none"
            aria-label="New chat"
          >
            <Plus className="size-[1.15rem]" strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false)
              setSettingsOpen(true)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 transition hover:bg-neutral-200/70 focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:outline-none"
            aria-label="Open settings"
          >
            <Settings className="size-[1.05rem]" strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              setSettingsOpen(false)
              setSidebarOpen((v) => !v)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 transition hover:bg-neutral-200/70 focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:outline-none"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "Close chat list" : "Open chat list"}
          >
            <PanelRightOpen
              className="size-[1.05rem]"
              strokeWidth={2.25}
              aria-hidden
            />
          </button>
        </div>
      </div>

      <AshAiChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={store.chats}
        activeChatId={store.activeChatId}
        onSelectChat={(id) => {
          setSettingsOpen(false)
          selectChat(id)
        }}
        onNewChat={openNewChat}
        onDeleteChat={removeChat}
      />

      <AshAiSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <AshAiScreen
        key={store.activeChatId}
        chatId={store.activeChatId}
        initialMessages={activeThread.messages}
        onPersistStore={onPersistStore}
        bootstrapHandoff={bootstrapHandoff ?? null}
        onConsumeBootstrapHandoff={onConsumeBootstrapHandoff}
      />
    </>
  )
}
