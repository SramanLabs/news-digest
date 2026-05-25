"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import DateSelector from "@/components/DateSelector";
import NewsCard from "@/components/NewsCard";
import AIAssistant from "@/components/AIAssistant";
import { Article } from "@/types/article";
import { getLocalDateString, formatLocalDate } from "@/utils/date";

type Theme = "paper" | "sage" | "alabaster" | "dark";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [theme, setTheme] = useState<Theme>("paper");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // AI curation fetching state
  const [isFetchingNews, setIsFetchingNews] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    setArticles([]);
    setHasMore(true);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setPage(1);
    setArticles([]);
    setHasMore(true);
  };

  const handleFetchNewsForDate = async () => {
    setIsFetchingNews(true);
    setError(null);
    setFetchStatus("Triggering Gemini API News Pipeline...");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/news/trigger-fetch?date=${selectedDate}`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Failed to trigger news pipeline");
      
      setFetchStatus("Fetching RSS feeds & running Gemini MBA Curation (~20 seconds)...");
      
      // Poll every 5 seconds until articles show up
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const checkUrl = new URL(`${apiUrl}/api/news`);
          checkUrl.searchParams.append("date", selectedDate);
          checkUrl.searchParams.append("limit", "1");
          const checkRes = await fetch(checkUrl.toString());
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            if (checkData.articles && checkData.articles.length > 0) {
              clearInterval(interval);
              setIsFetchingNews(false);
              setFetchStatus(null);
              // Force reload page
              setPage(1);
              setArticles([]);
              setHasMore(true);
              const dateCopy = selectedDate;
              setSelectedDate("");
              setTimeout(() => setSelectedDate(dateCopy), 10);
            }
          }
        } catch (err) {
          console.error("Error polling database:", err);
        }
        
        if (attempts > 12) { // Max 1 minute polling
          clearInterval(interval);
          setIsFetchingNews(false);
          setFetchStatus(null);
          setError("Fetching took longer than expected. Please check again in a bit.");
        }
      }, 5000);
      
    } catch (err) {
      console.error("Fetch pipeline trigger failed:", err);
      setError("Failed to start news fetching pipeline.");
      setIsFetchingNews(false);
      setFetchStatus(null);
    }
  };

  useEffect(() => {
    if (!selectedDate) return;

    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const url = new URL(`${apiUrl}/api/news`);
        url.searchParams.append("date", selectedDate);
        if (selectedCategory !== "All") {
          url.searchParams.append("category", selectedCategory);
        }
        url.searchParams.append("skip", ((page - 1) * 20).toString());
        url.searchParams.append("limit", "20");

        const res = await fetch(url.toString());
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        
        const data = await res.json();
        const newArticles = data.articles || [];
        setArticles(prev => page === 1 ? newArticles : [...prev, ...newArticles]);
        setHasMore(newArticles.length === 20);
      } catch (err: unknown) {
        console.error("Error fetching news:", err);
        setError("Failed to load news articles. Please try again later.");
        if (page === 1) setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedDate, selectedCategory, page]);

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
                  onSelectDate={handleDateChange}
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
            onSelectCategory={handleCategoryChange}
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

        {!isMounted || !selectedDate || (isLoading && page === 1) ? (
          <ArticlesSkeleton />
        ) : error && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center text-red-500">
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Error Loading News</h3>
            <p className="max-w-md font-medium">{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {articles.map((article, index) => {
                if (articles.length === index + 1) {
                  return (
                    <div ref={lastArticleElementRef} key={`${article.id}-${index}`} className="h-full flex flex-col">
                      <NewsCard article={article} />
                    </div>
                  );
                } else {
                  return (
                    <div key={`${article.id}-${index}`} className="h-full flex flex-col">
                      <NewsCard article={article} />
                    </div>
                  );
                }
              })}
            </div>
            {isLoading && page > 1 && (
              <div className="mt-12">
                <ArticlesSkeleton />
              </div>
            )}
          </>
        ) : isFetchingNews ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-pulse">
            <div className="w-12 h-12 border-4 border-t-theme-accent border-theme-border rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-theme-fg">AI Curation in Progress</h3>
            <p className="text-theme-muted max-w-md font-medium text-sm">
              {fetchStatus}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-theme-fg">No stories found</h3>
            <p className="text-theme-muted max-w-md font-medium mb-8">
              We couldn&apos;t find any news articles for {selectedCategory} on this date.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleFetchNewsForDate}
                className="px-6 py-3 bg-theme-accent text-theme-bg border border-theme-accent hover:bg-transparent hover:text-theme-accent font-bold text-sm uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-theme-fg/5"
              >
                Fetch & Curate news with AI
              </button>
              <button
                onClick={() => {
                  handleCategoryChange("All");
                  handleDateChange(getLocalDateString(new Date()));
                }}
                className="px-6 py-3 border border-theme-border hover:border-theme-fg font-semibold text-sm uppercase tracking-widest transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col justify-between py-2 border-b border-theme-border pb-6 animate-pulse">
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
