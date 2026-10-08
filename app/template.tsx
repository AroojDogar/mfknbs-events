"use client";
import { motion } from "framer-motion";

// Opacity only: a transform here would break position:fixed elements (lightbox, booklet toolbar).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
