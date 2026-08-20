"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateParticipantAction } from "@/app/actions";
import { Community, ParticipationType, Participant, PaymentStatus } from "@/lib/types";

export default function ParticipantEditModal({
  participant,
  communities,
  onClose,
  onSaved,
}: {
  participant: Participant;
  communities: Community[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [firstName, setFirstName] = useState(participant.firstName);
  const [lastName, setLastName] = useState(participant.lastName);
  const [email, setEmail] = useState(participant.email ?? "");
  const [phone, setPhone] = useState(participant.phone);
  const [communityId, setCommunityId] = useState(participant.communityId);
  const [participationType, setParticipationType] = useState<ParticipationType>(participant.participationType);
  const [pledgeAmount, setPledgeAmount] = useState<number | "">(participant.pledgeAmount || "");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(participant.paymentStatus);
  const [dedication, setDedication] = useState(participant.dedication ?? "");
  const [heartVisible, setHeartVisible] = useState(participant.heartVisible);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateParticipantAction(participant.id, {
      firstName,
      lastName,
      email: email || undefined,
      phone,
      communityId,
      participationType,
      pledgeAmount: Number(pledgeAmount) || 0,
      paymentStatus,
      dedication: dedication || undefined,
      heartVisible,
    });
    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold text-navy">Edit Participant</h3>
          <button onClick={onClose} className="text-foreground/40 hover:text-navy">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name">
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" />
            </Field>
            <Field label="Last Name">
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
            </Field>
            <Field label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Community">
            <select value={communityId} onChange={(e) => setCommunityId(e.target.value)} className="input">
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Participation">
              <select
                value={participationType}
                onChange={(e) => setParticipationType(e.target.value as ParticipationType)}
                className="input"
              >
                <option value="walking">Walking</option>
                <option value="pledging">Pledging</option>
                <option value="both">Walking + Pledging</option>
              </select>
            </Field>
            <Field label="Pledge ($)">
              <input
                type="number"
                min={0}
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="input"
              />
            </Field>
          </div>
          <Field label="Payment Status">
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="input"
            >
              <option value="unknown">Unknown</option>
              <option value="pledged">Pledged</option>
              <option value="paid">Paid</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <Field label="Dedication">
            <textarea
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input type="checkbox" checked={heartVisible} onChange={(e) => setHeartVisible(e.target.checked)} />
            Visible on public Heart Wall
          </label>

          {error && <p className="text-sm font-medium text-heart-deep">{error}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/60 hover:text-navy"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-heart px-5 py-2 text-sm font-bold text-white transition hover:bg-heart-deep disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
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
