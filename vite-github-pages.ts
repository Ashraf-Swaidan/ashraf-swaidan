import type { Plugin } from "vite"

/** Prefix root-absolute asset and route strings when deployed under a subpath. */
export function prefixAbsolutePathsPlugin(base: string): Plugin {
  if (base === "/") {
    return { name: "prefix-absolute-paths" }
  }

  const prefix = (path: string) => `${base}${path.slice(1)}`

  return {
    name: "prefix-absolute-paths",
    transform(code, id) {
      if (!/[/\\]src[/\\].*\.(t|j)sx?$/.test(id)) {
        return null
      }

      let next = code

      next = next.replace(/(["'`])\/assets\//g, (_, quote) => `${quote}${prefix("/assets/")}`)
      next = next.replace(/(["'`])\/fonts\//g, (_, quote) => `${quote}${prefix("/fonts/")}`)
      next = next.replace(/href="\/"/g, `href="${base}"`)
      next = next.replace(/href='\/'/g, `href='${base}'`)
      next = next.replace(
        /window\.location\.href\s*=\s*["']\/["']/g,
        `window.location.href = "${base}"`,
      )

      if (next === code) {
        return null
      }

      return { code: next, map: null }
    },
  }
}
