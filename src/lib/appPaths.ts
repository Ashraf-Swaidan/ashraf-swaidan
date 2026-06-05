const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "")

function isAppBasePath(path: string) {
  return Boolean(BASE_PATH && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)))
}

/** Pathname without the Vite base prefix (e.g. `/works/luxian`). */
export function getAppPathname(): string {
  const { pathname } = window.location

  if (isAppBasePath(pathname)) {
    return pathname.slice(BASE_PATH.length) || "/"
  }

  return pathname || "/"
}

/** Build an in-app URL that respects the deploy base path. */
export function appPath(path = "/"): string {
  if (path.startsWith("#")) {
    return `${import.meta.env.BASE_URL}${path}`
  }

  const normalized = path.startsWith("/") ? path : `/${path}`
  if (isAppBasePath(normalized)) {
    return normalized
  }

  if (normalized === "/") {
    return import.meta.env.BASE_URL
  }

  return `${import.meta.env.BASE_URL}${normalized.slice(1)}`
}
