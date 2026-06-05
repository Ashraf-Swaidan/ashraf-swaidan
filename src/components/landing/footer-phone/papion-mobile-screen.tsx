import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { appPath } from "@/lib/appPaths"

import { BODY_FONT, DISPLAY_FONT, PAPION_MOBILE_TABS } from "./constants"
import type { PapionMobileTab, PapionMobileTabId, ProjectApp } from "./types"

function PapionTabButton({
  tab,
  active,
  onClick,
}: {
  tab: PapionMobileTab
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-2 text-[0.62rem] font-semibold tracking-[0.16em] uppercase transition",
        active
          ? "bg-[var(--color-drh-ink)] text-white shadow-[0_10px_24px_rgb(10_10_10/0.16)]"
          : "bg-white/72 text-[var(--color-drh-ink)]/48 hover:bg-white"
      )}
      style={{ fontFamily: DISPLAY_FONT }}
    >
      {tab.label}
    </button>
  )
}

function PapionProofCard({ tab }: { tab: PapionMobileTab }) {
  if (tab.id === "today") {
    return (
      <div className="rounded-[1.45rem] border border-black/6 bg-white/92 p-3 shadow-[0_18px_34px_rgb(31_24_20/0.08)]">
        <div className="flex items-center justify-between">
          <p
            className="text-[0.62rem] tracking-[0.18em] text-[var(--color-drh-ink)]/42 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {tab.proofLabel}
          </p>
          <span
            className="rounded-full bg-amber-100 px-2 py-1 text-[0.56rem] font-semibold tracking-[0.14em] text-amber-900 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Sales agenda
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {tab.metrics?.map((item) => (
            <div
              key={item.label}
              className="rounded-[1rem] bg-[var(--color-drh-bg)] px-2 py-2.5"
            >
              <p
                className="text-[1rem] leading-none font-semibold text-[var(--color-drh-ink)]"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                {item.value}
              </p>
              <p
                className="mt-1 text-[0.58rem] leading-tight text-[var(--color-drh-ink)]/48"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {tab.list?.map((item) => (
            <div
              key={item}
              className="rounded-[1rem] border border-black/5 bg-white px-3 py-2.5"
            >
              <p
                className="text-[0.78rem] leading-[1.25] text-[var(--color-drh-ink)]/72"
                style={{ fontFamily: BODY_FONT }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (tab.id === "ai") {
    return (
      <div className="rounded-[1.45rem] border border-black/6 bg-[rgb(24_24_26)] p-3 text-white shadow-[0_18px_34px_rgb(31_24_20/0.12)]">
        <p
          className="text-[0.62rem] tracking-[0.18em] text-white/42 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {tab.proofLabel}
        </p>
        <div className="mt-3 rounded-[1rem] bg-white/8 px-3 py-2.5">
          <p
            className="text-[0.82rem] leading-[1.3] text-white/82"
            style={{ fontFamily: BODY_FONT }}
          >
            {tab.query}
          </p>
        </div>
        <div className="mt-3 rounded-[1.1rem] bg-white px-3 py-3 text-[var(--color-drh-ink)]">
          <p
            className="text-[0.6rem] tracking-[0.16em] text-[var(--color-drh-ink)]/38 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Answer
          </p>
          <div className="mt-2 space-y-2">
            {tab.answer?.map((line) => (
              <p
                key={line}
                className="text-[0.78rem] leading-[1.25] text-[var(--color-drh-ink)]/72"
                style={{ fontFamily: BODY_FONT }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[1.45rem] border border-black/6 bg-white/92 p-3 shadow-[0_18px_34px_rgb(31_24_20/0.08)]">
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-[0.62rem] tracking-[0.18em] text-[var(--color-drh-ink)]/42 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {tab.proofLabel}
        </p>
        {tab.id === "expenses" ? (
          <span
            className="rounded-full bg-[#1d1d1f] px-2 py-1 text-[0.56rem] font-semibold tracking-[0.14em] text-white uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Voice ready
          </span>
        ) : null}
      </div>
      {tab.media ? (
        <div className="mt-3 overflow-hidden rounded-[1.15rem] border border-black/5 bg-[var(--color-drh-bg)]">
          <img
            src={tab.media.src}
            alt={tab.media.alt}
            className={cn(
              "w-full object-cover",
              tab.id === "expenses" ? "aspect-[4/3] object-top" : "aspect-[16/10]"
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="mt-3 space-y-2">
        {tab.list?.map((item) => (
          <div
            key={item}
            className="rounded-[1rem] bg-[var(--color-drh-bg)]/82 px-3 py-2.5"
          >
            <p
              className="text-[0.78rem] leading-[1.25] text-[var(--color-drh-ink)]/72"
              style={{ fontFamily: BODY_FONT }}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PapionMobileScreen({ app }: { app: ProjectApp }) {
  const [activeTabId, setActiveTabId] = useState<PapionMobileTabId>("today")
  const activeTab =
    PAPION_MOBILE_TABS.find((tab) => tab.id === activeTabId) ??
    PAPION_MOBILE_TABS[0]

  useEffect(() => {
    setActiveTabId("today")
  }, [app.id])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#efe7dc] text-[var(--color-drh-ink)]">
      <div className="relative overflow-hidden border-b border-black/6 px-4 pt-4 pb-3">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-85",
            activeTab.accent
          )}
          aria-hidden
        />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-[0.64rem] tracking-[0.22em] text-[var(--color-drh-ink)]/46 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {activeTab.eyebrow}
            </p>
            <h3
              className="mt-2 max-w-[11rem] text-[1.42rem] leading-[0.95] font-semibold uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Papion mobile
            </h3>
          </div>
          <img
            src={app.iconSrc}
            alt=""
            className="h-12 w-12 rounded-[1rem] bg-white/82 p-2 shadow-[0_12px_28px_rgb(31_24_20/0.12)]"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          {PAPION_MOBILE_TABS.map((tab) => (
            <PapionTabButton
              key={tab.id}
              tab={tab}
              active={tab.id === activeTab.id}
              onClick={() => setActiveTabId(tab.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-5">
        <div className="rounded-[1.5rem] bg-white/58 px-4 py-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.48)] backdrop-blur-md">
          <p
            className="text-[0.62rem] tracking-[0.18em] text-[var(--color-drh-ink)]/44 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {activeTab.label}
          </p>
          <h4
            className="mt-2 text-[1.22rem] leading-[1.02] font-semibold text-balance uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {activeTab.title}
          </h4>
          <p
            className="mt-3 text-[0.9rem] leading-[1.35] text-[var(--color-drh-ink)]/62"
            style={{ fontFamily: BODY_FONT }}
          >
            {activeTab.body}
          </p>
        </div>

        <div className="mt-4">
          <PapionProofCard tab={activeTab} />
        </div>

        <a
          href={appPath(app.project.href)}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-drh-ink)] px-5 py-3 text-center text-[0.74rem] font-semibold tracking-[0.18em] text-white uppercase transition hover:-translate-y-[1px]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {activeTab.ctaLabel ?? "Open full case study"}
        </a>
      </div>
    </div>
  )
}
