import { useSyncExternalStore } from "react"

import { PHONE_ASSET_ROOT } from "./constants"

export const PHONE_WALLPAPER_STORAGE_KEY = "phone-wallpaper-id"

export const PHONE_WALLPAPER_CHANGE_EVENT = "phone-wallpaper-change"

export type PhoneWallpaperId = "wallpaper-1" | "wallpaper-2" | "wallpaper-3"

export const PHONE_WALLPAPERS: {
  id: PhoneWallpaperId
  label: string
  src: string
}[] = [
  {
    id: "wallpaper-1",
    label: "Studio",
    src: `${PHONE_ASSET_ROOT}/phone-wallpaper.webp`,
  },
  {
    id: "wallpaper-2",
    label: "Gradient",
    src: `${PHONE_ASSET_ROOT}/phone-wallpaper-2.webp`,
  },
  {
    id: "wallpaper-3",
    label: "Deep",
    src: `${PHONE_ASSET_ROOT}/phone-wallpaper-3.webp`,
  },
]

function defaultId(): PhoneWallpaperId {
  return PHONE_WALLPAPERS.find((wallpaper) => wallpaper.id === "wallpaper-3")?.id
    ?? PHONE_WALLPAPERS[0]!.id
}

function readStoredId(): PhoneWallpaperId {
  if (typeof window === "undefined") return defaultId()
  try {
    const raw = localStorage.getItem(PHONE_WALLPAPER_STORAGE_KEY)
    if (raw && PHONE_WALLPAPERS.some((w) => w.id === raw)) {
      return raw as PhoneWallpaperId
    }
  } catch {
    /* ignore */
  }
  return defaultId()
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {}
  const onStorage = (e: StorageEvent) => {
    if (e.key === PHONE_WALLPAPER_STORAGE_KEY || e.key === null) cb()
  }
  const onCustom = () => cb()
  window.addEventListener("storage", onStorage)
  window.addEventListener(PHONE_WALLPAPER_CHANGE_EVENT, onCustom)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(PHONE_WALLPAPER_CHANGE_EVENT, onCustom)
  }
}

function getSnapshot(): PhoneWallpaperId {
  return readStoredId()
}

function getServerSnapshot(): PhoneWallpaperId {
  return defaultId()
}

export function setPhoneWallpaperId(id: PhoneWallpaperId) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PHONE_WALLPAPER_STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(PHONE_WALLPAPER_CHANGE_EVENT))
}

export function usePhoneWallpaper() {
  const id = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const entry =
    PHONE_WALLPAPERS.find((w) => w.id === id) ??
    PHONE_WALLPAPERS.find((w) => w.id === defaultId()) ??
    PHONE_WALLPAPERS[0]!

  return {
    id: entry.id,
    label: entry.label,
    src: entry.src,
    setId: setPhoneWallpaperId,
  }
}
