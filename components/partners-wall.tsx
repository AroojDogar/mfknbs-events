"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Handshake } from "lucide-react";

export function PartnersWall({ partners }: { partners: { name: string; slug: string; date: string }[] }) {
  if (!partners.length) return null;
  return (
    <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((p, i) => (
        <motion.li
          key={p.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
          className="border-b border-r border-line"
        >
          <Link href={`/events/${p.slug}`} className="group relative flex h-full min-h-40 flex-col justify-between overflow-hidden p-7">
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-navy-900 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
            <span className="relative flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron-100 text-saffron-600 transition group-hover:bg-saffron-500 group-hover:text-navy-950">
                <Handshake className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted transition group-hover:text-white/50">
                MoU · {new Date(p.date).getFullYear()}
              </span>
            </span>
            <span className="relative mt-8 flex items-end justify-between gap-4">
              <span className="font-display text-2xl font-semibold leading-tight text-navy-900 transition group-hover:text-white">{p.name}</span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-saffron-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-saffron-400" />
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
