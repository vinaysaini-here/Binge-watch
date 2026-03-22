"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Search, Sparkles, Video } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/dashboard/submit", label: "Submit" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useApp();

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-cyan-300 via-sky-400 to-orange-400 text-slate-950">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">BingeWatch</p>
            <p className="text-xs text-slate-400">External video streaming</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/discover")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-cyan-300 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-white sm:inline-flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href={`/profile/${user.username}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                <Sparkles className="h-4 w-4" />
                @{user.username}
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/");
                  router.refresh();
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-rose-300 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-slate-200 transition hover:bg-white/8 sm:inline-flex">
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
