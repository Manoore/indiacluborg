import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JoinWizard from "@/components/JoinWizard";
import { getCommunities } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const communities = await getCommunities();

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream py-10">
        <JoinWizard communities={communities} />
      </main>
      <Footer />
    </>
  );
}
