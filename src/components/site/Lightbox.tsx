import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  if (index === null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-ink/95 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute top-5 right-5 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
        className="absolute left-4 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[82vh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-lift"
      />
      <button
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
        className="absolute right-4 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <span className="absolute bottom-6 text-sm tracking-widest text-white/60">
        {index + 1} / {images.length}
      </span>
    </div>
  );
}
