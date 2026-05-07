import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { AshErrorBoundary } from "@/components/AshErrorBoundary"
import { SmoothScroll } from "@/components/SmoothScroll.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { injectSelectedWorksVideoHints } from "@/lib/injectSelectedWorksVideoHints"

injectSelectedWorksVideoHints()

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AshErrorBoundary>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </AshErrorBoundary>
  </ThemeProvider>,
)
