"use client";

import { useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";

export function CommentsPanel({ videoId, initialComments, initialViewer }) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");

    const response = await fetch(`/api/videos/${videoId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.error || "Unable to add comment.");
      return;
    }

    setComments((current) => [data.comment, ...current]);
    setBody("");
  };

  const remove = async (id) => {
    const response = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (response.ok) {
      setComments((current) => current.filter((comment) => comment.id !== id));
    }
  };

  return (
    <aside className="glass-panel-strong h-fit rounded-[2rem] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Comments</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{comments.length} replies</h2>
        </div>
      </div>

      {initialViewer ? (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <textarea
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            placeholder="Add a thoughtful reaction..."
          />
          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
          <button type="submit" disabled={pending} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60">
            {pending ? "Posting..." : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Log in to join the discussion.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">@{comment.author.username}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              {comment.canDelete ? (
                <button type="button" onClick={() => remove(comment.id)} className="text-slate-500 transition hover:text-rose-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{comment.body}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
