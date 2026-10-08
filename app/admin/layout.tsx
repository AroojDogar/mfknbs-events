import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f4f3f9]">{children}</div>;
}
