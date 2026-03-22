import { HeroSection } from "@/components/feed/hero-section";
import { FeedSection } from "@/components/feed/feed-section";
import { getCurrentUser } from "@/lib/session";
import { listVideos } from "@/lib/data";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [viewer, latest, trending] = await Promise.all([
    getCurrentUser(),
    listVideos({ page: 1, limit: 8, sortBy: "latest" }),
    listVideos({ page: 1, limit: 4, sortBy: "trending" }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <HeroSection latest={latest.items.slice(0, 3)} trending={trending.items} viewer={viewer} />
      <FeedSection
        eyebrow="Latest stream drops"
        title="Fresh submissions from the community"
        description="External videos, reimagined with a premium discovery layer, custom controls, and creator dashboards."
        items={latest.items}
      />
      <FeedSection
        eyebrow="Trending now"
        title="Momentum across YouTube and Vimeo"
        description="Surf the highest-performing links based on views, likes, and community discussion."
        items={trending.items}
        compact
      />
    </div>
  );
}
