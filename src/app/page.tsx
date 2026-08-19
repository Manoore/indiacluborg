import Link from "next/link";
import { Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HeartWall from "@/components/HeartWall";
import Leaderboard from "@/components/Leaderboard";
import { getCampaign, getCommunities, getCommunityStats, getPublicParticipants, getTotals } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [campaign, totals, communities, participants, communityStats] = await Promise.all([
    getCampaign(),
    getTotals(),
    getCommunities(),
    getPublicParticipants(),
    getCommunityStats(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero campaign={campaign} totals={totals} />

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
            <HeartWall participants={participants} communities={communities} />
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="px-4">
            <Leaderboard communityStats={communityStats} />
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
