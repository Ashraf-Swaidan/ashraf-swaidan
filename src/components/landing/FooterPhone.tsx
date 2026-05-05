import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useReducedMotion } from "motion/react"

import { SELECTED_WORKS_PROJECTS, type WorkProject } from "@/data/selectedWorks"
import { askAshAi, type AshAiChatMessage } from "@/lib/pollinationsAshAi"
import { type AshStickerId } from "@/lib/ashAiContext"
import { cn } from "@/lib/utils"
import {
  CASE_ASSETS,
  MODULE_EXPLORER_ENTRIES,
} from "@/pages/papion-system/papion-data"

gsap.registerPlugin(useGSAP)

const DISPLAY_FONT = "'Barlow Condensed', sans-serif"
const BODY_FONT = "'Cormorant Garamond', 'Fraunces Variable', serif"
const PHONE_ASSET_ROOT = "/assets/phone-apps"
const GMAIL_ADDRESS = "ashraf.swaidan.13@gmail.com"

type AppKind =
  | "chatgpt"
  | "gmail"
  | "instagram"
  | "linkedin"
  | "whatsapp"
  | "media"
  | "settings"
  | "photos"
  | "camera"
  | "files"
  | "notes"
  | "phone"
  | "safari"
  | "project"

type BaseApp = {
  id: string
  kind: AppKind
  label: string
  iconSrc: string
}

type StandardApp = BaseApp & {
  kind: Exclude<AppKind, "project">
  title: string
  body: string
  href?: string
  cta?: string
}

type ProjectApp = BaseApp & {
  kind: "project"
  project: WorkProject
}

type PhoneApp = StandardApp | ProjectApp

type PapionMobileTabId = "today" | "sales" | "expenses" | "ai"

type PapionMobileTab = {
  id: PapionMobileTabId
  label: string
  eyebrow: string
  title: string
  body: string
  accent: string
  proofLabel: string
  media?: {
    kind: "image"
    src: string
    alt: string
  }
  metrics?: { label: string; value: string }[]
  list?: string[]
  query?: string
  answer?: string[]
  ctaLabel?: string
}

const DOCK_IDS = ["whatsapp", "linkedin", "instagram", "gmail"] as const
const ASH_STICKER_ROOT = "/assets/ash-stickers"
const ASH_AI_CHAT_STORAGE_KEY = "ash-ai-chat-messages"
const CHATGPT_MARK_SRC = `${PHONE_ASSET_ROOT}/ChatGPT-Logo.svg`
const CHATGPT_SEND_ICON_SRC = `${PHONE_ASSET_ROOT}/arrow-square-top.svg`

type AshAiUiMessage = AshAiChatMessage & {
  id: string
  sticker?: AshStickerId | null
  failed?: boolean
}

