"use client";

import { SessionProvider } from "next-auth/react";
import { NewsProvider } from "./NewsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NewsProvider>
        {children}
      </NewsProvider>
    </SessionProvider>
  );
}
