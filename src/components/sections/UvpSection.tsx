"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, PiggyBank } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const items = [
  {
    title: "Industry-standard quality",
    body: "Code reviews, QA checkpoints, and design critique baked into every sprint—not bolted on at the end.",
    icon: BadgeCheck,
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
    alt: "Team high-five after shipping quality work",
  },
  {
    title: "Budget-friendly engagement models",
    body: "Dedicated squads, fixed-scope pods, or hybrid outsourcing—pick the shape that matches your runway.",
    icon: PiggyBank,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    alt: "Planning finances on laptop",
  },
  {
    title: "Fast, predictable delivery",
    body: "Weekly demos, transparent boards, and clear SLAs so stakeholders always know what ships when.",
    icon: Clock,
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80",
    alt: "Productivity and time management",
  },
];

export function UvpSection() {
  return (
    <section id="value" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="div" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Unique value <span className="text-brand-teal">propositions</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            The reasons product teams keep RobertRM on speed dial.
          </p>
        </Reveal>

        <motion.div
          className="mt-14 grid gap-10 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={staggerItem}
                whileHover={{ y: -10, transition: { duration: 0.25 } }}
                className="glass-card water-sheen flex flex-col rounded-2xl p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="relative mx-auto h-36 w-full max-w-[220px] overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="220px"
                  />
                </div>
                <motion.div
                  className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal text-white shadow-md"
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                  transition={{ duration: 0.45 }}
                >
                  <Icon className="h-7 w-7" aria-hidden />
                </motion.div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
