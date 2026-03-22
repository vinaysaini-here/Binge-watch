"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/components/providers/app-provider";

const modeCopy = {
  login: {
    title: "Welcome back",
    description: "Jump into your dashboard, publish new embeds, and manage your community feed.",
    endpoint: "/api/auth/login",
    action: "Login",
    alternateHref: "/register",
    alternateLabel: "Create an account",
  },
  register: {
    title: "Create your creator account",
    description: "Register to submit YouTube or Vimeo links, curate your profile, and track engagement.",
    endpoint: "/api/auth/register",
    action: "Register",
    alternateHref: "/login",
    alternateLabel: "Already have an account?",
  },
};

export function AuthForm({ mode }) {
  const router = useRouter();
  const { setUser } = useApp();
  const copy = modeCopy[mode];
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");

    const response = await fetch(copy.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.error || "Request failed.");
      return;
    }

    setUser(data.user);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="glass-panel-strong rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Authentication</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">{copy.description}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["JWT sessions", "Custom player UX", "MongoDB metadata"].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-4">
            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Username</span>
                <input
                  required
                  value={form.username}
                  onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                  placeholder="cinema_curator"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Password</span>
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="StrongPassword123"
              />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

          <button type="submit" disabled={pending} className="mt-6 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60">
            {pending ? "Please wait..." : copy.action}
          </button>

          <p className="mt-5 text-sm text-slate-400">
            <Link href={copy.alternateHref} className="text-cyan-300 transition hover:text-cyan-200">
              {copy.alternateLabel}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
