import { FeedSection } from "@/components/feed/feed-section";
import { DiscoverFilters } from "@/components/feed/discover-filters";
import { getCurrentUser } from "@/lib/session";
import { listVideos } from "@/lib/data";

export const metadata = {
  title: "Discover",
  description: "Search YouTube and Vimeo submissions by title, tags, and platform.",
};

export const dynamic = "force-dynamic";

export default async function DiscoverPage({ searchParams }) {
  const params = await searchParams;
  const viewer = await getCurrentUser();
  const query = String(params.query || "");
  const platform = String(params.platform || "all");
  const sortBy = String(params.sortBy || "latest");
  const videos = await listVideos({ page: 1, limit: 12, query, platform, sortBy }, viewer?.id);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <DiscoverFilters initialQuery={query} initialPlatform={platform} initialSortBy={sortBy} />
      <FeedSection
        eyebrow="Search results"
        title={query ? `Results for "${query}"` : "Explore every stream"}
        description="Filter the library by platform, title, or tag to surface the right video instantly."
        items={videos.items}
      />
    </div>
  );
}
