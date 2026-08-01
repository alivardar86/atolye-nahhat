// Client-only: resizes an image to fit within maxDim on its longest edge and
// re-encodes it as JPEG, per CLAUDE.md's "resize client-side before upload,
// max 1600px" rule. Only ever called from a browser event handler.
export async function resizeImage(
  file: File,
  maxDim = 1600,
  quality = 0.85
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas desteklenmiyor.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Sıkıştırma başarısız."))),
      "image/jpeg",
      quality
    );
  });
}
