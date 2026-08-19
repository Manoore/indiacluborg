"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Footprints, Copy, Check } from "lucide-react";
import { Participant } from "@/lib/types";

export default function ConfirmationView({
  participant,
  communityName,
  teamName,
  campaignDate,
}: {
  participant: Participant;
  communityName: string;
  teamName: string;
  campaignDate: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const duration = 1500;
    const end = Date.now() + duration;
    const colors = ["#ff9933", "#ffffff", "#0f9d58", "#e11d48"];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const shareText = `❤️ I just joined ${teamName} for the Heart Walk on ${new Date(
    campaignDate
  ).toLocaleDateString("en-US", { month: "long", day: "numeric" })}! I'm walking with the ${communityName} to support heart health. Join me and add your heart!`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-14 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <Heart size={56} fill="#e11d48" color="#e11d48" className="mx-auto drop-shadow-md" />
      </motion.div>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-navy">Your Heart Has Been Added!</h1>
      <p className="mt-2 text-foreground/60">
        Welcome to {teamName}, {participant.firstName}!
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-auto mt-8 w-fit rounded-3xl border border-heart/10 bg-white px-10 py-6 shadow-lg"
      >
        <Heart size={40} fill="#e11d48" color="#e11d48" className="mx-auto animate-float" />
        <p className="mt-2 font-display text-lg font-bold text-navy">{participant.displayName}</p>
        <p className="text-sm font-medium text-saffron-deep">{communityName}</p>
      </motion.div>

      <div className="mx-auto mt-6 flex w-fit flex-col gap-2 rounded-2xl bg-cream p-4 text-left text-sm">
        <p className="font-semibold text-navy">Your commitment</p>
        {(participant.participationType === "walking" || participant.participationType === "both") && (
          <p className="flex items-center gap-2 text-india-green-deep">
            <Footprints size={16} /> Walking
          </p>
        )}
        {(participant.participationType === "pledging" || participant.participationType === "both") && (
          <p className="flex items-center gap-2 text-heart-deep">
            <Heart size={16} /> ${participant.pledgeAmount} pledge
          </p>
        )}
      </div>

      <p className="mx-auto mt-6 max-w-sm text-sm font-medium text-navy/80">
        {participant.participationType === "pledging"
          ? "Thank you for supporting the Heart Walk."
          : participant.participationType === "walking"
            ? "See you September 26!"
            : "We can't wait to see you on September 26!"}
      </p>

      <div className="mt-8">
        <p className="mb-3 text-sm font-bold text-navy">Share Your Heart ❤️</p>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            className="rounded-full bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a
            className="rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      <Link href="/" className="mt-10 inline-block font-semibold text-heart underline-offset-4 hover:underline">
        ← Back to the Heart Wall
      </Link>
    </div>
  );
}
