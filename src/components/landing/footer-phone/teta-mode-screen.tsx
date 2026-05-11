import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useReducedMotion } from "motion/react"
import { ArrowUp, Check, Copy, Plus, RefreshCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { translateToTeta } from "@/lib/pollinationsTetaMode"

import { BODY_FONT, DISPLAY_FONT, PHONE_ASSET_ROOT } from "./constants"

gsap.registerPlugin(useGSAP)

const IOS_SANS =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
const IOS_BLUE = "#007aff"

/** Native scroll inside phone; Lenis ignores this subtree (see index.css). */
const SCROLL_PANEL_CLASS =
  "min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

const PLACEHOLDER_HINTS = [
  "tell teta what you did today",
  "i got promoted at work",
  "i'm dating someone new",
  "i made dinner for my friends",
] as const

const EXAMPLE_CHIPS = [
  "I got a new job",
  "I cooked dinner",
  "I'm dating someone new",
] as const

type Phase = "idle" | "translating" | "ready"

type Exchange = {
  id: string
  user: string
  reply: string
}

export function TetaModeScreen() {
  const prefersReducedMotion = useReducedMotion()
  const [prompt, setPrompt] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [copied, setCopied] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const stageInnerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    textareaRef.current?.focus()
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
    const lineHeight = Number.parseFloat(getComputedStyle(ta).lineHeight) || 22
    const padY = 18
    const maxH = lineHeight * 3 + padY
    ta.style.height = `${Math.min(ta.scrollHeight, maxH)}px`
  }, [prompt])

  useEffect(() => {
    if (!error) return
    const t = window.setTimeout(() => setError(null), 4000)
    return () => window.clearTimeout(t)
  }, [error])

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1400)
    return () => window.clearTimeout(t)
  }, [copied])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const phase: Phase = useMemo(() => {
    if (busy) return "translating"
    if (exchange) return "ready"
    return "idle"
  }, [busy, exchange])

  const phaseKey = `${phase}-${exchange?.id ?? "none"}`

  useGSAP(
    () => {
      const el = stageInnerRef.current
      if (!el || prefersReducedMotion) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
      )
    },
    { dependencies: [phaseKey, prefersReducedMotion], scope: stageInnerRef }
  )

  const runTranslate = useCallback(async (input: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setError(null)
    setBusy(true)
    try {
      const result = await translateToTeta(input, { signal: controller.signal })
      if (controller.signal.aborted) return
      if (!result.ok) {
        setError(result.message)
        return
      }
      setExchange({
        id: `tm-${Date.now()}`,
        user: input.trim(),
        reply: result.reply,
      })
      setPrompt("")
    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }, [])

  const handleSend = () => {
    if (busy) return
    const text = prompt.trim()
    if (!text) return
    void runTranslate(text)
  }

  const handleAgain = () => {
    if (!exchange || busy) return
    void runTranslate(exchange.user)
  }

  const handleNew = () => {
    setExchange(null)
    setPrompt("")
    setError(null)
    setCopied(false)
    textareaRef.current?.focus()
  }

  const handleCopy = async () => {
    if (!exchange) return
    try {
      await navigator.clipboard.writeText(exchange.reply)
      setCopied(true)
    } catch {
      setError("Couldn't copy.")
    }
  }

  const handleComposerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChipTap = (text: string) => {
    setPrompt(text)
    textareaRef.current?.focus()
  }

  const canSend = !busy && Boolean(prompt.trim())

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden text-neutral-900"
      style={{ fontFamily: IOS_SANS }}
    >
      {/* Ambient layers (teta's living room) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,#fff2e8_0%,#fadccd_38%,#f3c4b3_72%,#e9b39e_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-15%,rgba(255,210,180,0.55),transparent_55%),radial-gradient(ellipse_70%_55%_at_110%_40%,rgba(220,150,130,0.25),transparent_55%),radial-gradient(ellipse_60%_45%_at_-5%_85%,rgba(255,225,205,0.6),transparent_55%)]"
        aria-hidden
      />
      {/* Subtle evil-eye motif pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10px 10px, #1e6fa8 1.6px, transparent 2.2px), radial-gradient(circle at 10px 10px, #ffffff 0.6px, transparent 1.2px)",
          backgroundSize: "32px 32px, 32px 32px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-52 w-52 rounded-full bg-rose-300/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-amber-300/25 blur-3xl"
        aria-hidden
      />

      {/* Header */}
      <div className="relative z-20 flex shrink-0 items-center gap-3 border-b border-white/45 bg-white/35 px-4 py-2.5 backdrop-blur-xl">
        <div className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_12px_rgba(160,80,60,0.18)] ring-1 ring-white/80">
          <img
            src={`${PHONE_ASSET_ROOT}/teta-mode.svg`}
            alt=""
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            className="truncate text-[1.02rem] leading-none font-semibold tracking-tight text-neutral-900"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Teta Mode
          </h2>
          <p
            className="mt-0.5 truncate text-[0.74rem] italic text-neutral-600"
            style={{ fontFamily: BODY_FONT }}
          >
            she's just worried about you
          </p>
        </div>
        {exchange ? (
          <button
            type="button"
            onClick={handleNew}
            className="grid size-9 place-items-center rounded-full text-neutral-700 transition hover:bg-white/55 active:scale-[0.97]"
            aria-label="New conversation"
          >
            <Plus className="size-[1.15rem]" strokeWidth={2.2} />
          </button>
        ) : (
          <span className="size-9" aria-hidden />
        )}
      </div>

      {/* Stage */}
      <div
        data-lenis-prevent
        className={cn(
          "relative z-10 flex flex-col px-4 pt-4 pb-3",
          SCROLL_PANEL_CLASS
        )}
      >
        <div
          ref={stageInnerRef}
          className="mx-auto flex w-full max-w-md flex-col gap-3"
        >
          {phase === "idle" ? (
            <IdleState onChip={handleChipTap} />
          ) : phase === "translating" ? (
            <TranslatingState input={prompt.trim() || exchange?.user || ""} />
          ) : exchange ? (
            <ReadyState
              exchange={exchange}
              copied={copied}
              onCopy={handleCopy}
              onAgain={handleAgain}
              busy={busy}
            />
          ) : null}
        </div>
      </div>

      {/* Composer */}
      <div className="relative z-20 shrink-0 px-4 pt-1 pb-3">
        <div
          className={cn(
            "mx-auto flex w-full max-w-md items-end gap-2 rounded-[1.35rem] border border-white/70 bg-white/80 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_28px_-8px_rgba(120,60,40,0.18)] backdrop-blur-md",
            busy && "pointer-events-none opacity-60"
          )}
        >
          <label className="sr-only" htmlFor="teta-composer-input">
            Tell teta
          </label>
          <textarea
            ref={textareaRef}
            id="teta-composer-input"
            rows={1}
            value={prompt}
            maxLength={400}
            placeholder={PLACEHOLDER_HINTS[placeholderIdx]}
            disabled={busy}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleComposerKeyDown}
            className="max-h-[4.5rem] min-h-[2.35rem] flex-1 resize-none bg-transparent px-1.5 py-2 text-[0.94rem] leading-snug text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
            style={{ fontFamily: IOS_SANS }}
          />
          <button
            type="button"
            disabled={!canSend}
            onClick={handleSend}
            className={cn(
              "mb-0.5 grid size-9 shrink-0 place-items-center rounded-full text-white shadow-md transition active:scale-[0.94]",
              canSend ? "" : "bg-neutral-300"
            )}
            style={{ backgroundColor: canSend ? IOS_BLUE : undefined }}
            aria-label="Send to Teta"
          >
            <ArrowUp className="size-[1.05rem]" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Toast */}
      {error ? (
        <div
          role="alert"
          className="pointer-events-none absolute inset-x-4 bottom-20 z-30 mx-auto max-w-md rounded-xl bg-neutral-900/92 px-3.5 py-2 text-center text-[0.8rem] font-medium text-white shadow-lg backdrop-blur-sm"
        >
          {error}
        </div>
      ) : null}
    </div>
  )
}

