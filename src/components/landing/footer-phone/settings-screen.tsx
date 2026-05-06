import { useCallback, useState, type CSSProperties, type ReactNode } from "react"

import {
  Boxes,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  LayoutGrid,
  Shield,
  Sparkles,
  SunMedium,
  Volume2,
  Wind,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { BODY_FONT, DISPLAY_FONT, GMAIL_ADDRESS } from "./constants"
import {
  type PhoneWallpaperId,
  PHONE_WALLPAPERS,
  usePhoneWallpaper,
} from "./phone-wallpaper"

const IOS_BG = "#f2f2f7"
const IOS_BLUE = "#007aff"
const IOS_LABEL = "#3c3c43"
const IOS_LABEL_SECONDARY = "rgba(60,60,67,0.6)"

const SCROLL_HIDE =
  "overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"

type SettingsView = "root" | "wallpaper" | "about"

const ABOUT_BUILD = "2026.05.B7"

const TECH_STACK: { name: string; sub?: string; Icon: LucideIcon }[] = [
  { name: "React", Icon: Boxes },
  { name: "TypeScript", Icon: Braces },
  { name: "Vite", Icon: Zap },
  { name: "Tailwind", sub: "CSS", Icon: Wind },
  { name: "GSAP", Icon: Wand2 },
  { name: "Motion", sub: "motion/react", Icon: Sparkles },
  { name: "Framer", sub: "Motion", Icon: Sparkles },
  { name: "Radix", sub: "UI", Icon: LayoutGrid },
  { name: "Lucide", Icon: CircleDot },
]

const ABOUT_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Ashraf-Swaidan",
    detail: "Code & experiments",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ashraf-swaidan/",
    detail: "Profile",
  },
  {
    label: "Gmail",
    href: `mailto:${GMAIL_ADDRESS}`,
    detail: GMAIL_ADDRESS,
  },
] as const

function SystemFont({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={className}
      style={{
        ...style,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
      }}
    >
      {children}
    </span>
  )
}

function SettingsInsetTopBar({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="sticky top-0 z-10 flex shrink-0 items-center gap-1 border-b border-black/6 bg-white/92 px-1 py-1.5 backdrop-blur-md">
      <button
        type="button"
        onClick={onBack}
        className="grid size-9 shrink-0 place-items-center rounded-full text-[#007aff] transition active:bg-black/5"
        aria-label="Back"
      >
        <ChevronLeft className="size-7" strokeWidth={2} aria-hidden />
      </button>
      <SystemFont className="min-w-0 flex-1 truncate text-center text-[1.05rem] font-semibold text-black">
        {title}
      </SystemFont>
      <span className="size-9 shrink-0" aria-hidden />
    </div>
  )
}

function GroupCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[0.65rem] bg-white shadow-sm ring-1 ring-black/[0.06]">
      {children}
    </div>
  )
}

function ListDivider({ indent }: { indent?: boolean }) {
  return <div className={cn("h-px bg-black/8", indent && "ml-14")} />
}

function SettingsRootRow({
  icon,
  iconBg,
  label,
  detail,
  onClick,
  trailing,
  muted,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  detail?: string
  onClick?: () => void
  trailing?: React.ReactNode
  muted?: boolean
}) {
  const inner = (
    <>
      <span
        className="grid size-7 shrink-0 place-items-center rounded-md text-white shadow-inner"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <SystemFont
          className={cn(
            "block text-[1.05rem] text-black",
            muted && "text-black/35"
          )}
        >
          {label}
        </SystemFont>
        {detail ? (
          <SystemFont
            className="mt-0.5 block text-[0.82rem]"
            style={{ color: IOS_LABEL_SECONDARY }}
          >
            {detail}
          </SystemFont>
        ) : null}
      </div>
      {trailing ?? (
        <ChevronRight
          className={cn(
            "size-5 shrink-0 text-[#c7c7cc]",
            muted && "opacity-0"
          )}
          strokeWidth={2}
          aria-hidden
        />
      )}
    </>
  )

  const cls =
    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition active:bg-black/[0.04]"

  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick}>
        {inner}
      </button>
    )
  }
  return (
    <div className={cls} role="presentation">
      {inner}
    </div>
  )
}

