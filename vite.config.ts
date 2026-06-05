import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { prefixAbsolutePathsPlugin } from "./vite-github-pages"

const REPO_BASE = "/ashraf-swaidan/"
const base = process.env.GITHUB_PAGES === "true" ? REPO_BASE : "/"

// https://vite.dev/config/
export default defineConfig({
  base,
  envPrefix: ["VITE_", "POLLINATIONS_"],
  plugins: [react(), tailwindcss(), prefixAbsolutePathsPlugin(base)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
