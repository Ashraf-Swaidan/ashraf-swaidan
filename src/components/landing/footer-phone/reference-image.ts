export async function fileToReferenceDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const maxSide = 1024
  let w = bitmap.width
  let h = bitmap.height
  const scale = Math.min(1, maxSide / Math.max(w, h))
  w = Math.round(w * scale)
  h = Math.round(h * scale)
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    bitmap.close()
    throw new Error("Canvas unsupported")
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  return canvas.toDataURL("image/jpeg", 0.88)
}

export function clipboardItemsImageFile(items: DataTransferItemList): File | null {
  for (let i = 0; i < items.length; i += 1) {
    const it = items[i]
    if (!it || it.kind !== "file") continue
    const f = it.getAsFile()
    if (f && f.type.startsWith("image/")) return f
  }
  return null
}
