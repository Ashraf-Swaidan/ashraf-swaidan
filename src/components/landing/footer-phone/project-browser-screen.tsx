import { useEffect, useMemo, useState } from "react"

import { absolutizePublicAssetUrl } from "@/lib/ashAiVisualContext"

import { PhoneBrowserToolbar } from "./browser-toolbar"
import { BODY_FONT, DISPLAY_FONT } from "./constants"
import { PhoneWebEmbed } from "./phone-web-embed"
import type { ProjectApp } from "./types"

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

export function ProjectBrowserScreen({ app }: { app: ProjectApp }) {
  const src = useMemo(() => {
    const remote = app.project.liveSiteUrl?.trim()
    if (remote) return remote
    return absolutizePublicAssetUrl(app.project.href)
  }, [app.project.liveSiteUrl, app.project.href])

  const addressText = useMemo(() => urlForAddressBar(src), [src])
  const isHttps = src.startsWith("https://")

  const modeLabel = app.project.liveSiteUrl?.trim() ? "Live site" : "Case study"
  const [loaded, setLoaded] = useState(false)
  const [showSlowHint, setShowSlowHint] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setShowSlowHint(false)
    const slow = window.setTimeout(() => setShowSlowHint(true), 12_000)
    return () => window.clearTimeout(slow)
  }, [src])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain bg-white">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain bg-white">
        <PhoneWebEmbed
          key={src}
          src={src}
          title={`${app.project.title} — ${modeLabel}`}
          onLoad={() => setLoaded(true)}
        />
        {!loaded ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-white"
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
              {app.project.title} · {modeLabel}
            </p>
          </div>
        ) : null}
      </div>

      <PhoneBrowserToolbar
        fullUrl={src}
        isHttps={isHttps}
        showSlowHint={showSlowHint}
        canGoBack={false}
        canGoForward={false}
        onBack={() => {}}
        onForward={() => {}}
        addressControl={
          <p
            className="min-w-0 truncate text-[0.72rem] leading-tight font-medium tracking-[-0.01em] text-neutral-800"
            title={src}
          >
            {addressText}
          </p>
        }
      />
    </div>
  )
}
