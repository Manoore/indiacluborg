import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllParticipantsForAdmin, getCampaign, getCommunities, getCommunityStats, getTotals } from "@/lib/data";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const [participants, communities, communityStats, totals, campaign] = await Promise.all([
    getAllParticipantsForAdmin(),
    getCommunities(),
    getCommunityStats(),
    getTotals(),
    getCampaign(),
  ]);

  return (
    <AdminDashboardClient
      participants={participants}
      communities={communities}
      communityStats={communityStats}
      totals={totals}
      campaign={campaign}
    />
  );
}
