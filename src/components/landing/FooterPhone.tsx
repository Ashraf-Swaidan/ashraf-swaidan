import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

import {
  ASH_AI_HANDOFF_EVENT,
  type AshAiHandoffDetail,
} from "@/lib/ashAiVisualContext"

import { AppScreen } from "./footer-phone/app-screen"
import {
  DOCK_IDS,
  STANDARD_APPS,
  makeProjectApps,
} from "./footer-phone/constants"
import { usePhoneWallpaper } from "./footer-phone/phone-wallpaper"
import { AppIcon, DockIcon, HomeWidgets } from "./footer-phone/home-dock"
import {
  NotificationDragHandle,
  NotificationShade,
  type PhoneNotification,
  StatusBar,
  usePhoneClock,
} from "./footer-phone/phone-chrome"
import type {
  PhoneApp,
  SpotifyBackgroundSession,
  SpotifyPlayerDockRect,
} from "./footer-phone/types"
import { moveItem } from "./footer-phone/utils"

gsap.registerPlugin(useGSAP)

export function FooterPhone() {
  const { time, day, dateLine } = usePhoneClock()
  const panelRef = useRef<HTMLDivElement>(null)
  const phoneBezelRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [activeAppId, setActiveAppId] = useState<string | null>("chatgpt")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [ashAiBootstrapHandoff, setAshAiBootstrapHandoff] =
    useState<AshAiHandoffDetail | null>(null)
  const allApps = useMemo(() => [...STANDARD_APPS, ...makeProjectApps()], [])
  const initialHomeApps = useMemo(
    () =>
      allApps.filter(
        (app) => !DOCK_IDS.includes(app.id as (typeof DOCK_IDS)[number])
      ),
    [allApps]
  )
  const [homeApps, setHomeApps] = useState<PhoneApp[]>(initialHomeApps)
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null)
  const [spotifySession, setSpotifySession] =
    useState<SpotifyBackgroundSession | null>(null)
  const [spotifyDockRect, setSpotifyDockRect] =
    useState<SpotifyPlayerDockRect | null>(null)
  const [spotifyResumeNonce, setSpotifyResumeNonce] = useState(0)

  const bumpSpotifyResume = useCallback(() => {
    setSpotifyResumeNonce((n) => n + 1)
  }, [])

  const dockApps = DOCK_IDS.map((id) =>
    allApps.find((app) => app.id === id)
  ).filter(Boolean) as PhoneApp[]

  const clearSpotifySession = useCallback(() => {
    setSpotifySession(null)
    setSpotifyDockRect(null)
  }, [])

  const notifications: PhoneNotification[] = useMemo(() => {
    const rows: PhoneNotification[] = []
    if (spotifySession) {
      rows.push({
        id: "spotify-now",
        layout: "media",
        title: spotifySession.displayTitle,
        artist: spotifySession.displayArtist,
        thumbUrl: spotifySession.thumb,
        openUrl: spotifySession.openUrl,
        onClick: () => {
          setActiveAppId("spotify")
          bumpSpotifyResume()
        },
        onDismiss: clearSpotifySession,
      })
    } else {
      rows.push({
        id: "spotify-seed",
        title: "Spotify",
        body: "Ashraf Radio is ready — open the app and press play.",
        onClick: () => setActiveAppId("spotify"),
      })
    }
    rows.push({
      id: "ash-ai-tip",
      title: "Ash AI",
      body: "You can try texting ChatGPT.",
      onClick: () => setActiveAppId("chatgpt"),
    })
    return rows
  }, [spotifySession, bumpSpotifyResume, clearSpotifySession])

  const ashAiApp = allApps.find((app) => app.id === "chatgpt") ?? null
  const activeApp = allApps.find((app) => app.id === activeAppId) ?? null
  const { src: wallpaperSrc } = usePhoneWallpaper()

  useEffect(() => {
    const onHandoff = (ev: Event) => {
      const e = ev as CustomEvent<AshAiHandoffDetail>
      if (!e.detail?.userText?.trim()) return
      setAshAiBootstrapHandoff(e.detail)
      setActiveAppId("chatgpt")
    }
    window.addEventListener(ASH_AI_HANDOFF_EVENT, onHandoff)
    return () => window.removeEventListener(ASH_AI_HANDOFF_EVENT, onHandoff)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion || !panelRef.current || !activeAppId) return

      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 28, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "power2.out" }
      )
    },
    { dependencies: [activeAppId, prefersReducedMotion], scope: panelRef }
  )

  const reorderHomeApp = (targetId: string) => {
    if (!draggedAppId || draggedAppId === targetId) return
    setHomeApps((current) => {
      const from = current.findIndex((app) => app.id === draggedAppId)
      const to = current.findIndex((app) => app.id === targetId)
      return from >= 0 && to >= 0 ? moveItem(current, from, to) : current
    })
  }

  const spotifyDockedInUi =
    Boolean(spotifySession) &&
    activeAppId === "spotify" &&
    spotifyDockRect !== null

  const spotifyIframeStyle: CSSProperties | undefined = spotifySession
    ? spotifyDockedInUi
      ? {
          position: "absolute",
          zIndex: 32,
          top: spotifyDockRect!.top,
          left: spotifyDockRect!.left,
          width: spotifyDockRect!.width,
          height: spotifyDockRect!.height,
          opacity: 1,
          pointerEvents: "auto",
          border: "none",
          borderRadius: "1rem",
        }
      : {
          position: "absolute",
          zIndex: 32,
          top: "120%",
          left: 0,
          width: "min(100%, 20rem)",
          height: 188,
          opacity: 0,
          pointerEvents: "none",
          border: "none",
        }
    : undefined

  return (
    <div className="phone-reveal relative w-full max-w-[24rem]">
      <div
        className="absolute top-[6%] left-1/2 h-[88%] w-[76%] -translate-x-1/2 rounded-[3.3rem] bg-[radial-gradient(circle_at_50%_0%,rgba(10,10,10,0.13),transparent_58%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute top-[18%] -left-1 h-14 w-1 rounded-l-full bg-[var(--color-drh-ink)]/22"
        aria-hidden
      />
      <div
        className="absolute top-[25%] -right-1 h-24 w-1 rounded-r-full bg-[var(--color-drh-ink)]/24"
        aria-hidden
      />

      <div className="relative rounded-[3.25rem] bg-[linear-gradient(135deg,rgb(33_34_34),rgb(10_10_10)_46%,rgb(74_75_72))] p-[0.62rem] shadow-[0_36px_95px_rgb(12_12_12/0.18)]">
        <div
          ref={phoneBezelRef}
          className="relative aspect-[9/18.8] overflow-hidden rounded-[2.55rem] bg-black"
        >
          <img
            src={wallpaperSrc}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.08),transparent_24%,rgb(0_0_0/0.2)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12),inset_0_18px_44px_rgb(255_255_255/0.12)]"
            aria-hidden
          />

          <StatusBar time={time} />
          <NotificationDragHandle onOpen={() => setNotificationsOpen(true)} />
          <div
            className="absolute top-3 left-1/2 z-50 h-7 w-[6.8rem] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_1px_2px_rgb(255_255_255/0.18),0_10px_24px_rgb(0_0_0/0.26)]"
            aria-hidden
          >
            <span className="absolute top-1/2 right-5 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-700/80" />
          </div>

          <NotificationShade
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            notifications={notifications}
          />

          {spotifySession && spotifyIframeStyle ? (
            <iframe
              key={spotifySession.embedUrl}
              src={spotifySession.embedUrl}
              title={spotifySession.displayTitle}
              className="overflow-hidden"
              style={spotifyIframeStyle}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : null}

          <div
            className={cn(
              "absolute inset-0 z-10 flex flex-col px-4 pt-14 pb-5 transition",
              activeApp ? "scale-[0.985] opacity-25" : "opacity-100"
            )}
          >
            <HomeWidgets
              day={day}
              dateLine={dateLine}
              ashAiApp={ashAiApp ?? undefined}
              onOpenAshAi={() => setActiveAppId("chatgpt")}
            />

            <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-2">
              {homeApps.map((app) => (
                <AppIcon
                  key={app.id}
                  app={app}
                  draggable
                  onOpen={() => {
                    if (!draggedAppId) setActiveAppId(app.id)
                  }}
                  onDragStart={() => setDraggedAppId(app.id)}
                  onDragEnter={() => reorderHomeApp(app.id)}
                  onDragEnd={() => setDraggedAppId(null)}
                />
              ))}
            </div>

            <div className="mt-auto grid grid-cols-4 gap-2 rounded-[1.55rem] bg-white/18 px-2 shadow-[0_16px_36px_rgb(0_0_0/0.16)] backdrop-blur-xl">
              {dockApps.map((app) => (
                <DockIcon
                  key={app.id}
                  app={app}
                  onOpen={() => setActiveAppId(app.id)}
                />
              ))}
            </div>
          </div>

          {activeApp ? (
            <AppScreen
              app={activeApp}
              panelRef={panelRef}
              ashAiBootstrapHandoff={
                activeApp.id === "chatgpt" ? ashAiBootstrapHandoff : null
              }
              onConsumeAshAiBootstrapHandoff={() =>
                setAshAiBootstrapHandoff(null)
              }
              onClose={() => setActiveAppId(null)}
              spotifyPlayer={
                activeApp.id === "spotify"
                  ? {
                      phoneBezelRef,
                      session: spotifySession,
                      setSession: setSpotifySession,
                      setDockRect: setSpotifyDockRect,
                      resumeNonce: spotifyResumeNonce,
                    }
                  : undefined
              }
            />
          ) : null}

          <div
            className="absolute inset-x-0 bottom-2 z-50 flex justify-center"
            aria-hidden
          >
            <span className="h-1.5 w-24 rounded-full bg-white/72 shadow-[0_1px_8px_rgb(0_0_0/0.22)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterPhone
