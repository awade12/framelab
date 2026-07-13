import { useEffect, useRef, useState } from "react";
import { isFontLoaded, loadFontFamily } from "../lib/google-fonts";

export const useLazyFont = (family: string, weights: string[]) => {
  const [isLoaded, setIsLoaded] = useState(() => isFontLoaded(family));
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsLoaded(isFontLoaded(family));
  }, [family]);

  useEffect(() => {
    if (isLoaded || !ref.current) return;

    const element = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        void loadFontFamily(family, weights).then(() => setIsLoaded(true));
      },
      { rootMargin: "120px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [family, isLoaded, weights]);

  return { ref, isLoaded };
};
