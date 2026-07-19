import type { SnapGuide } from "../../lib/alignment-snapping";
import {
  APP_STORE_SAFE_AREA,
  GOLDEN_RATIO_LINES,
  RULE_OF_THIRDS_LINES,
} from "../../lib/alignment-snapping";

interface AlignmentGuidesProps {
  guides: SnapGuide[];
  showThirds?: boolean;
  showGoldenRatio?: boolean;
  showSafeArea?: boolean;
}

export const AlignmentGuides = ({
  guides,
  showThirds = false,
  showGoldenRatio = false,
  showSafeArea = false,
}: AlignmentGuidesProps) => (
  <div className="pointer-events-none absolute inset-0 z-[300]">
    {showSafeArea && (
      <div
        className="absolute rounded-lg border border-dashed border-amber-400/25"
        style={{
          top: `${APP_STORE_SAFE_AREA.top}%`,
          bottom: `${100 - APP_STORE_SAFE_AREA.bottom}%`,
          left: `${APP_STORE_SAFE_AREA.left}%`,
          right: `${100 - APP_STORE_SAFE_AREA.right}%`,
        }}
      >
        <span className="absolute -top-4 left-0 text-[9px] font-medium uppercase tracking-wider text-amber-400/50">
          Safe area
        </span>
      </div>
    )}

    {showThirds && (
      <>
        {RULE_OF_THIRDS_LINES.x.map((position) => (
          <div
            key={`grid-x-${position}`}
            className="absolute top-0 bottom-0 w-px bg-white/10"
            style={{ left: `${position}%` }}
          />
        ))}
        {RULE_OF_THIRDS_LINES.y.map((position) => (
          <div
            key={`grid-y-${position}`}
            className="absolute left-0 right-0 h-px bg-white/10"
            style={{ top: `${position}%` }}
          />
        ))}
      </>
    )}

    {showGoldenRatio && (
      <>
        {GOLDEN_RATIO_LINES.x.map((position) => (
          <div
            key={`phi-x-${position}`}
            className="absolute top-0 bottom-0 w-px bg-violet-400/15"
            style={{ left: `${position}%` }}
          />
        ))}
        {GOLDEN_RATIO_LINES.y.map((position) => (
          <div
            key={`phi-y-${position}`}
            className="absolute left-0 right-0 h-px bg-violet-400/15"
            style={{ top: `${position}%` }}
          />
        ))}
      </>
    )}

    {(showThirds || showGoldenRatio) && (
      <>
        <div
          className="absolute top-0 bottom-0 w-px bg-white/15"
          style={{ left: "50%" }}
        />
        <div
          className="absolute left-0 right-0 h-px bg-white/15"
          style={{ top: "50%" }}
        />
      </>
    )}

    {guides.map((guide, index) => {
      if (guide.kind === "spacing" && guide.span) {
        const from = Math.min(guide.span.from, guide.span.to);
        const to = Math.max(guide.span.from, guide.span.to);
        const mid = guide.position;

        if (guide.orientation === "vertical") {
          return (
            <div key={`spacing-${index}`}>
              <div
                className="absolute w-px bg-cyan-400/80"
                style={{ left: `${from}%`, top: "42%", bottom: "42%" }}
              />
              <div
                className="absolute w-px bg-cyan-400/80"
                style={{ left: `${to}%`, top: "42%", bottom: "42%" }}
              />
              <div
                className="absolute h-px bg-cyan-400/60"
                style={{
                  left: `${from}%`,
                  width: `${to - from}%`,
                  top: "50%",
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded bg-cyan-500/90 px-1.5 py-0.5 text-[9px] font-semibold tabular-nums text-black"
                style={{ left: `${mid}%`, transform: "translate(-50%, -50%)" }}
              >
                {guide.label ?? "equal"}
              </div>
            </div>
          );
        }

        return (
          <div key={`spacing-${index}`}>
            <div
              className="absolute h-px bg-cyan-400/80"
              style={{ top: `${from}%`, left: "42%", right: "42%" }}
            />
            <div
              className="absolute h-px bg-cyan-400/80"
              style={{ top: `${to}%`, left: "42%", right: "42%" }}
            />
            <div
              className="absolute w-px bg-cyan-400/60"
              style={{
                top: `${from}%`,
                height: `${to - from}%`,
                left: "50%",
              }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded bg-cyan-500/90 px-1.5 py-0.5 text-[9px] font-semibold tabular-nums text-black"
              style={{ top: `${mid}%`, transform: "translate(-50%, -50%)" }}
            >
              {guide.label ?? "equal"}
            </div>
          </div>
        );
      }

      if (guide.orientation === "vertical") {
        return (
          <div key={`guide-v-${guide.position}-${index}`}>
            <div
              className="absolute top-0 bottom-0 w-px bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.8)]"
              style={{ left: `${guide.position}%` }}
            />
            {guide.label && (
              <div
                className="absolute top-2 rounded bg-fuchsia-500/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black"
                style={{ left: `${guide.position}%`, transform: "translateX(-50%)" }}
              >
                {guide.label}
              </div>
            )}
          </div>
        );
      }

      return (
        <div key={`guide-h-${guide.position}-${index}`}>
          <div
            className="absolute left-0 right-0 h-px bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.8)]"
            style={{ top: `${guide.position}%` }}
          />
          {guide.label && (
            <div
              className="absolute left-2 rounded bg-fuchsia-500/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black"
              style={{ top: `${guide.position}%`, transform: "translateY(-50%)" }}
            >
              {guide.label}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
