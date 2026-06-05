import { SiteFooter } from "@/components/SiteFooter"
import { CreativeRangeSection } from "@/components/landing/CreativeRangeSection"
import { DesignRevisionHero } from "@/components/landing/DesignRevisionHero"
import { LandingBootGate } from "@/components/landing/LandingBootGate"
import { LandingNav } from "@/components/landing/LandingNav"
import { FooterSection } from "@/components/landing/FooterSection"
import { ManifestoSection } from "@/components/landing/ManifestoSection"
import { SelectedWorks } from "@/components/landing/SelectedWorks"

export function HomePage() {
  return (
    <LandingBootGate>
      <div className="min-h-svh bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)]">
        <LandingNav />
        <DesignRevisionHero />

        <ManifestoSection />
        <SelectedWorks />
        <CreativeRangeSection />
        <FooterSection />
        <SiteFooter />
      </div>
    </LandingBootGate>
  )
}

export default HomePage
