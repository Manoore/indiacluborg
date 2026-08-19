"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import HeartNode from "./HeartNode";
import { Community, ParticipationType, Participant } from "@/lib/types";

export default function HeartWall({
  participants,
  communities,
  hideFilters = false,
}: {
  participants: Participant[];
  communities: Community[];
  hideFilters?: boolean;
}) {
  const [community, setCommunity] = useState<string>("all");
  const [participation, setParticipation] = useState<"all" | ParticipationType>("all");

  const communityMap = useMemo(() => new Map(communities.map((c) => [c.id, c.name])), [communities]);

  const filtered = useMemo(() => {
    return participants
      .filter((p) => community === "all" || p.communityId === community)
      .filter((p) => participation === "all" || p.participationType === participation);
  }, [participants, community, participation]);

  return (
    <div id="wall">
      {!hideFilters && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm outline-none focus:border-heart"
          >
            <option value="all">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={participation}
            onChange={(e) => setParticipation(e.target.value as typeof participation)}
            className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm outline-none focus:border-heart"
          >
            <option value="all">Everyone</option>
            <option value="walking">Walking</option>
            <option value="pledging">Pledging</option>
            <option value="both">Walking + Pledging</option>
          </select>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-foreground/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-walk" /> Walking
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pledge" /> Pledging
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-both" /> Walking + Pledging
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-foreground/50">No hearts here yet — be the first!</p>
      ) : (
        <motion.div
          layout
          className="mx-auto grid max-w-4xl grid-cols-5 place-items-center gap-x-2 gap-y-4 rounded-3xl border border-black/5 bg-white/60 p-6 shadow-inner sm:grid-cols-7 md:grid-cols-9"
        >
          {filtered.map((p, i) => (
            <HeartNode key={p.id} participant={p} communityName={communityMap.get(p.communityId) ?? ""} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
