import { useEffect, useRef, useState } from "react"

import { Mic, MicOff, PhoneOff } from "lucide-react"

import {
  PollinationsRealtimeSession,
  type RealtimeCallPhase,
} from "@/lib/pollinationsRealtime"
import { cn } from "@/lib/utils"

import { CHAT_APP_UI_FONT, CHATGPT_MARK_SRC } from "./constants"

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function phaseLabel(
  phase: RealtimeCallPhase,
  userSpeaking: boolean
): string {
  switch (phase) {
    case "connecting":
      return "Connecting…"
    case "ready":
      return userSpeaking ? "Listening" : "Say something"
    case "listening":
      return "Listening"
    case "speaking":
      return "Ash AI is speaking"
    case "error":
      return "Call failed"
    case "ended":
      return "Call ended"
    default:
      return ""
  }
}

function VoiceOrb({
  phase,
  userSpeaking,
}: {
  phase: RealtimeCallPhase
  userSpeaking: boolean
}) {
  const active =
    phase === "speaking" ||
    phase === "listening" ||
    (phase === "ready" && userSpeaking)
  const connecting = phase === "connecting"

  return (
    <div className="relative grid place-items-center">
      <div
        className={cn(
          "absolute size-44 rounded-full bg-[radial-gradient(circle_at_30%_28%,#7ef0c8_0%,#10a37f_38%,#0b6b55_72%,#042f27_100%)] opacity-70 blur-2xl transition-all duration-700",
          active ? "scale-110 opacity-90" : "scale-95",
          connecting ? "animate-pulse" : ""
        )}
        aria-hidden
      />
      <div
        className={cn(
          "absolute size-36 rounded-full border border-white/12 bg-white/6 backdrop-blur-sm transition-transform duration-500",
          active ? "scale-105" : "scale-100",
          phase === "speaking" ? "animate-[orb-speak_1.8s_ease-in-out_infinite]" : "",
          phase === "listening" || userSpeaking
            ? "animate-[orb-listen_1.2s_ease-in-out_infinite]"
            : ""
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative grid size-28 place-items-center rounded-full border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] shadow-[0_18px_48px_rgb(0_0_0/0.45)]",
          connecting ? "animate-pulse" : ""
        )}
      >
        <img
          src={CHATGPT_MARK_SRC}
          alt=""
          className="size-12 object-contain brightness-0 invert"
          decoding="async"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center gap-1 pb-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "w-1 rounded-full bg-emerald-200/80 transition-all duration-300",
              active ? "animate-[voice-bar_0.9s_ease-in-out_infinite]" : "h-1 opacity-25"
            )}
            style={{
              animationDelay: `${index * 0.12}s`,
              height: active ? `${10 + index * 4}px` : "4px",
            }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}

