import { useEffect, useRef, useState } from "react"

import { Delete, Phone, Star } from "lucide-react"

import { PHONE_NUMBER_DISPLAY, PHONE_NUMBER_TEL } from "./constants"

const IOS_GREEN = "#34c759"
const IOS_LABEL_SECONDARY = "rgba(60,60,67,0.6)"

const KEYPAD: { digit: string; letters?: string }[] = [
  { digit: "1" },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
  { digit: "*" },
  { digit: "0", letters: "+" },
  { digit: "#" },
]

function KeypadButton({
  digit,
  letters,
  onPress,
}: {
  digit: string
  letters?: string
  onPress: (digit: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPress(digit)}
      className="grid aspect-square w-full place-items-center rounded-full bg-[#efeff4] text-black transition active:scale-[0.97] active:bg-[#e5e5ea]"
      aria-label={letters ? `${digit} ${letters}` : digit}
    >
      <span className="flex flex-col items-center">
        <span
          className="text-[1.85rem] leading-none font-light"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
          }}
        >
          {digit}
        </span>
        {letters ? (
          <span
            className="mt-0.5 text-[0.52rem] tracking-[0.1em] text-black/70"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
            }}
          >
            {letters}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export function PhoneScreen() {
  const [canPromptCall, setCanPromptCall] = useState(false)
  const [dialed, setDialed] = useState(PHONE_NUMBER_DISPLAY)
  const meowRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)")
    const update = () => setCanPromptCall(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const audio = new Audio("/assets/meow.mp3")
    audio.preload = "auto"
    meowRef.current = audio
    return () => {
      meowRef.current = null
    }
  }, [])

  const handleDigitPress = (digit: string) => {
    setDialed((prev) => `${prev}${digit}`)
    const audio = meowRef.current
    if (audio) {
      try {
        audio.currentTime = 0
        void audio.play()
      } catch {
        /* ignore autoplay/playback errors */
      }
    }
  }

  const handleDelete = () => {
    setDialed((prev) => prev.slice(0, -1))
  }

  const telValue = dialed
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "")
    .trim()
  const callHref = telValue ? `tel:${telValue}` : `tel:${PHONE_NUMBER_TEL}`

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-black">
      <div className="flex shrink-0 items-center justify-center border-b border-black/6 px-4 pt-3 pb-2">
        <h1
          className="text-[1.05rem] font-semibold"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
          }}
        >
          Phone
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pt-4 pb-2">
        <div className="shrink-0">
          <p
            className="text-center text-[2rem] leading-none font-light text-black"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            }}
          >
            {dialed}
          </p>
          <div className="mt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={handleDelete}
              className="grid size-8 place-items-center rounded-full text-[#8e8e93] opacity-65"
              aria-label="Delete"
            >
              <Delete className="size-4" strokeWidth={2.1} />
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {KEYPAD.map((key) => (
            <KeypadButton
              key={`${key.digit}-${key.letters ?? ""}`}
              digit={key.digit}
              letters={key.letters}
              onPress={handleDigitPress}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <span className="size-14" aria-hidden />

          {canPromptCall ? (
            <a
              href={callHref}
              className="grid size-14 place-items-center rounded-full text-white shadow-[0_10px_18px_rgb(52_199_89/0.36)] transition active:scale-[0.96]"
              style={{ backgroundColor: IOS_GREEN }}
              aria-label={`Call ${dialed || PHONE_NUMBER_DISPLAY}`}
            >
              <Phone className="size-7" strokeWidth={2.3} />
            </a>
          ) : (
            <button
              type="button"
              className="grid size-14 place-items-center rounded-full text-white shadow-[0_10px_18px_rgb(52_199_89/0.28)] transition active:scale-[0.96]"
              style={{ backgroundColor: IOS_GREEN }}
              aria-label={`Call ${dialed || PHONE_NUMBER_DISPLAY}`}
            >
              <Phone className="size-7" strokeWidth={2.3} />
            </button>
          )}

          <button
            type="button"
            className="grid size-14 place-items-center rounded-full text-[#8e8e93] transition active:bg-black/5"
            aria-label="Add to contacts"
          >
            <Star className="size-6" strokeWidth={2} />
          </button>
        </div>

        <p
          className="mt-2 text-center text-[0.75rem]"
          style={{
            color: IOS_LABEL_SECONDARY,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
          }}
        >
          {canPromptCall
            ? "Tap call to suggest calling Ashraf."
            : "Call button is available on mobile."}
        </p>
      </div>
    </div>
  )
}
