import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { SmoothScroll } from "@/components/SmoothScroll.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <SmoothScroll>
      <App />
    </SmoothScroll>
  </ThemeProvider>,
)
