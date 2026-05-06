import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import {
  CASE_ASSETS,
  MODULE_EXPLORER_ENTRIES,
} from "@/pages/papion-system/papion-data"

import type { PapionMobileTab, ProjectApp, StandardApp } from "./types"

export const DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const BODY_FONT = "'Cormorant Garamond', 'Fraunces Variable', serif"
export const PHONE_ASSET_ROOT = "/assets/phone-apps"
export const GMAIL_ADDRESS = "ashraf.swaidan.13@gmail.com"

export const DOCK_IDS = ["whatsapp", "linkedin", "instagram", "gmail"] as const

export const PHONE_NUMBER_DISPLAY = "+961 76 350 373"
export const PHONE_NUMBER_TEL = "+96176350373"

export const ASH_STICKER_ROOT = "/assets/ash-stickers"
/** @deprecated Migrated to ASH_AI_CHATS_STORAGE_KEY; kept for migration only */
export const ASH_AI_CHAT_STORAGE_KEY = "ash-ai-chat-messages"
/** Multi-chat archive (localStorage) */
export const ASH_AI_CHATS_STORAGE_KEY = "ash-ai-chats-v1"
export const ASH_AI_MAX_CHATS = 20
export const ASH_AI_CHATS_SCHEMA_VERSION = 1
export const ASH_AI_GREETING = "Hey — what do you need today?"
/** Shown as chips on fresh chats only — opinionated conversation starters */
export const ASH_AI_STARTER_PROMPTS = [
  "What’s the coolest feature Ash built?",
  "Which project best shows Ash’s product thinking?",
  "What should I look at first if I’m hiring?",
] as const
export const ASH_AI_NEW_CHAT_TITLE = "New chat"
export const CHATGPT_MARK_SRC = `${PHONE_ASSET_ROOT}/ChatGPT-Logo.svg`
/** Inter Variable — friendly UI for the in-phone Ash AI chat shell */
export const CHAT_APP_UI_FONT =
  "var(--font-sans), ui-sans-serif, system-ui, sans-serif"

/** Insets app UI below status bar + Dynamic Island (must match AppScreen). */
export const PHONE_APP_CONTENT_PT_CLASS = "pt-[4.45rem]"

export const STANDARD_APPS: StandardApp[] = [
  {
    id: "chatgpt",
    kind: "chatgpt",
    label: "Ash AI",
    iconSrc: `${PHONE_ASSET_ROOT}/chatgpt.png`,
    title: "Ash AI",
    body: "Chat casually or dig into projects and systems — whatever you need from this portfolio.",
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
    href: "https://example.com",
    cta: "Try the web",
  },
  {
    id: "spotify",
    kind: "media",
    label: "Spotify",
    iconSrc: `${PHONE_ASSET_ROOT}/spotify.svg`,
    title: "Ashraf's Spotify",
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
    kind: "youtube",
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

export function makeProjectApps(): ProjectApp[] {
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

export const PAPION_MOBILE_TABS: PapionMobileTab[] = [
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
    query:
      "Show unpaid orders due this week and tell me what needs follow-up first.",
    answer: [
      "7 unpaid orders are due before Friday.",
      "2 are bridal event orders with due dates inside 48 hours.",
      "Cost details stay hidden for this role, but payment urgency is clear.",
    ],
  },
]
