export type GuideSettings = {
  showSafeArea: boolean;
  showThirds: boolean;
  showGoldenRatio: boolean;
};

export const DEFAULT_GUIDE_SETTINGS: GuideSettings = {
  showSafeArea: false,
  showThirds: false,
  showGoldenRatio: false,
};

const STORAGE_KEY = "framelab-guide-settings";

export const loadGuideSettings = (): GuideSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_GUIDE_SETTINGS;
    const parsed = JSON.parse(stored) as Partial<GuideSettings>;
    return {
      showSafeArea: parsed.showSafeArea ?? DEFAULT_GUIDE_SETTINGS.showSafeArea,
      showThirds: parsed.showThirds ?? DEFAULT_GUIDE_SETTINGS.showThirds,
      showGoldenRatio:
        parsed.showGoldenRatio ?? DEFAULT_GUIDE_SETTINGS.showGoldenRatio,
    };
  } catch {
    return DEFAULT_GUIDE_SETTINGS;
  }
};

export const saveGuideSettings = (settings: GuideSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
