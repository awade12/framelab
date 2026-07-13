import { getScreenImageStyle } from "../../lib/screen-image";

interface ScreenContentProps {
  screenshotSrc: string | null;
  screenZoom?: number;
  screenOffsetX?: number;
  screenOffsetY?: number;
}

export const ScreenContent = ({
  screenshotSrc,
  screenZoom = 100,
  screenOffsetX = 0,
  screenOffsetY = 0,
}: ScreenContentProps) => {
  if (screenshotSrc) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#1c1c1e]">
        <img
          src={screenshotSrc}
          alt="Screenshot"
          className="pointer-events-none select-none"
          draggable={false}
          style={getScreenImageStyle(screenZoom, screenOffsetX, screenOffsetY)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#1c1c1e]">
      <span className="text-[10px] text-gray-600">No image</span>
    </div>
  );
};
