import { useEffect, useRef } from "react";

/*
 * A full-bleed background image that drifts slower than the page as you scroll.
 *
 * - `speed` is how far the image lags behind the page (0.12 = barely, 0.4 = clearly
 *   slower). The image is oversized by enough to cover that lag, so its edges are
 *   never exposed.
 * - Light: one passive scroll listener, work batched into requestAnimationFrame,
 *   the transform written straight to the element (no React re-renders), and it
 *   only runs while the section is on screen.
 * - Mobile first: below 1024px, or when the visitor prefers reduced motion, the
 *   image is a plain static background with no oversizing.
 */
export function ParallaxBg({
  src,
  speed = 0.12,
  position = "50% 50%",
  className = "",
}: {
  src: string;
  speed?: number;
  position?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const desktop = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let visible = false;
    let limit = 0;

    // Oversize the image by the furthest it can drift: the section travels
    // (viewport + section height) / 2 either side of centre while on screen.
    const measure = () => {
      if (!desktop.matches) {
        img.style.top = "0";
        img.style.height = "100%";
        img.style.transform = "";
        limit = 0;
        return;
      }
      const h = wrap.offsetHeight;
      limit = Math.ceil(((window.innerHeight + h) / 2) * speed) + 2;
      img.style.top = `${-limit}px`;
      img.style.height = `${h + limit * 2}px`;
    };

    const update = () => {
      frame = 0;
      if (!limit) return;
      const rect = wrap.getBoundingClientRect();
      const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2;
      const y = Math.max(-limit, Math.min(limit, -fromCentre * speed));
      img.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && limit && !frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      onScroll();
    });
    observer.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    desktop.addEventListener("change", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktop.removeEventListener("change", onResize);
      cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-x-0 top-0 h-full w-full object-cover lg:will-change-transform"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
