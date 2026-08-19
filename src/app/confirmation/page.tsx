import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfirmationView from "@/components/ConfirmationView";
import { getCampaign, getCommunity, getParticipant } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const participant = id ? await getParticipant(id) : null;

  const [community, campaign] = participant
    ? await Promise.all([getCommunity(participant.communityId), getCampaign()])
    : [null, null];

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        {!participant || !campaign ? (
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <p className="text-foreground/60">We couldn&rsquo;t find that heart.</p>
            <Link href="/join" className="mt-4 inline-block font-semibold text-heart">
              Add your heart →
            </Link>
          </div>
        ) : (
          <ConfirmationView
            participant={participant}
            communityName={community?.name ?? ""}
            teamName={campaign.teamName}
            campaignDate={campaign.date}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
