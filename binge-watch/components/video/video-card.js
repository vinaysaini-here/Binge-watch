"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Play, ThumbsUp } from "lucide-react";

export function VideoCard({ video }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.22, ease: "easeOut" }}>
      <Link href={`/watch/${video.id}`} className="group glass-panel block overflow-hidden rounded-[1.75rem] transition hover:border-cyan-300/50">
        <div className="relative aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-xs text-white backdrop-blur-sm">
            <Play className="h-3.5 w-3.5" />
            {video.providerLabel}
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">@{video.author.username}</p>
            <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-white">{video.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{video.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/6 px-3 py-1 text-xs text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Play className="h-3.5 w-3.5" />
              {video.viewsCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {video.likesCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {video.commentsCount}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
