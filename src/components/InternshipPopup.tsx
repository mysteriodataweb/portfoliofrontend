import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { internship } from "@/data/availability";

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

  useEffect(() => {
    if (pathname.startsWith("/admin") || alreadySeen()) return;
    // A short delay lets the page appear first.
    const timer = setTimeout(() => {
      markSeen();
      setOpen(true);
    }, 800);
    return () => clearTimeout(timer);
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
        className="w-[calc(100%-2rem)] max-w-md gap-0 overflow-hidden p-0 sm:rounded-none"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <div className="p-6 pr-12">
          <p className="text-sm font-medium text-muted-foreground">{internship.role}</p>
          <DialogTitle className="mt-2 text-xl font-normal text-foreground">Je cherche un stage de fin d'études</DialogTitle>
          <DialogDescription className="mt-3 text-base leading-relaxed text-foreground">
            {internship.duration} à partir de {internship.start}. {internship.location}.
          </DialogDescription>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{internship.experience}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/cv" onClick={() => setOpen(false)} className="btn-ink btn-sm">
              Voir mon CV
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-paper btn-sm">
              Me contacter
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="h-1 bg-secondary">
          <div
            className="h-full bg-foreground transition-[width] duration-100 ease-linear"
            style={{ width: `${(remaining / DURATION) * 100}%` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternshipPopup;
