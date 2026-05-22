"use client";

import { useState } from "react";
import { Bot, Languages, X, Sparkles, Send, BookOpen } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"define" | "translate">("define");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("Hindi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentQuery = query.trim();
    setLoading(true);
    setResponse("");
    setQuery(""); // Clear the input box immediately!

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (mode === "define") {
        setResponse(
          `"${currentQuery}" is a key concept. In a real-world scenario, the AI would provide a comprehensive, MBA-tailored definition and business context for this term here.`
        );
      } else {
        setResponse(
          `Translation of "${currentQuery}" in ${targetLanguage}: [Mock ${targetLanguage} Translation]. The AI translator would output the exact meaning in your preferred language.`
        );
      }
    }, 1200);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-theme-accent text-theme-bg rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50 group border border-theme-border/20 cursor-pointer"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[360px] bg-theme-card-bg border border-theme-border shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-theme-border/60 bg-theme-border/20 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-extrabold text-xs uppercase tracking-widest text-theme-fg">Reading Assistant</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-theme-muted hover:text-theme-fg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-theme-border/60 transition-colors duration-300">
        <button
          onClick={() => { setMode("define"); setResponse(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            mode === "define" 
              ? "text-theme-fg border-b-2 border-theme-fg" 
              : "text-theme-muted hover:text-theme-fg"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Meaning
        </button>
        <button
          onClick={() => { setMode("translate"); setResponse(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            mode === "translate" 
              ? "text-theme-fg border-b-2 border-theme-fg" 
              : "text-theme-muted hover:text-theme-fg"
          }`}
        >
          <Languages className="w-4 h-4" />
          Translate
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 min-h-[200px] flex flex-col justify-end bg-theme-bg/30 transition-colors duration-300">
        {response ? (
          <div className="bg-theme-border/30 text-theme-fg/90 p-4 rounded-xl text-sm leading-relaxed mb-4 border border-theme-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            {response}
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 text-theme-muted text-sm mb-4 animate-pulse px-2">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Generating response...
          </div>
        ) : (
          <div className="text-theme-muted text-xs font-medium mb-4 px-2 text-center leading-relaxed">
            Type any difficult word or phrase from the news to get its {mode === "define" ? "meaning" : "translation"}.
          </div>
        )}

        {mode === "translate" && (
          <div className="mb-4 flex items-center justify-between bg-theme-bg border border-theme-border rounded-xl p-2 px-3 shadow-sm transition-colors duration-300">
            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Translate to:</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none text-theme-fg cursor-pointer outline-none border-none mr-2 pr-1"
            >
              <option value="Hindi" className="bg-theme-card-bg text-theme-fg">Hindi</option>
              <option value="Telugu" className="bg-theme-card-bg text-theme-fg">Telugu</option>
              <option value="Spanish" className="bg-theme-card-bg text-theme-fg">Spanish</option>
              <option value="French" className="bg-theme-card-bg text-theme-fg">French</option>
              <option value="German" className="bg-theme-card-bg text-theme-fg">German</option>
              <option value="Mandarin" className="bg-theme-card-bg text-theme-fg">Mandarin</option>
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative mt-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "define" ? "e.g., Repo Rate, GDP..." : "Enter word to translate..."}
            className="w-full bg-theme-bg text-theme-fg border border-theme-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-theme-accent text-theme-bg rounded-lg disabled:opacity-40 transition-opacity cursor-pointer"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
