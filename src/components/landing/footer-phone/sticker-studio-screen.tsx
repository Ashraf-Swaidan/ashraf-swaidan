import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
  type ClipboardEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useReducedMotion } from "motion/react"
import {
  ArrowUp,
  ChevronLeft,
  Download,
  Paperclip,
  Plus,
  RefreshCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { generateAshStickerImage } from "@/lib/pollinationsStickerImage"

import { BODY_FONT, DISPLAY_FONT, PHONE_ASSET_ROOT } from "./constants"
import { PollinationsBalanceLabel } from "./pollinations-balance-label"
import {
  clipboardItemsImageFile,
  fileToReferenceDataUrl,
} from "./reference-image"

gsap.registerPlugin(useGSAP)

const IOS_SANS =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
const IOS_BLUE = "#007aff"
const SESSION_KEY = "ash-sticker-studio-session-v2"
const SESSION_CAP = 6

const SCROLL_X_CLASS =
  "overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"

const TEXTAREA_CLASS =
  "max-h-[4.5rem] min-h-[2.35rem] flex-1 resize-none overflow-y-auto bg-transparent py-2 text-[0.94rem] leading-snug text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-60 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

const PLACEHOLDER_HINTS = [
  "a sleepy raccoon thumbs up",
  "tiny coffee cup, big smile",
  "me, but as a sticker",
] as const

type Phase = "idle" | "generating" | "ready"

type SessionSticker = {
  id: string
  prompt: string
  dataUrl: string
  createdAt: number
  /** Reference image data URL used when this sticker was generated */
  referenceUsedDataUrl?: string | null
}

function migrateSessionIfNeeded(): SessionSticker[] {
  if (typeof window === "undefined") return []
  try {
    const v2 = window.sessionStorage.getItem(SESSION_KEY)
    if (v2) {
      const parsed = JSON.parse(v2) as unknown
      if (Array.isArray(parsed)) return normalizeRows(parsed)
    }
    const v1 = window.sessionStorage.getItem("ash-sticker-studio-session-v1")
    if (v1) {
      const parsed = JSON.parse(v1) as unknown
      if (Array.isArray(parsed)) {
        const rows = normalizeRows(parsed)
        try {
          window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(rows))
          window.sessionStorage.removeItem("ash-sticker-studio-session-v1")
        } catch {
          /* ignore */
        }
        return rows
      }
    }
  } catch {
    /* ignore */
  }
  return []
}

function normalizeRows(parsed: unknown[]): SessionSticker[] {
  return parsed.filter(
    (row): row is SessionSticker =>
      typeof row === "object" &&
      row !== null &&
      typeof (row as SessionSticker).id === "string" &&
      typeof (row as SessionSticker).dataUrl === "string" &&
      typeof (row as SessionSticker).prompt === "string"
  )
}

function readSession(): SessionSticker[] {
  return migrateSessionIfNeeded()
}

function writeSession(rows: SessionSticker[]) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(rows))
  } catch {
    /* quota */
  }
}

const CHECKER_BG = {
  backgroundImage:
    "linear-gradient(45deg, #e8e8e8 25%, transparent 25%), linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8e8e8 75%), linear-gradient(-45deg, transparent 75%, #e8e8e8 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  backgroundColor: "#f6f6f6",
} as const

