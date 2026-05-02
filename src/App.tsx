import { useState } from "react"
import { AshLegend } from "./components/landing/AshFixes/AshDot"
import { DesignRevisionHero } from "./components/landing/DesignRevisionHero"
import { FooterSection } from "./components/landing/FooterSection"
import { HeroSection } from "./components/landing/HeroSection"
import { OneSystemFlow } from "./components/landing/one-system-flow/OneSystemFlow"
import { ManifestoSection } from "./components/landing/ManifestoSection"
import { SelectedWorks } from "./components/landing/SelectedWorks"
export function App() {
  const [isAshNavOpen, setIsAshNavOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <AshLegend
        fixed
        expanded={isAshNavOpen}
        onClick={() => setIsAshNavOpen((isOpen) => !isOpen)}
      />
      <nav
        id="ash-navigation"
        aria-label="Ash navigation"
        className={[
          "fixed left-5 top-[4.35rem] z-[99] w-[min(18rem,calc(100vw-2.5rem))] rounded-3xl border border-[var(--color-drh-ink)]/10 bg-white/82 p-3 shadow-[0_24px_70px_rgb(10_10_10/0.12)] backdrop-blur-xl transition-all duration-300",
          isAshNavOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        ].join(" ")}
      >
        {["Intro", "How it happens", "Work", "One system", "Footer"].map((item) => (
          <a
            key={item}
            href="#"
            className="block rounded-2xl px-4 py-3 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-drh-ink)]/62 transition hover:bg-[var(--color-drh-ink)]/5 hover:text-[var(--color-drh-ink)]"
            style={{ fontFamily: "var(--font-drh-body)", fontVariationSettings: '"opsz" 64, "wght" 560' }}
          >
            {item}
          </a>
        ))}
      </nav>
      <DesignRevisionHero />

      <ManifestoSection />
      <SelectedWorks />
      <HeroSection />

      <section className="border-t border-border">
        <OneSystemFlow />
      </section>

      {/* <FooterSection /> */}
    </div>
  )
}

export default App
