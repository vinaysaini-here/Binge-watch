"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function LikeButton({ videoId, initialVideo }) {
  const [video, setVideo] = useState(initialVideo);
  const [pending, setPending] = useState(false);

  const toggleLike = async () => {
    setPending(true);
    const response = await fetch(`/api/videos/${videoId}/like`, { method: "POST" });
    const data = await response.json();
    setPending(false);

    if (response.ok) {
      setVideo(data.video);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
        video.isLiked
          ? "bg-rose-400 text-white"
          : "border border-white/10 bg-white/5 text-slate-100 hover:border-rose-300/30"
      }`}
    >
      <Heart className={`h-4 w-4 ${video.isLiked ? "fill-current" : ""}`} />
      {video.likesCount} likes
    </button>
  );
}
