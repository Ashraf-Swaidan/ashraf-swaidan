import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
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
  Clapperboard,
  Clock,
  Download,
  Maximize2,
  Paperclip,
  Play,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react"

import {
  clearClipLabClips,
  deleteClipLabClip,
  listClipLabClips,
  resolveClipBlob,
  saveClipLabClip,
} from "@/lib/clipLabStorage"
import { cn } from "@/lib/utils"
import {
  CLIP_LAB_PLACEHOLDER_HINTS,
  type ClipLabDuration,
  type ClipLabModelId,
  generateClipLabVideo,
  getClipLabDurationsForModel,
  getClipLabModelShortLabel,
  getStoredClipLabModel,
  normalizeClipLabDuration,
  readStoredClipLabDuration,
  writeStoredClipLabDuration,
} from "@/lib/pollinationsClipLab"

import { ClipLabSettingsPanel } from "./clip-lab-settings-panel"
import { DISPLAY_FONT, PHONE_ASSET_ROOT } from "./constants"
import { PollinationsBalanceLabel } from "./pollinations-balance-label"
import {
  clipboardItemsImageFile,
  fileToReferenceDataUrl,
} from "./reference-image"

gsap.registerPlugin(useGSAP)

const IOS_SANS =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
const IOS_BLUE = "#5e8cff"

/** Horizontal strips — scrollbar fully suppressed (incl. overlay bleed). */
const SCROLL_X_CLASS =
  "overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"

const TEXTAREA_CLASS =
  "max-h-[4.5rem] min-h-[2.35rem] flex-1 resize-none overflow-y-auto bg-transparent px-1.5 py-2 text-[0.92rem] leading-snug text-white placeholder:text-white/38 focus:outline-none disabled:opacity-60 selection:bg-[#5e8cff] selection:text-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

const RENDER_STAGE_TAILS = [
  "Rolling film…",
  "Mixing the mood…",
  "Almost there…",
] as const

function clipLabRenderStages(model: ClipLabModelId): readonly string[] {
  return [`Warming up ${getClipLabModelShortLabel(model)}…`, ...RENDER_STAGE_TAILS]
}

type Phase = "idle" | "generating" | "ready"

type SessionClip = {
  id: string
  scene: string
  objectUrl: string
  createdAt: number
}

