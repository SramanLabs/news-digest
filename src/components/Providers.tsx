"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { NewsProvider } from "./NewsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("mba-digest-theme");
    if (savedTheme && ["paper", "sage", "alabaster", "dark"].includes(savedTheme)) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "paper");
    }
  }, []);

  return (
    <SessionProvider>
      <NewsProvider>
        {children}
      </NewsProvider>
    </SessionProvider>
  );
}
