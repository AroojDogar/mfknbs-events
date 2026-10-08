"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const path = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  if (path.startsWith("/admin")) return null;
  return <motion.div style={{ scaleX }} className="no-print fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-saffron-500 via-saffron-400 to-saffron-600" />;
}
