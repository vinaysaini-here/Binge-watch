"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DiscoverFilters({ initialQuery, initialPlatform, initialSortBy }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [platform, setPlatform] = useState(initialPlatform);
  const [sortBy, setSortBy] = useState(initialSortBy);

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (platform && platform !== "all") params.set("platform", platform);
    if (sortBy && sortBy !== "latest") params.set("sortBy", sortBy);

    router.push(`/discover${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form onSubmit={submit} className="glass-panel grid gap-4 rounded-[2rem] p-5 sm:grid-cols-[minmax(0,1fr)_180px_180px_auto] sm:items-center">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
        placeholder="Search titles, descriptions, or tags"
      />
      <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
        <option value="all">All platforms</option>
        <option value="youtube">YouTube</option>
        <option value="vimeo">Vimeo</option>
      </select>
      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
        <option value="latest">Latest</option>
        <option value="trending">Trending</option>
      </select>
      <button type="submit" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
        Search
      </button>
    </form>
  );
}
