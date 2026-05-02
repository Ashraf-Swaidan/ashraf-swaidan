import { cn } from "@/lib/utils"
import type { ProblemTone } from "./types"

function DashboardVisual({ active }: { active: boolean }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 220 150" aria-hidden="true">
      <rect x="18" y="18" width="184" height="114" rx="0" fill="white" opacity="0.72" />
      <g 
        className={cn(
          "origin-bottom",
          active && "[&_.bar]:animate-[ashBar_1.4s_ease-in-out_infinite_alternate]"
        )}
      >
        {[42, 62, 82, 102].map((x, i) => (
          <rect
            key={x}
            className="bar"
            x={x}
            y={84 - i * 9}
            width="13"
            height={30 + i * 9}
            fill="#ff6b35"
            opacity={0.32 + i * 0.14}
            style={{ animationDelay: `${i * 0.13}s` }}
          />
        ))}
      </g>
      <path
        className={cn(active && "animate-[ashDraw_1.7s_ease-in-out_infinite]")}
        d="M38 92 C62 76 73 88 91 66 S133 76 154 48 178 51 188 38"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="190"
      />
      <g fill="#0a0a0a">
        <circle className={cn(active && "animate-ping")} cx="188" cy="38" r="4" />
        <rect x="34" y="34" width="45" height="10" opacity="0.12" />
        <rect x="130" y="104" width="54" height="10" opacity="0.12" />
      </g>
    </svg>
  )
}

function StockVisual({ active }: { active: boolean }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 220 150" aria-hidden="true">
      <g fill="white" opacity="0.75">
        <rect x="24" y="29" width="56" height="32" />
        <rect x="88" y="29" width="56" height="32" />
        <rect x="152" y="29" width="44" height="32" />
        <rect x="24" y="72" width="56" height="32" />
        <rect x="88" y="72" width="56" height="32" />
        <rect x="152" y="72" width="44" height="32" />
      </g>
      <rect
        className={cn(active && "animate-[ashScan_1.45s_ease-in-out_infinite]")}
        x="18"
        y="24"
        width="184"
        height="6"
        fill="#3f9f62"
        opacity="0.55"
      />
      <g stroke="#0a0a0a" strokeWidth="2.5" opacity="0.55">
        <path d="M38 45h22M101 45h25M164 45h16M38 88h22M101 88h25M164 88h16" />
      </g>
      <path
        className={cn(active && "animate-[ashPop_1.6s_ease-in-out_infinite]")}
        d="m93 124 13 13 31-36"
        fill="none"
        stroke="#3f9f62"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExpenseVisual({ active }: { active: boolean }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 220 150" aria-hidden="true">
      <path
        className={cn(active && "animate-[ashReceipt_1.8s_ease-in-out_infinite]")}
        d="M44 24h72v90l-8-5-8 5-8-5-8 5-8-5-8 5-8-5-8 5V24Z"
        fill="white"
        opacity="0.78"
      />
      <g stroke="#0a0a0a" strokeWidth="3" opacity="0.28">
        <path d="M60 45h39M60 61h28M60 77h42" />
      </g>
      <g className={cn(active && "[&_.chip]:animate-[ashChip_1.35s_ease-in-out_infinite_alternate]")}>
        {["Meals", "Travel", "Ops"].map((label, i) => (
          <g key={label} className="chip" style={{ animationDelay: `${i * 0.18}s` }}>
            <rect x={124} y={38 + i * 27} width={58} height="18" fill="#c98221" opacity={0.18 + i * 0.1} />
            <text x={134} y={51 + i * 27} fill="#0a0a0a" fontSize="9" fontFamily="Fraunces Variable">
              {label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export function SolutionVisual({ tone, active }: { tone: ProblemTone; active: boolean }) {
  if (tone === "stock") return <StockVisual active={active} />
  if (tone === "expense") return <ExpenseVisual active={active} />
  return <DashboardVisual active={active} />
}