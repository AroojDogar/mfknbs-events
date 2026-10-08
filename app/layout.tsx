import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: { default: "MFKNBS Activities & Events", template: "%s · MFKNBS" },
  description:
    "Conferences, partnerships, research and student milestones at Malik Firoz Khan Noon Business School, University of Sargodha.",
  icons: { icon: "/logo.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <ScrollProgress />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
