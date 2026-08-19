import "server-only";
import { getPrisma } from "./db";
import { Campaign, Community, CommunityStats, Participant } from "./types";

export async function getCampaign(): Promise<Campaign> {
  const prisma = getPrisma();
  const c = await prisma.campaign.findUnique({ where: { id: "heartwalk2026" } });
  if (!c) throw new Error("Campaign not seeded — run `npm run db:seed`");
  return {
    id: c.id,
    name: c.name,
    title: c.title,
    date: c.date.toISOString(),
    teamName: c.teamName,
    tagline: c.tagline,
    registrationOpen: c.registrationOpen,
    donationUrl: c.donationUrl ?? undefined,
  };
}

export async function getCommunities(): Promise<Community[]> {
  const prisma = getPrisma();
  const rows = await prisma.community.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? undefined,
    active: r.active,
    displayOrder: r.displayOrder,
  }));
}

export async function getCommunity(id: string): Promise<Community | null> {
  const prisma = getPrisma();
  const r = await prisma.community.findUnique({ where: { id } });
  if (!r) return null;
  return { id: r.id, name: r.name, description: r.description ?? undefined, active: r.active, displayOrder: r.displayOrder };
}

function mapParticipant(p: {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  displayNameMode: string;
  email: string | null;
  phone: string;
  participationType: string;
  communityId: string;
  pledgeAmount: number;
  dedication: string | null;
  heartVisible: boolean;
  approved: boolean;
  paymentStatus: string;
  createdAt: Date;
}): Participant {
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    displayName: p.displayName,
    displayNameMode: p.displayNameMode as Participant["displayNameMode"],
    email: p.email ?? undefined,
    phone: p.phone,
    participationType: p.participationType as Participant["participationType"],
    communityId: p.communityId,
    pledgeAmount: p.pledgeAmount,
    dedication: p.dedication ?? undefined,
    heartVisible: p.heartVisible,
    approved: p.approved,
    paymentStatus: p.paymentStatus as Participant["paymentStatus"],
    createdAt: p.createdAt.toISOString(),
  };
}

export async function getPublicParticipants(communityId?: string): Promise<Participant[]> {
  const prisma = getPrisma();
  const rows = await prisma.participant.findMany({
    where: { heartVisible: true, approved: true, ...(communityId ? { communityId } : {}) },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapParticipant);
}

export async function getParticipant(id: string): Promise<Participant | null> {
  const prisma = getPrisma();
  const row = await prisma.participant.findUnique({ where: { id } });
  return row ? mapParticipant(row) : null;
}

export async function getAllParticipantsForAdmin(): Promise<Participant[]> {
  const prisma = getPrisma();
  const rows = await prisma.participant.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapParticipant);
}

export async function getCommunityStats(): Promise<CommunityStats[]> {
  const communities = await getCommunities();
  const participants = await getPublicParticipants();

  return communities
    .map((c) => {
      const members = participants.filter((p) => p.communityId === c.id);
      return {
        communityId: c.id,
        communityName: c.name,
        hearts: members.length,
        walkers: members.filter((p) => p.participationType === "walking" || p.participationType === "both").length,
        pledged: members.reduce((sum, p) => sum + (p.pledgeAmount || 0), 0),
      };
    })
    .sort((a, b) => b.hearts - a.hearts);
}

export async function getTotals() {
  const participants = await getPublicParticipants();
  return {
    hearts: participants.length,
    walkers: participants.filter((p) => p.participationType === "walking" || p.participationType === "both").length,
    pledged: participants.reduce((sum, p) => sum + (p.pledgeAmount || 0), 0),
  };
}
