import { SiteFooter } from "./components/SiteFooter"
import { DesignRevisionHero } from "./components/landing/DesignRevisionHero"
import { LandingBootGate } from "./components/landing/LandingBootGate"
import { LandingNav } from "./components/landing/LandingNav"
import { FooterSection } from "./components/landing/FooterSection"
import { ManifestoSection } from "./components/landing/ManifestoSection"
import { SelectedWorks } from "./components/landing/SelectedWorks"
import { AkPage } from "./pages/AkPage"
import { DuwitPage } from "./pages/DuwitPage"
import { PapionSystemPage } from "./pages/PapionSystemPage"
import { TwodoPage } from "./pages/TwodoPage"

export function App() {
  const path = window.location.pathname
  const isPapionPage = path === "/works/papion-system"
  const isDuwitPage = path === "/works/duwit"
  const isAkPage = path === "/works/ak-system"
  const isTwodoPage = path === "/works/twodo"

  if (isPapionPage) {
    return (
      <>
        <LandingNav />
        <PapionSystemPage />
        <SiteFooter />
      </>
    )
  }

  if (isDuwitPage) {
    return (
      <>
        <LandingNav />
        <DuwitPage />
        <SiteFooter />
      </>
    )
  }

  if (isAkPage) {
    return (
      <>
        <LandingNav />
        <AkPage />
        <SiteFooter />
      </>
    )
  }

  if (isTwodoPage) {
    return (
      <>
        <LandingNav />
        <TwodoPage />
        <SiteFooter />
      </>
    )
  }

  return (
    <LandingBootGate>
      <div className="min-h-svh bg-background text-foreground">
        <LandingNav />
        <DesignRevisionHero />

        <ManifestoSection />
        <SelectedWorks />
        <FooterSection />
        <SiteFooter />
      </div>
    </LandingBootGate>
  )
}

export default App
