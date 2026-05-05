import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react"

import { PhoneBrowserToolbar } from "./browser-toolbar"
import { BODY_FONT, DISPLAY_FONT } from "./constants"
import { PhoneWebEmbed } from "./phone-web-embed"
import type { StandardApp } from "./types"

function urlForAddressBar(raw: string): string {
  try {
    const u = new URL(raw)
    const host = u.hostname.replace(/^www\./, "")
    const path = u.pathname === "/" ? "" : u.pathname
    const qs = u.search || ""
    return `${host}${path}${qs}` || host
  } catch {
    return raw
  }
}

function normalizeNavigateUrl(input: string): string | null {
  const t = input.trim()
  if (!t) return null
  if (/^https?:\/\//i.test(t)) return t
  if (/^\/\//.test(t)) return `https:${t}`
  return `https://${t}`
}

type HistoryState = { urls: string[]; index: number }

function initialHistory(app: StandardApp): HistoryState {
  const raw = app.href?.trim()
  if (!raw) return { urls: [], index: -1 }
  const url = normalizeNavigateUrl(raw)
  if (!url) return { urls: [], index: -1 }
  return { urls: [url], index: 0 }
}

export function SafariBrowserScreen({ app }: { app: StandardApp }) {
  const [history, setHistory] = useState<HistoryState>(() =>
    initialHistory(app)
  )

  const committedUrl = useMemo(() => {
    const { urls, index } = history
    if (index < 0 || index >= urls.length) return ""
    return urls[index] ?? ""
  }, [history])

  const [draft, setDraft] = useState("")
  const [loaded, setLoaded] = useState(true)
  const [showSlowHint, setShowSlowHint] = useState(false)

  useEffect(() => {
    setDraft(committedUrl ? urlForAddressBar(committedUrl) : "")
  }, [committedUrl])

  useEffect(() => {
    if (!committedUrl) {
      setLoaded(true)
      setShowSlowHint(false)
      return
    }
    setLoaded(false)
    setShowSlowHint(false)
    const slow = window.setTimeout(() => setShowSlowHint(true), 12_000)
    return () => window.clearTimeout(slow)
  }, [committedUrl])

  const commitNavigation = useCallback((raw: string) => {
    const next = normalizeNavigateUrl(raw)
    if (!next) return
    setHistory((h) => ({
      urls: [...h.urls.slice(0, h.index + 1), next],
      index: h.index + 1,
    }))
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    commitNavigation(draft)
  }

  const canGoBack = history.index > 0
  const canGoForward = history.index < history.urls.length - 1

  const goBack = () => {
    setHistory((h) => (h.index > 0 ? { ...h, index: h.index - 1 } : h))
  }

  const goForward = () => {
    setHistory((h) =>
      h.index < h.urls.length - 1 ? { ...h, index: h.index + 1 } : h
    )
  }

  const isHttps = committedUrl.startsWith("https://")
  const addressText = urlForAddressBar(committedUrl || draft || "")

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain bg-white">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain">
        {committedUrl ? (
          <>
            <PhoneWebEmbed
              key={`${history.index}:${committedUrl}`}
              src={committedUrl}
              title={app.title}
              onLoad={() => setLoaded(true)}
            />
            {!loaded ? (
              <div
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-white"
                aria-live="polite"
                aria-busy="true"
              >
                <p
                  className="text-[0.8rem] font-medium text-neutral-500"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  Loading…
                </p>
                <p
                  className="max-w-[14rem] px-4 text-center text-[0.72rem] text-neutral-400"
                  style={{ fontFamily: BODY_FONT }}
                >
                  {addressText}
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-white px-6 text-center">
            <p
              className="text-[0.85rem] font-medium text-neutral-500"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Mini Safari
            </p>
            <p
              className="max-w-[14rem] text-[0.72rem] text-neutral-400"
              style={{ fontFamily: BODY_FONT }}
            >
              Enter a URL below. Some sites block embedded previews—use Open
              outside if the page stays blank.
            </p>
          </div>
        )}
      </div>

      <PhoneBrowserToolbar
        fullUrl={committedUrl}
        isHttps={isHttps}
        showSlowHint={Boolean(committedUrl && showSlowHint)}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onBack={goBack}
        onForward={goForward}
        addressControl={
          <form className="min-w-0 flex-1" onSubmit={onSubmit}>
            <label htmlFor="safari-url" className="sr-only">
              Address
            </label>
            <input
              id="safari-url"
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => {
                if (committedUrl) setDraft(committedUrl)
              }}
              className="w-full min-w-0 border-0 bg-transparent p-0 text-[0.72rem] leading-tight font-medium tracking-[-0.01em] text-neutral-800 outline-none"
              style={{ fontFamily: "ui-monospace, monospace" }}
              placeholder="Search or enter website name"
            />
          </form>
        }
      />
    </div>
  )
}