export function SettingsScreen({ onExitApp }: { onExitApp: () => void }) {
  const [view, setView] = useState<SettingsView>("root")
  const { id: currentWallpaperId, src: currentSrc, setId } = usePhoneWallpaper()

  const barBack = useCallback(() => {
    if (view === "root") onExitApp()
    else setView("root")
  }, [view, onExitApp])

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col"
      style={{ backgroundColor: IOS_BG, color: IOS_LABEL }}
    >
      {view === "root" ? (
        <>
          <div className="sticky top-0 z-10 flex shrink-0 items-center border-b border-black/6 bg-white/92 px-2 py-2 backdrop-blur-md">
            <button
              type="button"
              onClick={onExitApp}
              className="grid size-9 shrink-0 place-items-center rounded-full text-[#007aff] transition active:bg-black/5"
              aria-label="Back to phone home"
            >
              <ChevronLeft className="size-7" strokeWidth={2} aria-hidden />
            </button>
            <SystemFont className="flex-1 pr-9 text-center text-[0.95rem] font-semibold text-black">
              Settings
            </SystemFont>
          </div>
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-6",
              SCROLL_HIDE
            )}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <h1
              className="px-1 pb-3 text-[2.1rem] font-bold leading-none tracking-[-0.03em] text-black"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
              }}
            >
              Settings
            </h1>

            <GroupCard>
              <SettingsRootRow
                icon={
                  <span
                    className="text-[0.62rem] font-bold"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    AS
                  </span>
                }
                iconBg="linear-gradient(145deg,#8e8e93,#636366)"
                label="Ashraf Swaidan"
                detail="Apple ID, iCloud, Media & Purchases"
                muted
              />
            </GroupCard>

            <p
              className="mt-6 mb-1.5 px-4 text-[0.78rem] font-medium tracking-wide text-[#6c6c70]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              PORTFOLIO OS
            </p>
            <GroupCard>
              <SettingsRootRow
                icon={
                  <SunMedium className="size-4 text-white" strokeWidth={2} />
                }
                iconBg="linear-gradient(180deg,#ff9f0a,#ff8800)"
                label="Display & Brightness"
                muted
              />
              <ListDivider indent />
              <SettingsRootRow
                icon={
                  <Volume2 className="size-4 text-white" strokeWidth={2} />
                }
                iconBg="linear-gradient(180deg,#ff375f,#ff2d55)"
                label="Sounds & Haptics"
                muted
              />
              <ListDivider indent />
              <SettingsRootRow
                icon={
                  <Shield className="size-4 text-white" strokeWidth={2} />
                }
                iconBg="linear-gradient(180deg,#5e5ce6,#4846d6)"
                label="Privacy & Security"
                muted
              />
            </GroupCard>

            <p
              className="mt-6 mb-1.5 px-4 text-[0.78rem] font-medium tracking-wide text-[#6c6c70]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              PERSONALIZATION
            </p>
            <GroupCard>
              <button
                type="button"
                onClick={() => setView("wallpaper")}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition active:bg-black/[0.04]"
              >
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-md text-white shadow-inner"
                  style={{
                    background: "linear-gradient(180deg,#30d158,#28cd41)",
                  }}
                >
                  <Sparkles className="size-4 text-white" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <SystemFont className="block text-[1.05rem] text-black">
                    Wallpaper
                  </SystemFont>
                </div>
                <div className="relative size-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/10">
                  <img
                    src={currentSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <ChevronRight
                  className="size-5 shrink-0 text-[#c7c7cc]"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
              <ListDivider indent />
              <SettingsRootRow
                icon={
                  <span
                    className="text-[0.55rem] font-bold tabular-nums text-white"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    i
                  </span>
                }
                iconBg="linear-gradient(180deg,#8e8e93,#636366)"
                label="About"
                detail="Version, tech stack, links"
                onClick={() => setView("about")}
              />
            </GroupCard>
          </div>
        </>
      ) : view === "wallpaper" ? (
        <>
          <SettingsInsetTopBar title="Wallpaper" onBack={barBack} />
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8",
              SCROLL_HIDE
            )}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <p
              className="mb-3 px-1 text-[0.88rem] font-semibold text-black"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              Choose a New Wallpaper
            </p>
            <p
              className="mb-4 px-1 text-[0.8rem] leading-snug"
              style={{ color: IOS_LABEL_SECONDARY, fontFamily: BODY_FONT }}
            >
              Pick a look for the home screen. Different images crop to fill the
              display.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PHONE_WALLPAPERS.map((w) => {
                const on = w.id === currentWallpaperId
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setId(w.id as PhoneWallpaperId)}
                    className="relative overflow-hidden rounded-[1.25rem] ring-2 ring-transparent transition focus-visible:ring-[#007aff] focus-visible:outline-none active:scale-[0.98]"
                    style={{
                      boxShadow: on
                        ? `0 0 0 2px ${IOS_BLUE}`
                        : "0 1px 4px rgb(0 0 0 / 0.12)",
                    }}
                  >
                    <div className="aspect-[9/19] w-full">
                      <img
                        src={w.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 py-2 pt-8"
                      aria-hidden
                    />
                    <SystemFont className="absolute bottom-2 left-2 text-[0.78rem] font-semibold text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]">
                      {w.label}
                    </SystemFont>
                    {on ? (
                      <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-[#007aff] text-white shadow-lg">
                        <Check className="size-4" strokeWidth={3} />
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <SettingsInsetTopBar title="About" onBack={barBack} />
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-10",
              SCROLL_HIDE
            )}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <GroupCard>
              {(
                [
                  ["Name", "Ashraf Swaidan"],
                  ["Role", "Designer & Engineer"],
                  ["Version", "Portfolio OS 1.0"],
                  ["Build", ABOUT_BUILD],
                  ["Live since", "2024"],
                ] as const
              ).map(([k, v], i, arr) => (
                <div key={k}>
                  <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                    <SystemFont className="text-[1.02rem] text-black">{k}</SystemFont>
                    <SystemFont
                      className="text-right text-[1.02rem]"
                      style={{ color: IOS_LABEL_SECONDARY }}
                    >
                      {v}
                    </SystemFont>
                  </div>
                  {i < arr.length - 1 ? <ListDivider /> : null}
                </div>
              ))}
            </GroupCard>

            <p
              className="mt-6 mb-1.5 px-4 text-[0.78rem] font-medium tracking-wide text-[#6c6c70]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              BUILT WITH
            </p>
            <GroupCard>
              <div className="grid grid-cols-3 gap-0">
                {TECH_STACK.map(({ name, sub, Icon }, i) => (
                  <div
                    key={`${name}-${sub ?? i}`}
                    className={cn(
                      "flex flex-col items-center gap-1 border-black/6 px-2 py-3 text-center",
                      i % 3 !== 2 && "border-r",
                      i < TECH_STACK.length - 3 && "border-b"
                    )}
                  >
                    <Icon
                      className="size-6 text-[#007aff]"
                      strokeWidth={1.65}
                      aria-hidden
                    />
                    <SystemFont className="text-[0.62rem] font-semibold leading-tight text-black">
                      {name}
                    </SystemFont>
                    {sub ? (
                      <SystemFont
                        className="text-[0.58rem] leading-tight"
                        style={{ color: IOS_LABEL_SECONDARY }}
                      >
                        {sub}
                      </SystemFont>
                    ) : null}
                  </div>
                ))}
              </div>
            </GroupCard>

            <p
              className="mt-6 mb-1.5 px-4 text-[0.78rem] font-medium tracking-wide text-[#6c6c70]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              LINKS
            </p>
            <GroupCard>
              {ABOUT_LINKS.map((link, i) => (
                <div key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 transition active:bg-black/[0.04]"
                  >
                    <div className="min-w-0">
                      <SystemFont className="block text-[1.05rem] text-black">
                        {link.label}
                      </SystemFont>
                      <SystemFont
                        className="block text-[0.8rem]"
                        style={{ color: IOS_LABEL_SECONDARY }}
                      >
                        {link.detail}
                      </SystemFont>
                    </div>
                    <ChevronRight
                      className="size-5 shrink-0 text-[#c7c7cc]"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </a>
                  {i < ABOUT_LINKS.length - 1 ? <ListDivider /> : null}
                </div>
              ))}
            </GroupCard>
          </div>
        </>
      )}
    </div>
  )
}
