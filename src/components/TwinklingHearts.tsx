"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// Deterministic pseudo-random so server and client render the same positions
// (avoids hydration mismatch — Math.random() would differ between passes).
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(7);
const SMALL_HEARTS = Array.from({ length: 16 }).map((_, i) => ({
  id: `s${i}`,
  top: `${rand() * 100}%`,
  left: `${rand() * 100}%`,
  size: 8 + rand() * 14,
  duration: 1.8 + rand() * 2.2,
  delay: rand() * 4,
  repeatDelay: 1 + rand() * 2,
  maxOpacity: 0.9,
}));
const BIG_HEARTS = Array.from({ length: 7 }).map((_, i) => ({
  id: `b${i}`,
  top: `${rand() * 100}%`,
  left: `${rand() * 100}%`,
  size: 28 + rand() * 26,
  duration: 2.6 + rand() * 2.4,
  delay: rand() * 5,
  repeatDelay: 1.5 + rand() * 2.5,
  maxOpacity: 0.45,
}));
const HEARTS = [...SMALL_HEARTS, ...BIG_HEARTS];

export default function TwinklingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ top: h.top, left: h.left }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, h.maxOpacity, 0], scale: [0, 1, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            repeatDelay: h.repeatDelay,
            ease: "easeInOut",
          }}
        >
          <Heart size={h.size} className="fill-white text-white drop-shadow" />
        </motion.div>
      ))}
    </div>
  );
}
