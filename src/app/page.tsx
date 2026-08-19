"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartWall from "@/components/HeartWall";
import Leaderboard from "@/components/Leaderboard";
import StatCounter from "@/components/StatCounter";
import { useData } from "@/lib/store";

export default function Home() {
  const { campaign, totals } = useData();
  const walkDate = new Date(campaign.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="hero-gradient bg-gradient-animated relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-4xl sm:text-5xl"
            >
              🇮🇳
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-6xl"
            >
              {campaign.teamName} <Heart className="inline align-baseline" fill="white" size={40} />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 font-display text-lg font-bold uppercase tracking-[0.2em] text-white/90"
            >
              Heart Walk 2026 · {walkDate}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-5 max-w-xl text-balance text-lg font-medium text-white/95 sm:text-xl"
            >
              {campaign.tagline}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-3 max-w-lg text-sm text-white/85"
            >
              Whether you&rsquo;re walking, pledging your support, or doing both — every heart makes a difference.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/join"
                className="animate-pulse-glow group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-heart shadow-xl transition hover:scale-105"
              >
                <Heart fill="#e11d48" color="#e11d48" size={18} />
                Add Your Heart
                <ArrowRight className="transition group-hover:translate-x-1" size={16} />
              </Link>
              <a
                href="#communities"
                className="rounded-full border-2 border-white/70 px-7 py-3.5 text-base font-bold text-white transition hover:bg-white/10"
              >
                Explore Our Communities
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4 rounded-2xl border border-white/30 bg-white/15 p-5 backdrop-blur-md"
            >
              <div>
                <StatCounter value={totals.hearts} className="font-display text-3xl font-extrabold text-white" />
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Hearts</p>
              </div>
              <div>
                <StatCounter value={totals.walkers} className="font-display text-3xl font-extrabold text-white" />
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Walkers</p>
              </div>
              <div>
                <StatCounter
                  value={totals.pledged}
                  prefix="$"
                  className="font-display text-3xl font-extrabold text-white"
                />
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Pledged</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
              One India. <span className="text-gradient">One Heart.</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-foreground/60">
              Every heart below represents someone who joined Team India. Tap a heart to see their story.
            </p>
          </div>
          <div className="mt-10 px-4">
            <HeartWall />
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="px-4">
            <Leaderboard />
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-2xl rounded-3xl bg-navy px-6 py-10 text-center shadow-xl sm:px-10">
            <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
              Ready to add your heart?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              Join {campaign.teamName} in under two minutes. Walk, pledge, or both — every heart counts.
            </p>
            <Link
              href="/join"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-heart px-7 py-3.5 text-base font-bold text-white shadow-lg transition hover:scale-105 hover:bg-heart-deep"
            >
              <Heart fill="white" size={18} /> Add Your Heart
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
