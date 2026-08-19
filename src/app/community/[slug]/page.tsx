"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Footprints, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartWall from "@/components/HeartWall";
import StatCounter from "@/components/StatCounter";
import { useData } from "@/lib/store";

export default function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { communities, communityStats, campaign } = useData();
  const community = communities.find((c) => c.id === slug);
  const stats = communityStats.find((c) => c.communityId === slug);

  if (!community) return notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="hero-gradient bg-gradient-animated py-14 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <Heart size={40} fill="white" className="mx-auto mb-3 drop-shadow" />
            <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{community.name}</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-white/85">
              {campaign.teamName} — Heart Walk 2026
            </p>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4 rounded-2xl border border-white/30 bg-white/15 p-5 backdrop-blur-md">
              <div>
                <StatCounter value={stats?.hearts ?? 0} className="font-display text-2xl font-extrabold text-white" />
                <p className="flex items-center justify-center gap-1 text-[11px] font-semibold text-white/80">
                  <Heart size={11} /> Hearts
                </p>
              </div>
              <div>
                <StatCounter
                  value={stats?.walkers ?? 0}
                  className="font-display text-2xl font-extrabold text-white"
                />
                <p className="flex items-center justify-center gap-1 text-[11px] font-semibold text-white/80">
                  <Footprints size={11} /> Walkers
                </p>
              </div>
              <div>
                <StatCounter
                  value={stats?.pledged ?? 0}
                  prefix="$"
                  className="font-display text-2xl font-extrabold text-white"
                />
                <p className="flex items-center justify-center gap-1 text-[11px] font-semibold text-white/80">
                  <DollarSign size={11} /> Pledged
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="px-4">
            <HeartWall communityId={community.id} />
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-lg rounded-3xl bg-navy px-6 py-8 text-center shadow-xl">
            <h3 className="font-display text-xl font-extrabold text-white">Join the {community.name}</h3>
            <Link
              href="/join"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-heart px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:bg-heart-deep"
            >
              <Heart fill="white" size={16} /> Add Your Heart
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