const STANDARD_APPS: StandardApp[] = [
  {
    id: "chatgpt",
    kind: "chatgpt",
    label: "ChatGPT",
    iconSrc: `${PHONE_ASSET_ROOT}/chatgpt.png`,
    title: "Ask Ash AI",
    body: "Ask about Ashraf's work, systems, projects, and the operational problems behind them.",
  },
  {
    id: "gmail",
    kind: "gmail",
    label: "Gmail",
    iconSrc: `${PHONE_ASSET_ROOT}/gmail.svg`,
    title: "New message",
    body: "Send a note, a brief, a loose idea, or the tiny beginning of a bigger thing.",
    href: `mailto:${GMAIL_ADDRESS}`,
    cta: "Compose",
  },
  {
    id: "instagram",
    kind: "instagram",
    label: "Instagram",
    iconSrc: `${PHONE_ASSET_ROOT}/instagram.svg`,
    title: "@ashrafswaidan",
    body: "A compact profile preview for process fragments, visual references, and the less formal side of the work.",
    href: "https://www.instagram.com/ashrafswaidan/",
    cta: "Visit profile",
  },
  {
    id: "linkedin",
    kind: "linkedin",
    label: "LinkedIn",
    iconSrc: `${PHONE_ASSET_ROOT}/linkedIn.svg`,
    title: "Ashraf Swaidan",
    body: "A professional snapshot: product systems, interface work, shipped tools, and the practical side of the portfolio.",
    href: "https://www.linkedin.com/in/ashraf-swaidan/",
    cta: "Open profile",
  },
  {
    id: "whatsapp",
    kind: "whatsapp",
    label: "WhatsApp",
    iconSrc: `${PHONE_ASSET_ROOT}/whatsapp.svg`,
    title: "Quick chat",
    body: "A fast lane for rough context, simple questions, and low-pressure project starts.",
    href: "https://wa.me/",
    cta: "Start chat",
  },
  {
    id: "photos",
    kind: "photos",
    label: "Photos",
    iconSrc: `${PHONE_ASSET_ROOT}/photos.svg`,
    title: "Recents",
    body: "Favorite photos and visual notes will sit here in small iOS-inspired albums.",
  },
  {
    id: "settings",
    kind: "settings",
    label: "Settings",
    iconSrc: `${PHONE_ASSET_ROOT}/settings.svg`,
    title: "Portfolio OS",
    body: "Phone preferences, wallpaper controls, and future interactive settings.",
  },
  {
    id: "camera",
    kind: "camera",
    label: "Camera",
    iconSrc: `${PHONE_ASSET_ROOT}/camera.svg`,
    title: "Camera",
    body: "A future camera roll for capturing references, interface details, and quick visual notes.",
  },
  {
    id: "files",
    kind: "files",
    label: "Files",
    iconSrc: `${PHONE_ASSET_ROOT}/files.svg`,
    title: "Files",
    body: "A small file browser for briefs, project fragments, assets, and useful little documents.",
  },
  {
    id: "notes",
    kind: "notes",
    label: "Notes",
    iconSrc: `${PHONE_ASSET_ROOT}/notes.svg`,
    title: "Notes",
    body: "A scratchpad for product thoughts, project ideas, and the first rough shape of better systems.",
  },
  {
    id: "phone",
    kind: "phone",
    label: "Phone",
    iconSrc: `${PHONE_ASSET_ROOT}/phone.svg`,
    title: "Phone",
    body: "A quiet placeholder for future direct contact options. For now, Gmail and WhatsApp are the cleanest routes.",
  },
  {
    id: "safari",
    kind: "safari",
    label: "Safari",
    iconSrc: `${PHONE_ASSET_ROOT}/safari.svg`,
    title: "Safari",
    body: "A tiny browser shell for future project pages, docs, references, and portfolio links.",
  },
  {
    id: "spotify",
    kind: "media",
    label: "Spotify",
    iconSrc: `${PHONE_ASSET_ROOT}/spotify.svg`,
    title: "Studio Radio",
    body: "A Spotify-inspired shell for favorite songs and focus-mode playlists.",
    href: "https://open.spotify.com/",
    cta: "Open Spotify",
  },
  {
    id: "netflix",
    kind: "media",
    label: "Netflix",
    iconSrc: `${PHONE_ASSET_ROOT}/netflix.svg`,
    title: "My List",
    body: "A Netflix-inspired shelf for favorite shows, films, and launch-night comfort watches.",
  },
  {
    id: "youtube",
    kind: "media",
    label: "YouTube",
    iconSrc: `${PHONE_ASSET_ROOT}/youtube.svg`,
    title: "Portfolio Channel",
    body: "Future project demos and walkthroughs will show up here as thumbnails first.",
    href: "https://www.youtube.com/",
    cta: "Open YouTube",
  },
  {
    id: "app-store",
    kind: "media",
    label: "App Store",
    iconSrc: `${PHONE_ASSET_ROOT}/app-store.svg`,
    title: "App Store",
    body: "A playful place for future applets, games, and experiments inside this phone.",
  },
]

function makeProjectApps(): ProjectApp[] {
  return SELECTED_WORKS_PROJECTS.map((project) => ({
    id: `project-${project.id}`,
    kind: "project",
    label: project.title.replace(" System", ""),
    iconSrc: project.logoSrc,
    project,
  }))
}

const PAPION_COPY = {
  sales: MODULE_EXPLORER_ENTRIES.find((entry) => entry.id === "sales"),
  expenses: MODULE_EXPLORER_ENTRIES.find((entry) => entry.id === "expenses"),
  ai: MODULE_EXPLORER_ENTRIES.find((entry) => entry.id === "ai"),
} as const

