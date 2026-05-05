import { ChevronLeft, ChevronRight, Lock, Share } from "lucide-react"

import { cn } from "@/lib/utils"

import { BODY_FONT, CHAT_APP_UI_FONT, DISPLAY_FONT } from "./constants"

export function PhoneBrowserToolbar({
  fullUrl,
  isHttps,
  showSlowHint,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  addressControl,
}: {
  fullUrl: string
  isHttps: boolean
  showSlowHint: boolean
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onForward: () => void
  addressControl: React.ReactNode
}) {
  return (
    <div
      className="shrink-0 border-t border-neutral-300/55 bg-[#ecedf0] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-[0_-1px_0_rgb(0_0_0/0.06)]"
      role="region"
      aria-label="Safari toolbar"
    >
      {showSlowHint ? (
        <p
          className="border-b border-neutral-900/[0.06] px-3 py-1.5 text-center text-[0.65rem] text-neutral-600"
          style={{ fontFamily: BODY_FONT }}
        >
          This page may block in-phone preview or is still loading.
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-1 font-semibold text-[#007aff]"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Open outside
          </a>
        </p>
      ) : null}

      <div className="flex items-center gap-1 px-2 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg text-neutral-600",
            !canGoBack && "cursor-not-allowed opacity-35"
          )}
          aria-label="Back"
        >
          <ChevronLeft className="size-5" strokeWidth={2.25} />
        </button>
        <button
          type="button"
          onClick={onForward}
          disabled={!canGoForward}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg text-neutral-600",
            !canGoForward && "cursor-not-allowed opacity-35"
          )}
          aria-label="Forward"
        >
          <ChevronRight className="size-5" strokeWidth={2.25} />
        </button>

        <div
          className={cn(
            "flex min-h-8 min-w-0 flex-1 items-center gap-1.5 rounded-xl px-2.5 py-1.5",
            "bg-white shadow-[0_1px_3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.07]"
          )}
        >
          {isHttps ? (
            <Lock
              className="size-3 shrink-0 text-neutral-400"
              strokeWidth={2.25}
              aria-hidden
            />
          ) : null}
          <div
            className="min-w-0 flex-1 text-[0.72rem] font-medium tracking-[-0.01em] text-neutral-800"
            style={{ fontFamily: CHAT_APP_UI_FONT }}
          >
            {addressControl}
          </div>
        </div>

        <a
          href={fullUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg text-[#007aff] transition active:opacity-70",
            !fullUrl && "pointer-events-none opacity-35"
          )}
          aria-label="Open in browser"
          onClick={(e) => {
            if (!fullUrl) e.preventDefault()
          }}
        >
          <Share className="size-[1.15rem]" strokeWidth={2.25} />
        </a>
      </div>

      <div
        className="mx-auto mt-2 h-1 w-28 rounded-full bg-neutral-800/18"
        aria-hidden
      />
    </div>
  )
}
