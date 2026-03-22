import Link from "next/link";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({ children }) {
  await requireUser();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-20 pt-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
      <aside className="glass-panel h-fit rounded-[2rem] p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Dashboard</p>
        <nav className="mt-5 flex flex-col gap-2">
          <Link className="rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8" href="/dashboard">
            Overview
          </Link>
          <Link className="rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8" href="/dashboard/submit">
            Submit video
          </Link>
          <Link className="rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8" href="/dashboard/instructions">
            Upload guide
          </Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
