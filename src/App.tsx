import { OneSystemFlow } from "./components/landing/OneSystemFlow"
import { RopeUntangle } from "./components/landing/RopeUntangle"

function GalleryFrame({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-border py-10 last:border-b-0">
      <h2 className="mb-4 px-4 font-sans text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border px-4 py-5">
        <h1 className="font-sans text-lg font-semibold tracking-tight">Animation gallery</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Draft previews while iterating — static HTML in iframes, React below.
        </p>
      </header>

      <GalleryFrame title="Line problem solver (public HTML)">
        <iframe
          title="Line problem solver"
          src="/line_problem_solver.html"
          className="mx-auto block min-h-[420px] w-full max-w-3xl rounded-md border border-border bg-white"
        />
      </GalleryFrame>

      <GalleryFrame title="Noise to orchestra (public HTML)">
        <iframe
          title="Noise to orchestra"
          src="/noise_to_orchestra.html"
          className="mx-auto block min-h-[420px] w-full max-w-3xl rounded-md border border-border bg-white"
        />
      </GalleryFrame>

      <GalleryFrame title="Rope untangle (React + GSAP)">
        <RopeUntangle />
      </GalleryFrame>

      <GalleryFrame title="One system flow (React + GSAP)">
        <OneSystemFlow />
      </GalleryFrame>
    </div>
  )
}

export default App
