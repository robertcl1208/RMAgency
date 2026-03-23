"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bot,
  LayoutTemplate,
  MonitorSmartphone,
  Smartphone,
  CloudCog,
  Workflow,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

const highlights = [
  { label: "UI/UX Design", icon: LayoutTemplate },
  { label: "Web development", icon: MonitorSmartphone },
  { label: "SaaS App development", icon: CloudCog },
  { label: "Mobile App development", icon: Smartphone },
  { label: "CRM & Automation", icon: Workflow },
  { label: "AI integration", icon: Bot },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-mint via-white to-sky-50/40">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-teal-light/20 blur-3xl animate-blob"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-accent/15 blur-3xl animate-blob-reverse"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-cyan-200/20 blur-3xl animate-blob-slow"
        aria-hidden
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={staggerItem}
            className="text-sm font-semibold uppercase tracking-wider text-brand-teal"
          >
            Outsourcing & software development agency
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-tight"
          >
            Empowering businesses with{" "}
            <span className="bg-gradient-to-r from-brand-teal to-brand-teal-light bg-clip-text text-transparent">
              Digital Solutions
            </span>
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="mt-5 max-w-xl text-lg text-slate-600"
          >
            We design and ship products your users love—fast, scalable, and
            ready for growth.
          </motion.p>

          <motion.ul
            variants={staggerContainer}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            {highlights.map(({ label, icon: Icon }) => (
              <motion.li
                key={label}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card water-sheen flex items-center gap-3 rounded-xl px-4 py-3 transition-shadow hover:shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {label}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={staggerItem}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.a
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl bg-brand-teal px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-teal/30"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              Start a project
            </motion.a>
            <motion.a
              href="#services"
              className="glass-chip inline-flex items-center justify-center rounded-xl border-2 border-brand-teal/40 px-6 py-3.5 text-sm font-semibold text-brand-teal hover:border-brand-teal/70 hover:bg-white/40"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              Explore services
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-lg pb-14 sm:pb-16 lg:max-w-none"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div className="mirror-stack">
            <div className="mirror-stack__glow" aria-hidden />
            <div className="mirror-stack__line" aria-hidden />
            <motion.div
              className="glass-frame water-sheen relative z-[2] aspect-[4/3] overflow-hidden rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
                alt="Product team collaborating in a modern office"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </div>
          <motion.div
            className="glass-panel water-sheen absolute -bottom-4 -left-4 z-[3] hidden max-w-[200px] rounded-xl p-3 shadow-lg sm:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            whileHover={{ y: -6, rotate: 1 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"
              alt="Professional portrait"
              width={180}
              height={120}
              className="h-24 w-full rounded-lg object-cover"
            />
            <p className="mt-2 text-xs font-semibold text-slate-800">
              Dedicated squads
            </p>
            <p className="text-[11px] text-slate-500">Design · Eng · AI</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
