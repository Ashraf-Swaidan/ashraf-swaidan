import { buildAshAiSupplementalContext } from "@/lib/ashAiKnowledge"
import { getPollinationsKey } from "@/lib/pollinationsAshAi"

const POLLINATIONS_REALTIME_BASE = "wss://gen.pollinations.ai/v1/realtime"
export const POLLINATIONS_REALTIME_MODEL = "gpt-realtime-2" as const
const SAMPLE_RATE = 24_000
/** Batch PCM deltas before scheduling — fewer gaps between tiny websocket chunks. */
const PLAYBACK_BATCH_SAMPLES = 4_800

const ASH_AI_VOICE_INSTRUCTIONS = `You are Ash AI — a warm, natural voice assistant inside Ashraf Swaidan's portfolio phone experience.

Speak like a real conversation: short sentences, friendly tone, no bullet lists unless the visitor asks. You are not Ashraf; never pretend to be him or use first person for his life or work.

Help visitors with what they actually want — small talk, questions about Ashraf's projects, hiring, or curiosity about the portfolio. Bring up specific work only when it helps them.

Keep answers concise for voice (usually one to three sentences). Ground facts about Ashraf and his work only in the portfolio knowledge provided below. If a detail is not there, say you do not see it in the portfolio materials. No JSON, no markdown — this is a live voice call.`

export function buildAshAiVoiceSessionInstructions(): string {
  const portfolioContext = buildAshAiSupplementalContext([
    {
      role: "user",
      content:
        "Voice call about Ashraf Swaidan's portfolio, projects, background, and work.",
    },
  ])

  return `${ASH_AI_VOICE_INSTRUCTIONS}

${portfolioContext}`
}

export type RealtimeCallPhase =
  | "connecting"
  | "ready"
  | "listening"
  | "speaking"
  | "error"
  | "ended"

export type RealtimeCallCallbacks = {
  onPhase: (phase: RealtimeCallPhase) => void
  onAssistantTranscript: (text: string) => void
  onUserSpeaking: (speaking: boolean) => void
  onError: (message: string) => void
}

function floatTo16BitPcm(float32: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32.length * 2)
  const view = new DataView(buffer)
  for (let i = 0; i < float32.length; i++) {
    const sample = Math.max(-1, Math.min(1, float32[i]!))
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
  }
  return buffer
}

function base64Encode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunkSize))
    )
  }
  return btoa(binary)
}

function pcm16Base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const view = new DataView(bytes.buffer)
  const samples = bytes.byteLength / 2
  const float32 = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    float32[i] = view.getInt16(i * 2, true) / 0x8000
  }
  return float32
}

function buildRealtimeUrl(apiKey: string): string {
  const params = new URLSearchParams({
    model: POLLINATIONS_REALTIME_MODEL,
    key: apiKey,
  })
  return `${POLLINATIONS_REALTIME_BASE}?${params.toString()}`
}

export class PollinationsRealtimeSession {
  private ws: WebSocket | null = null
  private audioContext: AudioContext | null = null
  private micStream: MediaStream | null = null
  private processor: ScriptProcessorNode | null = null
  private micSource: MediaStreamAudioSourceNode | null = null
  private silentGain: GainNode | null = null
  private playbackDestination: MediaStreamAudioDestinationNode | null = null
  private monitorAudio: HTMLAudioElement | null = null
  private nextPlaybackTime = 0
  private pendingPlaybackSamples: number[] = []
  private micTransmitEnabled = true
  private micResumeTimer: ReturnType<typeof setTimeout> | null = null
  private muted = false
  private closed = false
  private assistantTranscript = ""
  private activeResponseId: string | null = null
  private activeSources = new Set<AudioBufferSourceNode>()

  private callbacks: RealtimeCallCallbacks

  constructor(callbacks: RealtimeCallCallbacks) {
    this.callbacks = callbacks
  }

