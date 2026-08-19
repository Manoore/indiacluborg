"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Footprints, DollarSign, Trophy } from "lucide-react";
import { CommunityStats } from "@/lib/types";

type Metric = "hearts" | "walkers" | "pledged";

const METRIC_META: Record<Metric, { label: string; icon: React.ElementType; format: (n: number) => string }> = {
  hearts: { label: "Most Hearts", icon: Heart, format: (n) => `${n}` },
  walkers: { label: "Most Walkers", icon: Footprints, format: (n) => `${n}` },
  pledged: { label: "Most Pledged", icon: DollarSign, format: (n) => `$${n.toLocaleString()}` },
};

export default function Leaderboard({ communityStats }: { communityStats: CommunityStats[] }) {
  return (
    <div id="communities" className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-center gap-2">
        <Trophy className="text-gold" />
        <h2 className="font-display text-2xl font-extrabold text-navy">Team India Community Challenge</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {(Object.keys(METRIC_META) as Metric[]).map((metric) => {
          const meta = METRIC_META[metric];
          const Icon = meta.icon;
          const ranked = [...communityStats].sort((a, b) => b[metric] - a[metric]).slice(0, 5);
          return (
            <div key={metric} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-navy">
                <Icon size={16} className="text-heart" />
                {meta.label}
              </div>
              <ol className="space-y-2">
                {ranked.map((c, i) => (
                  <motion.li
                    key={c.communityId}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/community/${c.communityId}`}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-cream"
                    >
                      <span className="flex items-center gap-2 font-medium text-foreground/80">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            i === 0
                              ? "bg-gold text-white"
                              : i === 1
                                ? "bg-navy/20 text-navy"
                                : i === 2
                                  ? "bg-saffron/30 text-saffron-deep"
                                  : "bg-black/5 text-foreground/50"
                          }`}
                        >
                          {i + 1}
                        </span>
                        {c.communityName.replace(" Community", "")}
                      </span>
                      <span className="font-semibold text-heart-deep">{meta.format(c[metric])}</span>
                    </Link>
                  </motion.li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