const PAPION_MOBILE_TABS: PapionMobileTab[] = [
  {
    id: "today",
    label: "Today",
    eyebrow: "Operations pulse",
    title: "This is how the day stays under control.",
    body:
      "Due-date orders, unpaid follow-up, and branch tasks stay visible in one calm mobile pass before the morning gets noisy.",
    accent: "from-[#f2e7d8] via-[#ebdfcf] to-[#d8c8b0]",
    proofLabel: "Today",
    metrics: [
      { label: "Due today", value: "03" },
      { label: "Unpaid", value: "12" },
      { label: "Tasks", value: "07" },
    ],
    list: [
      "Dbayeh workshop · 11:30 vinyl pickup",
      "Event setup · Stand + latex mix due 4 PM",
      "Follow up two partial-pay bridal orders",
    ],
    ctaLabel: "Open full case study",
  },
  {
    id: "sales",
    label: "Sales",
    eyebrow: "One order, many inventories",
    title:
      PAPION_COPY.sales?.headline ??
      "One order can span the business without turning into chaos.",
    body:
      "A single customer order can mix stands, chocolate, balloons, and workshop items while keeping deposits, due dates, and unpaid balance readable.",
    accent: "from-[#efe4d3] via-[#f7f0e6] to-[#d4dce4]",
    proofLabel: "Mixed order",
    media: {
      kind: "image",
      src: CASE_ASSETS.sales,
      alt: "Papion sales module preview",
    },
    list: [
      "Maya K. · Event order · May 18",
      "2 stands + 1 chocolate tray + 24 helium balloons",
      "Deposit paid: $80 · Balance due: $145",
    ],
  },
  {
    id: "expenses",
    label: "Expenses",
    eyebrow: "Receipt to record",
    title:
      PAPION_COPY.expenses?.headline ??
      "Capture spend quickly without losing the story behind it.",
    body:
      "Upload the receipt, let AI prefill the obvious fields, then review and save. Voice entry stays nearby when hands are busy.",
    accent: "from-[#f5ead6] via-[#f8f3eb] to-[#e0d6c7]",
    proofLabel: "AI prefill",
    media: {
      kind: "image",
      src: CASE_ASSETS.receiptSample,
      alt: "Papion receipt sample used for AI expense prefilling",
    },
    list: [
      "Merchant: Color House Supplies",
      "Amount: $46.50 · Branch: Workshop",
      "Voice note ready · Review before save",
    ],
  },
  {
    id: "ai",
    label: "AI",
    eyebrow: "Role-aware assistant",
    title:
      PAPION_COPY.ai?.headline ??
      "A grounded assistant with the same permission story as the rest of the app.",
    body:
      "Answers stay tied to live operational context and the user role that asked, so the feature feels useful without becoming a leak.",
    accent: "from-[#ded7cc] via-[#f2eee8] to-[#d6dce4]",
    proofLabel: "Papion AI",
    query: "Show unpaid orders due this week and tell me what needs follow-up first.",
    answer: [
      "7 unpaid orders are due before Friday.",
      "2 are bridal event orders with due dates inside 48 hours.",
      "Cost details stay hidden for this role, but payment urgency is clear.",
    ],
  },
]

function usePhoneClock() {
  const [date, setDate] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setDate(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return {
    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
    day: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date),
    dateLine: new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
    }).format(date),
  }
}

function SignalBars() {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {[4, 6, 8, 10].map((height) => (
        <span
          key={height}
          className="w-[3px] rounded-full bg-white/90"
          style={{ height }}
        />
      ))}
    </span>
  )
}

function BatteryIcon() {
  return (
    <span className="flex items-center gap-[2px]" aria-hidden>
      <span className="h-[0.62rem] w-[1.32rem] rounded-[0.2rem] border border-white/80 p-[2px]">
        <span className="block h-full w-[72%] rounded-[0.1rem] bg-white/90" />
      </span>
      <span className="h-[0.28rem] w-[2px] rounded-r-full bg-white/72" />
    </span>
  )
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-3 text-white drop-shadow-[0_1px_4px_rgb(0_0_0/0.32)]">
      <span
        className="text-[0.72rem] font-semibold tracking-[0.02em]"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {time}
      </span>
      <span className="flex items-center gap-2">
        <SignalBars />
        <img
          src={`${PHONE_ASSET_ROOT}/wifi.svg`}
          alt=""
          className="h-3.5 w-3.5 brightness-0 invert"
          aria-hidden
        />
        <BatteryIcon />
      </span>
    </div>
  )
}