  async start(): Promise<void> {
    const apiKey = getPollinationsKey().trim()
    if (!apiKey || !apiKey.startsWith("pk_")) {
      throw new Error(
        "Add a publishable Pollinations key (VITE_POLLINATIONS_API_KEY) to start a voice call."
      )
    }

    this.callbacks.onPhase("connecting")

    this.monitorAudio = document.createElement("audio")
    this.monitorAudio.autoplay = true
    this.monitorAudio.setAttribute("playsinline", "true")

    this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE })
    this.playbackDestination = this.audioContext.createMediaStreamDestination()
    this.monitorAudio.srcObject = this.playbackDestination.stream
    await this.monitorAudio.play().catch(() => undefined)
    await this.audioContext.resume()

    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    })

    this.ws = new WebSocket(buildRealtimeUrl(apiKey))

    this.ws.addEventListener("open", () => {
      this.send({
        type: "session.update",
        session: {
          type: "realtime",
          model: POLLINATIONS_REALTIME_MODEL,
          instructions: buildAshAiVoiceSessionInstructions(),
          output_modalities: ["audio"],
          audio: {
            input: {
              format: { type: "audio/pcm", rate: SAMPLE_RATE },
              turn_detection: {
                type: "semantic_vad",
                interrupt_response: false,
              },
            },
            output: {
              format: { type: "audio/pcm", rate: SAMPLE_RATE },
              voice: "marin",
            },
          },
        },
      })
    })

    this.ws.addEventListener("message", (event) => {
      this.handleServerEvent(event.data)
    })

    this.ws.addEventListener("close", () => {
      if (!this.closed) {
        this.callbacks.onPhase("ended")
      }
    })

    this.ws.addEventListener("error", () => {
      this.fail("Voice connection dropped. Try again in a moment.")
    })

    await new Promise<void>((resolve, reject) => {
      const ws = this.ws
      if (!ws) {
        reject(new Error("WebSocket failed to initialize."))
        return
      }
      const onOpen = () => {
        ws.removeEventListener("open", onOpen)
        ws.removeEventListener("error", onError)
        resolve()
      }
      const onError = () => {
        ws.removeEventListener("open", onOpen)
        ws.removeEventListener("error", onError)
        reject(new Error("Could not connect to Pollinations Realtime."))
      }
      if (ws.readyState === WebSocket.OPEN) {
        resolve()
        return
      }
      ws.addEventListener("open", onOpen)
      ws.addEventListener("error", onError)
    })

    this.startMicCapture()
  }

  setMuted(muted: boolean) {
    this.muted = muted
  }

  end() {
    this.closed = true
    this.callbacks.onPhase("ended")
    this.teardown()
  }

  private fail(message: string) {
    if (this.closed) return
    this.closed = true
    this.callbacks.onError(message)
    this.callbacks.onPhase("error")
    this.teardown()
  }

  private teardown() {
    if (this.micResumeTimer !== null) {
      clearTimeout(this.micResumeTimer)
      this.micResumeTimer = null
    }

    this.activeSources.forEach((source) => {
      try {
        source.stop()
      } catch {
        /* already stopped */
      }
    })
    this.activeSources.clear()

    this.processor?.disconnect()
    this.micSource?.disconnect()
    this.silentGain?.disconnect()
    this.processor = null
    this.micSource = null
    this.silentGain = null

    this.micStream?.getTracks().forEach((track) => track.stop())
    this.micStream = null

    if (this.ws && this.ws.readyState <= WebSocket.OPEN) {
      this.ws.close()
    }
    this.ws = null

    this.monitorAudio?.pause()
    if (this.monitorAudio) {
      this.monitorAudio.srcObject = null
      this.monitorAudio = null
    }

    void this.audioContext?.close()
    this.audioContext = null
    this.playbackDestination = null
  }

  private send(payload: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload))
    }
  }

  private startMicCapture() {
    const ctx = this.audioContext
    const stream = this.micStream
    if (!ctx || !stream) return

    this.micSource = ctx.createMediaStreamSource(stream)
    this.processor = ctx.createScriptProcessor(4096, 1, 1)
    this.silentGain = ctx.createGain()
    this.silentGain.gain.value = 0

    this.processor.onaudioprocess = (event) => {
      if (
        this.muted ||
        !this.micTransmitEnabled ||
        this.closed ||
        this.ws?.readyState !== WebSocket.OPEN
      ) {
        return
      }
      const channel = event.inputBuffer.getChannelData(0)
      const pcm = floatTo16BitPcm(channel)
      this.send({
        type: "input_audio_buffer.append",
        audio: base64Encode(pcm),
      })
    }

    this.micSource.connect(this.processor)
    this.processor.connect(this.silentGain)
    this.silentGain.connect(ctx.destination)
  }

  private handleServerEvent(raw: string) {
    let event: {
      type?: string
      delta?: string
      response?: { id?: string }
      error?: { message?: string }
    }
    try {
      event = JSON.parse(raw) as typeof event
    } catch {
      return
    }

    switch (event.type) {
      case "session.created":
      case "session.updated":
        this.callbacks.onPhase("ready")
        break
      case "input_audio_buffer.speech_started":
        if (!this.micTransmitEnabled) break
        this.callbacks.onUserSpeaking(true)
        this.callbacks.onPhase("listening")
        break
      case "input_audio_buffer.speech_stopped":
        this.callbacks.onUserSpeaking(false)
        break
      case "response.created": {
        const responseId = event.response?.id ?? null
        if (responseId && responseId === this.activeResponseId) break
        this.activeResponseId = responseId
        this.pauseMicForAssistant()
        this.assistantTranscript = ""
        this.callbacks.onAssistantTranscript("")
        this.callbacks.onPhase("speaking")
        break
      }
      case "response.output_audio.delta":
      case "response.audio.delta":
        if (event.delta) {
          this.enqueuePlayback(event.delta)
        }
        break
      case "response.output_audio.done":
      case "response.audio.done":
        this.flushPendingPlayback()
        break
      case "response.output_audio_transcript.delta":
      case "response.audio_transcript.delta":
        if (event.delta) {
          this.assistantTranscript += event.delta
          this.callbacks.onAssistantTranscript(this.assistantTranscript)
        }
        break
      case "response.cancelled":
        this.activeResponseId = null
        this.flushPlayback()
        this.resumeMicAfterPlayback()
        this.callbacks.onPhase("ready")
        break
      case "response.done":
        this.activeResponseId = null
        this.flushPendingPlayback()
        this.resumeMicAfterPlayback()
        this.callbacks.onPhase("ready")
        break
      case "error":
        this.fail(event.error?.message ?? "Realtime session error.")
        break
      default:
        break
    }
  }

  private pauseMicForAssistant() {
    this.micTransmitEnabled = false
    if (this.micResumeTimer !== null) {
      clearTimeout(this.micResumeTimer)
      this.micResumeTimer = null
    }
  }

  private resumeMicAfterPlayback() {
    if (this.micResumeTimer !== null) {
      clearTimeout(this.micResumeTimer)
    }
    const ctx = this.audioContext
    if (!ctx) {
      this.micTransmitEnabled = true
      return
    }
    const delayMs = Math.max(
      180,
      (this.nextPlaybackTime - ctx.currentTime) * 1000 + 120
    )
    this.micResumeTimer = setTimeout(() => {
      this.send({ type: "input_audio_buffer.clear" })
      this.micTransmitEnabled = true
      this.micResumeTimer = null
    }, delayMs)
  }

  private flushPlayback() {
    this.pendingPlaybackSamples = []
    this.activeSources.forEach((source) => {
      try {
        source.stop()
      } catch {
        /* already stopped */
      }
    })
    this.activeSources.clear()
    if (this.audioContext) {
      this.nextPlaybackTime = this.audioContext.currentTime
    }
  }

  private flushPendingPlayback() {
    if (this.pendingPlaybackSamples.length > 0) {
      this.schedulePlaybackChunk(
        new Float32Array(this.pendingPlaybackSamples)
      )
      this.pendingPlaybackSamples = []
    }
  }

  private enqueuePlayback(base64Pcm: string) {
    const float32 = pcm16Base64ToFloat32(base64Pcm)
    for (let i = 0; i < float32.length; i++) {
      this.pendingPlaybackSamples.push(float32[i]!)
    }
    while (this.pendingPlaybackSamples.length >= PLAYBACK_BATCH_SAMPLES) {
      const batch = this.pendingPlaybackSamples.splice(0, PLAYBACK_BATCH_SAMPLES)
      this.schedulePlaybackChunk(new Float32Array(batch))
    }
  }

  private schedulePlaybackChunk(float32: Float32Array) {
    const ctx = this.audioContext
    const destination = this.playbackDestination
    if (!ctx || !destination || float32.length === 0) return

    const buffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE)
    buffer.getChannelData(0).set(float32)

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(destination)

    const now = ctx.currentTime
    if (this.nextPlaybackTime < now) {
      this.nextPlaybackTime = now + 0.02
    }
    source.start(this.nextPlaybackTime)
    this.nextPlaybackTime += buffer.duration

    this.activeSources.add(source)
    source.onended = () => {
      this.activeSources.delete(source)
    }
  }
}
