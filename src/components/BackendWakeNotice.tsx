import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api";

// The API runs on Render's free plan: after a quiet spell it sleeps and needs up to a minute to wake.
const SHOW_AFTER = 1_500;
const RETRY_EVERY = 3_000;
const GIVE_UP_AFTER = 90_000;

type State = "checking" | "waking" | "ready" | "failed";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Tells visitors the content is on its way while the API wakes up, then reloads the data. */
const BackendWakeNotice = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<State>("checking");
  const [attempt, setAttempt] = useState(0);
  const shown = useRef(false);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();
    const showTimer = setTimeout(() => {
      shown.current = true;
      setState((s) => (s === "checking" ? "waking" : s));
    }, SHOW_AFTER);

    const wait = async () => {
      while (!cancelled && Date.now() - started < GIVE_UP_AFTER) {
        try {
          const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
          if (res.ok) return true;
        } catch {
          // Still asleep, or the network dropped: try again shortly.
        }
        await sleep(RETRY_EVERY);
      }
      return false;
    };

    wait().then((ok) => {
      if (cancelled) return;
      clearTimeout(showTimer);
      if (!ok) {
        setState("failed");
        return;
      }
      setState("ready");
      // Requests sent while the API was asleep may have failed: fetch everything again.
      if (shown.current) queryClient.invalidateQueries();
    });

    return () => {
      cancelled = true;
      clearTimeout(showTimer);
    };
  }, [attempt, queryClient]);

  if (state === "checking" || state === "ready") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md border border-border bg-background p-4 shadow-lg"
    >
      {state === "waking" ? (
        <div className="flex items-start gap-3">
          <Loader2 size={18} className="mt-0.5 shrink-0 animate-spin text-foreground" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-foreground">{t.wake.loading}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.wake.waking}</p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-foreground">{t.wake.slow}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.wake.failed}</p>
          <button
            onClick={() => {
              setState("waking");
              setAttempt((a) => a + 1);
            }}
            className="btn-ink btn-sm mt-3"
          >
            {t.wake.retry}
          </button>
        </div>
      )}
    </div>
  );
};

export default BackendWakeNotice;
