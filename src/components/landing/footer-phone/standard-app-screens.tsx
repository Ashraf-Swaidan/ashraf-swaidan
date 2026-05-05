import { cn } from "@/lib/utils"

import { BODY_FONT, DISPLAY_FONT, GMAIL_ADDRESS } from "./constants"
import type { ProjectApp, StandardApp } from "./types"

export function ProjectScreen({ app }: { app: ProjectApp }) {
  const { project } = app

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-950 text-white">
      <div className="relative h-[47%] overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={project.videoSrc}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgb(0_0_0/0.78)_100%)]" />
        <img
          src={project.logoSrc}
          alt=""
          className="absolute bottom-4 left-4 h-12 w-12 rounded-[1rem] bg-white/92 object-contain p-2 shadow-lg"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p
          className="text-[0.68rem] tracking-[0.22em] text-white/42 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Selected work
        </p>
        <h3
          className="mt-1 text-[2.15rem] leading-[0.88] font-semibold uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {project.title}
        </h3>
        <p
          className="mt-3 line-clamp-6 text-[0.96rem] leading-[1.48] text-white/64"
          style={{ fontFamily: BODY_FONT }}
        >
          {project.description}
        </p>
        <a
          href={project.href}
          className="mt-auto inline-flex w-max rounded-full bg-white px-4 py-2 text-[0.72rem] font-semibold tracking-[0.18em] text-black uppercase transition hover:-translate-y-[1px]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          View project
        </a>
      </div>
    </div>
  )
}

export function GmailScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f8fafd] px-4 pt-4 pb-5 text-slate-950">
      <div className="rounded-[1.4rem] bg-white px-4 py-3 shadow-[0_12px_32px_rgb(15_23_42/0.08)]">
        <p
          className="text-[0.68rem] tracking-[0.2em] text-slate-400 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          To
        </p>
        <p className="mt-1 text-[0.96rem] font-semibold text-slate-800">
          {GMAIL_ADDRESS}
        </p>
      </div>
      <div className="mt-3 flex-1 rounded-[1.4rem] bg-white px-4 py-4 shadow-[0_12px_32px_rgb(15_23_42/0.08)]">
        <div>
          <p
            className="text-[0.68rem] tracking-[0.2em] text-slate-400 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Subject
          </p>
          <p
            className="mt-1 text-[1.4rem] leading-none font-semibold"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Let&apos;s build something calmer
          </p>
        </div>
        <p
          className="mt-5 text-[1rem] leading-[1.52] text-slate-500"
          style={{ fontFamily: BODY_FONT }}
        >
          Hi Ashraf, I have a project, workflow, or interface that could use a
          better shape...
        </p>
      </div>
      <a
        href={`mailto:${GMAIL_ADDRESS}`}
        className="mt-3 rounded-full bg-[#1a73e8] px-5 py-3 text-center text-[0.78rem] font-semibold tracking-[0.18em] text-white uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Compose email
      </a>
    </div>
  )
}

export function InstagramScreen({ app }: { app: StandardApp }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white px-4 pt-4 pb-5 text-neutral-950">
      <div className="flex items-center gap-3">
        <img
          src={app.iconSrc}
          alt=""
          className="h-16 w-16 rounded-full object-contain"
        />
        <div className="grid flex-1 grid-cols-3 text-center">
          {["4 Posts", "Soon Followers", "Curated Following"].map((stat) => (
            <p
              key={stat}
              className="text-[0.72rem] leading-tight font-semibold"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {stat}
            </p>
          ))}
        </div>
      </div>
      <p
        className="mt-3 text-[1.55rem] leading-none font-semibold"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {app.title}
      </p>
      <p
        className="mt-2 text-[0.92rem] leading-[1.38] text-neutral-500"
        style={{ fontFamily: BODY_FONT }}
      >
        {app.body}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {["Process", "Details", "Systems", "Notes"].map((item) => (
          <div
            key={item}
            className="aspect-square rounded-[0.85rem] bg-[linear-gradient(135deg,#f4eee6,#d7dde5_48%,#161616)] p-2 text-[0.7rem] font-semibold text-white shadow-inner"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item}
          </div>
        ))}
      </div>
      <a
        href={app.href}
        target="_blank"
        rel="noreferrer"
        className="mt-auto rounded-full bg-neutral-950 px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] text-white uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Visit profile
      </a>
    </div>
  )
}

