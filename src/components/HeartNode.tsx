"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Footprints } from "lucide-react";
import { Participant, ParticipationType } from "@/lib/types";

const TYPE_COLOR: Record<ParticipationType, { fill: string; deep: string; label: string }> = {
  walking: { fill: "#14b8a6", deep: "#0f766e", label: "Walking" },
  pledging: { fill: "#f59e0b", deep: "#b45309", label: "Pledging" },
  both: { fill: "#c026d3", deep: "#86198f", label: "Walking + Pledging" },
};

export default function HeartNode({
  participant,
  communityName,
  index,
}: {
  participant: Participant;
  communityName: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const { fill: color, deep: colorDeep } = TYPE_COLOR[participant.participationType];
  const label =
    participant.displayNameMode === "anonymous"
      ? "A friend"
      : participant.displayNameMode === "full"
        ? `${participant.firstName} ${participant.lastName}`
        : participant.firstName;

  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, scale: 0.4, y: 12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "50px" }}
        transition={{ delay: (index % 24) * 0.03, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.18, zIndex: 20 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        style={{ ["--tilt" as string]: `${(index % 5) - 2}deg`, animationDelay: `${(index % 7) * 0.3}s` }}
        className="animate-float group flex flex-col items-center gap-1 rounded-2xl p-1.5 focus:outline-none"
      >
        <Heart
          className="drop-shadow-sm transition-transform"
          size={index % 3 === 0 ? 30 : 24}
          fill={color}
          color={color}
          strokeWidth={1.5}
        />
        <span className="text-[10px] font-medium text-navy/70 group-hover:text-navy">{label}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 top-full z-40 mt-2 w-52 -translate-x-1/2 rounded-xl border border-black/5 bg-white p-3 text-left shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Heart size={16} fill={color} color={color} />
                <span className="font-semibold text-navy">{label}</span>
              </div>
              <div className="mt-1 text-xs font-medium text-navy/60">{communityName}</div>
              <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: colorDeep }}>
                {(participant.participationType === "walking" || participant.participationType === "both") && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ backgroundColor: `${TYPE_COLOR.walking.fill}1a`, color: TYPE_COLOR.walking.deep }}
                  >
                    <Footprints size={12} /> Walking
                  </span>
                )}
                {(participant.participationType === "pledging" || participant.participationType === "both") && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ backgroundColor: `${TYPE_COLOR.pledging.fill}1a`, color: TYPE_COLOR.pledging.deep }}
                  >
                    <Heart size={12} /> Pledging
                  </span>
                )}
              </div>
              {participant.dedication && (
                <p className="mt-2 text-xs italic text-foreground/60">&ldquo;{participant.dedication}&rdquo;</p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
