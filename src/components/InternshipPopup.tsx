import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n";
import { track } from "@/lib/analytics";
import { introDone } from "@/lib/motion";

const DURATION = 10_000;
const TICK = 100;
const SEEN_KEY = "internship-popup-seen";

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable (private mode): the pop-up may simply show again on the next page.
  }
};

/** Announces the internship search once per visit, then closes itself after 10 seconds. */
const InternshipPopup = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const [paused, setPaused] = useState(false);
  const { t } = useLanguage();
  const { internship } = t;

  useEffect(() => {
    if (pathname.startsWith("/admin") || alreadySeen()) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    // Shown once the loading screen has gone, after a short delay that lets the page appear first.
    introDone.then(() => {
      if (cancelled) return;
      timer = setTimeout(() => {
        markSeen();
        setOpen(true);
      }, 800);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname]);

  // Timed in JavaScript rather than with a CSS animation: the reduced-motion rule shortens every animation to nothing.
  useEffect(() => {
    if (!open || paused) return;
    const timer = setInterval(() => setRemaining((r) => Math.max(0, r - TICK)), TICK);
    return () => clearInterval(timer);
  }, [open, paused]);

  useEffect(() => {
    if (remaining === 0) setOpen(false);
  }, [remaining]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-md gap-0 overflow-hidden border-deep-black p-0 sm:rounded-none"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <div className="p-6 pr-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t.popup.available} {internship.role}</p>
          <DialogTitle className="mt-3 text-3xl font-black uppercase leading-[0.95] tracking-tighter text-foreground">
            {t.popup.titleStart} <span className="text-dutch-orange">{t.popup.titleAccent}</span>
          </DialogTitle>
          <DialogDescription className="mt-3 text-base leading-relaxed text-foreground">
            {internship.duration}. {internship.location}.
          </DialogDescription>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{internship.experience}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/cv"
              onClick={() => {
                track("popup-stage", { action: "cv" });
                setOpen(false);
              }}
              className="btn-ink btn-sm"
            >
              {t.popup.seeCv}
            </Link>
            <Link
              to="/contact"
              onClick={() => {
                track("popup-stage", { action: "contact" });
                setOpen(false);
              }}
              className="btn-paper btn-sm"
            >
              {t.common.contactMe}
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="h-1 bg-secondary">
          <div
            className="h-full bg-dutch-orange transition-[width] duration-100 ease-linear"
            style={{ width: `${(remaining / DURATION) * 100}%` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternshipPopup;