function NotificationDragHandle({ onOpen }: { onOpen: () => void }) {
  const startYRef = useRef<number | null>(null)

  return (
    <div
      className="absolute inset-x-0 top-0 z-[45] h-9 cursor-grab touch-none"
      onPointerDown={(event) => {
        startYRef.current = event.clientY
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerUp={(event) => {
        const startY = startYRef.current
        startYRef.current = null
        if (startY !== null && event.clientY - startY > 22) {
          onOpen()
        }
      }}
      onPointerCancel={() => {
        startYRef.current = null
      }}
      aria-label="Drag down for notifications"
      role="button"
      tabIndex={-1}
    />
  )
}

function AppIcon({
  app,
  onOpen,
  draggable,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  app: PhoneApp
  onOpen: () => void
  draggable?: boolean
  onDragStart?: () => void
  onDragEnter?: () => void
  onDragEnd?: () => void
}) {
  return (
    <button
      type="button"
      draggable={draggable}
      onClick={onOpen}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragEnd={onDragEnd}
      className="group flex h-[4.7rem] min-w-0 cursor-pointer flex-col items-center justify-start rounded-[1rem] px-0.5 py-1 text-center transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:outline-none"
      aria-label={`Open ${app.label}`}
    >
      <img
        src={app.iconSrc}
        alt=""
        className={cn(
          "h-[3.15rem] w-[3.15rem] rounded-[0.96rem] object-contain drop-shadow-[0_12px_18px_rgb(0_0_0/0.26)] transition group-hover:scale-[1.04]",
          app.kind === "project" && "bg-white/92 p-2"
        )}
        loading="lazy"
        decoding="async"
      />
      <span
        className="mt-1.5 w-full truncate text-[0.64rem] leading-none font-semibold text-white drop-shadow-[0_1px_5px_rgb(0_0_0/0.62)]"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {app.label}
      </span>
    </button>
  )
}

function DockIcon({ app, onOpen }: { app: PhoneApp; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid aspect-square w-full place-items-center rounded-[1.05rem] transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:outline-none"
      aria-label={`Open ${app.label}`}
    >
      <img
        src={app.iconSrc}
        alt=""
        className="h-[3.12rem] w-[3.12rem] rounded-[0.96rem] object-contain drop-shadow-[0_12px_18px_rgb(0_0_0/0.26)]"
        loading="lazy"
        decoding="async"
      />
    </button>
  )
}

function HomeWidgets({
  day,
  dateLine,
  papionApp,
  onOpenPapion,
}: {
  day: string
  dateLine: string
  papionApp?: PhoneApp
  onOpenPapion: () => void
}) {
  return (
    <div className="grid grid-cols-[1fr_0.82fr] gap-2">
      <div className="min-h-[5.3rem] rounded-[1.45rem] bg-black/24 px-3 py-3 text-white shadow-[0_14px_32px_rgb(0_0_0/0.18)] backdrop-blur-xl">
        <p
          className="text-[0.68rem] tracking-[0.18em] text-white/64 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Today
        </p>
        <p
          className="mt-1 text-[1.55rem] leading-none font-semibold"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {day}
        </p>
        <p
          className="mt-1 text-[0.92rem] text-white/70"
          style={{ fontFamily: BODY_FONT }}
        >
          {dateLine}
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenPapion}
        className="min-h-[5.3rem] rounded-[1.45rem] bg-[linear-gradient(145deg,rgb(246_237_225/0.82),rgb(213_195_170/0.62))] px-3 py-3 text-left text-[var(--color-drh-ink)] shadow-[0_14px_32px_rgb(0_0_0/0.14)] backdrop-blur-xl transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:outline-none"
      >
        <p
          className="text-[0.68rem] tracking-[0.18em] text-[var(--color-drh-ink)]/52 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Papion
        </p>
        <div className="mt-2 flex items-center gap-2">
          {papionApp ? (
            <img
              src={papionApp.iconSrc}
              alt=""
              className="h-8 w-8 rounded-[0.8rem] bg-white/88 p-1.5 shadow-[0_8px_16px_rgb(0_0_0/0.14)]"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="min-w-0">
            <p
              className="text-[1rem] leading-none font-semibold"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              3 due today
            </p>
            <p
              className="mt-1 text-[0.74rem] leading-[1.1] text-[var(--color-drh-ink)]/58"
              style={{ fontFamily: BODY_FONT }}
            >
              Open the mobile pass
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}

function NotificationShade({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-2 top-2 z-[60] rounded-[2rem] bg-black/38 px-3 pt-11 pb-4 text-white shadow-[0_22px_54px_rgb(0_0_0/0.28)] backdrop-blur-2xl transition duration-300",
        open
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      )}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-x-0 top-2 mx-auto h-1.5 w-16 rounded-full bg-white/50"
        aria-label="Close notifications"
      />
      <p
        className="text-[0.68rem] tracking-[0.2em] text-white/58 uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Notifications
      </p>
      {[
        ["Papion System", "3 due-date orders need attention before 4 PM."],
        ["Gmail", "A thoughtful project brief would look good here."],
        [
          "Portfolio OS",
          "Drag apps around. The layout remembers this session.",
        ],
      ].map(([title, body]) => (
        <div
          key={title}
          className="mt-2 rounded-[1.15rem] bg-white/16 px-3 py-2"
        >
          <p
            className="text-[0.78rem] font-semibold"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {title}
          </p>
          <p
            className="mt-0.5 text-[0.82rem] leading-[1.25] text-white/72"
            style={{ fontFamily: BODY_FONT }}
          >
            {body}
          </p>
        </div>
      ))}
    </div>
  )
}

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

function PapionMobileScreen({ app }: { app: ProjectApp }) {
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
          href={app.project.href}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-drh-ink)] px-5 py-3 text-center text-[0.74rem] font-semibold tracking-[0.18em] text-white uppercase transition hover:-translate-y-[1px]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {activeTab.ctaLabel ?? "Open full case study"}
        </a>
      </div>
    </div>
  )
}

