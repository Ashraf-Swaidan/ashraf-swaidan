export const NOTES_DEEP_LINK_EVENT = "footer-phone:notes-deep-link" as const

export type NotesDeepLinkDetail = {
  noteId: string
}

export function requestNotesDeepLink(detail: NotesDeepLinkDetail) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent<NotesDeepLinkDetail>(NOTES_DEEP_LINK_EVENT, { detail })
  )
}
