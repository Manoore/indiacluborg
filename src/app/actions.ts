"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { getCommunity } from "@/lib/data";
import { sendWhatsAppConfirmation } from "@/lib/whatsapp";
import { createAdminSession, clearAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";
import { DisplayNameMode, ParticipationType } from "@/lib/types";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  participationType: ParticipationType;
  communityId: string;
  pledgeAmount: number;
  dedication?: string;
  displayNameMode: DisplayNameMode;
  heartVisible: boolean;
}

export async function registerParticipant(input: RegisterInput) {
  if (!input.firstName.trim() || !input.email.trim() || !input.communityId) {
    throw new Error("Missing required fields");
  }

  const displayName =
    input.displayNameMode === "anonymous"
      ? "A friend"
      : input.displayNameMode === "full"
        ? `${input.firstName} ${input.lastName}`.trim()
        : input.firstName;

  const prisma = getPrisma();
  const participant = await prisma.participant.create({
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      displayName,
      displayNameMode: input.displayNameMode,
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
      participationType: input.participationType,
      communityId: input.communityId,
      pledgeAmount: input.pledgeAmount || 0,
      dedication: input.dedication?.trim() || null,
      heartVisible: input.heartVisible,
      paymentStatus: input.pledgeAmount > 0 ? "pledged" : "unknown",
    },
  });

  revalidatePath("/");
  revalidatePath(`/community/${input.communityId}`);

  if (participant.phone) {
    const community = await getCommunity(input.communityId);
    sendWhatsAppConfirmation({
      phone: participant.phone,
      firstName: participant.firstName,
      communityName: community?.name ?? "Team India",
    }).catch((err) => console.error("[whatsapp] confirmation send failed", err));
  }

  redirect(`/confirmation?id=${participant.id}`);
}

export async function adminLoginAction(email: string, password: string) {
  const ok = await verifyAdminCredentials(email, password);
  if (!ok) {
    return { error: "Invalid email or password" };
  }
  await createAdminSession();
  redirect("/admin/dashboard");
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin");
}
