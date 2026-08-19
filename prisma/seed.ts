import { PrismaClient } from "@prisma/client";
import { CAMPAIGN, COMMUNITIES, PARTICIPANTS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.campaign.upsert({
    where: { id: CAMPAIGN.id },
    create: {
      id: CAMPAIGN.id,
      name: CAMPAIGN.name,
      title: CAMPAIGN.title,
      date: new Date(CAMPAIGN.date),
      teamName: CAMPAIGN.teamName,
      tagline: CAMPAIGN.tagline,
      registrationOpen: CAMPAIGN.registrationOpen,
      donationUrl: CAMPAIGN.donationUrl,
    },
    update: {},
  });

  for (const c of COMMUNITIES) {
    await prisma.community.upsert({
      where: { id: c.id },
      create: { id: c.id, name: c.name, active: c.active, displayOrder: c.displayOrder },
      update: {},
    });
  }

  const existing = await prisma.participant.count();
  if (existing === 0) {
    for (const p of PARTICIPANTS) {
      await prisma.participant.create({
        data: {
          firstName: p.firstName,
          lastName: p.lastName,
          displayName: p.displayName,
          displayNameMode: p.displayNameMode,
          email: p.email,
          phone: p.phone,
          participationType: p.participationType,
          communityId: p.communityId,
          pledgeAmount: p.pledgeAmount,
          dedication: p.dedication,
          heartVisible: p.heartVisible,
          approved: p.approved,
          paymentStatus: p.paymentStatus,
          createdAt: new Date(p.createdAt),
        },
      });
    }
    console.log(`Seeded ${PARTICIPANTS.length} demo participants.`);
  } else {
    console.log(`Skipping demo participants — ${existing} already exist.`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
