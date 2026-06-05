const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "")

/** Pathname without the Vite base prefix (e.g. `/works/luxian`). */
export function getAppPathname(): string {
  const { pathname } = window.location

  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || "/"
  }

  return pathname || "/"
}

/** Build an in-app URL that respects the deploy base path. */
export function appPath(path = "/"): string {
  if (path.startsWith("#")) {
    return `${import.meta.env.BASE_URL}${path.slice(1)}`
  }

  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") {
    return import.meta.env.BASE_URL
  }

  return `${import.meta.env.BASE_URL}${normalized.slice(1)}`
}
