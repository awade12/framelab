import { useEffect, useState } from "react";

const STORAGE_KEY = "framelab-left-sidebar-collapsed";

export const useLeftSidebarCollapsed = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const toggle = () => setIsCollapsed((current) => !current);

  return { isCollapsed, setIsCollapsed, toggle };
};
