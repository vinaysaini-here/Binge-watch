"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function VideoSubmissionForm({ initialData, mode = "create" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    url: initialData?.sourceUrl || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    tags: initialData?.tags?.join(", ") || "",
    thumbnail: initialData?.thumbnail || "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");

    const response = await fetch(mode === "edit" ? `/api/videos/${initialData.id}` : "/api/videos", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.error || "Unable to submit video.");
      return;
    }

    router.push(`/watch/${data.video.id || data.video._id}`);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Video URL</span>
          <input
            required
            value={form.url}
            onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Title</span>
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="Cinematic breakdown of..."
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Description</span>
          <textarea
            required
            rows={8}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="Tell viewers why this link matters, what they should watch for, and how it fits your channel."
          />
        </label>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Tags</span>
          <input
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="film, trailer, animation"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Thumbnail URL (optional)</span>
          <input
            value={form.thumbnail}
            onChange={(event) => setForm((current) => ({ ...current, thumbnail: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="Leave blank to auto-fetch"
          />
        </label>

        <div className="rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-5 text-sm leading-7 text-cyan-50">
          <p>Validation tips:</p>
          <p>Use full YouTube or Vimeo links.</p>
          <p>Shorts and player URLs are also supported.</p>
          <p>The platform stores metadata only, never the video file.</p>
        </div>

        {error ? <p className="rounded-2xl border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

        <button type="submit" disabled={pending} className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60">
          {pending ? (mode === "edit" ? "Saving..." : "Publishing...") : mode === "edit" ? "Save changes" : "Publish stream"}
        </button>
      </div>
    </form>
  );
}
