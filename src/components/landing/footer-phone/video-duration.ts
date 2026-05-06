import { useEffect, useState } from "react"

export function formatVideoDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const s = Math.floor(seconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, "0")}`
}

export function useVideoDurationLabel(src: string): string | null {
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    const v = document.createElement("video")
    v.preload = "metadata"
    v.src = src
    const onMeta = () => {
      setLabel(formatVideoDuration(v.duration))
    }
    v.addEventListener("loadedmetadata", onMeta)
    const onErr = () => setLabel(null)
    v.addEventListener("error", onErr)
    return () => {
      v.removeEventListener("loadedmetadata", onMeta)
      v.removeEventListener("error", onErr)
      v.src = ""
    }
  }, [src])
  return label
}
