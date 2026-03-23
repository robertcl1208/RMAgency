"use client";

import {
  badgeOfficialResources,
  certificationBadges,
  type BadgeKind,
} from "@/data/certificationBadges";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { viewportOnce } from "@/lib/motion";

const AUTO_MS = 3200;

function kindPillClass(kind: BadgeKind): string {
  switch (kind) {
    case "clutch":
      return "bg-[#17313B] text-white";
    case "goodfirms":
      return "bg-[#155dfc] text-white";
    case "designrush":
      return "bg-[#0284c7] text-white";
  }
}

function kindLabel(kind: BadgeKind): string {
  switch (kind) {
    case "clutch":
      return "Clutch";
    case "goodfirms":
      return "GoodFirms";
    case "designrush":
      return "DesignRush";
  }
}

export function CertificationsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = certificationBadges.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % len), [len]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + len) % len), [len]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, AUTO_MS);
    return () => clearInterval(t);
  }, [paused, next]);

  const badge = certificationBadges[index];

  return (
    <section
      id="certifications"
      className="glass-section border-y border-white/50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="div" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Certifications 
          </h2>
        </Reveal>

        <motion.div
          className="relative mx-auto mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="glass-panel water-sheen overflow-hidden rounded-2xl shadow-lg"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="border-b border-white/40 px-6 py-4 sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${kindPillClass(badge.kind)}`}
                >
                  {kindLabel(badge.kind)}
                </span>
                <span className="text-sm font-semibold text-brand-accent">
                  {index + 1} / {len}
                </span>
                {paused ? (
                  <span className="text-xs font-medium text-slate-400">
                    Paused
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
                {badge.label}
              </h3>
            </div>

            <div className="relative flex min-h-[220px] items-center justify-center bg-gradient-to-b from-white/35 to-white/15 px-6 py-10 sm:min-h-[280px] sm:px-10">
              <div
                key={index}
                className="cert-badge-slide relative h-52 w-full max-w-md sm:h-64"
              >
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="(max-width: 768px) 100vw, 28rem"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <motion.button
              type="button"
              onClick={prev}
              className="glass-chip inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:text-brand-teal"
              aria-label="Previous badge"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <div className="flex gap-2">
              {certificationBadges.map((b, i) => (
                <button
                  key={b.src + b.label}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-brand-teal"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Show badge: ${b.label}`}
                  aria-current={i === index}
                />
              ))}
            </div>
            <motion.button
              type="button"
              onClick={next}
              className="glass-chip inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:text-brand-teal"
              aria-label="Next badge"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-slate-600">
            {badgeOfficialResources.map((r) => (
              <li key={r.href}>
                <motion.a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-teal underline-offset-2 hover:underline"
                  whileHover={{ y: -2 }}
                >
                  {r.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
