import {
  BODY_FONT,
  BRANCH_ROWS,
  DISPLAY_FONT,
} from "./papion-data"

export function BranchInventoryMap() {
  return (
    <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
      {BRANCH_ROWS.map((row) => (
        <div
          key={row.branch}
          className="flex flex-col rounded-xl border border-[var(--color-drh-ink)]/08 bg-white/80 px-5 py-5 shadow-[0_8px_32px_rgb(10_10_10/0.04)] backdrop-blur-sm"
        >
          <p
            className="text-[0.65rem] font-medium tracking-[0.18em] text-[var(--color-drh-accent-orange)]/90 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {row.branch}
          </p>
          <ul className="mt-4 space-y-2">
            {row.items.map((item) => (
              <li
                key={item}
                className="border-t border-[var(--color-drh-ink)]/08 pt-2.5 text-[0.95rem] text-[var(--color-drh-ink)]/70 first:border-t-0 first:pt-0"
                style={{ fontFamily: BODY_FONT }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
