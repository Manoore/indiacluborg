"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Footprints, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { registerParticipant } from "@/app/actions";
import { Community, DisplayNameMode, ParticipationType } from "@/lib/types";

const STEPS = ["Participation", "About You", "Community", "Pledge", "Dedication"];
const PLEDGE_PRESETS = [25, 50, 100, 250, 500];

export default function JoinWizard({ communities }: { communities: Community[] }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [participationType, setParticipationType] = useState<ParticipationType | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [otherCommunity, setOtherCommunity] = useState("");
  const [pledgeAmount, setPledgeAmount] = useState<number | "">("");
  const [dedication, setDedication] = useState("");
  const [displayMode, setDisplayMode] = useState<DisplayNameMode>("first");
  const [consent, setConsent] = useState(true);

  const needsPledge = participationType === "pledging" || participationType === "both";
  const effectiveSteps = needsPledge ? STEPS : STEPS.filter((s) => s !== "Pledge");
  const stepKey = effectiveSteps[step];

  function canAdvance() {
    if (stepKey === "Participation") return !!participationType;
    if (stepKey === "About You") return firstName.trim() && email.trim().includes("@");
    if (stepKey === "Community") return communityId && (communityId !== "other" || otherCommunity.trim());
    if (stepKey === "Pledge") return true;
    return true;
  }

  function next() {
    if (step < effectiveSteps.length - 1) setStep(step + 1);
    else handleSubmit();
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await registerParticipant({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        participationType: participationType!,
        communityId,
        pledgeAmount: needsPledge ? Number(pledgeAmount) || 0 : 0,
        dedication: dedication.trim() || undefined,
        displayNameMode: displayMode,
        heartVisible: consent,
      });
      // registerParticipant redirects on success; this line only runs on failure paths that don't throw.
    } catch (err) {
      // Next.js redirect() throws a special error to perform navigation — rethrow it, only show real errors.
      if (err instanceof Error && err.message === "Missing required fields") {
        setSubmitError("Please fill in the required fields.");
        setSubmitting(false);
        return;
      }
      if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / effectiveSteps.length) * 100;

  return (
    <div className="mx-auto max-w-xl px-4">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">❤️ Join Team India</h1>
        <p className="mt-1 text-sm text-foreground/60">{effectiveSteps[step]}</p>
      </div>

      <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-black/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-heart-deep to-heart"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg sm:p-8">
        <AnimatePresence initial={false}>
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {stepKey === "Participation" && (
              <div>
                <h2 className="mb-4 text-center font-semibold text-navy">What are you doing?</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {(
                    [
                      { type: "walking" as ParticipationType, icon: Footprints, label: "I'm Walking", desc: "I'll participate" },
                      { type: "pledging" as ParticipationType, icon: Heart, label: "I'm Pledging", desc: "I'll donate" },
                      { type: "both" as ParticipationType, icon: Heart, label: "Both", desc: "Walk + Pledge" },
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setParticipationType(opt.type)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition ${
                        participationType === opt.type
                          ? "border-heart bg-heart/5 shadow-md"
                          : "border-black/10 hover:border-heart/40"
                      }`}
                    >
                      <opt.icon
                        size={28}
                        className={participationType === opt.type ? "text-heart" : "text-navy/50"}
                        fill={opt.type !== "walking" && participationType === opt.type ? "#e11d48" : "none"}
                      />
                      <span className="text-sm font-bold text-navy">{opt.label}</span>
                      <span className="text-xs text-foreground/50">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stepKey === "About You" && (
              <div className="space-y-4">
                <h2 className="mb-2 text-center font-semibold text-navy">Tell us about yourself</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name *">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input"
                      placeholder="AJ"
                    />
                  </Field>
                  <Field label="Last Name">
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input"
                      placeholder="Jindal"
                    />
                  </Field>
                </div>
                <Field label="Email *">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="aj@example.com"
                  />
                </Field>
                <Field label="Mobile Phone (optional — for WhatsApp updates)">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    placeholder="+1 555 123 4567"
                  />
                </Field>
                <p className="text-[11px] text-foreground/40">
                  Your email and phone stay private — never shown on the public Heart Wall.
                </p>
              </div>
            )}

            {stepKey === "Community" && (
              <div className="space-y-4">
                <h2 className="mb-2 text-center font-semibold text-navy">
                  Which community are you representing?
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {communities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCommunityId(c.id)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition ${
                        communityId === c.id
                          ? "border-heart bg-heart/5 text-heart-deep"
                          : "border-black/10 text-navy/70 hover:border-heart/40"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                {communityId === "other" && (
                  <Field label="Community Name">
                    <input
                      value={otherCommunity}
                      onChange={(e) => setOtherCommunity(e.target.value)}
                      className="input"
                      placeholder="Enter your community"
                    />
                  </Field>
                )}
              </div>
            )}

            {stepKey === "Pledge" && (
              <div className="space-y-4">
                <h2 className="mb-2 text-center font-semibold text-navy">My pledge</h2>
                <div className="grid grid-cols-3 gap-2">
                  {PLEDGE_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setPledgeAmount(amt)}
                      className={`rounded-xl border-2 py-3 text-sm font-bold transition ${
                        pledgeAmount === amt
                          ? "border-heart bg-heart/5 text-heart-deep"
                          : "border-black/10 text-navy/70 hover:border-heart/40"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={0}
                    value={PLEDGE_PRESETS.includes(Number(pledgeAmount)) ? "" : pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Other $"
                    className="input rounded-xl text-center font-bold"
                  />
                </div>
                <p className="text-[11px] text-foreground/40">Optional — every pledge helps, no minimum.</p>
              </div>
            )}

            {stepKey === "Dedication" && (
              <div className="space-y-4">
                <Field label="Why are you walking / pledging? (optional)">
                  <textarea
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value.slice(0, 150))}
                    maxLength={150}
                    rows={3}
                    className="input resize-none"
                    placeholder="Walking for a healthier community ❤️"
                  />
                </Field>
                <p className="text-right text-[11px] text-foreground/40">{dedication.length}/150</p>

                <Field label="How should your heart appear?">
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { v: "first" as DisplayNameMode, label: firstName || "First name" },
                        { v: "full" as DisplayNameMode, label: `${firstName} ${lastName}`.trim() || "Full name" },
                        { v: "anonymous" as DisplayNameMode, label: "Anonymous" },
                      ]
                    ).map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setDisplayMode(opt.v)}
                        className={`rounded-full border-2 px-4 py-1.5 text-sm font-medium transition ${
                          displayMode === opt.v
                            ? "border-heart bg-heart/5 text-heart-deep"
                            : "border-black/10 text-navy/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <label className="flex items-start gap-2 text-sm text-foreground/70">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1"
                  />
                  I agree to have my name displayed on the Team India Heart Wall.
                </label>
                <p className="rounded-xl bg-cream p-3 text-[11px] text-foreground/50">
                  ❤️ Your contact information stays private and is only accessible to authorized campaign
                  administrators.
                </p>
                {submitError && <p className="text-sm font-medium text-heart-deep">{submitError}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-navy/60 transition hover:text-navy disabled:opacity-0"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={next}
            disabled={!canAdvance() || submitting}
            className="flex items-center gap-1.5 rounded-full bg-heart px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-heart-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === effectiveSteps.length - 1 ? (
              <>
                {submitting ? "Adding..." : "Add My Heart"} <Heart size={16} fill="white" />
              </>
            ) : (
              <>
                Continue <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {effectiveSteps.map((s, i) => (
          <div
            key={s}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition ${
              i < step ? "bg-heart-deep text-white" : i === step ? "bg-heart text-white" : "bg-black/5 text-foreground/30"
            }`}
          >
            {i < step ? <Check size={12} /> : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-navy/70">{label}</span>
      {children}
    </label>
  );
}
