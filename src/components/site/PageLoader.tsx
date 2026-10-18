import { useEffect, useRef, useState } from "react";

import { company } from "@/lib/site-data";

/** Once per browser tab. Replaying this on every page change would be a nuisance. */
const SEEN_KEY = "champs_loader_seen";

const BRICKS = 7;
const TYPE_SPEED_MS = 52;
/** Logo rise + bricks laying, before the tagline starts typing. */
const TYPE_START_MS = 900;

/**
 * The opening sequence: the mark rises like a wall going up, a course of bricks
 * lays itself underneath, the tagline types out, and the screen parts like a
 * curtain to reveal the site.
 *
 * Two things keep it from being annoying. It runs once per tab, so navigating
 * between pages never replays it. And it is purely decorative — `aria-hidden`
 * throughout, with the page rendered underneath the whole time, so a screen
 * reader and the crawler never wait for it.
 */
export function PageLoader() {
  // Assume it has been seen until the effect proves otherwise: on a client-side
  // navigation that avoids a flash of the overlay before the check runs.
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [typed, setTyped] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private mode or blocked storage: show it, it is only a couple of seconds.
      seen = false;
    }
    if (seen) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Not fatal — worst case it plays again next navigation.
    }

    setActive(true);

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const tagline = company.tagline;

    if (reduced) {
      // No typing, no curtain: show it briefly and get out of the way.
      setTyped(tagline);
      timers.current.push(window.setTimeout(() => setLeaving(true), 450));
      timers.current.push(window.setTimeout(() => setActive(false), 850));
      return;
    }

    for (let i = 1; i <= tagline.length; i += 1) {
      timers.current.push(
        window.setTimeout(() => setTyped(tagline.slice(0, i)), TYPE_START_MS + i * TYPE_SPEED_MS),
      );
    }

    const typingEnds = TYPE_START_MS + tagline.length * TYPE_SPEED_MS;
    timers.current.push(window.setTimeout(() => setLeaving(true), typingEnds + 420));
    timers.current.push(window.setTimeout(() => setActive(false), typingEnds + 1320));

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      {/* Two halves that slide apart, so the reveal feels like a curtain. */}
      <Curtain half="top" leaving={leaving} />
      <Curtain half="bottom" leaving={leaving} />

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-300 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative overflow-hidden">
          <img
            src={company.logo}
            alt=""
            width={1453}
            height={470}
            className="w-[min(78vw,26rem)]"
            style={{ animation: "loader-rise 760ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
          />
          {/* A single sheen sweeping across once the mark is up. */}
          <span
            className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent"
            style={{ animation: "loader-sheen 900ms ease-in-out 700ms both" }}
          />
        </div>

        <div className="mt-7 flex items-end gap-1.5" aria-hidden>
          {Array.from({ length: BRICKS }, (_, i) => (
            <span
              key={i}
              className="h-2.5 w-7 rounded-[3px] bg-accent-gold sm:w-9"
              style={{
                animation: `loader-brick 420ms cubic-bezier(0.22, 1, 0.36, 1) ${360 + i * 70}ms both`,
              }}
            />
          ))}
        </div>

        <p className="mt-7 min-h-6 text-center text-sm font-bold tracking-[0.22em] text-white uppercase sm:text-base">
          {typed}
          <span
            className="ml-0.5 inline-block w-[2px] translate-y-[2px] self-stretch bg-accent-gold"
            style={{ height: "1em", animation: "loader-caret 760ms steps(1) infinite" }}
          />
        </p>
      </div>
    </div>
  );
}

function Curtain({ half, leaving }: { half: "top" | "bottom"; leaving: boolean }) {
  return (
    <div
      className={`absolute inset-x-0 h-1/2 bg-brand-ink ${half === "top" ? "top-0" : "bottom-0"}`}
      style={
        leaving
          ? {
              animation: `${
                half === "top" ? "loader-lift-top" : "loader-lift-bottom"
              } 820ms cubic-bezier(0.76, 0, 0.24, 1) both`,
            }
          : undefined
      }
    />
  );
}
