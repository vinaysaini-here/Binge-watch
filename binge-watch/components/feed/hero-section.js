"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { HeroCanvas } from "@/components/three/hero-canvas";

export function HeroSection({ latest, trending, viewer }) {
  return (
    <section className="glass-panel-strong relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950/88 via-slate-950/55 to-transparent" />
      <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Premium embed streaming
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-6xl">
            Build your own <span className="text-gradient">video universe</span> from external links.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Submit YouTube and Vimeo URLs, stream them inside a custom interface, and manage the full viewer experience without storing raw video files.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={viewer ? "/dashboard/submit" : "/register"} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
              Start submitting
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/discover" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-white">
              Explore library
              <PlayCircle className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
          className="relative z-10 space-y-4"
        >
          {latest.map((video, index) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="block rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-4 transition hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Featured {index + 1}</p>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-300">
                  {video.providerLabel}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white">{video.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-400">{video.description}</p>
            </Link>
          ))}
          <div className="rounded-[1.5rem] border border-orange-300/20 bg-orange-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-orange-200">Trending clips</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {trending.slice(0, 4).map((video) => (
                <span key={video.id} className="rounded-full bg-black/30 px-3 py-1 text-xs text-slate-100">
                  {video.title}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