function ProjectScreen({ app }: { app: ProjectApp }) {
  const { project } = app

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-950 text-white">
      <div className="relative h-[47%] overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={project.videoSrc}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgb(0_0_0/0.78)_100%)]" />
        <img
          src={project.logoSrc}
          alt=""
          className="absolute bottom-4 left-4 h-12 w-12 rounded-[1rem] bg-white/92 object-contain p-2 shadow-lg"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p
          className="text-[0.68rem] tracking-[0.22em] text-white/42 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Selected work
        </p>
        <h3
          className="mt-1 text-[2.15rem] leading-[0.88] font-semibold uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {project.title}
        </h3>
        <p
          className="mt-3 line-clamp-6 text-[0.96rem] leading-[1.48] text-white/64"
          style={{ fontFamily: BODY_FONT }}
        >
          {project.description}
        </p>
        <a
          href={project.href}
          className="mt-auto inline-flex w-max rounded-full bg-white px-4 py-2 text-[0.72rem] font-semibold tracking-[0.18em] text-black uppercase transition hover:-translate-y-[1px]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          View project
        </a>
      </div>
    </div>
  )
}

function GmailScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f8fafd] px-4 pt-4 pb-5 text-slate-950">
      <div className="rounded-[1.4rem] bg-white px-4 py-3 shadow-[0_12px_32px_rgb(15_23_42/0.08)]">
        <p
          className="text-[0.68rem] tracking-[0.2em] text-slate-400 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          To
        </p>
        <p className="mt-1 text-[0.96rem] font-semibold text-slate-800">
          {GMAIL_ADDRESS}
        </p>
      </div>
      <div className="mt-3 flex-1 rounded-[1.4rem] bg-white px-4 py-4 shadow-[0_12px_32px_rgb(15_23_42/0.08)]">
        <div>
          <p
            className="text-[0.68rem] tracking-[0.2em] text-slate-400 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Subject
          </p>
          <p
            className="mt-1 text-[1.4rem] leading-none font-semibold"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Let&apos;s build something calmer
          </p>
        </div>
        <p
          className="mt-5 text-[1rem] leading-[1.52] text-slate-500"
          style={{ fontFamily: BODY_FONT }}
        >
          Hi Ashraf, I have a project, workflow, or interface that could use a
          better shape...
        </p>
      </div>
      <a
        href={`mailto:${GMAIL_ADDRESS}`}
        className="mt-3 rounded-full bg-[#1a73e8] px-5 py-3 text-center text-[0.78rem] font-semibold tracking-[0.18em] text-white uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Compose email
      </a>
    </div>
  )
}

function InstagramScreen({ app }: { app: StandardApp }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white px-4 pt-4 pb-5 text-neutral-950">
      <div className="flex items-center gap-3">
        <img
          src={app.iconSrc}
          alt=""
          className="h-16 w-16 rounded-full object-contain"
        />
        <div className="grid flex-1 grid-cols-3 text-center">
          {["4 Posts", "Soon Followers", "Curated Following"].map((stat) => (
            <p
              key={stat}
              className="text-[0.72rem] leading-tight font-semibold"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {stat}
            </p>
          ))}
        </div>
      </div>
      <p
        className="mt-3 text-[1.55rem] leading-none font-semibold"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {app.title}
      </p>
      <p
        className="mt-2 text-[0.92rem] leading-[1.38] text-neutral-500"
        style={{ fontFamily: BODY_FONT }}
      >
        {app.body}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {["Process", "Details", "Systems", "Notes"].map((item) => (
          <div
            key={item}
            className="aspect-square rounded-[0.85rem] bg-[linear-gradient(135deg,#f4eee6,#d7dde5_48%,#161616)] p-2 text-[0.7rem] font-semibold text-white shadow-inner"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item}
          </div>
        ))}
      </div>
      <a
        href={app.href}
        target="_blank"
        rel="noreferrer"
        className="mt-auto rounded-full bg-neutral-950 px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] text-white uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Visit profile
      </a>
    </div>
  )
}

function makeAshAiMessage(
  role: AshAiChatMessage["role"],
  content: string,
  options: Pick<AshAiUiMessage, "failed" | "sticker"> = {}
): AshAiUiMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    ...options,
  }
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

function getInitialAshAiMessages() {
  try {
    const stored = window.sessionStorage.getItem(ASH_AI_CHAT_STORAGE_KEY)
    if (!stored) {
      return [makeAshAiMessage("assistant", "Ask me about Ashraf")]
    }
    const parsed = JSON.parse(stored) as AshAiUiMessage[]
    return parsed.length
      ? parsed
      : [makeAshAiMessage("assistant", "Ask me about Ashraf")]
  } catch {
    return [makeAshAiMessage("assistant", "Ask me about Ashraf")]
  }
}

