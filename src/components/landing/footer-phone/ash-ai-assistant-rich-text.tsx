import { Fragment, type ReactNode } from "react"

import { cn } from "@/lib/utils"

function splitByCode(line: string): { code: boolean; value: string }[] {
  const out: { code: boolean; value: string }[] = []
  let i = 0
  while (i < line.length) {
    const t = line.indexOf("`", i)
    if (t === -1) {
      out.push({ code: false, value: line.slice(i) })
      break
    }
    if (t > i) out.push({ code: false, value: line.slice(i, t) })
    const t2 = line.indexOf("`", t + 1)
    if (t2 === -1) {
      out.push({ code: false, value: line.slice(t) })
      break
    }
    out.push({ code: true, value: line.slice(t + 1, t2) })
    i = t2 + 1
  }
  return out.length ? out : [{ code: false, value: "" }]
}

function formatBoldItalic(segment: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let rest = segment
  let k = 0
  while (rest.length) {
    const open = rest.indexOf("**")
    if (open === -1) {
      nodes.push(...formatItalicOneLevel(rest, `${keyBase}-tail-${k}`))
      break
    }
    if (open > 0) {
      nodes.push(
        ...formatItalicOneLevel(rest.slice(0, open), `${keyBase}-pre-${k}`)
      )
    }
    const close = rest.indexOf("**", open + 2)
    if (close === -1) {
      nodes.push(
        ...formatItalicOneLevel(rest.slice(open), `${keyBase}-bad-${k}`)
      )
      break
    }
    nodes.push(
      <strong
        key={`${keyBase}-str-${k++}`}
        className="font-semibold text-inherit"
      >
        {formatItalicOneLevel(
          rest.slice(open + 2, close),
          `${keyBase}-istr`
        )}
      </strong>
    )
    rest = rest.slice(close + 2)
  }
  return nodes.length ? nodes : [segment]
}

/** Single-depth *italic* (no nesting). */
function formatItalicOneLevel(segment: string, keyBase: string): ReactNode[] {
  const parts = segment.split(/(\*[^*]+\*)/g).filter((x) => x.length > 0)
  const nodes: ReactNode[] = []
  let k = 0
  for (const part of parts) {
    const em = part.match(/^\*([^*]+)\*$/)
    if (em) {
      nodes.push(
        <em key={`${keyBase}-i-${k++}`} className="italic text-inherit">
          {em[1]}
        </em>
      )
    } else if (part) {
      nodes.push(part)
    }
  }
  return nodes.length ? nodes : [segment]
}

function formatLine(line: string, lineKey: string): ReactNode[] {
  const pieces = splitByCode(line)
  const out: ReactNode[] = []
  let i = 0
  for (const piece of pieces) {
    if (piece.code) {
      out.push(
        <code
          key={`${lineKey}-c-${i++}`}
          className="rounded-md bg-neutral-200/75 px-1 py-0.5 font-[ui-monospace,SFMono-Regular,monospace] text-[0.88em] font-medium text-neutral-900"
        >
          {piece.value}
        </code>
      )
    } else {
      out.push(...formatBoldItalic(piece.value, `${lineKey}-t-${i++}`))
    }
  }
  return out
}

export function AshAiAssistantRichText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const blocks = text.split(/\n\n+/)
  return (
    <span className={cn("block", className)}>
      {blocks.map((block, bi) => (
        <span key={bi} className="block [&:not(:first-child)]:mt-2.5">
          {block.split("\n").map((line, li) => (
            <Fragment key={li}>
              {li > 0 ? <br /> : null}
              {formatLine(line, `${bi}-${li}`)}
            </Fragment>
          ))}
        </span>
      ))}
    </span>
  )
}
