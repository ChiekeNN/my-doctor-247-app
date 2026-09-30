"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaProvider() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setDismissed(window.localStorage.getItem("md247_install_dismissed") === "1");
    };
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    setOffline(typeof navigator !== "undefined" && !navigator.onLine);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const close = () => {
    window.localStorage.setItem("md247_install_dismissed", "1");
    setDismissed(true);
  };

  return (
    <>
      {offline && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-center text-xs font-semibold text-amber-950 py-1.5">
          You are offline — showing saved data. Dial *347*247# to reach a doctor by voice.
        </div>
      )}
      {deferred && !dismissed && (
        <div className="fixed bottom-24 md:bottom-6 inset-x-3 md:left-auto md:right-6 md:w-96 z-[60] animate-fadeup">
          <div className="card p-4 flex items-start gap-3">
            <div className="text-2xl">📲</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Install MyDoc247</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Add to your home screen for offline records, faster access and consultation alerts.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={install}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Install app
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
