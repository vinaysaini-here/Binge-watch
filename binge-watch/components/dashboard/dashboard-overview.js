"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, Pencil, Trash2 } from "lucide-react";
import { ProfileEditor } from "@/components/dashboard/profile-editor";

export function DashboardOverview({ viewer, videos }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState("");

  const deleteVideo = async (id) => {
    setPendingId(id);
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    setPendingId("");
    router.refresh();
  };

  const totalViews = videos.reduce((sum, video) => sum + video.viewsCount, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likesCount, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="glass-panel-strong rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Analytics</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Creator control room</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Videos</p>
              <p className="mt-3 text-3xl font-semibold text-white">{videos.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Views</p>
              <p className="mt-3 text-3xl font-semibold text-white">{totalViews}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Likes</p>
              <p className="mt-3 text-3xl font-semibold text-white">{totalLikes}</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-50">
            Stream submissions only store metadata such as source URL, platform, extracted video ID, tags, title, description, and thumbnail.
          </div>
        </div>
        <ProfileEditor viewer={viewer} />
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Your library</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Submitted videos</h2>
          </div>
          <Link href="/dashboard/submit" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
            Submit new video
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {videos.length ? (
            videos.map((video) => (
              <div key={video.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{video.providerLabel}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{video.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        {video.viewsCount} views
                      </span>
                      <span>{video.likesCount} likes</span>
                      <span>{video.commentsCount} comments</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/watch/${video.id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-white">
                      Open
                    </Link>
                    <Link href={`/dashboard/edit/${video.id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-white">
                      <Pencil className="mr-2 inline h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteVideo(video.id)}
                      disabled={pendingId === video.id}
                      className="rounded-full border border-rose-300/25 bg-rose-400/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-400/20 disabled:opacity-60"
                    >
                      <Trash2 className="mr-2 inline h-4 w-4" />
                      {pendingId === video.id ? "Removing..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-white/10 px-6 py-12 text-center text-slate-300">
              No videos yet. Submit your first YouTube or Vimeo link from the dashboard.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
