"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { getCommunity } from "@/lib/data";
import { sendWhatsAppConfirmation } from "@/lib/whatsapp";
import { createAdminSession, clearAdminSession, isAdminAuthenticated, verifyAdminCredentials } from "@/lib/admin-auth";
import { DisplayNameMode, ParticipationType, PaymentStatus } from "@/lib/types";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  participationType: ParticipationType;
  communityId: string;
  customCommunityName?: string;
  pledgeAmount: number;
  dedication?: string;
  displayNameMode: DisplayNameMode;
  heartVisible: boolean;
}

function slugify(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `community-${Date.now()}`
  );
}

// Finds an existing community with a matching (trimmed, case-insensitive) name,
// or creates a new one. Used when someone picks "Other" and types a custom name.
async function resolveOrCreateCommunity(name: string) {
  const prisma = getPrisma();
  const trimmed = name.trim();
  const existing = await prisma.community.findFirst({
    where: { name: { equals: trimmed, mode: "insensitive" } },
  });
  if (existing) return existing.id;

  const maxOrder = await prisma.community.aggregate({ _max: { displayOrder: true } });
  const id = slugify(trimmed);
  await prisma.community.create({
    data: { id, name: trimmed, active: true, displayOrder: (maxOrder._max.displayOrder ?? 0) + 1 },
  });
  return id;
}

export async function registerParticipant(input: RegisterInput) {
  if (!input.firstName.trim() || !input.phone.trim() || !input.communityId) {
    throw new Error("Missing required fields");
  }
  if (input.communityId === "other" && !input.customCommunityName?.trim()) {
    throw new Error("Missing required fields");
  }

  const communityId =
    input.communityId === "other" && input.customCommunityName
      ? await resolveOrCreateCommunity(input.customCommunityName)
      : input.communityId;

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
      email: input.email?.trim() || null,
      phone: input.phone.trim(),
      participationType: input.participationType,
      communityId,
      pledgeAmount: input.pledgeAmount || 0,
      dedication: input.dedication?.trim() || null,
      heartVisible: input.heartVisible,
      paymentStatus: input.pledgeAmount > 0 ? "pledged" : "unknown",
    },
  });

  revalidatePath("/");
  revalidatePath(`/community/${communityId}`);

  if (participant.phone) {
    const community = await getCommunity(communityId);
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

export async function createCommunityAction(name: string) {
  if (!(await isAdminAuthenticated())) throw new Error("Not authorized");
  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required" };

  const prisma = getPrisma();
  const existing = await prisma.community.findFirst({ where: { name: { equals: trimmed, mode: "insensitive" } } });
  if (existing) return { error: "A community with that name already exists" };

  const maxOrder = await prisma.community.aggregate({ _max: { displayOrder: true } });
  await prisma.community.create({
    data: { id: slugify(trimmed), name: trimmed, active: true, displayOrder: (maxOrder._max.displayOrder ?? 0) + 1 },
  });

  revalidatePath("/");
  revalidatePath("/join");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function renameCommunityAction(id: string, newName: string) {
  if (!(await isAdminAuthenticated())) throw new Error("Not authorized");
  const trimmed = newName.trim();
  if (!trimmed) return { error: "Name is required" };

  const prisma = getPrisma();
  await prisma.community.update({ where: { id }, data: { name: trimmed } });

  revalidatePath("/");
  revalidatePath(`/community/${id}`);
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function deleteCommunityAction(id: string) {
  if (!(await isAdminAuthenticated())) throw new Error("Not authorized");

  const prisma = getPrisma();
  const memberCount = await prisma.participant.count({ where: { communityId: id } });
  if (memberCount > 0) {
    return {
      error: `Can't delete — ${memberCount} participant${memberCount === 1 ? "" : "s"} still belong to this community. Reassign or remove them first.`,
    };
  }

  await prisma.community.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/join");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export interface UpdateParticipantInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  communityId: string;
  participationType: ParticipationType;
  pledgeAmount: number;
  paymentStatus: PaymentStatus;
  dedication?: string;
  heartVisible: boolean;
}

export async function updateParticipantAction(id: string, input: UpdateParticipantInput) {
  if (!(await isAdminAuthenticated())) throw new Error("Not authorized");
  if (!input.firstName.trim() || !input.phone.trim() || !input.communityId) {
    return { error: "First name, phone, and community are required" };
  }

  const prisma = getPrisma();
  const existing = await prisma.participant.findUnique({ where: { id } });
  if (!existing) return { error: "Participant not found" };

  const displayName =
    existing.displayNameMode === "anonymous"
      ? "A friend"
      : existing.displayNameMode === "full"
        ? `${input.firstName} ${input.lastName}`.trim()
        : input.firstName;

  await prisma.participant.update({
    where: { id },
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      displayName,
      email: input.email?.trim() || null,
      phone: input.phone.trim(),
      communityId: input.communityId,
      participationType: input.participationType,
      pledgeAmount: input.pledgeAmount || 0,
      paymentStatus: input.paymentStatus,
      dedication: input.dedication?.trim() || null,
      heartVisible: input.heartVisible,
    },
  });

  revalidatePath("/");
  revalidatePath(`/community/${input.communityId}`);
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function deleteParticipantAction(id: string) {
  if (!(await isAdminAuthenticated())) throw new Error("Not authorized");

  const prisma = getPrisma();
  const participant = await prisma.participant.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/community/${participant.communityId}`);
  revalidatePath("/admin/dashboard");
  return { ok: true };
}
