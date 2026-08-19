"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Footprints } from "lucide-react";
import { Participant } from "@/lib/types";

const PALETTE = ["#e11d48", "#ff9933", "#0f9d58", "#f4b942", "#be123c"];

function hashColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % PALETTE.length;
  return PALETTE[h];
}

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
  const color = hashColor(participant.id);
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
              className="absolute left-1/2 top-full z-40 mt-2 w-52 -translate-x-1/2 rounded-xl border border-heart/10 bg-white p-3 text-left shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Heart size={16} fill={color} color={color} />
                <span className="font-semibold text-navy">{label}</span>
              </div>
              <div className="mt-1 text-xs font-medium text-saffron-deep">{communityName}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-foreground/70">
                {(participant.participationType === "walking" || participant.participationType === "both") && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-india-green/10 px-2 py-0.5 text-india-green-deep">
                    <Footprints size={12} /> Walking
                  </span>
                )}
                {(participant.participationType === "pledging" || participant.participationType === "both") && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-heart/10 px-2 py-0.5 text-heart-deep">
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
