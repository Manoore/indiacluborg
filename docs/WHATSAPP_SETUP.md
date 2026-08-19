# WhatsApp (Meta Cloud API) setup

Code is ready in `src/lib/whatsapp.ts`, called from `registerParticipant` in `src/app/actions.ts` on every new registration that has a phone number. It no-ops (logs and returns) until the env vars below are set — none of the Meta-side steps can be automated, they require your Meta account.

## 1. Meta Business + WhatsApp app
1. Go to business.facebook.com — create/verify a Meta Business Account (if not already have one).
2. Go to developers.facebook.com/apps → Create App → type "Business" → add the "WhatsApp" product.
3. Under WhatsApp → API Setup, note the **Phone Number ID** (test number works for dev; production needs a real number added + verified).
4. Generate a **permanent access token**: Business Settings → Users → System Users → create a system user → assign the WhatsApp app → generate a token with `whatsapp_business_messaging` permission. (The temporary token shown in API Setup expires in 24h — don't use that for production.)

## 2. Message template (required — first message to a user must be a template)
1. WhatsApp Manager → Message Templates → Create Template.
2. Category: **Utility**. Name: `heart_confirmation`. Language: `en_US`.
3. Body (must match the param order in `src/lib/whatsapp.ts` — {{1}}=first name, {{2}}=community):
   ```
   ❤️ You're in, {{1}}! You just joined Team India — {{2}} community. See you September 26 for the Heart Walk!
   ```
4. Submit for review. Approval usually takes a few hours, sometimes up to 2-3 days.

## 3. Configure env vars
Add to `.env` (dev) and your Vercel project's Environment Variables (production):
- `WHATSAPP_TOKEN` — the permanent access token from step 1.4
- `WHATSAPP_PHONE_NUMBER_ID` — from step 1.3
- `WHATSAPP_TEMPLATE_NAME` — defaults to `heart_confirmation`
- `WHATSAPP_TEMPLATE_LANG` — defaults to `en_US`

That's it — no separate deploy step. It's plain server-side code that runs as part of the registration request.

## Later (not built yet)
Day-before reminder and post-walk thank-you would each be a small scheduled job (Vercel Cron → API route) querying participants and sending the same way — say the word once confirmation messages are live and I'll add them.
