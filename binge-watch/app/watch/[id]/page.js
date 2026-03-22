import { notFound } from "next/navigation";
import { EmbeddedVideoPlayer } from "@/components/player/embedded-video-player";
import { CommentsPanel } from "@/components/video/comments-panel";
import { LikeButton } from "@/components/video/like-button";
import { getCurrentUser } from "@/lib/session";
import { getVideoById, listComments } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    return { title: "Video not found" };
  }

  return {
    title: video.title,
    description: video.description,
  };
}

export const dynamic = "force-dynamic";

export default async function WatchPage({ params }) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  const [video, comments] = await Promise.all([
    getVideoById(id, viewer?.id),
    listComments(id, viewer?.id),
  ]);

  if (!video) {
    notFound();
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 pt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <section className="space-y-6">
        <EmbeddedVideoPlayer video={video} />
        <div className="glass-panel-strong rounded-[2rem] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">{video.providerLabel}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{video.title}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <LikeButton videoId={video.id} initialVideo={video} />
          </div>
          <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Submitted by</p>
              <p className="mt-2 text-base text-white">@{video.author.username}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Views</p>
              <p className="mt-2 text-base text-white">{video.viewsCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Likes</p>
              <p className="mt-2 text-base text-white">{video.likesCount}</p>
            </div>
          </div>
          <p className="mt-6 whitespace-pre-wrap leading-8 text-slate-300">{video.description}</p>
        </div>
      </section>
      <CommentsPanel videoId={video.id} initialComments={comments} initialViewer={viewer} />
    </div>
  );
}
