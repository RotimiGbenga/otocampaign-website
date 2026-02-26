"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const INACTIVITY_MINUTES = 30;

export function ActivityTracker() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fetch("/api/admin/logout", { method: "POST", credentials: "include" })
        .catch(() => {})
        .finally(() => {
          router.replace("/admin/login?reason=inactivity");
        });
    }, INACTIVITY_MINUTES * 60 * 1000);
  }, [router]);

  useEffect(() => {
    if (isLoginPage) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetTimer, isLoginPage]);

  return null;
}