export function ChatScreen({ app }: { app: StandardApp }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#e8f1e7] px-3 pt-4 pb-5">
      <div
        className="self-start rounded-[1rem] bg-white px-3 py-2 text-[0.95rem] text-slate-700 shadow-sm"
        style={{ fontFamily: BODY_FONT }}
      >
        Hey Ashraf, quick question.
      </div>
      <div
        className="mt-2 self-end rounded-[1rem] bg-[#d7f8c6] px-3 py-2 text-[0.95rem] text-slate-700 shadow-sm"
        style={{ fontFamily: BODY_FONT }}
      >
        Send the messy version. That&apos;s usually the useful one.
      </div>
      <div
        className="mt-auto rounded-full bg-white px-4 py-3 text-[0.78rem] tracking-[0.16em] text-slate-400 uppercase shadow-sm"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Message
      </div>
      {app.href ? (
        <a
          href={app.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 rounded-full bg-[#25d366] px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] text-white uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {app.cta}
        </a>
      ) : null}
    </div>
  )
}

export function LinkedInScreen({ app }: { app: StandardApp }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f6f8] px-4 pt-4 pb-5 text-slate-950">
      <div className="h-20 rounded-t-[1.4rem] bg-[#0a66c2]" />
      <div className="-mt-8 rounded-b-[1.4rem] bg-white px-4 pt-0 pb-4 shadow-[0_12px_32px_rgb(15_23_42/0.08)]">
        <div
          className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-slate-950 text-[1.35rem] font-semibold text-white"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          AS
        </div>
        <h3
          className="mt-2 text-[1.8rem] leading-none font-semibold"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {app.title}
        </h3>
        <p
          className="mt-2 text-[0.95rem] leading-[1.42] text-slate-500"
          style={{ fontFamily: BODY_FONT }}
        >
          {app.body}
        </p>
      </div>
      <a
        href={app.href}
        target="_blank"
        rel="noreferrer"
        className="mt-auto rounded-full bg-[#0a66c2] px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] text-white uppercase"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Open profile
      </a>
    </div>
  )
}

export function UtilityScreen({ app }: { app: StandardApp }) {
  const dark = app.id === "spotify" || app.id === "netflix"
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col px-4 pt-4 pb-5",
        dark ? "bg-neutral-950 text-white" : "bg-[#f4f4f2] text-neutral-950"
      )}
    >
      <img
        src={app.iconSrc}
        alt=""
        className="h-16 w-16 rounded-[1.15rem] object-contain drop-shadow-lg"
      />
      <h3
        className="mt-4 text-[2rem] leading-none font-semibold"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {app.title}
      </h3>
      <p
        className={cn(
          "mt-3 text-[1rem] leading-[1.5]",
          dark ? "text-white/62" : "text-neutral-500"
        )}
        style={{ fontFamily: BODY_FONT }}
      >
        {app.body}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {["Draft", "Preview", "Soon", "Playable"].map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-[1rem] px-3 py-2 text-[0.66rem] tracking-[0.16em] uppercase",
              dark ? "bg-white/10 text-white/58" : "bg-white text-neutral-400"
            )}
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {item}
          </span>
        ))}
      </div>
      {app.href ? (
        <a
          href={app.href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "mt-auto rounded-full px-5 py-2.5 text-center text-[0.76rem] font-semibold tracking-[0.18em] uppercase",
            dark ? "bg-white text-black" : "bg-neutral-950 text-white"
          )}
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {app.cta}
        </a>
      ) : null}
    </div>
  )
}
