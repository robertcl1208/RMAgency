"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { viewportOnce } from "@/lib/motion";

export function CtaReadySection() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-teal-dark via-brand-teal to-brand-teal-light"
        aria-hidden
      />
      <motion.div
        className="absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-brand-accent/25 blur-3xl"
        aria-hidden
        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl"
        aria-hidden
        animate={{ scale: [1, 1.08, 1], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />

      <motion.div
        className="glass-on-vivid water-sheen water-sheen-vivid relative mx-auto max-w-4xl rounded-[2rem] px-6 py-12 text-center sm:px-10 sm:py-14 lg:px-12"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="text-sm font-bold uppercase tracking-widest text-white/90"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Ready to work with us?
        </motion.p>
        <motion.h2
          className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          You are just one step away...
        </motion.h2>
        <motion.p
          className="mx-auto mt-5 max-w-xl text-base text-white/85"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Tell us about your roadmap—we’ll assemble design, engineering, and AI
          specialists around your goals.
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, type: "spring", stiffness: 280, damping: 20 }}
        >
          <motion.a
            href="#contact"
            className="glass-chip inline-flex items-center gap-2 rounded-xl bg-white/90 px-8 py-4 text-base font-bold text-brand-teal shadow-lg"
            whileHover={{
              scale: 1.06,
              y: -4,
              boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.25)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            Contact Us
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
