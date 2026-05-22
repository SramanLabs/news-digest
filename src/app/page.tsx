"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import DateSelector from "@/components/DateSelector";
import NewsCard from "@/components/NewsCard";
import AIAssistant from "@/components/AIAssistant";
import { mockArticles } from "@/data/mockData";
import { getLocalDateString, formatLocalDate } from "@/utils/date";

type Theme = "paper" | "sage" | "alabaster" | "dark";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [theme, setTheme] = useState<Theme>("paper");

  useEffect(() => {
    setIsMounted(true);
    setSelectedDate(getLocalDateString(new Date()));

    // Load theme from localStorage on client side mount
    const savedTheme = localStorage.getItem("mba-digest-theme") as Theme | null;
    if (savedTheme && ["paper", "sage", "alabaster", "dark"].includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "paper");
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("mba-digest-theme", newTheme);
  };

  const filteredArticles = useMemo(() => {
    if (!selectedDate) return [];
    return mockArticles.filter((article) => {
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const matchesDate = article.published_date === selectedDate;
      return matchesCategory && matchesDate;
    });
  }, [selectedCategory, selectedDate]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-fg font-sans selection:bg-theme-selection-bg transition-colors duration-300">

      {/* Minimal Header */}
      <header className="sticky top-0 z-30 bg-theme-bg/95 backdrop-blur-md border-b border-theme-border/80 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-theme-fg uppercase mb-1">NEWS Digest</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2.5">
                <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">The Daily Brief</span>
                <span className="w-1.5 h-1.5 rounded-full bg-theme-border"></span>

                {/* Elegant Swatch Theme Selector */}
                <div className="flex items-center gap-2.5 bg-theme-card-bg/90 border border-theme-border/60 py-1 px-2.5 rounded-full shadow-sm">
                  <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest mr-1">Theme:</span>
                  <button
                    onClick={() => handleThemeChange("paper")}
                    className={`w-3.5 h-3.5 rounded-full bg-[#F9F7F1] border transition-all hover:scale-125 cursor-pointer relative group ${theme === "paper" ? "border-amber-700 ring-2 ring-amber-700/30 scale-110" : "border-stone-300"
                      }`}
                    title="Calm Paper (Warm Cream)"
                    aria-label="Switch to Calm Paper theme"
                  >
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-theme-fg text-theme-bg text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      Calm Paper
                    </span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("sage")}
                    className={`w-3.5 h-3.5 rounded-full bg-[#F2F5F0] border transition-all hover:scale-125 cursor-pointer relative group ${theme === "sage" ? "border-emerald-700 ring-2 ring-emerald-700/30 scale-110" : "border-stone-300"
                      }`}
                    title="Classic Sage (Tea Green)"
                    aria-label="Switch to Classic Sage theme"
                  >
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-theme-fg text-theme-bg text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      Classic Sage
                    </span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("alabaster")}
                    className={`w-3.5 h-3.5 rounded-full bg-[#F5F3EE] border transition-all hover:scale-125 cursor-pointer relative group ${theme === "alabaster" ? "border-amber-950 ring-2 ring-amber-950/30 scale-110" : "border-stone-300"
                      }`}
                    title="Muted Alabaster (Sand)"
                    aria-label="Switch to Muted Alabaster theme"
                  >
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-theme-fg text-theme-bg text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      Muted Alabaster
                    </span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`w-3.5 h-3.5 rounded-full bg-[#0D0D0C] border transition-all hover:scale-125 cursor-pointer relative group ${theme === "dark" ? "border-stone-200 ring-2 ring-stone-200/30 scale-110" : "border-stone-700"
                      }`}
                    title="Deep Charcoal (Dark)"
                    aria-label="Switch to Deep Charcoal theme"
                  >
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-theme-fg text-theme-bg text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      Deep Charcoal
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {isMounted && selectedDate ? (
                <DateSelector
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              ) : (
                <div className="flex gap-4 overflow-x-auto py-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="w-20 h-8 bg-theme-border/60 rounded-full animate-pulse"></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-12 border-b border-theme-fg pb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-theme-fg">
            {selectedCategory === "All" ? "Today's Top Stories" : `${selectedCategory} News`}
          </h2>
          <p className="text-theme-muted mt-2 text-sm font-semibold uppercase tracking-wider">
            {isMounted && selectedDate ? (
              formatLocalDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
            ) : (
              <span className="inline-block w-48 h-4 bg-theme-border/60 rounded animate-pulse"></span>
            )}
          </p>
        </div>

        {!isMounted || !selectedDate ? (
          <ArticlesSkeleton />
        ) : filteredArticles.length > 0 ? (
          <div className="columns-1 md:columns-2 gap-12 space-y-12">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-theme-fg">No stories found</h3>
            <p className="text-theme-muted max-w-md font-medium">
              We couldn't find any news articles for {selectedCategory} on this date.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDate(getLocalDateString(new Date()));
              }}
              className="mt-8 px-6 py-3 border border-theme-accent hover:bg-theme-accent hover:text-theme-bg font-semibold text-sm uppercase tracking-widest transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  );
}

function ArticlesSkeleton() {
  return (
    <div className="columns-1 md:columns-2 gap-12 space-y-12">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="break-inside-avoid flex flex-col justify-between py-2 border-b border-theme-border pb-6 animate-pulse">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-3.5 bg-theme-border/70 rounded"></div>
              <span className="w-1 h-1 rounded-full bg-theme-border"></span>
              <div className="w-24 h-3.5 bg-theme-border/70 rounded"></div>
            </div>
            <div className="w-full h-8 bg-theme-border/70 rounded mb-3"></div>
            <div className="w-3/4 h-8 bg-theme-border/70 rounded mb-6"></div>
            <div className="w-full h-4 bg-theme-border/70 rounded mb-2"></div>
            <div className="w-5/6 h-4 bg-theme-border/70 rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-theme-border/70 rounded mb-6"></div>
          </div>
          <div className="w-32 h-4 bg-theme-border/70 rounded mt-4"></div>
        </div>
      ))}
    </div>
  );
}
