import { useEffect, useRef } from "react"

import { AlertTriangle } from "lucide-react"

import { CHAT_APP_UI_FONT } from "./constants"

export function ClearChatConfirmModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="absolute inset-0 z-[85] flex items-center justify-center px-5 py-10"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/48 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="clear-chat-title"
        aria-describedby="clear-chat-desc"
        className="relative w-full max-w-[16.75rem] rounded-[1.35rem] border border-black/[0.08] bg-white p-4 shadow-[0_22px_52px_rgb(0_0_0/0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex gap-2.5">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600"
            aria-hidden
          >
            <AlertTriangle className="size-[1.15rem]" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h2
              id="clear-chat-title"
              className="text-[0.9rem] font-semibold tracking-[-0.02em] text-neutral-950"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              Clear this chat?
            </h2>
            <p
              id="clear-chat-desc"
              className="mt-1.5 text-[0.78rem] leading-[1.45] text-neutral-600"
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              All messages in this session will be removed. This cannot be
              undone.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-[2.5rem] flex-1 rounded-full border border-neutral-200 bg-white py-2 text-[0.78rem] font-medium text-neutral-800 transition hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:outline-none"
            style={{ fontFamily: CHAT_APP_UI_FONT }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[2.5rem] flex-1 rounded-full bg-rose-600 py-2 text-[0.78rem] font-semibold text-white shadow-sm transition hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
            style={{ fontFamily: CHAT_APP_UI_FONT }}
          >
            Clear chat
          </button>
        </div>
      </div>
    </div>
  )
}