export function AshAiCallOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const sessionRef = useRef<PollinationsRealtimeSession | null>(null)
  const [phase, setPhase] = useState<RealtimeCallPhase>("connecting")
  const [userSpeaking, setUserSpeaking] = useState(false)
  const [muted, setMuted] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [callStarted, setCallStarted] = useState(false)
  const startedAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return

    setPhase("connecting")
    setUserSpeaking(false)
    setMuted(false)
    setTranscript("")
    setError(null)
    setElapsed(0)
    setCallStarted(false)
    startedAtRef.current = null

    const session = new PollinationsRealtimeSession({
      onPhase: (next) => {
        setPhase(next)
        if (
          (next === "ready" || next === "listening" || next === "speaking") &&
          startedAtRef.current === null
        ) {
          startedAtRef.current = Date.now()
          setCallStarted(true)
        }
        if (next === "ended" || next === "error") {
          sessionRef.current = null
        }
      },
      onAssistantTranscript: setTranscript,
      onUserSpeaking: setUserSpeaking,
      onError: setError,
    })

    sessionRef.current = session
    void session.start().catch((err) => {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start the voice call."
      )
      setPhase("error")
      sessionRef.current = null
    })

    return () => {
      session.end()
      sessionRef.current = null
    }
  }, [open])

  useEffect(() => {
    sessionRef.current?.setMuted(muted)
  }, [muted])

  useEffect(() => {
    if (!open || !callStarted) return
    const id = window.setInterval(() => {
      if (startedAtRef.current) {
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000))
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [open, callStarted])

  const endCall = () => {
    sessionRef.current?.end()
    sessionRef.current = null
    onClose()
  }

  if (!open) return null

  const status = phaseLabel(phase, userSpeaking)

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-[#050b0a] text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Ash AI voice call"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(16,163,127,0.28),transparent_58%),radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(8,80,66,0.35),transparent_55%)]"
        aria-hidden
      />

      <div className="relative flex shrink-0 flex-col items-center px-5 pt-6">
        <p
          className="text-[0.72rem] font-semibold tracking-[0.22em] text-emerald-100/55 uppercase"
          style={{ fontFamily: CHAT_APP_UI_FONT }}
        >
          Voice
        </p>
        <h2
          className="mt-1 text-[1.35rem] font-semibold tracking-[-0.02em] text-white"
          style={{ fontFamily: CHAT_APP_UI_FONT }}
        >
          Ash AI
        </h2>
        <p
          className="mt-1 text-[0.82rem] text-emerald-100/70"
          style={{ fontFamily: CHAT_APP_UI_FONT }}
        >
          {callStarted ? formatDuration(elapsed) : "—:—"}
        </p>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <VoiceOrb phase={phase} userSpeaking={userSpeaking} />
        <p
          className={cn(
            "mt-8 text-center text-[0.95rem] font-medium",
            phase === "error" ? "text-rose-300" : "text-emerald-50/88"
          )}
          style={{ fontFamily: CHAT_APP_UI_FONT }}
        >
          {error ?? status}
        </p>
        {transcript && !error ? (
          <p
            className="mt-4 max-w-[18rem] text-center text-[0.86rem] leading-relaxed text-white/72"
            style={{ fontFamily: CHAT_APP_UI_FONT }}
          >
            {transcript}
          </p>
        ) : null}
      </div>

      <div className="relative shrink-0 px-8 pb-8 pt-2">
        <div className="flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            disabled={phase === "connecting" || phase === "error"}
            className={cn(
              "grid size-14 place-items-center rounded-full border transition enabled:active:scale-[0.96] disabled:opacity-40",
              muted
                ? "border-rose-300/35 bg-rose-500/18 text-rose-100"
                : "border-white/14 bg-white/8 text-white"
            )}
            aria-label={muted ? "Unmute microphone" : "Mute microphone"}
            aria-pressed={muted}
          >
            {muted ? (
              <MicOff className="size-5" strokeWidth={2.2} aria-hidden />
            ) : (
              <Mic className="size-5" strokeWidth={2.2} aria-hidden />
            )}
          </button>

          <button
            type="button"
            onClick={endCall}
            className="grid size-[4.25rem] place-items-center rounded-full bg-[#ff453a] text-white shadow-[0_14px_36px_rgb(255_69_58/0.42)] transition hover:bg-[#ff5f56] active:scale-[0.96]"
            aria-label="End call"
          >
            <PhoneOff className="size-6" strokeWidth={2.3} aria-hidden />
          </button>

          <span className="size-14" aria-hidden />
        </div>
        <p
          className="mt-4 text-center text-[0.68rem] leading-relaxed text-white/38"
          style={{ fontFamily: CHAT_APP_UI_FONT }}
        >
          Voice uses Pollinations credits while connected.
          <br />
          gpt-realtime-2 · portfolio-aware
        </p>
      </div>

      <style>{`
        @keyframes orb-speak {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes orb-listen {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes voice-bar {
          0%, 100% { transform: scaleY(0.45); opacity: 0.55; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
