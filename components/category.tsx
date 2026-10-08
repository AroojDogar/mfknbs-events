import {
  Award, Briefcase, Compass, GraduationCap, Handshake, HeartHandshake, Landmark, Mic, Presentation, ScrollText, Users, Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Conference: Landmark,
  "Seminar & Talk": Mic,
  "Training & Workshop": Wrench,
  "Partnership & MoU": Handshake,
  Accreditation: Award,
  "Research & Publication": ScrollText,
  "Faculty Achievement": Presentation,
  "Student Life": GraduationCap,
  Alumni: Users,
  "Community Outreach": HeartHandshake,
  Careers: Briefcase,
  "Governance & Strategy": Compass,
};

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const Icon = CATEGORY_ICON[category] ?? Landmark;
  return <Icon className={className} strokeWidth={1.6} aria-hidden />;
}

export function CategoryPill({ category, tone = "light" }: { category: Category; tone?: "light" | "dark" }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide " +
        (tone === "light"
          ? "bg-navy-50 text-navy-800 ring-1 ring-navy-100"
          : "bg-white/10 text-saffron-200 ring-1 ring-white/15")
      }
    >
      <CategoryIcon category={category} className="h-3.5 w-3.5" />
      {category}
    </span>
  );
}