function AshAiScreen() {
  const [messages, setMessages] = useState<AshAiUiMessage[]>(
    getInitialAshAiMessages
  )
  const [draft, setDraft] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const scrollFrameRef = useRef<number | null>(null)
  const shouldAnchorToBottomRef = useRef(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ block: "end" })
      scrollFrameRef.current = null
    })
  }

  useEffect(() => {
    window.sessionStorage.setItem(
      ASH_AI_CHAT_STORAGE_KEY,
      JSON.stringify(messages)
    )
  }, [messages])

  useEffect(() => {
    if (shouldAnchorToBottomRef.current) {
      scrollToBottom()
    }
  }, [messages, isThinking])

  const sendMessage = async () => {
    const content = draft.trim()
    if (!content || isThinking) return

    shouldAnchorToBottomRef.current = true
    const userMessage = makeAshAiMessage("user", content)
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setDraft("")
    setIsThinking(true)

    try {
      const answer = await askAshAi(
        nextMessages.map(({ role, content }) => ({ role, content }))
      )
      const sticker = shouldShowAshSticker(answer.sticker, nextMessages)
      setMessages((current) => [
        ...current,
        makeAshAiMessage("assistant", answer.message, {
          sticker,
        }),
      ])
    } catch {
      setMessages((current) => [
        ...current,
        makeAshAiMessage(
          "assistant",
          "I hit a connection snag. Your question is still here, so try sending it again in a moment.",
          { failed: true }
        ),
      ])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-[#101010]">
      <div
        ref={scrollAreaRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5"
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
          {messages.map((message) => {
            const isUser = message.role === "user"
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
                    className="max-w-[82%] rounded-[1.15rem] bg-[#f1f1f1] px-3.5 py-2.5 text-[1.02rem] leading-[1.38] text-neutral-950"
                    style={{ fontFamily: BODY_FONT }}
                  >
                    {message.content}
                  </div>
                ) : (
                  <div className="flex max-w-[92%] items-start gap-2.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white shadow-[0_1px_4px_rgb(0_0_0/0.06)]">
                      <img
                        src={CHATGPT_MARK_SRC}
                        alt=""
                        className="h-[1.125rem] w-[1.125rem] object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-[1.02rem] leading-[1.42]",
                          message.failed ? "text-rose-700" : "text-neutral-950"
                        )}
                        style={{ fontFamily: BODY_FONT }}
                      >
                        {message.content}
                      </div>
                      {message.sticker ? (
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

          {isThinking ? (
            <div className="flex justify-start">
              <div className="flex max-w-[92%] items-start gap-2.5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white shadow-[0_1px_4px_rgb(0_0_0/0.06)]">
                  <img
                    src={CHATGPT_MARK_SRC}
                    alt=""
                    className="h-[1.125rem] w-[1.125rem] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <TypingDots />
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        className="bg-white px-3 pt-2 pb-5"
        onSubmit={(event) => {
          event.preventDefault()
          void sendMessage()
        }}
      >
        <div className="flex items-center gap-2 rounded-[1.35rem] bg-[#f1f1f1] px-3 py-2 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.04)]">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about Ashraf"
            className="min-w-0 flex-1 bg-transparent text-[1rem] text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
            style={{ fontFamily: BODY_FONT }}
            disabled={isThinking}
            aria-label="Ask about Ashraf"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isThinking}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-950 transition hover:scale-105 disabled:scale-100 disabled:bg-neutral-300"
            aria-label="Send message"
          >
            <img
              src={CHATGPT_SEND_ICON_SRC}
              alt=""
              className="h-4 w-4 brightness-0 invert"
              aria-hidden
            />
          </button>
        </div>
      </form>
    </div>
  )
}

function ChatScreen({ app }: { app: StandardApp }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#e8f1e7] px-3 pt-4 pb-5">
      <div
        className="self-start rounded-[1rem] bg-white px-3 py-2 text-[0.95rem] text-slate-700 shadow-sm"
        style={{ fontFamily: BODY_FONT }}
      >
        Hey Ashraf, quick question.
      </div>
      <div
        className="mt-2 self-end rounded-[1rem] bg-[#d7f8c6] px-3 py-2 text-[0.95rem] text-slate-700 shadow-sm"
        style={{ fontFamily: BODY_FONT }}
      >
        Send the messy version. That&apos;s usually the useful one.
      </div>
      <div
        className="mt-auto rounded-full bg-white px-4 py-3 text-[0.78rem] tracking-[0.16em] text-slate-400 uppercase shadow-sm"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Message
      </div>
      {app.href ? (
        <a
          href={app.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 rounded-full bg-[#25d366] px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] text-white uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {app.cta}
        </a>
      ) : null}
    </div>
  )
}

function LinkedInScreen({ app }: { app: StandardApp }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f6f8] px-4 pt-4 pb-5 text-slate-950">
      <div className="h-20 rounded-t-[1.4rem] bg-[#0a66c2]" />
      <div className="-mt-8 rounded-b-[1.4rem] bg-white px-4 pt-0 pb-4 shadow-[0_12px_32px_rgb(15_23_42/0.08)]">
        <div
          className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-slate-950 text-[1.35rem] font-semibold text-white"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          AS
        </div>
        <h3
          className="mt-2 text-[1.8rem] leading-none font-semibold"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {app.title}
        </h3>
        <p
          className="mt-2 text-[0.95rem] leading-[1.42] text-slate-500"
          style={{ fontFamily: BODY_FONT }}
        >
          {app.body}
        </p>
      </div>
      <a
        href={app.href}
        target="_blank"
        rel="noreferrer"
        className="mt-auto rounded-full bg-[#0a66c2] px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] text-white uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Open profile
      </a>
    </div>
  )
}

function UtilityScreen({ app }: { app: StandardApp }) {
  const dark = app.id === "spotify" || app.id === "netflix"
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col px-4 pt-4 pb-5",
        dark ? "bg-neutral-950 text-white" : "bg-[#f4f4f2] text-neutral-950"
      )}
    >
      <img
        src={app.iconSrc}
        alt=""
        className="h-16 w-16 rounded-[1.15rem] object-contain drop-shadow-lg"
      />
      <h3
        className="mt-4 text-[2rem] leading-none font-semibold"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {app.title}
      </h3>
      <p
        className={cn(
          "mt-3 text-[1rem] leading-[1.5]",
          dark ? "text-white/62" : "text-neutral-500"
        )}
        style={{ fontFamily: BODY_FONT }}
      >
        {app.body}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {["Draft", "Preview", "Soon", "Playable"].map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-[1rem] px-3 py-2 text-[0.66rem] tracking-[0.16em] uppercase",
              dark ? "bg-white/10 text-white/58" : "bg-white text-neutral-400"
            )}
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item}
          </span>
        ))}
      </div>
      {app.href ? (
        <a
          href={app.href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "mt-auto rounded-full px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] uppercase",
            dark ? "bg-white text-black" : "bg-neutral-950 text-white"
          )}
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {app.cta}
        </a>
      ) : null}
    </div>
  )
}