export function StickerStudioScreen({ onClose }: { onClose: () => void }) {
  const prefersReducedMotion = useReducedMotion()
  const [prompt, setPrompt] = useState("")
  const [referenceDataUrl, setReferenceDataUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const stageInnerRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<SessionSticker[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  useEffect(() => {
    const rows = readSession()
    setSession(rows)
    setActiveId(rows[0]?.id ?? null)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_HINTS.length)
    }, 4500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    const lineHeight =
      Number.parseFloat(getComputedStyle(ta).lineHeight) || 22
    const padY = 18
    const maxH = lineHeight * 3 + padY
    ta.style.height = `${Math.min(ta.scrollHeight, maxH)}px`
  }, [prompt])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!error) return
    const t = window.setTimeout(() => setError(null), 4000)
    return () => window.clearTimeout(t)
  }, [error])

  const active = useMemo(
    () => session.find((s) => s.id === activeId) ?? session[0] ?? null,
    [session, activeId]
  )

  const phase: Phase = useMemo(() => {
    if (busy) return "generating"
    if (active) return "ready"
    return "idle"
  }, [busy, active])

  const phaseKey = `${phase}-${active?.id ?? "none"}`

  useGSAP(
    () => {
      const el = stageInnerRef.current
      if (!el || prefersReducedMotion) return
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: 0.24, ease: "power2.out" }
      )
    },
    { dependencies: [phaseKey, prefersReducedMotion], scope: stageInnerRef }
  )

  const persist = useCallback((next: SessionSticker[]) => {
    writeSession(next)
    setSession(next)
  }, [])

  const applyReferenceFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return
    try {
      const dataUrl = await fileToReferenceDataUrl(file)
      setReferenceDataUrl(dataUrl)
      setError(null)
    } catch {
      setError("Couldn't read that image.")
    }
  }, [])

  const runGenerate = useCallback(
    async (
      text: string,
      refForRequest: string | null,
      refStoredOnRow: string | null
    ) => {
      setError(null)
      setBusy(true)
      const controller = new AbortController()
      try {
        const result = await generateAshStickerImage(text, {
          signal: controller.signal,
          referenceImageDataUrl: refForRequest,
        })
        if (!result.ok) {
          setError(result.message)
          return
        }
        const row: SessionSticker = {
          id: `st-${Date.now()}`,
          prompt: text.trim() || "Surprise sticker",
          dataUrl: result.dataUrl,
          createdAt: Date.now(),
          referenceUsedDataUrl: refStoredOnRow ?? null,
        }
        setSession((prev) => {
          const next = [row, ...prev].slice(0, SESSION_CAP)
          writeSession(next)
          return next
        })
        setActiveId(row.id)
        setPrompt("")
      } finally {
        setBusy(false)
      }
    },
    []
  )

  const handleSend = () => {
    if (busy) return
    const ref = referenceDataUrl?.trim() ?? null
    const text = prompt.trim()
    if (!text && !ref) return
    void runGenerate(text, ref, ref)
  }

  const handleRegenerate = () => {
    if (!active || busy) return
    const ref = active.referenceUsedDataUrl?.trim() ?? null
    void runGenerate(active.prompt, ref, ref)
  }

  const handleNew = () => {
    setPrompt("")
    setReferenceDataUrl(null)
    textareaRef.current?.focus()
  }

  const handleClearAll = () => {
    persist([])
    setActiveId(null)
    setPrompt("")
    setReferenceDataUrl(null)
    setError(null)
  }

  const handleDownload = () => {
    if (!active) return
    const a = document.createElement("a")
    a.href = active.dataUrl
    a.download = `ash-sticker-${active.id}.png`
    a.rel = "noopener"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleComposerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleComposerPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const file = clipboardItemsImageFile(e.clipboardData.items)
    if (file) {
      e.preventDefault()
      void applyReferenceFile(file)
    }
  }

  const canSend =
    !busy && (Boolean(prompt.trim()) || Boolean(referenceDataUrl?.trim()))

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden text-neutral-900"
      style={{ fontFamily: IOS_SANS }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#fff9f0_0%,#f3ecff_38%,#fff5e6_72%,#eef6ff_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(255,200,120,0.42),transparent_55%),radial-gradient(ellipse_70%_55%_at_108%_35%,rgba(167,139,250,0.2),transparent_50%),radial-gradient(ellipse_65%_50%_at_-5%_80%,rgba(253,224,200,0.55),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(30,30,30,0.04) 1px, transparent 0)",
          backgroundSize: "13px 13px",
        }}
        aria-hidden
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void applyReferenceFile(f)
          e.target.value = ""
        }}
      />

      <header className="relative z-20 flex shrink-0 items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 place-items-center rounded-full bg-white/55 text-neutral-800 shadow-sm backdrop-blur-md transition hover:bg-white/75 active:scale-[0.97]"
          aria-label="Back to home"
        >
          <ChevronLeft className="size-5" strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <h2
            className="truncate text-[1rem] font-semibold tracking-tight text-neutral-900"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Sticker Lab
          </h2>
          <p className="flex min-w-0 items-center gap-1.5 truncate text-[0.72rem] text-neutral-500">
            <span className="truncate">Prompt + optional photo</span>
            <span className="text-neutral-300" aria-hidden>
              ·
            </span>
            <PollinationsBalanceLabel
              variant="light"
              className="text-[0.68rem]"
            />
          </p>
        </div>
        {session.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="grid size-9 place-items-center rounded-full bg-white/55 text-neutral-700 shadow-sm backdrop-blur-md transition hover:bg-white/75 active:scale-[0.97]"
            aria-label="Clear all stickers"
          >
            <Trash2 className="size-[1.05rem]" strokeWidth={2.2} />
          </button>
        ) : (
          <span className="size-9" aria-hidden />
        )}
      </header>

      <div
        ref={stageInnerRef}
        className="relative z-0 min-h-0 flex-1 overflow-hidden"
        style={phase !== "idle" ? CHECKER_BG : undefined}
      >
        {phase === "generating" ? (
          <div className="relative flex size-full flex-col items-center justify-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  "linear-gradient(110deg, transparent 38%, rgb(255 255 255 / 0.72) 50%, transparent 62%)",
                backgroundSize: "200% 100%",
                animation: prefersReducedMotion
                  ? undefined
                  : "stickerShimmer 1.35s ease-in-out infinite",
              }}
            />
            <div className="relative z-[1] flex w-[min(72%,14rem)] flex-col gap-3">
              <div className="h-3 w-[55%] rounded-full bg-neutral-200/90 motion-safe:animate-pulse" />
              <div className="flex gap-2.5">
                <div className="aspect-square w-[38%] rounded-2xl bg-neutral-200/85 motion-safe:animate-pulse" />
                <div className="flex flex-1 flex-col justify-between gap-2 py-0.5">
                  <div className="h-2.5 w-full rounded-full bg-neutral-200/70 motion-safe:animate-pulse" />
                  <div className="h-2.5 w-[88%] rounded-full bg-neutral-200/65 motion-safe:animate-pulse motion-safe:[animation-delay:120ms]" />
                  <div className="h-2.5 w-[72%] rounded-full bg-neutral-200/60 motion-safe:animate-pulse motion-safe:[animation-delay:200ms]" />
                </div>
              </div>
            </div>
            <div className="relative z-[2] mt-6 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 shadow-[0_6px_20px_rgb(0_0_0/0.08)] ring-1 ring-white/90 backdrop-blur-sm">
              <Sparkles
                className="size-[1.05rem] text-[#007aff] motion-safe:animate-pulse"
                strokeWidth={2.2}
              />
              <p className="text-[0.82rem] font-semibold text-neutral-600">
                Brewing sticker…
              </p>
            </div>
          </div>
        ) : phase === "ready" && active ? (
          <>
            <img
              src={active.dataUrl}
              alt=""
              className="absolute inset-0 z-[1] size-full object-contain p-4 pb-16"
            />
            <div className="absolute top-3 right-3 z-[2] flex gap-1.5 rounded-full bg-white/92 p-1 shadow-[0_4px_16px_rgb(0_0_0/0.12)] backdrop-blur-sm">
              <button
                type="button"
                onClick={handleDownload}
                className="grid size-10 place-items-center rounded-full text-neutral-900 transition hover:bg-neutral-100 active:scale-[0.96]"
                aria-label="Save"
              >
                <Download className="size-[1.15rem]" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={busy}
                className="grid size-10 place-items-center rounded-full text-neutral-900 transition hover:bg-neutral-100 active:scale-[0.96] disabled:opacity-40"
                aria-label="Regenerate"
              >
                <RefreshCcw className="size-[1.05rem]" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={handleNew}
                className="grid size-10 place-items-center rounded-full text-neutral-900 transition hover:bg-neutral-100 active:scale-[0.96]"
                aria-label="New"
              >
                <Plus className="size-[1.15rem]" strokeWidth={2.2} />
              </button>
            </div>
          </>
        ) : (
          <div className="relative flex size-full flex-col items-center justify-center px-6 text-center">
            <div
              className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_210deg_at_50%_50%,transparent_0deg,rgba(255,200,120,0.12)_75deg,transparent_160deg,rgba(167,139,250,0.1)_260deg,transparent_360deg)]"
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-3">
              <div className="relative grid place-items-center">
                <div
                  className="absolute inset-[-18px] rounded-full bg-amber-200/35 blur-xl motion-safe:animate-pulse"
                  aria-hidden
                />
                <img
                  src={`${PHONE_ASSET_ROOT}/sticker-studio.svg`}
                  alt=""
                  className="relative h-[5rem] w-[5rem] drop-shadow-[0_8px_18px_rgb(0_0_0/0.1)]"
                />
              </div>
              <p
                className="max-w-[16rem] text-[0.95rem] font-semibold leading-snug text-neutral-700"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                Your next tiny masterpiece
              </p>
              <p className="max-w-[17rem] text-[0.8rem] leading-relaxed text-neutral-500">
                Type a vibe or add a photo — the canvas is the whole screen.
              </p>
            </div>
          </div>
        )}

        {error ? (
          <div
            className="absolute inset-x-3 bottom-3 z-[5] rounded-xl bg-red-600 px-3 py-2 text-center text-[0.78rem] font-medium text-white shadow-lg"
            role="alert"
          >
            {error}
          </div>
        ) : null}
      </div>

      <div className="relative z-20 shrink-0 overflow-hidden border-t border-white/50 bg-white/45 px-3 pt-2.5 pb-3 backdrop-blur-xl">
        {phase === "ready" && active ? (
          <p
            className="mb-2 flex items-start gap-1.5 px-0.5 text-[0.78rem] leading-snug text-neutral-600"
            style={{ fontFamily: BODY_FONT }}
          >
            {active.referenceUsedDataUrl ? (
              <Paperclip
                className="mt-0.5 size-3.5 shrink-0 text-neutral-400"
                strokeWidth={2.2}
                aria-hidden
              />
            ) : null}
            <span className="min-w-0 flex-1 line-clamp-2">{active.prompt}</span>
          </p>
        ) : null}

        {session.length > 1 ? (
          <div
            data-lenis-prevent
            className={cn("mb-2.5 flex gap-2", SCROLL_X_CLASS)}
          >
            {session.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setActiveId(row.id)}
                className={cn(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/60 bg-white/50 shadow-sm transition",
                  row.id === active?.id
                    ? "ring-2 ring-[#007aff] ring-offset-2 ring-offset-white/40"
                    : "opacity-90 hover:opacity-100"
                )}
                aria-label={`Sticker: ${row.prompt}`}
                aria-pressed={row.id === active?.id}
              >
                <img
                  src={row.dataUrl}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            "flex items-end gap-2 overflow-hidden rounded-2xl border border-white/70 bg-white/80 px-2 py-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.95),0_8px_28px_-10px_rgba(30,20,40,0.12)]",
            busy && "pointer-events-none opacity-60"
          )}
        >
          {referenceDataUrl ? (
            <div className="relative mb-0.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative overflow-hidden rounded-full ring-2 ring-amber-200/80 transition active:scale-[0.96]"
                aria-label="Replace reference photo"
              >
                <img
                  src={referenceDataUrl}
                  alt=""
                  className="size-8 object-cover"
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setReferenceDataUrl(null)
                }}
                className="absolute -top-1 -right-1 grid size-[1.15rem] place-items-center rounded-full bg-neutral-800 text-white shadow-md"
                aria-label="Remove reference"
              >
                <X className="size-2.5" strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-50 to-violet-50 text-neutral-800 ring-1 ring-white/90 transition hover:brightness-[1.03] active:scale-[0.96]"
              aria-label="Add photo"
            >
              <Paperclip className="size-[1.05rem]" strokeWidth={2.3} />
            </button>
          )}

          <label className="sr-only" htmlFor="sticker-composer-input">
            Prompt
          </label>
          <textarea
            ref={textareaRef}
            id="sticker-composer-input"
            rows={1}
            value={prompt}
            maxLength={400}
            placeholder={PLACEHOLDER_HINTS[placeholderIdx]}
            disabled={busy}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleComposerKeyDown}
            onPaste={handleComposerPaste}
            className={TEXTAREA_CLASS}
            style={{ fontFamily: IOS_SANS }}
          />

          <button
            type="button"
            disabled={!canSend}
            onClick={handleSend}
            className={cn(
              "mb-0.5 grid size-9 shrink-0 place-items-center rounded-full text-white shadow-md transition active:scale-[0.94]",
              !canSend && "bg-neutral-300"
            )}
            style={{ backgroundColor: canSend ? IOS_BLUE : undefined }}
            aria-label="Generate"
          >
            <ArrowUp className="size-[1.05rem]" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes stickerShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
