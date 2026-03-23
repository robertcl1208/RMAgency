"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const testimonials = [
  {
    quote:
      "RobertRM embedded like an internal team. Our SaaS dashboard shipped on time and the automation hooks saved ops hours every week.",
    name: "Jordan Ellis",
    role: "VP Product",
    company: "Northline Analytics",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
  {
    quote:
      "From UX polish to mobile parity, the squad was proactive. Standups felt like we’d hired senior folks in-house overnight.",
    name: "Priya Natarajan",
    role: "Head of Engineering",
    company: "FleetPilot",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
  },
  {
    quote:
      "They demystified AI for us—practical RAG, not hype. Compliance review loved the logging and human-in-the-loop defaults.",
    name: "Marcus Weber",
    role: "CTO",
    company: "Helix Documents",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="glass-section border-t border-white/50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="div" className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-teal">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Our happy customers speak for us
          </h2>
        </Reveal>

        <motion.div
          className="mt-14 grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {testimonials.map((t) => (
            <motion.blockquote
              key={t.name}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-card water-sheen flex flex-col rounded-2xl p-8 transition-shadow hover:shadow-lg"
            >
              <Quote
                className="h-8 w-8 text-brand-accent/80"
                aria-hidden
              />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                {t.quote}
              </p>
              <footer className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Image
                    src={t.image}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-mint"
                  />
                </motion.div>
                <div>
                  <cite className="not-italic text-sm font-bold text-slate-900">
                    {t.name}
                  </cite>
                  <p className="text-xs text-slate-500">
                    {t.role}
                    <span className="text-slate-400"> · </span>
                    {t.company}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