function formatClipAge(createdAt: number): string {
  const delta = Date.now() - createdAt
  const minutes = Math.floor(delta / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function downloadClip(clip: SessionClip) {
  const a = document.createElement("a")
  a.href = clip.objectUrl
  a.download = `clip-lab-${clip.id}.mp4`
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function Chip({
  selected,
  disabled,
  onClick,
  children,
  className,
}: {
  selected?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-[0.72rem] font-medium backdrop-blur-md transition active:scale-[0.97] disabled:opacity-45",
        selected
          ? "border-white/55 bg-white/22 text-white"
          : "border-white/18 bg-black/35 text-white/82 hover:bg-white/12",
        className
      )}
    >
      {children}
    </button>
  )
}

function ClipLabHistorySheet({
  open,
  clips,
  activeId,
  onSelect,
  onDownload,
  onDelete,
  onClearAll,
  onClose,
  sheetRef,
  prefersReducedMotion,
}: {
  open: boolean
  clips: SessionClip[]
  activeId: string | null
  onSelect: (id: string) => void
  onDownload: (clip: SessionClip) => void
  onDelete: (id: string) => void
  onClearAll: () => void
  onClose: () => void
  sheetRef: RefObject<HTMLDivElement | null>
  prefersReducedMotion: boolean | null
}) {
  useGSAP(
    () => {
      const el = sheetRef.current
      if (!el || !open) return
      if (prefersReducedMotion) {
        gsap.set(el, { y: 0, autoAlpha: 1 })
        return
      }
      gsap.fromTo(
        el,
        { y: "100%", autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.34, ease: "power3.out" }
      )
    },
    { dependencies: [open, prefersReducedMotion], scope: sheetRef }
  )

  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Close history"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Clip history"
        className="relative z-10 flex max-h-[min(72%,24rem)] min-h-[58%] flex-col rounded-t-[1.45rem] border border-white/12 border-b-0 bg-[#12101a]/96 shadow-[0_-24px_60px_rgb(0_0_0/0.45)] backdrop-blur-xl"
      >
        <div className="flex shrink-0 flex-col items-center px-4 pt-2.5 pb-1">
          <span
            className="mb-3 h-1 w-10 rounded-full bg-white/28"
            aria-hidden
          />
          <div className="flex w-full items-center justify-between gap-2">
            <h3
              className="text-[1.02rem] font-semibold tracking-tight text-white"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Clip history
            </h3>
            <div className="flex items-center gap-1.5">
              {clips.length > 0 ? (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="rounded-full bg-red-500/18 px-3 py-1.5 text-[0.74rem] font-semibold text-red-200 transition hover:bg-red-500/28 active:scale-[0.97]"
                >
                  Clear all
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/14 px-3.5 py-1.5 text-[0.78rem] font-semibold text-white transition hover:bg-white/22 active:scale-[0.97]"
              >
                Done
              </button>
            </div>
          </div>
          <p className="mt-1 w-full text-left text-[0.72rem] text-white/48">
            Saved on this device until you delete them.
          </p>
        </div>
        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {clips.length === 0 ? (
            <p className="py-8 text-center text-[0.82rem] text-white/45">
              No clips yet — generate one and it&apos;ll show up here.
            </p>
          ) : (
            <ul className="space-y-2">
              {clips.map((clip) => {
                const selected = clip.id === activeId
                return (
                  <li key={clip.id}>
                    <div
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl border p-2 transition",
                        selected
                          ? "border-white/35 bg-white/10"
                          : "border-white/10 bg-black/35"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(clip.id)
                          onClose()
                        }}
                        className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15"
                        aria-label={`Play clip: ${clip.scene}`}
                      >
                        <video
                          src={clip.objectUrl}
                          className="size-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <Play className="absolute inset-0 m-auto size-3.5 text-white/90 drop-shadow" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(clip.id)
                          onClose()
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-[0.8rem] font-medium text-white/88">
                          {clip.scene}
                        </p>
                        <p className="mt-0.5 truncate text-[0.68rem] text-white/45">
                          {formatClipAge(clip.createdAt)}
                        </p>
                      </button>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => onDownload(clip)}
                          className="grid size-8 place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/20 active:scale-[0.96]"
                          aria-label={`Download ${clip.scene}`}
                        >
                          <Download className="size-[0.95rem]" strokeWidth={2.2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(clip.id)}
                          className="grid size-8 place-items-center rounded-full bg-white/12 text-white/80 transition hover:bg-red-500/25 hover:text-red-100 active:scale-[0.96]"
                          aria-label={`Delete ${clip.scene}`}
                        >
                          <Trash2 className="size-[0.95rem]" strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export function ClipLabScreen({ onClose }: { onClose: () => void }) {
  const prefersReducedMotion = useReducedMotion()
  const [model, setModel] = useState<ClipLabModelId>(getStoredClipLabModel)
  const [prompt, setPrompt] = useState("")
  const [referenceDataUrl, setReferenceDataUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState<ClipLabDuration>(() =>
    readStoredClipLabDuration(getStoredClipLabModel())
  )
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<SessionClip[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [renderStageIdx, setRenderStageIdx] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const historySheetRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const busyRef = useRef(false)
  const generationRef = useRef(0)
  const sessionRef = useRef<SessionClip[]>([])

  const active = useMemo(
    () => session.find((clip) => clip.id === activeId) ?? session[0] ?? null,
    [session, activeId]
  )

  const durationOptions = useMemo(
    () => getClipLabDurationsForModel(model),
    [model]
  )

  const renderStages = useMemo(() => clipLabRenderStages(model), [model])

  const phase: Phase = useMemo(() => {
    if (busy) return "generating"
    if (active) return "ready"
    return "idle"
  }, [busy, active])

  const phaseKey = `${phase}-${active?.id ?? "none"}`

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const stored = await listClipLabClips()
        if (cancelled) return
        const rows: SessionClip[] = stored.map((row) => ({
          id: row.id,
          scene: row.scene,
          createdAt: row.createdAt,
          objectUrl: URL.createObjectURL(row.blob),
        }))
        setSession(rows)
        setActiveId(rows[0]?.id ?? null)
      } catch {
        if (!cancelled) setError("Couldn't load saved clips.")
      } finally {
        if (!cancelled) setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!historyOpen && !settingsOpen && hydrated) {
      textareaRef.current?.focus()
    }
  }, [historyOpen, settingsOpen, hydrated])

  useEffect(() => {
    writeStoredClipLabDuration(model, duration)
  }, [model, duration])

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % CLIP_LAB_PLACEHOLDER_HINTS.length)
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!busy) return
    const id = window.setInterval(() => {
      setRenderStageIdx((i) => (i + 1) % renderStages.length)
    }, 3200)
    return () => window.clearInterval(id)
  }, [busy, renderStages.length])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta || historyOpen) return
    ta.style.height = "auto"
    const lineHeight = Number.parseFloat(getComputedStyle(ta).lineHeight) || 22
    const padY = 18
    const maxH = lineHeight * 3 + padY
    ta.style.height = `${Math.min(ta.scrollHeight, maxH)}px`
  }, [prompt, historyOpen, settingsOpen, referenceDataUrl])

  useEffect(() => {
    if (!error) return
    const t = window.setTimeout(() => setError(null), 4500)
    return () => window.clearTimeout(t)
  }, [error])

  useEffect(() => {
    setViewerOpen(false)
  }, [active?.id])

  useEffect(() => {
    if (!viewerOpen) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setViewerOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [viewerOpen])

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      for (const clip of sessionRef.current) {
        if (clip.objectUrl.startsWith("blob:")) {
          URL.revokeObjectURL(clip.objectUrl)
        }
      }
    }
  }, [])

  useGSAP(
    () => {
      const el = stageRef.current
      if (!el || prefersReducedMotion) return
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      )
    },
    { dependencies: [phaseKey, prefersReducedMotion], scope: stageRef }
  )

  const revokeClip = useCallback((clip: SessionClip) => {
    if (clip.objectUrl.startsWith("blob:")) {
      URL.revokeObjectURL(clip.objectUrl)
    }
  }, [])

  const removeClipsFromSession = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return
      const idSet = new Set(ids)
      setSession((prev) => {
        for (const clip of prev) {
          if (idSet.has(clip.id)) revokeClip(clip)
        }
        const next = prev.filter((clip) => !idSet.has(clip.id))
        setActiveId((current) =>
          current && idSet.has(current) ? next[0]?.id ?? null : current
        )
        return next
      })
    },
    [revokeClip]
  )

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

  const handleModelChange = useCallback((nextModel: ClipLabModelId) => {
    setModel(nextModel)
    setDuration((current) => normalizeClipLabDuration(nextModel, current))
  }, [])

  const runGenerate = useCallback(
    async (
      scene: string,
      durationSeconds: ClipLabDuration,
      referenceImageDataUrl: string | null,
      videoModel: ClipLabModelId
    ) => {
      const generation = ++generationRef.current
      setError(null)
      busyRef.current = true
      setBusy(true)
      setRenderStageIdx(0)
      setHistoryOpen(false)
      setSettingsOpen(false)
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const result = await generateClipLabVideo({
          model: videoModel,
          scene,
          durationSeconds,
          referenceImageDataUrl,
          signal: controller.signal,
        })
        if (generation !== generationRef.current) return
        if (!result.ok) {
          if (
            result.message === "Cancelled." &&
            controller.signal.aborted &&
            abortRef.current !== controller
          ) {
            return
          }
          setError(
            result.message === "Cancelled."
              ? "Clip generation was interrupted. Try again."
              : result.message
          )
          return
        }

        const trimmedScene =
          scene.trim() ||
          (referenceImageDataUrl ? "From reference photo" : "Surprise scene")
        const id = `clip-${Date.now()}`
        const createdAt = Date.now()

        let objectUrl = result.objectUrl
        try {
          const blob = await resolveClipBlob(objectUrl, result.mimeType)
          if (result.objectUrl.startsWith("blob:")) {
            URL.revokeObjectURL(result.objectUrl)
          }
          objectUrl = URL.createObjectURL(blob)
          const evictedIds = await saveClipLabClip({
            id,
            scene: trimmedScene,
            styleLabel: "",
            createdAt,
            blob,
          })
          removeClipsFromSession(evictedIds)
        } catch {
          setError("Clip rendered but couldn't save to history.")
        }

        const row: SessionClip = {
          id,
          scene: trimmedScene,
          objectUrl,
          createdAt,
        }

        setSession((prev) => [row, ...prev.filter((clip) => clip.id !== id)])
        setActiveId(row.id)
        setPrompt("")
      } finally {
        if (generation === generationRef.current) {
          busyRef.current = false
          setBusy(false)
          if (abortRef.current === controller) {
            abortRef.current = null
          }
        }
      }
    },
    [removeClipsFromSession]
  )

  const handleSend = () => {
    if (busyRef.current) return
    const ref = referenceDataUrl?.trim() ?? null
    const text = prompt.trim()
    if (!text && !ref) return
    void runGenerate(text, duration, ref, model)
  }

  const handleClearAll = () => {
    generationRef.current += 1
    abortRef.current?.abort()
    busyRef.current = false
    setBusy(false)
    for (const clip of session) revokeClip(clip)
    void clearClipLabClips().catch(() => {
      setError("Couldn't clear saved clips.")
    })
    setSession([])
    setActiveId(null)
    setPrompt("")
    setError(null)
    setHistoryOpen(false)
  }

  const handleDeleteClip = useCallback(
    (id: string) => {
      const clip = sessionRef.current.find((row) => row.id === id)
      if (clip) revokeClip(clip)
      void deleteClipLabClip(id).catch(() => {
        setError("Couldn't delete that clip.")
      })
      setSession((prev) => {
        const next = prev.filter((row) => row.id !== id)
        setActiveId((current) => (current === id ? next[0]?.id ?? null : current))
        return next
      })
    },
    [revokeClip]
  )

  const handleDownload = () => {
    if (!active) return
    downloadClip(active)
  }

  const handleViewFull = () => {
    if (!active) return
    setViewerOpen(true)
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
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden text-white selection:bg-[#5e8cff]/70 selection:text-white"
      style={{ fontFamily: IOS_SANS }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[#0a0812]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_130%_90%_at_50%_-10%,rgba(120,80,200,0.35),transparent_58%),radial-gradient(ellipse_80%_60%_at_110%_70%,rgba(255,120,180,0.18),transparent_55%),radial-gradient(ellipse_70%_55%_at_-10%_80%,rgba(80,140,255,0.16),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
        aria-hidden
      />

      <div
        ref={stageRef}
        className="relative z-0 flex min-h-0 flex-1 flex-col"
      >
        {phase === "ready" && active ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <video
              ref={videoRef}
              key={active.id}
              src={active.objectUrl}
              className="max-h-full max-w-full object-contain"
              autoPlay
              loop
              playsInline
              muted
              controls={false}
            />
          </div>
        ) : phase === "generating" ? (
          <GeneratingStage
            stageLabel={renderStages[renderStageIdx]}
            modelLabel={getClipLabModelShortLabel(model)}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : (
          <IdleStage placeholder={CLIP_LAB_PLACEHOLDER_HINTS[placeholderIdx]} />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/88"
          aria-hidden
        />

        <header className="relative z-20 flex shrink-0 items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-black/35 text-white/90 backdrop-blur-md transition hover:bg-black/50 active:scale-[0.97]"
            aria-label="Back to home"
          >
            <ChevronLeft className="size-5" strokeWidth={2.2} />
          </button>
          <div className="min-w-0 flex-1">
            <h2
              className="truncate text-[1rem] font-semibold tracking-tight"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Clip Lab
            </h2>
            <p className="flex min-w-0 items-center gap-1.5 truncate text-[0.72rem] text-white/62">
              <span className="truncate">
                {getClipLabModelShortLabel(model)} · {duration}s
              </span>
              <span className="text-white/28" aria-hidden>
                ·
              </span>
              <PollinationsBalanceLabel
                variant="dark"
                className="text-[0.68rem]"
              />
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHistoryOpen(false)
              setSettingsOpen(true)
            }}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-black/35 text-white/85 backdrop-blur-md transition hover:bg-black/50 active:scale-[0.97]"
            aria-label="Open settings"
          >
            <Settings className="size-[1.05rem]" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => {
              setSettingsOpen(false)
              setHistoryOpen(true)
            }}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-black/35 text-white/85 backdrop-blur-md transition hover:bg-black/50 active:scale-[0.97]"
            aria-label="Open clip history"
          >
            <Clock className="size-[1.05rem]" strokeWidth={2.2} />
          </button>
        </header>

        <div className="relative z-20 mt-auto shrink-0 overflow-hidden pb-3">
          {phase === "ready" && active ? (
            <div className="mb-2 flex items-center justify-between gap-2 px-3">
              <p className="min-w-0 flex-1 truncate text-[0.76rem] text-white/72">
                {active.scene}
              </p>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={handleViewFull}
                  className="grid size-9 place-items-center rounded-full bg-white/14 text-white backdrop-blur-md transition hover:bg-white/22 active:scale-[0.96]"
                  aria-label="View clip full screen"
                >
                  <Maximize2 className="size-[1.05rem]" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="grid size-9 place-items-center rounded-full bg-white/14 text-white backdrop-blur-md transition hover:bg-white/22 active:scale-[0.96]"
                  aria-label="Download clip"
                >
                  <Download className="size-[1.05rem]" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                    onClick={() => {
                    setPrompt("")
                    setReferenceDataUrl(null)
                    textareaRef.current?.focus()
                  }}
                  className="grid size-9 place-items-center rounded-full bg-white/14 text-white backdrop-blur-md transition hover:bg-white/22 active:scale-[0.96]"
                  aria-label="New clip"
                >
                  <Plus className="size-[1.1rem]" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ) : null}

          {session.length > 1 ? (
            <div className={cn("mb-2 flex gap-2 px-3", SCROLL_X_CLASS)}>
              {session.map((clip) => {
                const selected = clip.id === active?.id
                return (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => setActiveId(clip.id)}
                    className={cn(
                      "relative h-14 w-10 shrink-0 overflow-hidden rounded-md ring-2 transition",
                      selected ? "ring-white" : "ring-white/25 hover:ring-white/50"
                    )}
                    aria-label={`Play clip: ${clip.scene}`}
                    aria-pressed={selected}
                  >
                    <video
                      src={clip.objectUrl}
                      className="absolute inset-0 size-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <Play className="absolute inset-0 m-auto size-3.5 text-white/85 drop-shadow" />
                  </button>
                )
              })}
            </div>
          ) : null}

          <div className="space-y-2 px-3">
            <div className="overflow-hidden">
              <p className="mb-1 px-0.5 text-[0.64rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
                Clip length
              </p>
              <div
                data-lenis-prevent
                className={cn("-mx-3 flex gap-1.5 px-3", SCROLL_X_CLASS)}
                role="list"
                aria-label="Clip length"
              >
                {durationOptions.map((seconds) => (
                  <Chip
                    key={seconds}
                    selected={duration === seconds}
                    disabled={busy}
                    onClick={() => setDuration(seconds)}
                    className="min-w-[3.25rem]"
                  >
                    {seconds}s
                  </Chip>
                ))}
              </div>
            </div>

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

            <div
              className={cn(
                "flex items-end gap-2 overflow-hidden rounded-2xl border border-white/14 bg-black/45 px-2.5 py-2 backdrop-blur-xl",
                busy && "pointer-events-none opacity-60"
              )}
            >
              {referenceDataUrl ? (
                <div className="relative mb-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative overflow-hidden rounded-lg ring-2 ring-violet-300/50 transition active:scale-[0.96]"
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
                    className="absolute -top-1 -right-1 grid size-[1.15rem] place-items-center rounded-full bg-neutral-900 text-white shadow-md"
                    aria-label="Remove reference"
                  >
                    <X className="size-2.5" strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-white/16 bg-white/10 text-white/85 transition hover:bg-white/16 active:scale-[0.96]"
                  aria-label="Add reference photo"
                >
                  <Paperclip className="size-[1.05rem]" strokeWidth={2.3} />
                </button>
              )}

              <label className="sr-only" htmlFor="clip-lab-composer">
                Describe your scene
              </label>
              <textarea
                ref={textareaRef}
                id="clip-lab-composer"
                rows={1}
                value={prompt}
                maxLength={280}
                disabled={busy}
                placeholder={
                  referenceDataUrl
                    ? `Motion (optional) — ${CLIP_LAB_PLACEHOLDER_HINTS[placeholderIdx]}`
                    : `Describe your clip — ${CLIP_LAB_PLACEHOLDER_HINTS[placeholderIdx]}`
                }
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleComposerKeyDown}
                onPaste={handleComposerPaste}
                className={TEXTAREA_CLASS}
              />
              <button
                type="button"
                disabled={!canSend}
                onClick={handleSend}
                className={cn(
                  "mb-0.5 grid size-9 shrink-0 place-items-center rounded-full text-white shadow-md transition active:scale-[0.94]",
                  !canSend && "bg-white/20"
                )}
                style={{ backgroundColor: canSend ? IOS_BLUE : undefined }}
                aria-label="Generate clip"
              >
                <ArrowUp className="size-[1.05rem]" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <ClipLabSettingsPanel
          open={settingsOpen}
          model={model}
          onClose={() => setSettingsOpen(false)}
          onModelChange={handleModelChange}
        />

        <ClipLabHistorySheet
          open={historyOpen}
          clips={session}
          activeId={activeId}
          onSelect={setActiveId}
          onDownload={downloadClip}
          onDelete={handleDeleteClip}
          onClearAll={handleClearAll}
          onClose={() => setHistoryOpen(false)}
          sheetRef={historySheetRef}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="pointer-events-none absolute inset-x-3 bottom-[5.5rem] z-30 rounded-xl bg-red-600/92 px-3.5 py-2 text-center text-[0.78rem] font-medium text-white shadow-lg backdrop-blur-sm"
        >
          {error}
        </div>
      ) : null}

      {viewerOpen && active ? (
        <ClipLabVideoViewer
          src={active.objectUrl}
          label={active.scene}
          onClose={() => setViewerOpen(false)}
        />
      ) : null}
    </div>
  )
}

