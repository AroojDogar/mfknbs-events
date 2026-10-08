export const CATEGORIES = [
  "Conference",
  "Seminar & Talk",
  "Training & Workshop",
  "Partnership & MoU",
  "Accreditation",
  "Research & Publication",
  "Faculty Achievement",
  "Student Life",
  "Alumni",
  "Community Outreach",
  "Careers",
  "Governance & Strategy",
] as const;

/** Themes whose posts usually have one poster-style photo — shown whole, not cropped. */
export const SINGLE_PHOTO_CATEGORIES: readonly string[] = ["Faculty Achievement", "Seminar & Talk", "Research & Publication"];

export type Category = (typeof CATEGORIES)[number];

export interface SchoolEvent {
  id?: string;
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM-DD, for multi-day events */
  end_date?: string | null;
  /** true when only the month is known — the site then shows "Month YYYY" */
  date_approx?: boolean;
  category: Category;
  /** One-line description used on cards and in the booklet */
  summary: string;
  /** Full write-up. Separate paragraphs with a blank line. */
  description: string;
  highlights?: string[];
  people?: string[];
  venue?: string | null;
  /** Image URLs or /public paths, e.g. "/events/alumni-meetup-2024/1.jpg" */
  images: string[];
  featured?: boolean;
}
