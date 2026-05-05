import { useEffect, useState } from "react"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Check, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ASH_AI_CHAT_MODEL_OPTIONS,
  type AshAiChatModelId,
  getStoredAshAiModelId,
  setStoredAshAiModelId,
} from "@/lib/ashAiModels"

import { CHAT_APP_UI_FONT, PHONE_APP_CONTENT_PT_CLASS } from "./constants"

export function AshAiSettingsPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const [selected, setSelected] = useState<AshAiChatModelId>(getStoredAshAiModelId)

  useEffect(() => {
    if (open) setSelected(getStoredAshAiModelId())
  }, [open])

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.85 }
  const fadeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const }

  const pick = (id: AshAiChatModelId) => {
    setStoredAshAiModelId(id)
    setSelected(id)
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="ash-settings-backdrop"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            className="absolute inset-0 z-[60] bg-black/35 backdrop-blur-[1px]"
            aria-label="Close settings"
            onClick={onClose}
          />
          <motion.aside
            key="ash-settings-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
            className="absolute inset-0 z-[61] flex min-h-0 flex-col bg-white shadow-[inset_0_1px_0_rgb(0_0_0/0.04)]"
            aria-label="Settings"
          >
            <div
              className={cn(
                "flex shrink-0 items-center justify-between gap-2 border-b border-neutral-100/90 px-3 pb-2.5",
                PHONE_APP_CONTENT_PT_CLASS
              )}
              style={{ fontFamily: CHAT_APP_UI_FONT }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Settings
                  className="size-[1.05rem] shrink-0 text-neutral-500"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-[0.82rem] font-semibold text-neutral-900">
                  Settings
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full px-2.5 py-1 text-[0.78rem] font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                aria-label="Close settings"
              >
                Done
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-4">
              <p
                className="mb-2 text-[0.68rem] font-medium tracking-[0.12em] text-neutral-400 uppercase"
                style={{ fontFamily: CHAT_APP_UI_FONT }}
              >
                Model
              </p>
              <ul className="flex flex-col gap-1.5" role="listbox" aria-label="AI model">
                {ASH_AI_CHAT_MODEL_OPTIONS.map((opt) => {
                  const isOn = opt.id === selected
                  return (
                    <li key={opt.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isOn}
                        onClick={() => pick(opt.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-3.5 text-left transition-colors",
                          isOn
                            ? "border-neutral-900/15 bg-neutral-100 ring-1 ring-neutral-200/80"
                            : "border-transparent bg-neutral-50/80 hover:bg-neutral-100/90"
                        )}
                        style={{ fontFamily: CHAT_APP_UI_FONT }}
                      >
                        <span
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-full border-2",
                            isOn
                              ? "border-neutral-950 bg-neutral-950"
                              : "border-neutral-300 bg-white"
                          )}
                          aria-hidden
                        >
                          {isOn ? (
                            <Check
                              className="size-3 text-white"
                              strokeWidth={2.5}
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1 text-[1.02rem] font-semibold leading-snug tracking-[-0.02em] text-neutral-900">
                          {opt.label}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <p
                className="mt-4 text-[0.68rem] leading-relaxed text-neutral-500"
                style={{ fontFamily: CHAT_APP_UI_FONT }}
              >
                Uses free hourly limited API.
              </p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
