import { type RefObject } from "react"

import { cn } from "@/lib/utils"

import { AshAiWorkspace } from "./ash-ai-workspace"
import { DISPLAY_FONT, PHONE_APP_CONTENT_PT_CLASS } from "./constants"
import { NotesScreen } from "./notes-screen"
import { PapionMobileScreen } from "./papion-mobile-screen"
import { PhotosScreen } from "./photos-screen"
import {
  ChatScreen,
  GmailScreen,
  InstagramScreen,
  LinkedInScreen,
  ProjectScreen,
  UtilityScreen,
} from "./standard-app-screens"
import type { PhoneApp } from "./types"

export function AppScreen({
  app,
  panelRef,
  onClose,
}: {
  app: PhoneApp
  panelRef: RefObject<HTMLDivElement | null>
  onClose: () => void
}) {
  const isAshAi = app.id === "chatgpt"

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute inset-0 z-30 flex flex-col overflow-hidden bg-white",
        PHONE_APP_CONTENT_PT_CLASS
      )}
    >
      {!isAshAi ? (
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
        <AshAiWorkspace onClose={onClose} />
      ) : app.kind === "project" && app.project.id === "papion" ? (
        <PapionMobileScreen app={app} />
      ) : app.kind === "project" ? (
        <ProjectScreen app={app} />
      ) : app.kind === "gmail" ? (
        <GmailScreen />
      ) : app.kind === "instagram" ? (
        <InstagramScreen app={app} />
      ) : app.kind === "linkedin" ? (
        <LinkedInScreen app={app} />
      ) : app.kind === "whatsapp" ? (
        <ChatScreen app={app} />
      ) : app.kind === "photos" ? (
        <PhotosScreen appPanelRef={panelRef} />
      ) : app.kind === "notes" ? (
        <NotesScreen />
      ) : (
        <UtilityScreen app={app} />
      )}
    </div>
  )
}
