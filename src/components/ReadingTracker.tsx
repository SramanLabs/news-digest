"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReadingTracker() {
  const { data: session } = useSession();
  const accumulatedTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const reportTime = async (seconds: number, email: string) => {
    try {
      await fetch(`${API_URL}/api/user/track-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, active_seconds: seconds })
      });
    } catch (err) {
      console.error("Failed to report reading time", err);
    }
  };

  useEffect(() => {
    if (!session?.user?.email) return;
    
    // Start interval to track active time every 10 seconds
    intervalRef.current = setInterval(() => {
      // Only track if document is visible (user is actively on the tab)
      if (document.visibilityState === "visible") {
        accumulatedTimeRef.current += 10;
        
        // Every 30 seconds of active reading, send to backend to persist
        if (accumulatedTimeRef.current >= 30) {
          reportTime(accumulatedTimeRef.current, session.user.email);
          accumulatedTimeRef.current = 0; // Reset after reporting
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Flush any remaining time on unmount
      if (accumulatedTimeRef.current > 0 && session?.user?.email) {
        reportTime(accumulatedTimeRef.current, session.user.email);
      }
    };
  }, [session]);

  return null; // Invisible component
}
