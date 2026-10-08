import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SINGLE_PHOTO_CATEGORIES, type SchoolEvent } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { CategoryPill } from "./category";
import { PhotoSlot } from "./photo-slot";

export function EventCard({ event, size = "md" }: { event: SchoolEvent; size?: "md" | "lg" }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-500 hover:-translate-y-1 hover:border-saffron-400/60 hover:shadow-2xl hover:shadow-navy-900/10"
    >
      <div className="relative overflow-hidden">
        <PhotoSlot
          src={event.images?.[0]}
          alt={event.title}
          fit={SINGLE_PHOTO_CATEGORIES.includes(event.category) ? "contain" : "cover"}
          className={(size === "lg" ? "aspect-[16/10]" : "aspect-[16/10]") + " transition duration-700 group-hover:scale-[1.04]"}
        />
        <span className="absolute left-4 top-4 rounded-full bg-navy-950/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
          {formatDate(event)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <CategoryPill category={event.category} />
        <h3 className={"mt-3 font-display font-semibold leading-snug text-navy-900 " + (size === "lg" ? "text-2xl" : "text-xl")}>
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{event.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-saffron-600">
          Read more <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
