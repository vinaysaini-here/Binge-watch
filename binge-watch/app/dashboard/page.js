import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { requireUser } from "@/lib/session";
import { listVideos } from "@/lib/data";

export const metadata = {
  title: "Dashboard",
  description: "Manage your submitted video links, profile, and basic analytics.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const viewer = await requireUser();
  const videos = await listVideos({ page: 1, limit: 12, userId: viewer.id }, viewer.id);

  return <DashboardOverview viewer={viewer} videos={videos.items} />;
}
