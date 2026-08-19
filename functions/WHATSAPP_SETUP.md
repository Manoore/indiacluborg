# WhatsApp (Meta Cloud API) setup

Code is ready in `functions/src/index.ts`. It won't send anything until these are done on Meta's side — none of this can be automated, it requires your Meta account.

## 1. Meta Business + WhatsApp app
1. Go to business.facebook.com — create/verify a Meta Business Account (if not already have one).
2. Go to developers.facebook.com/apps → Create App → type "Business" → add the "WhatsApp" product.
3. Under WhatsApp → API Setup, note the **Phone Number ID** (test number works for dev; production needs a real number added + verified).
4. Generate a **permanent access token**: System Users (Business Settings → Users → System Users) → create a system user → assign the WhatsApp app → generate token with `whatsapp_business_messaging` permission. (The temporary token shown in API Setup expires in 24h — don't use that for production.)

## 2. Message template (required — first message to a user must be a template)
1. WhatsApp Manager → Message Templates → Create Template.
2. Category: **Utility**. Name: `heart_confirmation`. Language: `en_US`.
3. Body (must match `functions/src/index.ts` param order — {{1}}=first name, {{2}}=community):
   ```
   ❤️ You're in, {{1}}! You just joined Team India — {{2}} community. See you September 26 for the Heart Walk!
   ```
4. Submit for review. Approval usually takes a few hours, sometimes up to 2-3 days.

## 3. Configure the Cloud Function
```bash
firebase functions:secrets:set WHATSAPP_TOKEN
firebase functions:config:set 2>/dev/null || true
```
Then set these as function params (or edit the `defineString` defaults in `index.ts`):
- `WHATSAPP_PHONE_NUMBER_ID` — from step 1.3
- `WHATSAPP_TEMPLATE_NAME` — defaults to `heart_confirmation`
- `WHATSAPP_TEMPLATE_LANG` — defaults to `en_US`

## 4. Deploy
```bash
cd functions
npm install
npm run deploy
```

## What it does
- `onParticipantCreated` — fires once per new registration with a phone number, sends the approved template via WhatsApp.
- `syncPublicHeartWall` — unrelated to WhatsApp, keeps the public Heart Wall in sync with only safe fields (see `firestore.rules`).

## Later (not built yet)
Day-before reminder and post-walk thank-you would each be a small scheduled function (`onSchedule`) querying `participants` and sending the same way — say the word once confirmation messages are live and I'll add them.
