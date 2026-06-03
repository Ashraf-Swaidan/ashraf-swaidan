import { useState } from "react"
import { Check, Copy } from "lucide-react"

import {
  LUXIAN_BODY_FONT,
  LUXIAN_DEMO_ADMIN_EMAIL,
  LUXIAN_DEMO_ADMIN_PASSWORD,
  LUXIAN_DISPLAY_FONT,
  LUXIAN_LOGIN_URL,
} from "./luxian-data"

function InlineCopy({
  value,
  label,
}: {
  value: string
  label: string
}) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <span className="inline-flex min-w-0 items-center gap-1">
      <code className="truncate text-[0.82rem] font-medium text-[var(--color-drh-ink)]/88">
        {value}
      </code>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="grid size-6 shrink-0 place-items-center rounded-md text-[var(--color-drh-ink)]/40 transition hover:bg-[rgb(255_122_0/0.08)] hover:text-[var(--color-drh-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-accent-orange)]/35"
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
      >
        {copied ? (
          <Check className="size-3" strokeWidth={2.2} aria-hidden />
        ) : (
          <Copy className="size-3" strokeWidth={2.2} aria-hidden />
        )}
      </button>
    </span>
  )
}

/** Admin demo credentials beside the live device preview. */
export function LuxianDemoAccess({ className = "" }: { className?: string }) {
  return (
    <div
      className={`luxian-demo-credentials-glow rounded-2xl border border-[var(--color-drh-accent-orange)]/25 bg-[rgb(255_122_0/0.06)] px-4 py-3 text-left sm:px-5 sm:py-3.5 ${className}`}
    >
      <p
        className="text-[0.72rem] leading-relaxed text-[var(--color-drh-ink)]/68 sm:text-[0.78rem]"
        style={{ fontFamily: LUXIAN_BODY_FONT }}
      >
        Use this email and password for the seeded admin demo. You will not stay
        signed in inside the preview below: Luxian&apos;s auth cookies are locked
        down, and browsers will not hold a session in our embedded portfolio view.{" "}
        <a
          href={LUXIAN_LOGIN_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-[var(--color-drh-accent-orange)] underline decoration-[var(--color-drh-accent-orange)]/35 underline-offset-[3px] transition hover:decoration-[var(--color-drh-accent-orange)]"
        >
          Open Luxian in a new tab
        </a>
        . Sign in on the live site, then explore the full back office.
      </p>
      <p
        className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5"
        style={{ fontFamily: LUXIAN_BODY_FONT }}
      >
        <span
          className="text-[0.62rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)]/45 uppercase"
          style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
        >
          Admin demo
        </span>
        <InlineCopy value={LUXIAN_DEMO_ADMIN_EMAIL} label="email" />
        <span className="text-[var(--color-drh-ink)]/22" aria-hidden>
          /
        </span>
        <InlineCopy value={LUXIAN_DEMO_ADMIN_PASSWORD} label="password" />
      </p>
    </div>
  )
}
