import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
} from "react"

import type { AshAiHandoffDetail } from "@/lib/ashAiVisualContext"
import { cn } from "@/lib/utils"

import { AshAiWorkspace } from "./ash-ai-workspace"
import { DISPLAY_FONT, PHONE_APP_CONTENT_PT_CLASS } from "./constants"
import { NotesScreen } from "./notes-screen"
import { PhoneScreen } from "./phone-screen"
import { ProjectBrowserScreen } from "./project-browser-screen"
import { PhotosScreen } from "./photos-screen"
import { SettingsScreen } from "./settings-screen"
import { SpotifyScreen } from "./spotify-screen"
import { YouTubeScreen } from "./youtube-screen"
import { SafariBrowserScreen } from "./safari-browser-screen"
import {
  ChatScreen,
  GmailScreen,
  InstagramScreen,
  LinkedInScreen,
  UtilityScreen,
} from "./standard-app-screens"
import type {
  PhoneApp,
  SpotifyBackgroundSession,
  SpotifyPlayerDockRect,
} from "./types"
import type { NotesDeepLinkDetail } from "@/lib/notesDeepLink"

export type SpotifyPlayerBridge = {
  phoneBezelRef: RefObject<HTMLDivElement | null>
  session: SpotifyBackgroundSession | null
  setSession: Dispatch<SetStateAction<SpotifyBackgroundSession | null>>
  setDockRect: Dispatch<SetStateAction<SpotifyPlayerDockRect | null>>
  resumeNonce: number
}

export function AppScreen({
  app,
  panelRef,
  onClose,
  ashAiBootstrapHandoff,
  onConsumeAshAiBootstrapHandoff,
  notesDeepLink,
  onConsumeNotesDeepLink,
  spotifyPlayer,
}: {
  app: PhoneApp
  panelRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  ashAiBootstrapHandoff?: AshAiHandoffDetail | null
  onConsumeAshAiBootstrapHandoff?: () => void
  notesDeepLink?: NotesDeepLinkDetail | null
  onConsumeNotesDeepLink?: () => void
  spotifyPlayer?: SpotifyPlayerBridge
}) {
  const isAshAi = app.id === "chatgpt"
  const hideChrome =
    isAshAi ||
    app.kind === "youtube" ||
    app.kind === "settings" ||
    app.id === "spotify"

  useEffect(() => {
    return () => {
      const el = panelRef.current
      if (el) {
        el.style.overflow = ""
      }
    }
  }, [panelRef])

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute inset-0 z-30 flex flex-col overflow-hidden",
        app.kind === "youtube"
          ? "bg-[#0f0f0f] pt-[3.35rem]"
          : app.kind === "settings"
            ? "bg-[#f2f2f7] pt-[3.35rem]"
            : app.id === "spotify"
              ? "bg-[#121212] pt-[3.35rem]"
              : cn("bg-white", PHONE_APP_CONTENT_PT_CLASS)
      )}
    >
      {!hideChrome ? (
        <div
          className={cn(
            "absolute inset-x-0 top-9 z-20 flex h-11 items-center justify-between px-4"
          )}
        >
          <button
            type="button"
            onClick={onClose}
            className="text-[0.76rem] font-semibold tracking-[0.14em] text-current/62 uppercase focus-visible:outline-none"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Back
          </button>
          <span
            className="max-w-[9rem] truncate text-[0.68rem] font-semibold tracking-[0.18em] text-current/38 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {app.label}
          </span>
        </div>
      ) : null}

      {app.kind === "chatgpt" ? (
        <AshAiWorkspace
          onClose={onClose}
          bootstrapHandoff={ashAiBootstrapHandoff ?? null}
          onConsumeBootstrapHandoff={onConsumeAshAiBootstrapHandoff}
        />
      ) : app.kind === "project" ? (
        <ProjectBrowserScreen app={app} />
      ) : app.kind === "safari" ? (
        <SafariBrowserScreen app={app} />
      ) : app.kind === "gmail" ? (
        <GmailScreen />
      ) : app.kind === "instagram" ? (
        <InstagramScreen app={app} />
      ) : app.kind === "linkedin" ? (
        <LinkedInScreen app={app} />
      ) : app.kind === "whatsapp" ? (
        <ChatScreen app={app} />
      ) : app.kind === "phone" ? (
        <PhoneScreen />
      ) : app.kind === "photos" ? (
        <PhotosScreen appPanelRef={panelRef} />
      ) : app.kind === "youtube" ? (
        <YouTubeScreen appPanelRef={panelRef} onExitApp={onClose} />
      ) : app.kind === "settings" ? (
        <SettingsScreen onExitApp={onClose} />
      ) : app.kind === "notes" ? (
        <NotesScreen
          deepLink={notesDeepLink ?? null}
          onConsumeDeepLink={onConsumeNotesDeepLink}
        />
      ) : app.id === "spotify" ? (
        spotifyPlayer ? (
          <SpotifyScreen
            onExitApp={onClose}
            phoneBezelRef={spotifyPlayer.phoneBezelRef}
            session={spotifyPlayer.session}
            setSession={spotifyPlayer.setSession}
            setDockRect={spotifyPlayer.setDockRect}
            resumeNonce={spotifyPlayer.resumeNonce}
          />
        ) : null
      ) : (
        <UtilityScreen app={app} />
      )}
    </div>
  )
}
