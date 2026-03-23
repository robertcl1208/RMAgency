"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";

const tags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  ul: motion.ul,
} as const;

type TagName = keyof typeof tags;

type RevealProps = {
  as?: TagName;
  className?: string;
  children: ReactNode;
  delay?: number;
};

export function Reveal({
  as = "div",
  className,
  children,
  delay = 0,
}: RevealProps) {
  const M = tags[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </M>
  );
}