function ClipLabVideoViewer({
  src,
  label,
  onClose,
}: {
  src: string
  label: string
  onClose: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`Full screen clip: ${label}`}
      onClick={onClose}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-2 px-3 py-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="min-w-0 flex-1 truncate text-[0.8rem] text-white/75">
          {label}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/16 text-white backdrop-blur-md transition hover:bg-white/24 active:scale-[0.97]"
          aria-label="Close"
        >
          <X className="size-5" strokeWidth={2.2} />
        </button>
      </div>
      <div
        data-lenis-prevent
        className="flex min-h-0 flex-1 items-center justify-center px-2"
      >
        <video
          src={src}
          className="max-h-full max-w-full object-contain"
          autoPlay
          loop
          playsInline
          muted
          controls={false}
        />
      </div>
      <div
        className="shrink-0 px-4 pb-4 pt-1"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-white/14 py-3 text-[0.88rem] font-semibold text-white backdrop-blur-md transition hover:bg-white/22 active:scale-[0.99]"
        >
          Done
        </button>
      </div>
    </div>
  )
}

function IdleStage({ placeholder }: { placeholder: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <div className="relative grid place-items-center">
        <div
          className="absolute inset-[-24px] rounded-full bg-violet-400/20 blur-2xl motion-safe:animate-pulse"
          aria-hidden
        />
        <img
          src={`${PHONE_ASSET_ROOT}/clip-lab.svg`}
          alt=""
          className="relative h-[4.25rem] w-[4.25rem] drop-shadow-[0_8px_24px_rgb(0_0_0/0.35)]"
        />
      </div>
      <p
        className="mt-5 max-w-[15rem] text-[1.02rem] font-semibold leading-snug text-white/92"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Describe your clip
      </p>
      <p className="mt-2 max-w-[17rem] text-[0.8rem] leading-relaxed text-white/55">
        Type a scene, attach a photo, or both. Pick clip length below.
      </p>
      <p className="mt-3 text-[0.74rem] italic text-white/40">e.g. {placeholder}</p>
    </div>
  )
}

function GeneratingStage({
  stageLabel,
  modelLabel,
  prefersReducedMotion,
}: {
  stageLabel: string
  modelLabel: string
  prefersReducedMotion: boolean | null
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#120a1e]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(110deg, transparent 36%, rgb(255 180 220 / 0.14) 50%, transparent 64%)",
          backgroundSize: "220% 100%",
          animation: prefersReducedMotion
            ? undefined
            : "clipLabShimmer 1.6s ease-in-out infinite",
        }}
      />
      <Clapperboard
        className="relative z-[1] size-10 text-white/75 motion-safe:animate-pulse"
        strokeWidth={1.8}
      />
      <p
        className="relative z-[1] mt-4 text-[0.88rem] font-semibold text-white/82"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {stageLabel}
      </p>
      <p className="relative z-[1] mt-1.5 max-w-[14rem] text-center text-[0.74rem] text-white/45">
        {modelLabel} can take up to a minute on cold start
      </p>
      <style>{`
        @keyframes clipLabShimmer {
          0% { background-position: 120% 0; }
          100% { background-position: -120% 0; }
        }
      `}</style>
    </div>
  )
}
