"use client";
import { motion } from "framer-motion";

/** Heading whose words rise out of a mask one by one. Wrap a word in *asterisks* to italicise it in saffron. */
export function SplitHeading({ text, className = "", as = "h2", delay = 0 }: { text: string; className?: string; as?: "h1" | "h2"; delay?: number }) {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  const words = text.split(" ");
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} transition={{ staggerChildren: 0.06, delayChildren: delay }}>
      {words.map((w, i) => {
        const em = w.startsWith("*") && w.replace(/[.,!?]$/, "").endsWith("*");
        const clean = w.replace(/\*/g, "");
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={"inline-block " + (em ? "italic text-saffron-500" : "")}
              variants={{ hidden: { y: "110%", rotate: 4 }, show: { y: "0%", rotate: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
            >
              {clean}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </Tag>
  );
}
