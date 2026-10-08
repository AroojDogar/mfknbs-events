"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { PhotoSlot } from "./photo-slot";

/** Photo grid with lightbox. Single-photo themes show one framed photo; others a 5-slot gallery that grows with uploads. */
export function Gallery({ images, title, single = false }: { images: string[]; title: string; single?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i! + 1) % images.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i! - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, images.length]);

  if (images.length === 0 && single) {
    return <PhotoSlot alt={title} className="mx-auto aspect-[4/3] max-w-2xl rounded-3xl" />;
  }

  if (images.length === 1) {
    return (
      <>
        <button onClick={() => setOpen(0)} className="block w-full">
          <PhotoSlot src={images[0]} alt={title} fit="contain" priority className="aspect-[4/3] w-full rounded-3xl sm:aspect-[16/10]" sizes="(max-width:1024px) 100vw, 1024px" />
        </button>
        <Lightbox images={images} title={title} open={open} setOpen={setOpen} />
      </>
    );
  }

  if (images.length === 0) {
    return (
      <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
        <PhotoSlot alt={title} className="aspect-[16/10] rounded-3xl sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full sm:min-h-[26rem]" />
        {[0, 1, 2, 3].map((k) => <PhotoSlot key={k} alt={title} label="" className="hidden aspect-[4/3] rounded-3xl sm:block" />)}
      </div>
    );
  }

  const shown = images.slice(0, 5);
  const n = shown.length;
  const cell = (i: number) => {
    if (n === 2) return "aspect-[4/3]";
    if (n === 3) return i === 0 ? "aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto" : "aspect-[4/3]";
    if (i === 0) return "aspect-[16/10] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[26rem]";
    if (n === 4 && i === 3) return "aspect-[4/3] sm:col-span-2 sm:aspect-auto";
    return "aspect-[4/3]";
  };
  const grid = n === 2 ? "sm:grid-cols-2" : n === 3 ? "sm:grid-cols-3 sm:grid-rows-2" : "sm:grid-cols-4 sm:grid-rows-2";
  return (
    <>
      <div className={"grid gap-3 " + grid}>
        {shown.map((src, i) => (
          <motion.button
            key={src + i}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            onClick={() => setOpen(i)}
            className={"group relative overflow-hidden rounded-3xl bg-navy-50 " + cell(i)}
          >
            <Image src={src} alt={`${title} photo ${i + 1}`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" priority={i === 0} />
            <span className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/20" />
            {i === n - 1 && images.length > n && (
              <span className="absolute inset-0 flex items-center justify-center bg-navy-950/60 font-display text-3xl text-white">+{images.length - n}</span>
            )}
          </motion.button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-muted">{images.length} photos</span>
        <button onClick={() => setOpen(0)} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-bold text-navy-900 transition hover:border-navy-900">
          <Images className="h-4 w-4" /> View gallery
        </button>
      </div>
      <Lightbox images={images} title={title} open={open} setOpen={setOpen} />
    </>
  );
}

function Lightbox({ images, title, open, setOpen }: { images: string[]; title: string; open: number | null; setOpen: (v: number | null) => void }) {
  return (
    <>
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4" onClick={() => setOpen(null)}>
            <button className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white" aria-label="Close"><X /></button>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + images.length) % images.length); }} className="absolute left-4 rounded-full bg-white/10 p-3 text-white" aria-label="Previous"><ChevronLeft /></button>
                <button onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % images.length); }} className="absolute right-4 rounded-full bg-white/10 p-3 text-white" aria-label="Next"><ChevronRight /></button>
              </>
            )}
            <motion.div key={open} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative h-[72vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={images[open]} alt={`${title} photo ${open + 1}`} fill sizes="100vw" className="object-contain" />
            </motion.div>
            {images.length > 1 ? (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 overflow-x-auto px-4" onClick={(e) => e.stopPropagation()}>
                {images.map((src, k) => (
                  <button key={src + k} onClick={() => setOpen(k)} className={"relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition " + (k === open ? "ring-saffron-500" : "opacity-50 ring-transparent hover:opacity-100")}>
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
