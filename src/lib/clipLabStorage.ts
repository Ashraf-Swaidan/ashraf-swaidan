const DB_NAME = "ash-clip-lab"
const DB_VERSION = 1
const STORE_NAME = "clips"

export const CLIP_LAB_HISTORY_CAP = 12

export type StoredClipLabRecord = {
  id: string
  scene: string
  styleLabel: string
  createdAt: number
  blob: Blob
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"))
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("createdAt", "createdAt", { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
  })
}

function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode)
        const store = tx.objectStore(STORE_NAME)
        const request = run(store)
        request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"))
        request.onsuccess = () => resolve(request.result as T)
        tx.oncomplete = () => db.close()
        tx.onerror = () => {
          db.close()
          reject(tx.error ?? new Error("IndexedDB transaction failed"))
        }
      })
  )
}

export async function listClipLabClips(): Promise<StoredClipLabRecord[]> {
  const rows = await withStore("readonly", (store) => store.getAll())
  return rows
    .filter(
      (row): row is StoredClipLabRecord =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as StoredClipLabRecord).id === "string" &&
        (row as StoredClipLabRecord).blob instanceof Blob
    )
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveClipLabClip(clip: StoredClipLabRecord): Promise<string[]> {
  await withStore("readwrite", (store) => store.put(clip))
  const all = await listClipLabClips()
  const overflow = all.slice(CLIP_LAB_HISTORY_CAP)
  for (const row of overflow) {
    await withStore("readwrite", (store) => store.delete(row.id))
  }
  return overflow.map((row) => row.id)
}

export async function deleteClipLabClip(id: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(id))
}

export async function clearClipLabClips(): Promise<void> {
  await withStore("readwrite", (store) => store.clear())
}

/** Fetch remote or blob URLs into a single Blob for IndexedDB. */
export async function resolveClipBlob(
  objectUrl: string,
  mimeType = "video/mp4"
): Promise<Blob> {
  const response = await fetch(objectUrl)
  const blob = await response.blob()
  if (blob.type || !mimeType) return blob
  return new Blob([blob], { type: mimeType })
}
