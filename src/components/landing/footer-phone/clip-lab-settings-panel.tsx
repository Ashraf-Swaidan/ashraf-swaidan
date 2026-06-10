import { useEffect, useState } from "react"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Check, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  CLIP_LAB_MODEL_OPTIONS,
  type ClipLabModelId,
  setStoredClipLabModel,
} from "@/lib/pollinationsClipLab"

const IOS_SANS =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

export function ClipLabSettingsPanel({
  open,
  model,
  onClose,
  onModelChange,
}: {
  open: boolean
  model: ClipLabModelId
  onClose: () => void
  onModelChange: (model: ClipLabModelId) => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const [selected, setSelected] = useState<ClipLabModelId>(model)

  useEffect(() => {
    if (open) setSelected(model)
  }, [open, model])

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.85 }
  const fadeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const }

  const pick = (id: ClipLabModelId) => {
    setStoredClipLabModel(id)
    setSelected(id)
    onModelChange(id)
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="clip-lab-settings-backdrop"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
            aria-label="Close settings"
            onClick={onClose}
          />
          <motion.aside
            key="clip-lab-settings-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
            className="absolute inset-0 z-[61] flex min-h-0 flex-col bg-[#12101a] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
            aria-label="Clip Lab settings"
            style={{ fontFamily: IOS_SANS }}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 pb-2.5 pt-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <Settings
                  className="size-[1.05rem] shrink-0 text-white/55"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-[0.82rem] font-semibold text-white/92">
                  Settings
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full px-2.5 py-1 text-[0.78rem] font-semibold text-white/72 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                aria-label="Close settings"
              >
                Done
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-4">
              <p className="mb-2 text-[0.68rem] font-medium tracking-[0.12em] text-white/42 uppercase">
                Video model
              </p>
              <ul className="flex flex-col gap-1.5" role="listbox" aria-label="Video model">
                {CLIP_LAB_MODEL_OPTIONS.map((opt) => {
                  const isOn = opt.id === selected
                  return (
                    <li key={opt.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isOn}
                        onClick={() => pick(opt.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border px-3 py-3.5 text-left transition-colors",
                          isOn
                            ? "border-white/28 bg-white/12 ring-1 ring-white/16"
                            : "border-transparent bg-white/[0.05] hover:bg-white/10"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2",
                            isOn
                              ? "border-white bg-white"
                              : "border-white/30 bg-transparent"
                          )}
                          aria-hidden
                        >
                          {isOn ? (
                            <Check
                              className="size-3 text-[#12101a]"
                              strokeWidth={2.5}
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[1.02rem] font-semibold leading-snug tracking-[-0.02em] text-white/95">
                            {opt.label}
                          </span>
                          <span className="mt-0.5 block text-[0.72rem] leading-relaxed text-white/48">
                            {opt.description}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-4 text-[0.68rem] leading-relaxed text-white/40">
                Both models use Pollinations pollen. Nova Reel costs more per
                second but supports longer 720p clips.
              </p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
