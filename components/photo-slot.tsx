import Image from "next/image";
import { ImageIcon } from "lucide-react";

/** Shows the photo if there is one, otherwise a branded placeholder ready for a JPEG. */
export function PhotoSlot({
  src, alt, className = "", sizes = "(max-width: 768px) 100vw, 50vw", priority, label = "Photo coming soon", fit = "cover",
}: { src?: string | null; alt: string; className?: string; sizes?: string; priority?: boolean; label?: string; fit?: "cover" | "contain" }) {
  if (src && fit === "contain") {
    // Poster-style photos: show the whole image over a blurred copy of itself
    return (
      <div className={"relative overflow-hidden bg-navy-900 " + className}>
        <Image src={src} alt="" fill sizes={sizes} className="scale-110 object-cover opacity-60 blur-2xl" aria-hidden />
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
      </div>
    );
  }
  if (src) {
    return (
      <div className={"relative overflow-hidden bg-navy-50 " + className}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div className={"placeholder-stripes relative flex items-center justify-center overflow-hidden " + className} role="img" aria-label={`${alt} (photo placeholder)`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.jpg" alt="" className="pointer-events-none absolute h-[70%] max-h-56 opacity-[0.07] mix-blend-multiply grayscale" />
      <div className="relative flex flex-col items-center gap-2 text-navy-700/60">
        {label && <ImageIcon className="h-6 w-6" strokeWidth={1.5} />}
        {label && <span className="eyebrow text-[10px]">{label}</span>}
      </div>
    </div>
  );
}
