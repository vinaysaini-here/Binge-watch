import { VideoCard } from "@/components/video/video-card";

export function VideoGrid({ items, compact = false }) {
  if (!items.length) {
    return (
      <div className="glass-panel rounded-[2rem] px-6 py-12 text-center text-slate-300">
        No videos matched the current selection yet.
      </div>
    );
  }

  return (
    <div className={`grid gap-5 ${compact ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-3"}`}>
      {items.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
