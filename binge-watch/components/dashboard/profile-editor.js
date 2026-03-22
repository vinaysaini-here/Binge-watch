"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/components/providers/app-provider";

export function ProfileEditor({ viewer }) {
  const router = useRouter();
  const { setUser } = useApp();
  const [form, setForm] = useState({
    username: viewer.username,
    bio: viewer.bio || "",
    avatar: viewer.avatar || "",
  });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.error || "Profile update failed.");
      return;
    }

    setUser(data.user);
    setMessage("Profile updated.");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="glass-panel rounded-[2rem] p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Profile</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Public creator details</h2>
      <div className="mt-6 space-y-4">
        <input
          value={form.username}
          onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          placeholder="Username"
        />
        <input
          value={form.avatar}
          onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          placeholder="Avatar URL (optional)"
        />
        <textarea
          rows={4}
          value={form.bio}
          onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          placeholder="Tell viewers what kind of videos you curate."
        />
      </div>
      {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60">
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
