"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Article } from "@/types/article";
import { getLocalDateString } from "@/utils/date";
import { useSession } from "next-auth/react";

interface NewsContextType {
  selectedCategory: string;
  selectedDate: string;
  articles: Article[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  isFetchingNews: boolean;
  fetchStatus: string | null;
  handleCategoryChange: (cat: string) => void;
  handleDateChange: (date: string) => void;
  handleFetchNewsForDate: () => Promise<void>;
  loadMore: () => void;
  setScrollPosition: (pos: number) => void;
  scrollPosition: number;
  readArticleIds: Set<string>;
  markAsRead: (articleId: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFetchingNews, setIsFetchingNews] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);

  // Preserve scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  // Read status state
  const { data: session } = useSession();
  const [readArticleIds, setReadArticleIds] = useState<Set<string>>(new Set());

  // Fetch read articles when session loads
  useEffect(() => {
    const userEmail = session?.user?.email;
    if (userEmail) {
      const fetchReadStats = async () => {
        try {
          const res = await fetch(`/api/user/read-articles?email=${encodeURIComponent(userEmail)}`);
          if (res.ok) {
            const data = await res.json();
            setReadArticleIds(new Set(data.read_article_ids || []));
          }
        } catch (err) {
          console.error("Failed to fetch read articles", err);
        }
      };
      fetchReadStats();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReadArticleIds(new Set());
    }
  }, [session]);

  const markAsRead = async (articleId: string) => {
    if (!articleId || readArticleIds.has(articleId)) return;
    
    // Optimistic update
    setReadArticleIds(prev => {
      const newSet = new Set(prev);
      newSet.add(articleId);
      return newSet;
    });

    const userEmail = session?.user?.email;
    if (userEmail) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        await fetch(`${apiUrl}/api/user/read-article`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, article_id: articleId })
        });
      } catch (err) {
        console.error("Failed to mark article as read", err);
      }
    }
  };

  // Set initial date only once
  useEffect(() => {
    if (!selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDate(getLocalDateString(new Date()));
    }
  }, [selectedDate]);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(prev => {
      if (prev === cat) return prev;
      setPage(1);
      setArticles([]);
      setHasMore(true);
      setScrollPosition(0);
      return cat;
    });
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(prev => {
      if (prev === date) return prev;
      setPage(1);
      setArticles([]);
      setHasMore(true);
      setScrollPosition(0);
      return date;
    });
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isLoading]);

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
    <NewsContext.Provider
      value={{
        selectedCategory,
        selectedDate,
        articles,
        page,
        hasMore,
        isLoading,
        error,
        isFetchingNews,
        fetchStatus,
        handleCategoryChange,
        handleDateChange,
        handleFetchNewsForDate,
        loadMore,
        setScrollPosition,
        scrollPosition,
        readArticleIds,
        markAsRead
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
}
