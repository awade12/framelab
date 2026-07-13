export function getCoverImageRect(
  imageWidth: number,
  imageHeight: number,
  destX: number,
  destY: number,
  destWidth: number,
  destHeight: number,
  zoom = 100,
  offsetX = 0,
  offsetY = 0,
) {
  const safeZoom = Math.max(100, zoom) / 100;
  const coverScale = Math.max(destWidth / imageWidth, destHeight / imageHeight);
  const drawWidth = imageWidth * coverScale * safeZoom;
  const drawHeight = imageHeight * coverScale * safeZoom;
  const maxOffsetX = Math.max(0, (drawWidth - destWidth) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - destHeight) / 2);
  const clampedOffsetX = Math.max(-50, Math.min(50, offsetX));
  const clampedOffsetY = Math.max(-50, Math.min(50, offsetY));

  return {
    x: destX + (destWidth - drawWidth) / 2 + (clampedOffsetX / 50) * maxOffsetX,
    y: destY + (destHeight - drawHeight) / 2 + (clampedOffsetY / 50) * maxOffsetY,
    width: drawWidth,
    height: drawHeight,
  };
}

export function getScreenImageStyle(
  zoom = 100,
  offsetX = 0,
  offsetY = 0,
): Record<string, string | number> {
  const safeZoom = Math.max(100, zoom) / 100;
  const clampedOffsetX = Math.max(-50, Math.min(50, offsetX));
  const clampedOffsetY = Math.max(-50, Math.min(50, offsetY));

  return {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${safeZoom}) translate(${clampedOffsetX}%, ${clampedOffsetY}%)`,
    transformOrigin: "center center",
  };
}
