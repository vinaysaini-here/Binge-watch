import { listVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const videos = await listVideos({ page: 1, limit: 50, sortBy: "latest" });

  return [
    { url: "https://binge-watch.example/", changeFrequency: "daily", priority: 1 },
    { url: "https://binge-watch.example/discover", changeFrequency: "daily", priority: 0.9 },
    { url: "https://binge-watch.example/login", changeFrequency: "monthly", priority: 0.5 },
    { url: "https://binge-watch.example/register", changeFrequency: "monthly", priority: 0.5 },
    ...videos.items.map((video) => ({
      url: `https://binge-watch.example/watch/${video.id}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
