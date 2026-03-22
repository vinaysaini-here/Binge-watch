"use client";

import Player from "@vimeo/player";
import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2 } from "lucide-react";

function loadYouTubeApi() {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
  });
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export function EmbeddedVideoPlayer({ video }) {
  const wrapperRef = useRef(null);
  const targetRef = useRef(null);
  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const tapRef = useRef({ zone: "", time: 0 });
  const holdTimerRef = useRef(null);
  const holdSpeedRef = useRef(1);
  const initialVolumeRef = useRef(80);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function createPlayer() {
      if (video.platform === "youtube") {
        const YT = await loadYouTubeApi();
        if (cancelled) return;

        playerRef.current = new YT.Player(targetRef.current, {
          videoId: video.videoId,
          playerVars: {
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event) => {
              setReady(true);
              setDuration(event.target.getDuration());
              event.target.setVolume(initialVolumeRef.current);
            },
            onStateChange: (event) => {
              const isPlaying = event.data === YT.PlayerState.PLAYING;
              setPlaying(isPlaying);
              if (isPlaying) setDuration(event.target.getDuration());
            },
          },
        });
      } else {
        playerRef.current = new Player(targetRef.current, {
          id: Number(video.videoId),
          controls: false,
          title: false,
          byline: false,
          portrait: false,
          autopause: true,
          dnt: true,
        });

        playerRef.current.on("loaded", async () => {
          if (cancelled) return;
          setReady(true);
          setDuration(await playerRef.current.getDuration());
          await playerRef.current.setVolume(initialVolumeRef.current / 100);
        });

        playerRef.current.on("play", () => setPlaying(true));
        playerRef.current.on("pause", () => setPlaying(false));
        playerRef.current.on("timeupdate", ({ seconds, duration: total }) => {
          setCurrentTime(seconds);
          setDuration(total);
        });
      }
    }

    createPlayer();

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
      clearTimeout(holdTimerRef.current);
      playerRef.current?.destroy?.();
    };
  }, [video.platform, video.videoId]);

  useEffect(() => {
    if (!ready || video.platform !== "youtube") return;

    pollRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime) return;
      setCurrentTime(player.getCurrentTime());
      setDuration(player.getDuration());
    }, 500);

    return () => clearInterval(pollRef.current);
  }, [ready, video.platform]);

  useEffect(() => {
    if (!ready || !playerRef.current) return;
    if (video.platform === "youtube") playerRef.current.setVolume(volume);
    else playerRef.current.setVolume(volume / 100);
  }, [ready, video.platform, volume]);

  useEffect(() => {
    fetch(`/api/videos/${video.id}/view`, { method: "POST" }).catch(() => {});
  }, [video.id]);

  const play = async () => {
    if (!playerRef.current) return;
    if (video.platform === "youtube") playerRef.current.playVideo();
    else await playerRef.current.play();
  };

  const pause = async () => {
    if (!playerRef.current) return;
    if (video.platform === "youtube") playerRef.current.pauseVideo();
    else await playerRef.current.pause();
  };

  const togglePlay = async () => {
    if (playing) await pause();
    else await play();
  };

  const seekTo = async (seconds) => {
    const next = Math.min(Math.max(seconds, 0), duration || seconds);
    setCurrentTime(next);
    if (video.platform === "youtube") playerRef.current.seekTo(next, true);
    else await playerRef.current.setCurrentTime(next);
  };

  const changeVolume = async (nextVolume) => {
    const value = Number(nextVolume);
    setVolume(value);
    if (!playerRef.current) return;
    if (video.platform === "youtube") playerRef.current.setVolume(value);
    else await playerRef.current.setVolume(value / 100);
  };

  const changeSpeed = async (nextSpeed) => {
    const value = Number(nextSpeed);
    setSpeed(value);
    if (!playerRef.current) return;
    if (video.platform === "youtube") playerRef.current.setPlaybackRate(value);
    else await playerRef.current.setPlaybackRate(value);
  };

  const setToast = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 850);
  };

  const handleZone = (zone) => {
    const now = Date.now();
    const previous = tapRef.current;

    if (previous.zone === zone && now - previous.time < 300) {
      if (zone === "left") {
        seekTo(currentTime - 10);
        setToast("Back 10s");
      }
      if (zone === "right") {
        seekTo(currentTime + 10);
        setToast("Forward 10s");
      }
      if (zone === "center") {
        togglePlay();
        setToast(playing ? "Paused" : "Playing");
      }

      tapRef.current = { zone: "", time: 0 };
      return;
    }

    tapRef.current = { zone, time: now };
  };

  const startHold = () => {
    holdTimerRef.current = setTimeout(() => {
      holdSpeedRef.current = speed;
      changeSpeed(2);
      setNotice("2x speed");
    }, 250);
  };

  const endHold = () => {
    clearTimeout(holdTimerRef.current);
    if (speed === 2 && holdSpeedRef.current !== 2) {
      changeSpeed(holdSpeedRef.current);
      setNotice("");
    }
  };

  const enterFullscreen = async () => {
    await wrapperRef.current?.requestFullscreen?.();
  };

  return (
    <div className="glass-panel-strong overflow-hidden rounded-[2rem] p-3">
      <div ref={wrapperRef} className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-black">
        <div ref={targetRef} className="h-full w-full" />

        <div className="absolute inset-0 grid grid-cols-3">
          <button type="button" className="cursor-pointer" onClick={() => handleZone("left")} aria-label="Seek backward 10 seconds" />
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => handleZone("center")}
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            aria-label="Play or pause"
          />
          <button type="button" className="cursor-pointer" onClick={() => handleZone("right")} aria-label="Seek forward 10 seconds" />
        </div>

        {notice ? (
          <div className="absolute left-1/2 top-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white -translate-x-1/2 -translate-y-1/2">
            {notice}
          </div>
        ) : null}
      </div>

      <div className="space-y-4 px-2 pb-2 pt-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(event) => seekTo(Number(event.target.value))}
          className="w-full accent-cyan-300"
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={togglePlay} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-950">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <div className="text-sm text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-slate-300" />
              <input type="range" min="0" max="100" value={volume} onChange={(event) => changeVolume(event.target.value)} className="accent-cyan-300" />
            </div>
            <select value={speed} onChange={(event) => changeSpeed(event.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
                <option key={value} value={value}>
                  {value}x
                </option>
              ))}
            </select>
            <button type="button" onClick={enterFullscreen} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-slate-200">
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Double tap left or right to seek. Double tap center to play or pause. Press and hold center for 2x speed.
        </p>
      </div>
    </div>
  );
}
