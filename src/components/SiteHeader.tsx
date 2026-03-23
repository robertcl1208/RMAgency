"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "#services", label: "Services" },
  { href: "#certifications", label: "Certifications" },
  { href: "#value", label: "Why Us" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="glass-nav sticky top-0 z-50 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <motion.span
            className="relative block shrink-0 overflow-hidden rounded-2xl shadow-md ring-2 ring-brand-teal/15"
            whileHover={{ scale: 1.06, rotate: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Image
              src="/logo.png"
              alt="Robert RM TechAgency"
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
              priority
            />
          </motion.span>
          <span className="text-lg font-bold tracking-tight text-brand-teal-dark">
            Robert<span className="text-brand-accent">RM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-slate-600"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              <span className="transition-colors group-hover:text-brand-teal">
                {item.label}
              </span>
              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-brand-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </motion.a>
          ))}
          <motion.a
            href="#trial"
            className="rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-amber-500/25"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Free trial
          </motion.a>
        </nav>

        <motion.button
          type="button"
          className="inline-flex rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.94 }}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="glass-mobile-sheet px-4 py-4 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-slate-700 hover:bg-white/60 hover:text-brand-teal"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#trial"
                className="mt-2 rounded-xl bg-brand-accent py-3 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Free trial
              </motion.a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
