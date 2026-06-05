import { lazy, Suspense, type ReactNode } from "react"

import { SiteFooter } from "./components/SiteFooter"
import { LandingNav } from "./components/landing/LandingNav"
import { getAppPathname } from "@/lib/appPaths"

const HomePage = lazy(() => import("./pages/HomePage"))
const PapionSystemPage = lazy(() =>
  import("./pages/PapionSystemPage").then(({ PapionSystemPage }) => ({
    default: PapionSystemPage,
  }))
)
const DuwitPage = lazy(() =>
  import("./pages/DuwitPage").then(({ DuwitPage }) => ({ default: DuwitPage }))
)
const AkPage = lazy(() =>
  import("./pages/AkPage").then(({ AkPage }) => ({ default: AkPage }))
)
const TwodoPage = lazy(() =>
  import("./pages/TwodoPage").then(({ TwodoPage }) => ({ default: TwodoPage }))
)
const LuxianPage = lazy(() =>
  import("./pages/LuxianPage").then(({ LuxianPage }) => ({ default: LuxianPage }))
)
const SmartarPage = lazy(() =>
  import("./pages/SmartarPage").then(({ SmartarPage }) => ({
    default: SmartarPage,
  }))
)

function RouteFallback() {
  return (
    <div
      className="grid min-h-svh place-items-center bg-(--color-drh-bg) px-6 text-center text-(--color-drh-ink)"
      role="status"
    >
      <span className="text-[0.68rem] font-semibold tracking-[0.38em] uppercase opacity-45">
        Loading
      </span>
    </div>
  )
}

function CaseStudyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingNav />
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
      <SiteFooter />
    </>
  )
}

export function App() {
  const path = getAppPathname()
  const isPapionPage = path === "/works/papion-system"
  const isDuwitPage = path === "/works/duwit"
  const isAkPage = path === "/works/ak-system"
  const isTwodoPage = path === "/works/twodo"
  const isLuxianPage = path === "/works/luxian"
  const isSmartarPage = path === "/works/smartar"

  if (isPapionPage) {
    return (
      <CaseStudyShell>
        <PapionSystemPage />
      </CaseStudyShell>
    )
  }

  if (isDuwitPage) {
    return (
      <CaseStudyShell>
        <DuwitPage />
      </CaseStudyShell>
    )
  }

  if (isAkPage) {
    return (
      <CaseStudyShell>
        <AkPage />
      </CaseStudyShell>
    )
  }

  if (isTwodoPage) {
    return (
      <CaseStudyShell>
        <TwodoPage />
      </CaseStudyShell>
    )
  }

  if (isLuxianPage) {
    return (
      <CaseStudyShell>
        <LuxianPage />
      </CaseStudyShell>
    )
  }

  if (isSmartarPage) {
    return (
      <CaseStudyShell>
        <SmartarPage />
      </CaseStudyShell>
    )
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <HomePage />
    </Suspense>
  )
}

export default App
