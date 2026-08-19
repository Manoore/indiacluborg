import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

initializeApp();

const WHATSAPP_TOKEN = defineSecret("WHATSAPP_TOKEN");
const WHATSAPP_PHONE_NUMBER_ID = defineString("WHATSAPP_PHONE_NUMBER_ID");
const WHATSAPP_TEMPLATE_NAME = defineString("WHATSAPP_TEMPLATE_NAME", {
  default: "heart_confirmation",
});
const WHATSAPP_TEMPLATE_LANG = defineString("WHATSAPP_TEMPLATE_LANG", {
  default: "en_US",
});

interface Participant {
  firstName: string;
  phone?: string;
  communityId: string;
  participationType: "walking" | "pledging" | "both";
  pledgeAmount?: number;
}

function toE164Digits(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  return digits.length >= 10 ? digits : null;
}

async function sendWhatsAppTemplate(params: {
  to: string;
  firstName: string;
  communityName: string;
  token: string;
  phoneNumberId: string;
  templateName: string;
  templateLang: string;
}) {
  const url = `https://graph.facebook.com/v20.0/${params.phoneNumberId}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: params.to,
    type: "template",
    template: {
      name: params.templateName,
      language: { code: params.templateLang },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: params.firstName },
            { type: "text", text: params.communityName },
          ],
        },
      ],
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`WhatsApp send failed (${res.status}): ${errText}`);
  }

  return res.json();
}

// Fires whenever a new participant registers (Firestore: participants/{id}).
// Requires an approved Meta message template — see functions/WHATSAPP_SETUP.md.
export const onParticipantCreated = onDocumentCreated(
  {
    document: "participants/{participantId}",
    secrets: [WHATSAPP_TOKEN],
  },
  async (event) => {
    const participant = event.data?.data() as Participant | undefined;
    if (!participant) return;

    const phoneDigits = participant.phone ? toE164Digits(participant.phone) : null;
    if (!phoneDigits) {
      logger.info("No valid phone on participant, skipping WhatsApp send", {
        id: event.params.participantId,
      });
      return;
    }

    const db = getFirestore();
    const communitySnap = await db.collection("communities").doc(participant.communityId).get();
    const communityName = (communitySnap.data()?.name as string) ?? "Team India";

    try {
      await sendWhatsAppTemplate({
        to: phoneDigits,
        firstName: participant.firstName,
        communityName,
        token: WHATSAPP_TOKEN.value(),
        phoneNumberId: WHATSAPP_PHONE_NUMBER_ID.value(),
        templateName: WHATSAPP_TEMPLATE_NAME.value(),
        templateLang: WHATSAPP_TEMPLATE_LANG.value(),
      });
      logger.info("WhatsApp confirmation sent", { id: event.params.participantId });
    } catch (err) {
      logger.error("WhatsApp send error", { id: event.params.participantId, err: String(err) });
    }
  }
);

// Mirrors only public-safe fields into heartWall/{id} so Firestore rules can give
// the public Heart Wall read access without ever exposing email/phone/pledge/status.
export const syncPublicHeartWall = onDocumentWritten("participants/{participantId}", async (event) => {
  const db = getFirestore();
  const ref = db.collection("heartWall").doc(event.params.participantId);
  const after = event.data?.after.data() as Participant & {
    displayName?: string;
    displayNameMode?: string;
    dedication?: string;
    heartVisible?: boolean;
    approved?: boolean;
    createdAt?: unknown;
  } | undefined;

  if (!after || !after.heartVisible || !after.approved) {
    await ref.delete().catch(() => undefined);
    return;
  }

  await ref.set({
    displayName: after.displayName,
    communityId: after.communityId,
    participationType: after.participationType,
    dedication: after.dedication ?? null,
    createdAt: after.createdAt ?? null,
  });
});
