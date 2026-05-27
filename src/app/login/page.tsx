"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn, Quote } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

const QUOTES = [
  { text: "You have to dream before your dreams can come true.", author: "A.P.J. Abdul Kalam" },
  { text: "I don't believe in taking right decisions. I take decisions and then make them right.", author: "Ratan Tata" },
  { text: "All of us do not have equal talent. But, all of us have an equal opportunity to develop our talents.", author: "A.P.J. Abdul Kalam" },
  { text: "Take the stones people throw at you and use them to build a monument.", author: "Ratan Tata" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle Onassis" },
  { text: "Arise, awake, and stop not till the goal is reached.", author: "Swami Vivekananda" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { text: "Play iterated games. All the returns in life come from compound interest.", author: "Naval Ravikant" },
  { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { text: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
  { text: "Do not wait; the time will never be 'just right.' Start where you stand.", author: "Napoleon Hill" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" }
];

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const [quote, setQuote] = useState(QUOTES[0]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    // Auto-redirect after 6 seconds if Access Denied
    if (error === "AccessDenied") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  // Use a visibility change listener as a lightweight BFCache reset
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setIsLoggingIn(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handleVisibility);
    };
  }, []);

  const handleSignIn = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    // Fallback unlock after 3s
    setTimeout(() => {
      setIsLoggingIn(false);
    }, 3000);

    try {
      // Bypass the next-auth React SDK to avoid its internal concurrency locks getting stuck in BFCache.
      // We manually fetch the CSRF token and submit the POST form.
      const res = await fetch("/api/auth/csrf");
      const { csrfToken } = await res.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/signin/google";

      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "csrfToken";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);

      const callbackInput = document.createElement("input");
      callbackInput.type = "hidden";
      callbackInput.name = "callbackUrl";
      callbackInput.value = window.location.origin + "/";
      form.appendChild(callbackInput);

      document.body.appendChild(form);
      form.submit();

      // Cleanup the form so it doesn't linger in the DOM if BFCache restores
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 100);

    } catch (err) {
      console.error("Sign-in failed", err);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Neon glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Header with Login Button */}
      <header className="w-full p-6 md:px-12 md:py-8 flex justify-between items-center relative z-20">
        <div className="font-black text-xl tracking-tighter uppercase flex items-center gap-3">
          <Image src="/logo.png" alt="News Digest Logo" width={32} height={32} className="w-8 h-8 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] object-cover" />
          <span className="tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-400">NEWS Digest</span>
        </div>

        <button
          type="button"
          onClick={handleSignIn}
          className={`group relative px-6 py-2.5 rounded-full overflow-hidden flex items-center gap-2 border border-cyan-500/30 hover:border-cyan-400 transition-all bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] ${isLoggingIn ? 'opacity-70 cursor-wait' : 'cursor-pointer'
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          {isLoggingIn ? (
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin relative z-10" />
          ) : (
            <LogIn className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors relative z-10" />
          )}
          <span className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors tracking-widest uppercase relative z-10">
            {isLoggingIn ? "Connecting..." : "Sign In"}
          </span>
        </button>
      </header>

      {/* Main Content: The Quote or Error */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 max-w-5xl mx-auto w-full">
        {error === "AccessDenied" ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 max-w-lg text-center mt-[-40px]">
            <Image src="/robot-denied.png" alt="Oops, access denied!" width={320} height={320} className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-4" priority />
            <h2 className="text-3xl md:text-4xl font-light text-stone-200 mb-3 tracking-tight">Oops!</h2>
            <p className="text-lg text-stone-400 leading-relaxed font-medium mb-6">
              It looks like you don&apos;t have access to this application just yet.
            </p>
            <div className="px-6 py-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-cyan-200 text-sm tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col items-center gap-2">
              <span>Please reach out to the admin</span>
              <span className="text-[10px] text-cyan-500 font-medium">Redirecting to main page in 6 seconds...</span>
            </div>
          </div>
        ) : (
          <div className="login-fade-in">
            <Quote className="w-10 h-10 md:w-14 md:h-14 text-cyan-500/30 mb-8 mx-auto" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight md:leading-tight lg:leading-tight text-center mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-200 to-stone-500 tracking-tight">
              &ldquo;{quote.text}&rdquo;
            </h1>
            <div className="flex items-center justify-center gap-6">
              <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent to-fuchsia-500/50" />
              <p className="text-sm md:text-lg font-bold tracking-[0.2em] uppercase text-fuchsia-400 drop-shadow-[0_0_12px_rgba(232,121,249,0.4)]">
                {quote.author}
              </p>
              <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent to-fuchsia-500/50" />
            </div>
          </div>
        )}
      </main>

      {/* Subtle footer */}
      <footer className="p-6 md:p-12 text-center relative z-10">
        <p className="text-stone-600 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold">
          Focus &bull; Learn &bull; Achieve
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <LoginContent />
    </Suspense>
  );
}