function AppScreen({
  app,
  panelRef,
  onClose,
}: {
  app: PhoneApp
  panelRef: RefObject<HTMLDivElement | null>
  onClose: () => void
}) {
  const isChatGpt = app.id === "chatgpt"

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute inset-0 z-30 flex flex-col overflow-hidden pt-[4.45rem]",
        isChatGpt ? "bg-[#f7f7f5] text-neutral-950" : "bg-white"
      )}
    >
      <div className="absolute inset-x-0 top-9 z-20 flex h-11 items-center justify-between px-4">
        {isChatGpt ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-200/70 focus-visible:outline-none"
              aria-label="Close ChatGPT"
            >
              <span className="flex flex-col gap-[3px]" aria-hidden>
                <span className="h-[1.5px] w-3 rounded-full bg-current" />
                <span className="h-[1.5px] w-3 rounded-full bg-current" />
              </span>
            </button>
            <span
              className="absolute left-1/2 -translate-x-1/2 text-[0.82rem] font-semibold text-neutral-950"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              ChatGPT 4 &gt;
            </span>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-200/70 focus-visible:outline-none"
              aria-label="New chat"
            >
              <span className="relative h-3.5 w-3.5" aria-hidden>
                <span className="absolute inset-[1px] rounded-[2px] border border-current" />
                <span className="absolute -top-0.5 right-0 h-2 w-[1.5px] rotate-45 rounded-full bg-current" />
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              className="text-[0.76rem] font-semibold tracking-[0.14em] text-current/62 uppercase focus-visible:outline-none"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Back
            </button>
            <span
              className="max-w-[9rem] truncate text-[0.68rem] font-semibold tracking-[0.18em] text-current/38 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {app.label}
            </span>
          </>
        )}
      </div>

      {app.kind === "chatgpt" ? (
        <AshAiScreen />
      ) : app.kind === "project" && app.project.id === "papion" ? (
        <PapionMobileScreen app={app} />
      ) : app.kind === "project" ? (
        <ProjectScreen app={app} />
      ) : app.kind === "gmail" ? (
        <GmailScreen />
      ) : app.kind === "instagram" ? (
        <InstagramScreen app={app} />
      ) : app.kind === "linkedin" ? (
        <LinkedInScreen app={app} />
      ) : app.kind === "whatsapp" ? (
        <ChatScreen app={app} />
      ) : (
        <UtilityScreen app={app} />
      )}
    </div>
  )
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items]
  const [item] = next.splice(from, 1)
  if (!item) return items
  next.splice(to, 0, item)
  return next
}

