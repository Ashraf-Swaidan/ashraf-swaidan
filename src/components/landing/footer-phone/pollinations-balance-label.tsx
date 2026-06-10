import { useEffect, useState } from "react"

import { fetchPollinationsAccountBalance } from "@/lib/pollinationsAshAi"
import { cn } from "@/lib/utils"

type BalanceState =
  | "loading"
  | { balance: number }
  | "unavailable"
  | "no_key"
  | "forbidden"

export function PollinationsBalanceLabel({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark"
  className?: string
}) {
  const [state, setState] = useState<BalanceState>("loading")

  useEffect(() => {
    const ac = new AbortController()
    void (async () => {
      const result = await fetchPollinationsAccountBalance(ac.signal)
      if (ac.signal.aborted) return
      if (result.ok) {
        setState({ balance: result.balance })
      } else if (result.reason === "no_key") {
        setState("no_key")
      } else if (result.reason === "forbidden") {
        setState("forbidden")
      } else {
        setState("unavailable")
      }
    })()
    return () => ac.abort()
  }, [])

  if (state === "no_key") return null

  const label = (() => {
    if (state === "loading") return "Credits…"
    if (state === "forbidden") return "Credits locked"
    if (state === "unavailable") return "Credits —"
    return `${state.balance.toLocaleString()} credits`
  })()

  return (
    <span
      className={cn(
        "shrink-0 tabular-nums",
        variant === "dark" ? "text-white/45" : "text-neutral-500",
        className
      )}
      aria-live="polite"
    >
      {label}
    </span>
  )
}
