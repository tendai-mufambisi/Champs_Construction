import { useEffect, useState } from "react";
import logo from "@/assets/champs-logo.svg";
import { company } from "@/lib/site-data";

export function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-ink transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={logo}
        alt=""
        width={734}
        height={206}
        className="w-56 animate-pulse rounded-2xl shadow-soft"
      />
      <div className="mt-6 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full w-1/3 rounded-full bg-accent-gradient"
          style={{ animation: "marquee 1.1s linear infinite" }}
        />
      </div>
      <p className="mt-4 px-6 text-center text-xs font-bold tracking-[0.3em] text-accent-gold uppercase">
        {company.tagline}
      </p>
    </div>
  );
}
