import "server-only";

function toE164Digits(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  return digits.length >= 10 ? digits : null;
}

// Sends the approved "heart_confirmation" WhatsApp template via Meta's Cloud API.
// No-ops (logs + returns) until WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID are set —
// see functions-legacy/WHATSAPP_SETUP.md for the Meta-side setup checklist.
export async function sendWhatsAppConfirmation(params: {
  phone: string;
  firstName: string;
  communityName: string;
}) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "heart_confirmation";
  const templateLang = process.env.WHATSAPP_TEMPLATE_LANG || "en_US";

  if (!token || !phoneNumberId) {
    console.log("[whatsapp] not configured, skipping send");
    return;
  }

  const to = toE164Digits(params.phone);
  if (!to) {
    console.log("[whatsapp] invalid phone, skipping send");
    return;
  }

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: templateLang },
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
    }),
  });

  if (!res.ok) {
    console.error("[whatsapp] send failed", res.status, await res.text());
  }
}
