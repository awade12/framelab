import type { Screenshot } from "../types";

export type SnapGuide = {
  orientation: "vertical" | "horizontal";
  position: number;
  kind: "align" | "spacing" | "edge";
  label?: string;
  span?: { from: number; to: number };
};

export type DragElementRef = {
  type: "headline" | "subheadline" | "image" | "device";
  id?: string;
};

export type SnapResult = {
  x: number;
  y: number;
  guides: SnapGuide[];
};

export const APP_STORE_SAFE_AREA = {
  top: 14,
  bottom: 88,
  left: 6,
  right: 94,
} as const;

export const RULE_OF_THIRDS_LINES = {
  x: [33.333, 66.667],
  y: [33.333, 66.667],
} as const;

export const GOLDEN_RATIO_LINES = {
  x: [38.2, 61.8],
  y: [38.2, 61.8],
} as const;

const CANVAS_X_TARGETS = [50, 33.333, 66.667, 25, 75, 10, 90, ...GOLDEN_RATIO_LINES.x];
const CANVAS_Y_TARGETS = [50, 33.333, 66.667, 25, 75, 12, 88, ...GOLDEN_RATIO_LINES.y];

const isSameElement = (a: DragElementRef, b: DragElementRef) =>
  a.type === b.type && a.id === b.id;

type AxisPoints = {
  values: number[];
  spacingPairs: { a: number; b: number; midpoint: number }[];
};

const buildAxisPoints = (values: number[]): AxisPoints => {
  const unique = [...new Set(values)];
  const spacingPairs: { a: number; b: number; midpoint: number }[] = [];

  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const a = unique[i];
      const b = unique[j];
      spacingPairs.push({ a, b, midpoint: (a + b) / 2 });
    }
  }

  return { values: unique, spacingPairs };
};

const collectElementPoints = (
  screenshot: Screenshot,
  exclude: DragElementRef,
) => {
  const xValues: number[] = [];
  const yValues: number[] = [];

  const pushPoint = (x: number, y: number) => {
    xValues.push(x);
    yValues.push(y);
  };

  if (!isSameElement(exclude, { type: "headline" })) {
    pushPoint(screenshot.headlineX, screenshot.headlineY);
  }

  if (!isSameElement(exclude, { type: "subheadline" })) {
    pushPoint(screenshot.subheadlineX, screenshot.subheadlineY);
  }

  for (const device of screenshot.devices) {
    if (isSameElement(exclude, { type: "device", id: device.id })) continue;
    const half = device.scale / 2;
    xValues.push(device.x, device.x - half, device.x + half);
    yValues.push(device.y);
  }

  for (const image of screenshot.overlayImages) {
    if (isSameElement(exclude, { type: "image", id: image.id })) continue;
    const halfW = image.width / 2;
    const halfH = image.height / 2;
    xValues.push(image.x, image.x - halfW, image.x + halfW);
    yValues.push(image.y, image.y - halfH, image.y + halfH);
  }

  return {
    x: buildAxisPoints(xValues),
    y: buildAxisPoints(yValues),
  };
};

export const collectAlignmentTargets = (
  screenshot: Screenshot,
  exclude: DragElementRef,
) => {
  const points = collectElementPoints(screenshot, exclude);

  const xTargets = new Set<number>([...CANVAS_X_TARGETS, ...points.x.values]);
  const yTargets = new Set<number>([...CANVAS_Y_TARGETS, ...points.y.values]);

  for (const pair of points.x.spacingPairs) xTargets.add(pair.midpoint);
  for (const pair of points.y.spacingPairs) yTargets.add(pair.midpoint);

  return {
    xTargets: [...xTargets],
    yTargets: [...yTargets],
    xSpacingPairs: points.x.spacingPairs,
    ySpacingPairs: points.y.spacingPairs,
  };
};

const snapAxis = (
  value: number,
  targets: number[],
  threshold: number,
): { value: number; guide: number | null; distance: number | null } => {
  let best: { value: number; guide: number; distance: number } | null = null;

  for (const target of targets) {
    const distance = Math.abs(value - target);
    if (distance <= threshold && (!best || distance < best.distance)) {
      best = { value: target, guide: target, distance };
    }
  }

  return best ?? { value, guide: null, distance: null };
};

const findSpacingPair = (
  midpoint: number,
  pairs: { a: number; b: number; midpoint: number }[],
) => pairs.find((pair) => Math.abs(pair.midpoint - midpoint) < 0.01);

const formatGap = (a: number, b: number) =>
  `${Math.abs(b - a).toFixed(1)}%`;

export const snapDragPosition = (
  x: number,
  y: number,
  targets: {
    xTargets: number[];
    yTargets: number[];
    xSpacingPairs: { a: number; b: number; midpoint: number }[];
    ySpacingPairs: { a: number; b: number; midpoint: number }[];
  },
  threshold: number,
): SnapResult => {
  const snappedX = snapAxis(x, targets.xTargets, threshold);
  const snappedY = snapAxis(y, targets.yTargets, threshold);
  const guides: SnapGuide[] = [];

  if (snappedX.guide !== null) {
    const spacing = findSpacingPair(snappedX.guide, targets.xSpacingPairs);
    if (spacing && !CANVAS_X_TARGETS.includes(spacing.midpoint)) {
      guides.push({
        orientation: "vertical",
        position: snappedX.guide,
        kind: "spacing",
        label: `↔ ${formatGap(spacing.a, spacing.b)}`,
        span: { from: spacing.a, to: spacing.b },
      });
    } else {
      guides.push({
        orientation: "vertical",
        position: snappedX.guide,
        kind: CANVAS_X_TARGETS.includes(snappedX.guide) ? "align" : "edge",
        label: snappedX.guide === 50 ? "center" : undefined,
      });
    }
  }

  if (snappedY.guide !== null) {
    const spacing = findSpacingPair(snappedY.guide, targets.ySpacingPairs);
    if (spacing && !CANVAS_Y_TARGETS.includes(spacing.midpoint)) {
      guides.push({
        orientation: "horizontal",
        position: snappedY.guide,
        kind: "spacing",
        label: `↕ ${formatGap(spacing.a, spacing.b)}`,
        span: { from: spacing.a, to: spacing.b },
      });
    } else {
      guides.push({
        orientation: "horizontal",
        position: snappedY.guide,
        kind: CANVAS_Y_TARGETS.includes(snappedY.guide) ? "align" : "edge",
        label: snappedY.guide === 50 ? "center" : undefined,
      });
    }
  }

  return {
    x: snappedX.value,
    y: snappedY.value,
    guides,
  };
};

export const getSnapThresholdPercent = (width: number, height: number) => ({
  x: width > 0 ? (8 / width) * 100 : 1.5,
  y: height > 0 ? (8 / height) * 100 : 1.5,
});

export const getNearestElementDistances = (
  x: number,
  y: number,
  screenshot: Screenshot,
  exclude: DragElementRef,
) => {
  const points = collectElementPoints(screenshot, exclude);
  const nearestX = points.x.values.reduce<{ value: number; dist: number } | null>(
    (best, value) => {
      const dist = Math.abs(value - x);
      return !best || dist < best.dist ? { value, dist } : best;
    },
    null,
  );
  const nearestY = points.y.values.reduce<{ value: number; dist: number } | null>(
    (best, value) => {
      const dist = Math.abs(value - y);
      return !best || dist < best.dist ? { value, dist } : best;
    },
    null,
  );

  return { nearestX, nearestY };
};