function IdleState({ onChip }: { onChip: (text: string) => void }) {
  return (
    <div className="relative flex flex-col items-center pt-4 pb-2 text-center">
      <div className="relative grid place-items-center">
        <div
          className="absolute inset-[-18px] rounded-full bg-rose-200/45 blur-2xl motion-safe:animate-pulse"
          aria-hidden
        />
        <img
          src={`${PHONE_ASSET_ROOT}/teta-mode.svg`}
          alt=""
          className="relative h-[4.5rem] w-[4.5rem] drop-shadow-[0_6px_14px_rgb(120_60_40/0.22)]"
        />
      </div>
      <p
        className="mt-4 max-w-[16rem] text-[1.02rem] leading-snug font-semibold text-neutral-800"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Tell teta what you did today.
      </p>
      <p
        className="mt-1.5 max-w-[18rem] text-[0.82rem] italic leading-relaxed text-neutral-600"
        style={{ fontFamily: BODY_FONT }}
      >
        She'll find something wrong with it. She always does.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {EXAMPLE_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChip(chip)}
            className="rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-[0.78rem] font-medium text-neutral-700 shadow-[0_4px_14px_-6px_rgba(120,60,40,0.18)] backdrop-blur-sm transition hover:bg-white/85 active:scale-[0.97]"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}

function TranslatingState({ input }: { input: string }) {
  return (
    <div className="flex flex-col gap-2.5 pt-1">
      {input ? <UserBubble text={input} /> : null}
      <div className="flex items-end gap-2">
        <div className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 ring-1 ring-white/80 shadow-sm">
          <img
            src={`${PHONE_ASSET_ROOT}/teta-mode.svg`}
            alt=""
            className="size-full object-cover"
          />
        </div>
        <div
          className="flex items-center gap-1.5 rounded-[1.1rem] rounded-bl-md bg-white/92 px-3.5 py-2.5 shadow-[0_6px_18px_-6px_rgba(120,60,40,0.22)] ring-1 ring-white/85 backdrop-blur-sm"
          aria-label="Teta is typing"
        >
          <Dot delay={0} />
          <Dot delay={140} />
          <Dot delay={280} />
        </div>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="block size-1.5 rounded-full bg-neutral-500/70 motion-safe:animate-bounce"
      style={{ animationDelay: `${delay}ms`, animationDuration: "1.05s" }}
    />
  )
}

function ReadyState({
  exchange,
  copied,
  onCopy,
  onAgain,
  busy,
}: {
  exchange: Exchange
  copied: boolean
  onCopy: () => void
  onAgain: () => void
  busy: boolean
}) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <UserBubble text={exchange.user} />
      <div className="flex items-end gap-2">
        <div className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 ring-1 ring-white/80 shadow-sm">
          <img
            src={`${PHONE_ASSET_ROOT}/teta-mode.svg`}
            alt=""
            className="size-full object-cover"
          />
        </div>
        <div
          className="max-w-[85%] rounded-[1.1rem] rounded-bl-md bg-gradient-to-br from-[#fff5ec] to-[#fde3d2] px-3.5 py-2.5 text-[0.95rem] leading-relaxed text-neutral-800 shadow-[0_8px_22px_-8px_rgba(120,60,40,0.28)] ring-1 ring-white/70"
          style={{ fontFamily: BODY_FONT }}
        >
          {exchange.reply}
        </div>
      </div>
      <div className="ml-9 flex items-center gap-1.5">
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[0.72rem] font-medium text-neutral-700 ring-1 ring-white/80 backdrop-blur-sm transition hover:bg-white/90 active:scale-[0.97]"
          aria-label="Copy Teta's reply"
        >
          {copied ? (
            <>
              <Check className="size-3" strokeWidth={2.5} />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" strokeWidth={2.2} />
              Copy
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onAgain}
          disabled={busy}
          className="flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[0.72rem] font-medium text-neutral-700 ring-1 ring-white/80 backdrop-blur-sm transition hover:bg-white/90 active:scale-[0.97] disabled:opacity-50"
          aria-label="Ask Teta again"
        >
          <RefreshCcw className="size-3" strokeWidth={2.2} />
          Again
        </button>
      </div>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[78%] rounded-[1.1rem] rounded-br-md px-3.5 py-2 text-[0.94rem] leading-snug text-white shadow-[0_6px_18px_-6px_rgba(0,90,200,0.45)]"
        style={{ backgroundColor: IOS_BLUE }}
      >
        {text}
      </div>
    </div>
  )
}
