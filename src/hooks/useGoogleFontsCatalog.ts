import { useCallback, useEffect, useState } from "react";
import {
  fetchGoogleFontsCatalog,
  popularFonts,
  type FontConfig,
} from "../lib/google-fonts";

export const useGoogleFontsCatalog = (isOpen: boolean) => {
  const [fonts, setFonts] = useState<FontConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const catalog = await fetchGoogleFontsCatalog();
      setFonts(catalog);
    } catch {
      setFonts(popularFonts);
      setError("Could not load full catalog. Showing popular fonts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || fonts.length > 0) return;
    void loadCatalog();
  }, [fonts.length, isOpen, loadCatalog]);

  return {
    fonts: fonts.length > 0 ? fonts : popularFonts,
    isLoading,
    error,
    retry: loadCatalog,
  };
};
