import { HeroSection } from "./components/landing/HeroSection"
import { OneSystemFlow } from "./components/landing/one-system-flow/OneSystemFlow"

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <HeroSection />

      <section className="border-t border-border">
        <OneSystemFlow />
      </section>
    </div>
  )
}

export default App
