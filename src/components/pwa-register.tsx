"use client";

import { useEffect } from "react";

const SW_REFRESH_KEY = "sw-refreshed-v3";

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const refreshAndRegister = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
      window.location.reload();
    };

    if (!localStorage.getItem(SW_REFRESH_KEY)) {
      localStorage.setItem(SW_REFRESH_KEY, "1");
      refreshAndRegister();
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
