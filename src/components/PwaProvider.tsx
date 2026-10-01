"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribeToNetworkStatus(onChange: () => void) {
  window.addEventListener("offline", onChange);
  window.addEventListener("online", onChange);
  return () => {
    window.removeEventListener("offline", onChange);
    window.removeEventListener("online", onChange);
  };
}

function getIsOnline() {
  return typeof navigator === "undefined" || navigator.onLine;
}

function isRunningStandalone() {
  const iosNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || iosNavigator.standalone === true;
}

function wasInstallDismissed() {
  try {
    return window.localStorage.getItem("md247_install_dismissed") === "1";
  } catch {
    return false;
  }
}

export default function PwaProvider() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDelayElapsed, setInstallDelayElapsed] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const offline = !useSyncExternalStore(subscribeToNetworkStatus, getIsOnline, () => true);

  useEffect(() => {
    const installDelay = window.setTimeout(() => {
      const installWasDismissed = wasInstallDismissed();
      setDismissed(installWasDismissed);
      if (!installWasDismissed && !isRunningStandalone()) setInstallDelayElapsed(true);
    }, 4000);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setDismissed(wasInstallDismissed());
      setShowManualInstructions(false);
    };
    const onInstalled = () => {
      setDeferred(null);
      setDismissed(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.clearTimeout(installDelay);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) {
      setShowManualInstructions(true);
      return;
    }
    try {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } catch {
      setShowManualInstructions(true);
      setDeferred(null);
    }
  };

  const close = () => {
    try {
      window.localStorage.setItem("md247_install_dismissed", "1");
    } catch {
      // Keep dismissal for this page view even when storage is unavailable.
    }
    setDismissed(true);
  };

  return (
    <>
      {offline && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-center text-xs font-semibold text-amber-950 py-1.5">
          You are offline — showing saved data. Dial *347*247# to reach a doctor by voice.
        </div>
      )}
      {installDelayElapsed && !dismissed && (
        <div className="fixed bottom-24 md:bottom-6 inset-x-3 md:left-auto md:right-6 md:w-96 z-[60] animate-fadeup">
          <div className="card p-4 flex items-start gap-3">
            <div className="text-2xl">📲</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Install App</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {showManualInstructions
                  ? "Open your browser's Share or menu button, then choose Add to Home Screen or Install app."
                  : "Add MyDoc247 to your home screen for offline records, faster access and consultation alerts."}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={install}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Install App
                </button>
                <button onClick={close} className="rounded-lg px-3 py-1.5 text-xs text-slate-500">
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