export function FooterPhone() {
  const { time, day, dateLine } = usePhoneClock()
  const panelRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [activeAppId, setActiveAppId] = useState<string | null>("chatgpt")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const allApps = useMemo(() => [...STANDARD_APPS, ...makeProjectApps()], [])
  const initialHomeApps = useMemo(
    () =>
      allApps.filter(
        (app) => !DOCK_IDS.includes(app.id as (typeof DOCK_IDS)[number])
      ),
    [allApps]
  )
  const [homeApps, setHomeApps] = useState<PhoneApp[]>(initialHomeApps)
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null)
  const dockApps = DOCK_IDS.map((id) =>
    allApps.find((app) => app.id === id)
  ).filter(Boolean) as PhoneApp[]
  const papionApp =
    allApps.find(
      (app): app is ProjectApp =>
        app.kind === "project" && app.project.id === "papion"
    ) ?? null
  const activeApp = allApps.find((app) => app.id === activeAppId) ?? null

  useGSAP(
    () => {
      if (prefersReducedMotion || !panelRef.current || !activeAppId) return

      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 28, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "power2.out" }
      )
    },
    { dependencies: [activeAppId, prefersReducedMotion], scope: panelRef }
  )

  const reorderHomeApp = (targetId: string) => {
    if (!draggedAppId || draggedAppId === targetId) return
    setHomeApps((current) => {
      const from = current.findIndex((app) => app.id === draggedAppId)
      const to = current.findIndex((app) => app.id === targetId)
      return from >= 0 && to >= 0 ? moveItem(current, from, to) : current
    })
  }

  return (
    <div className="phone-reveal relative w-full max-w-[24rem]">
      <div
        className="absolute top-[6%] left-1/2 h-[88%] w-[76%] -translate-x-1/2 rounded-[3.3rem] bg-[radial-gradient(circle_at_50%_0%,rgba(10,10,10,0.13),transparent_58%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute top-[18%] -left-1 h-14 w-1 rounded-l-full bg-[var(--color-drh-ink)]/22"
        aria-hidden
      />
      <div
        className="absolute top-[25%] -right-1 h-24 w-1 rounded-r-full bg-[var(--color-drh-ink)]/24"
        aria-hidden
      />

      <div className="relative rounded-[3.25rem] bg-[linear-gradient(135deg,rgb(33_34_34),rgb(10_10_10)_46%,rgb(74_75_72))] p-[0.62rem] shadow-[0_36px_95px_rgb(12_12_12/0.18)]">
        <div className="relative aspect-[9/18.8] overflow-hidden rounded-[2.55rem] bg-black">
          <img
            src={`${PHONE_ASSET_ROOT}/phone-wallpaper.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.08),transparent_24%,rgb(0_0_0/0.2)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12),inset_0_18px_44px_rgb(255_255_255/0.12)]"
            aria-hidden
          />

          <StatusBar time={time} />
          <NotificationDragHandle onOpen={() => setNotificationsOpen(true)} />
          <div
            className="absolute top-3 left-1/2 z-50 h-7 w-[6.8rem] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_1px_2px_rgb(255_255_255/0.18),0_10px_24px_rgb(0_0_0/0.26)]"
            aria-hidden
          >
            <span className="absolute top-1/2 right-5 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-700/80" />
          </div>

          <NotificationShade
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />

          <div
            className={cn(
              "absolute inset-0 z-10 flex flex-col px-4 pt-14 pb-5 transition",
              activeApp ? "scale-[0.985] opacity-25" : "opacity-100"
            )}
          >
            <HomeWidgets
              day={day}
              dateLine={dateLine}
              papionApp={papionApp ?? undefined}
              onOpenPapion={() => {
                if (papionApp) setActiveAppId(papionApp.id)
              }}
            />

            <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-2">
              {homeApps.map((app) => (
                <AppIcon
                  key={app.id}
                  app={app}
                  draggable
                  onOpen={() => {
                    if (!draggedAppId) setActiveAppId(app.id)
                  }}
                  onDragStart={() => setDraggedAppId(app.id)}
                  onDragEnter={() => reorderHomeApp(app.id)}
                  onDragEnd={() => setDraggedAppId(null)}
                />
              ))}
            </div>

            <div className="mt-auto grid grid-cols-4 gap-2 rounded-[1.55rem] bg-white/18 px-2 shadow-[0_16px_36px_rgb(0_0_0/0.16)] backdrop-blur-xl">
              {dockApps.map((app) => (
                <DockIcon
                  key={app.id}
                  app={app}
                  onOpen={() => setActiveAppId(app.id)}
                />
              ))}
            </div>
          </div>

          {activeApp ? (
            <AppScreen
              app={activeApp}
              panelRef={panelRef}
              onClose={() => setActiveAppId(null)}
            />
          ) : null}

          <div
            className="absolute inset-x-0 bottom-2 z-50 flex justify-center"
            aria-hidden
          >
            <span className="h-1.5 w-24 rounded-full bg-white/72 shadow-[0_1px_8px_rgb(0_0_0/0.22)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterPhone
