import { useRef, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useReducedMotion } from "motion/react"

import { AshDot } from "./AshDot"
import { PROBLEMS } from "./data"
import { ProblemArtifact } from "./ProblemArtifact"

gsap.registerPlugin(useGSAP)

function getLegendPosition(field: HTMLElement) {
  const legendDot = document.querySelector<HTMLElement>(".ash-legend-dot")
  if (!legendDot) {
    return { left: "1.35rem", top: "1.5rem", x: 0, y: 0 }
  }

  const fieldRect = field.getBoundingClientRect()
  const dotRect = legendDot.getBoundingClientRect()
  const ashDotRadius = 7

  return {
    left: dotRect.left + dotRect.width / 2 - fieldRect.left - ashDotRadius,
    top: dotRect.top + dotRect.height / 2 - fieldRect.top - ashDotRadius,
    x: 0,
    y: 0,
  }
}

function getCursorTarget(artifact: Element, step: Element, problemIndex: number) {
  const artifactRect = artifact.getBoundingClientRect()
  const stepRect = step.getBoundingClientRect()
  const hotspot = problemIndex === 1 ? { x: 16, y: 8 } : problemIndex === 0 ? { x: 9, y: 7 } : { x: 13, y: 13 }

  return {
    x: stepRect.left - artifactRect.left + 12 - hotspot.x,
    y: stepRect.top - artifactRect.top + stepRect.height / 2 - hotspot.y,
  }
}

export function ProblemField() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const ashRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)

  const setBubbleText = useCallback((text: string) => {
    if (bubbleRef.current) {
      bubbleRef.current.textContent = text
    }
  }, [])

  useGSAP(
    () => {
      const field = fieldRef.current
      const ash = ashRef.current
      const bubble = bubbleRef.current
      if (!field || !ash || !bubble) return

      const problems = gsap.utils.toArray<HTMLElement>(".ash-problem")
      const voices = gsap.utils.toArray<HTMLElement>(".problem-voice")

      if (reduceMotion) {
        gsap.set(problems, { opacity: 1, y: 0 })
        gsap.set(".problem-steps", { opacity: 0.22, filter: "blur(1px)" })
        gsap.set(voices, { opacity: 1, y: 0 })
        gsap.set(".ash-working-skeleton", { opacity: 0 })
        gsap.set(".solution-visual", { opacity: 1, scale: 1 })
        gsap.set(ash, getLegendPosition(field))
        setBubbleText(PROBLEMS[0].ashLine)
        gsap.set(bubble, { opacity: 1, scale: 1, x: 0 })
        return
      }

      // ─── Initial states ───
      gsap.set(ash, { ...getLegendPosition(field), scale: 1, opacity: 1 })
      gsap.set(bubble, { opacity: 0, scale: 0.94, x: -8 })
      gsap.set(".ash-working-skeleton", { opacity: 0, scale: 0.98, filter: "blur(6px)" })
      gsap.set(".solution-visual", { opacity: 0, scale: 0.86, filter: "blur(8px)" })
      gsap.set(".problem-steps", { opacity: 1, x: 0, filter: "blur(0px)" })
      gsap.set(voices, { opacity: 0, y: 4 })
      gsap.set(".problem-cursor", { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 })

      // ─── Ambient floating for cards ───
      problems.forEach((problem, index) => {
        gsap.to(problem, {
          y: index % 2 === 0 ? -5 : 5,
          x: index === 1 ? 4 : -3,
          rotate: `${PROBLEMS[index].rotate + (index % 2 === 0 ? 0.85 : -0.75)}deg`,
          duration: 5.8 + index * 0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      })

      // ─── Independent cursor loops: each problem cursor slowly cycles steps 1-5 ───
      const cursorMasters: gsap.core.Timeline[] = []

      problems.forEach((artifact, problemIndex) => {
        const cursor = artifact.querySelector<HTMLElement>(".problem-cursor")
        const steps = artifact.querySelectorAll<HTMLElement>(".step-item")
        if (!cursor || steps.length === 0) return

        const master = gsap.timeline({ repeat: -1 })
        cursorMasters.push(master)

        // Build a slower, more deliberate cycle through all 5 steps
        steps.forEach((step, stepIndex) => {
          const target = getCursorTarget(artifact, step, problemIndex)
          const approachDuration = 0.55 + stepIndex * 0.08

          master
            .to(cursor, {
              x: target.x,
              y: target.y,
              rotate: stepIndex % 2 ? 5 : -4,
              duration: approachDuration,
              ease: "power2.inOut",
            })
            .to(cursor, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" })
            .to(step, { x: 3, color: PROBLEMS[problemIndex].color, duration: 0.18, yoyo: true, repeat: 1 }, "<")
            .to({}, { duration: 0.22 }) // pause between steps
        })

        // After completing all 5 steps, slowly reset cursor to step 1 position
        const firstTarget = getCursorTarget(artifact, steps[0], problemIndex)
        master.to(cursor, {
          x: firstTarget.x,
          y: firstTarget.y,
          rotate: -4,
          duration: 0.75,
          ease: "power2.inOut",
        })
        master.to({}, { duration: 0.35 }) // pause before restarting cycle
      })

      // ─── Main Ash loop: goes to each problem while cursors are working ───
      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.6 })

      PROBLEMS.forEach((problem, index) => {
        const artifact = problems[index]
        if (!artifact) return

        const cursor = artifact.querySelector<HTMLElement>(".problem-cursor")
        const steps = artifact.querySelectorAll<HTMLElement>(".step-item")
        const solution = artifact.querySelector<HTMLElement>(".solution-visual")
        const working = artifact.querySelector<HTMLElement>(".ash-working-skeleton")
        const problemSteps = artifact.querySelector<HTMLElement>(".problem-steps")
        const voice = artifact.querySelector<HTMLElement>(".problem-voice")
        const cursorMaster = cursorMasters[index]

        // Phase 0: show struggle voice while cursor is still cycling frantically
        loop.call(() => setBubbleText(""))
        loop.to(bubble, { opacity: 0, scale: 0.94, x: -8, duration: 0.22, ease: "power2.inOut" })
        loop.to(voice, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, "+=0.15")
        loop.to({}, { duration: 0.35 })

        // Phase 1: Ash flies in — lands at the TOP of the card (not center)
        // y + 2% instead of y + 11% to sit above the card content
        loop.to(
          ash,
          {
            left: `${problem.position.x + 6}%`,
            top: `${problem.position.y + 2}%`,   // ← landed at top
            x: index === 1 ? -12 : 10,
            y: index === 2 ? -6 : -4,
            duration: 1.15,
            ease: "power3.inOut",
          },
          "+=0.08",
        )

        // Card subtly scales up as Ash arrives
        loop.to(artifact, { scale: 1.02, duration: 0.36, ease: "power2.out" }, "<0.4")

        // Phase 2: Ash states its line while cursor is still frantically working
        loop.call(() => setBubbleText(problem.ashLine))
        loop.to(bubble, { opacity: 1, scale: 1, x: 0, duration: 0.28, ease: "power2.out" }, "<0.1")
        loop.to({}, { duration: 0.4 })

        // Phase 3: NOW Ash "intervenes" — cursor gets confused/shaky
        loop.to(cursor, { x: "+=6", rotate: "+=14", duration: 0.1, yoyo: true, repeat: 3, ease: "none" })
        loop.to(voice, { opacity: 0, y: -3, duration: 0.2, ease: "power2.in" }, "<0.16")

        // Phase 4: Cursor gives up and disappears; steps fade out
        loop.to(problemSteps, { opacity: 0, x: -12, filter: "blur(5px)", duration: 0.5, ease: "power2.inOut" }, "+=0.12")
        loop.to(cursor, { opacity: 0, scale: 0.34, duration: 0.28, ease: "back.in(1.4)" }, "<0.02")

        // Pause the cursor master timeline so it doesn't continue behind the skeleton
        loop.call(() => cursorMaster?.pause())

        // Phase 5: Skeleton loading — SLOWED DOWN (more time)
        loop.to(
          working,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.34,
            ease: "power3.out",
          },
          "<0.12",
        )
        loop.to({}, { duration: 0.9 }) // skeleton loading time

        // Phase 6: Skeleton fades, solution appears
        loop.to(working, { opacity: 0, scale: 1.02, filter: "blur(4px)", duration: 0.28, ease: "power2.inOut" })
        loop.to(
          solution,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.64,
            ease: "power4.out",
          },
          "<0.08",
        )
        loop.to(artifact, { scale: 1, duration: 0.42, ease: "power2.out" }, "<")
        loop.to(bubble, { opacity: 0, scale: 0.94, x: -8, duration: 0.22, ease: "power2.in" }, "<0.18")
        loop.to({}, { duration: 0.45 })

        // Resume cursor master for next cycle (it will be reset at the top of next loop iteration)
        loop.call(() => cursorMaster?.play(0))
      })

      // ─── Reset phase: Ash returns to legend, everything resets ───
      loop
        .to(ash, { ...getLegendPosition(field), duration: 1.1, ease: "power3.inOut" })
        .to(".solution-visual", { opacity: 0, scale: 0.9, filter: "blur(8px)", duration: 0.52, stagger: 0.08 }, "<0.12")
        .to(".ash-working-skeleton", { opacity: 0, scale: 0.98, filter: "blur(6px)", duration: 0.34, stagger: 0.05 }, "<")
        .to(".problem-steps", { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.08 }, "<0.12")
        .to(voices, { opacity: 0, y: 4, duration: 0.22, stagger: 0.05 }, "<")
        .to(".problem-cursor", { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, duration: 0.42, stagger: 0.06 }, "<")
        .to({}, { duration: 0.4 })

      const syncLegendPosition = () => {
        if (!loop.isActive()) {
          gsap.set(ash, getLegendPosition(field))
        }
      }

      window.addEventListener("resize", syncLegendPosition)

      return () => {
        window.removeEventListener("resize", syncLegendPosition)
        cursorMasters.forEach((tl) => tl.kill())
        loop.kill()
        gsap.set([ash, bubble, ...problems, ...voices], { clearProps: "all" })
        gsap.set(".problem-cursor", { clearProps: "all" })
        gsap.set(".solution-visual", { clearProps: "all" })
        gsap.set(".ash-working-skeleton", { clearProps: "all" })
        gsap.set(".problem-steps", { clearProps: "all" })
      }
    },
    { scope: fieldRef, dependencies: [reduceMotion, setBubbleText] },
  )

  return (
    <div
      ref={fieldRef}
      className="relative h-[min(66vw,41rem)] min-h-[35rem] overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgb(255_255_255/0.94),rgb(255_255_255/0.48)_45%,transparent_78%)]"
      role="region"
      aria-label="Interactive demonstration: Ash solves three business problems"
    >
      <div className="absolute inset-0 opacity-[0.17] [background-image:linear-gradient(90deg,rgb(10_10_10/0.1)_1px,transparent_1px),linear-gradient(0deg,rgb(10_10_10/0.1)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute left-[8%] top-[18%] h-48 w-48 rounded-full bg-[var(--color-drh-accent-orange)]/8 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-[8%] right-[10%] h-52 w-52 rounded-full bg-[var(--color-drh-accent-lime)]/9 blur-3xl" aria-hidden="true" />
      {PROBLEMS.map((problem, index) => (
        <ProblemArtifact key={problem.id} problem={problem} index={index} />
      ))}
      <AshDot refProp={ashRef} bubbleRef={bubbleRef} />
    </div>
  )
}