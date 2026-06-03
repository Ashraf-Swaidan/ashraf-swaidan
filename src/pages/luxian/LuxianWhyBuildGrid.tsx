import { motion, useReducedMotion } from "motion/react"

import {
  LUXIAN_BODY_FONT,
  LUXIAN_DISPLAY_FONT,
  LUXIAN_WHY_BUILD_COLUMNS,
} from "./luxian-data"

function LuxianWhyBuildColumn({
  title,
  description,
  index,
  isLast,
}: {
  title: string
  description: string
  index: number
  isLast: boolean
}) {
  return (
    <article
      className={`flex min-w-[min(84vw,20rem)] shrink-0 snap-center flex-col pr-8 sm:min-w-[min(72vw,22rem)] sm:pr-10 lg:min-w-0 lg:px-8 lg:first:pl-0 lg:last:pr-0 ${
        isLast ? "" : "border-r border-black/12"
      }`}
      aria-labelledby={`luxian-why-${index}`}
    >
      <h3
        id={`luxian-why-${index}`}
        className="text-[clamp(2.15rem,6.5vw,3.75rem)] leading-[0.88] font-bold tracking-[-0.02em] text-black uppercase"
        style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
      >
        {title}
      </h3>
      <p
        className="mt-5 max-w-[28rem] text-[1.05rem] leading-[1.55] text-[var(--color-drh-ink)]/82 sm:mt-6 sm:text-[1.12rem] sm:leading-[1.58] lg:max-w-none"
        style={{
          fontFamily: LUXIAN_BODY_FONT,
          fontVariationSettings: '"opsz" 72, "wght" 460',
        }}
      >
        {description}
      </p>
    </article>
  )
}

export function LuxianWhyBuildGrid() {
  const reduceMotion = useReducedMotion() === true

  return (
    <motion.div
      className="mx-auto mt-12 max-w-6xl"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.8, ease: [0.22, 0.08, 0.19, 1] }}
    >
      <div
        className="-mx-5 flex gap-0 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] snap-x snap-mandatory lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {LUXIAN_WHY_BUILD_COLUMNS.map((column, index) => (
          <LuxianWhyBuildColumn
            key={column.id}
            title={column.title}
            description={column.description}
            index={index}
            isLast={index === LUXIAN_WHY_BUILD_COLUMNS.length - 1}
          />
        ))}
      </div>
    </motion.div>
  )
}
