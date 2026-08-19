"use client";

import { useMemo, useState } from "react";
import { Heart, Footprints, DollarSign, Download, LogOut, Users, Trophy } from "lucide-react";
import { adminLogoutAction } from "@/app/actions";
import { Campaign, Community, CommunityStats, Participant } from "@/lib/types";

type Tab = "overview" | "participants" | "communities";

export default function AdminDashboardClient({
  participants,
  communities,
  communityStats,
  totals,
  campaign,
}: {
  participants: Participant[];
  communities: Community[];
  communityStats: CommunityStats[];
  totals: { hearts: number; walkers: number; pledged: number };
  campaign: Campaign;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const communityMap = useMemo(() => new Map(communities.map((c) => [c.id, c.name])), [communities]);

  const walkingOnly = participants.filter((p) => p.participationType === "walking").length;
  const pledgingOnly = participants.filter((p) => p.participationType === "pledging").length;
  const both = participants.filter((p) => p.participationType === "both").length;

  function exportCsv() {
    const header = ["Name", "Email", "Phone", "Community", "Participation", "Pledge", "Status", "Date"];
    const rows = participants.map((p) => [
      `${p.firstName} ${p.lastName}`,
      p.email,
      p.phone ?? "",
      communityMap.get(p.communityId) ?? "",
      p.participationType,
      p.pledgeAmount ? `$${p.pledgeAmount}` : "",
      p.paymentStatus,
      new Date(p.createdAt).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heartwalk-participants.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen flex-1 bg-cream">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-navy">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-white">
            <Heart size={18} fill="#e11d48" color="#e11d48" />
            <span className="font-display text-sm font-bold">{campaign.title} — Admin</span>
          </div>
          <button
            onClick={() => adminLogoutAction()}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 px-4 pb-2 sm:px-6">
          {(
            [
              ["overview", "Overview"],
              ["participants", "Participants"],
              ["communities", "Communities"],
            ] as [Tab, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === t ? "bg-white text-navy" : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === "overview" && (
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={Heart} label="Hearts" value={totals.hearts} color="text-heart" />
              <StatCard icon={Footprints} label="Walkers" value={totals.walkers} color="text-navy" />
              <StatCard icon={DollarSign} label="Pledged" value={totals.pledged} color="text-heart-deep" money />
            </div>

            <div className="mt-8 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-navy">
                <Users size={16} /> Participation Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-cream p-4">
                  <p className="text-2xl font-extrabold text-navy">{walkingOnly}</p>
                  <p className="text-xs text-foreground/50">Walking Only</p>
                </div>
                <div className="rounded-xl bg-cream p-4">
                  <p className="text-2xl font-extrabold text-navy">{pledgingOnly}</p>
                  <p className="text-xs text-foreground/50">Pledging Only</p>
                </div>
                <div className="rounded-xl bg-cream p-4">
                  <p className="text-2xl font-extrabold text-navy">{both}</p>
                  <p className="text-xs text-foreground/50">Walking + Pledge</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-navy">
                <Trophy size={16} /> Top Communities
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left text-xs uppercase text-foreground/40">
                    <th className="py-2">Community</th>
                    <th className="py-2">Hearts</th>
                    <th className="py-2">Walkers</th>
                    <th className="py-2">Pledged</th>
                  </tr>
                </thead>
                <tbody>
                  {communityStats.slice(0, 8).map((c) => (
                    <tr key={c.communityId} className="border-b border-black/5">
                      <td className="py-2 font-medium text-navy">{c.communityName}</td>
                      <td className="py-2">{c.hearts}</td>
                      <td className="py-2">{c.walkers}</td>
                      <td className="py-2">${c.pledged.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "participants" && (
          <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 p-4">
              <h3 className="text-sm font-bold text-navy">Participants ({participants.length})</h3>
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left text-xs uppercase text-foreground/40">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Community</th>
                    <th className="px-4 py-2">Participation</th>
                    <th className="px-4 py-2">Pledge</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id} className="border-b border-black/5 hover:bg-cream/60">
                      <td className="px-4 py-2 font-medium text-navy">
                        {p.firstName} {p.lastName}
                      </td>
                      <td className="px-4 py-2 text-foreground/70">{communityMap.get(p.communityId)}</td>
                      <td className="px-4 py-2 capitalize text-foreground/70">{p.participationType}</td>
                      <td className="px-4 py-2 text-foreground/70">{p.pledgeAmount ? `$${p.pledgeAmount}` : "—"}</td>
                      <td className="px-4 py-2 text-foreground/50">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className="rounded-full bg-navy/8 px-2 py-0.5 text-xs font-semibold text-navy">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "communities" && (
          <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="border-b border-black/5 p-4">
              <h3 className="text-sm font-bold text-navy">Communities</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs uppercase text-foreground/40">
                  <th className="px-4 py-2">Community</th>
                  <th className="px-4 py-2">Hearts</th>
                  <th className="px-4 py-2">Walkers</th>
                  <th className="px-4 py-2">Pledged</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {communityStats.map((c) => (
                  <tr key={c.communityId} className="border-b border-black/5">
                    <td className="px-4 py-2 font-medium text-navy">{c.communityName}</td>
                    <td className="px-4 py-2">{c.hearts}</td>
                    <td className="px-4 py-2">{c.walkers}</td>
                    <td className="px-4 py-2">${c.pledged.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className="rounded-full bg-navy/8 px-2 py-0.5 text-xs font-semibold text-navy">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  money,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  money?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <Icon className={color} size={20} />
      <p className="mt-2 font-display text-2xl font-extrabold text-navy">
        {money ? "$" : ""}
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-foreground/50">{label}</p>
    </div>
  );
}
