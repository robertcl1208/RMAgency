"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

export function FreeTrialSection() {
  return (
    <section
      id="trial"
      className="border-t border-white/40 bg-gradient-to-br from-brand-mint/80 via-white/60 to-amber-50/35 py-20 sm:py-24 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="glass-frame water-sheen relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Analytics dashboard representing a product trial"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            <motion.p
              variants={staggerItem}
              className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-brand-teal"
            >
              <motion.span
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-4 w-4 text-brand-accent" aria-hidden />
              </motion.span>
              Convinced?
            </motion.p>
            <motion.h2
              variants={staggerItem}
              className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
            >
              Get a <span className="text-brand-accent">Free Trial</span> today
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mt-5 text-lg text-slate-600"
            >
              Book a no-risk discovery week: solution sketch, effort estimate,
              and a working slice of your highest-risk feature—or a design
              sprint for a key flow.
            </motion.p>
            <motion.ul
              variants={staggerContainer}
              className="mt-6 space-y-3 text-slate-700"
            >
              {[
                "Clear scope & timeline before you commit",
                "Engineers and designers who’ve shipped similar products",
                "Optional AI readiness checklist for your data & workflows",
              ].map((text) => (
                <motion.li
                  key={text}
                  variants={staggerItem}
                  className="flex gap-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" />
                  {text}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={staggerItem} className="mt-8">
              <motion.a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl bg-brand-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-amber-500/30"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                Claim your free trial
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
