"use client";

import {
  CheckmarkCircle02Icon,
  CollapseIcon,
  FullScreenIcon,
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeMuteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Lesson } from "./types";

interface VideoPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function VideoPlayer({ lesson, onComplete }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("720p");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [completed, setCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const videoSrc =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setFullscreen(false));
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = (parseFloat(e.target.value) / 100) * (v.duration || 0);
    v.currentTime = t;
    setCurrentTime(t);
  }, []);

  const setSpeed = useCallback((rate: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    saveIntervalRef.current = setInterval(() => {
      const v = videoRef.current;
      if (v && !v.paused) {
        localStorage.setItem(
          `hive-video-progress-${lesson.id}`,
          JSON.stringify({ time: v.currentTime, duration: v.duration }),
        );
      }
    }, 12000);
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [lesson.id]);

  useEffect(() => {
    const saved = localStorage.getItem(`hive-video-progress-${lesson.id}`);
    if (saved) {
      try {
        const { time } = JSON.parse(saved);
        const v = videoRef.current;
        if (v && time > 0) v.currentTime = time;
      } catch {
        /* ignore */
      }
    }
  }, [lesson.id]);

  useEffect(() => {
    if (completed) return;
    if (duration > 0 && currentTime / duration >= 0.9) {
      setCompleted(true);
      onComplete();
    }
  }, [currentTime, duration, completed, onComplete]);

  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Video player */}
      <div
        ref={containerRef}
        className="relative aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden group shadow-lg sm:shadow-2xl"
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (v) setCurrentTime(v.currentTime);
          }}
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (v) setDuration(v.duration);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            if (!completed) {
              setCompleted(true);
              onComplete();
            }
          }}
          onClick={togglePlay}
          playsInline
        />

        {/* Center play button overlay */}
        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
          >
            <div className="size-12 sm:size-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:bg-primary transition-colors hover:scale-105">
              <HugeiconsIcon
                icon={PlayIcon}
                size={22}
                className="sm:size-[28px] text-primary-foreground ml-0.5"
              />
            </div>
          </button>
        )}

        {/* Controls bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 sm:px-3 pb-2 sm:pb-3 pt-6 sm:pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Seek bar */}
          <input
            type="range"
            min={0}
            max={100}
            value={duration > 0 ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="w-full h-1 mb-1.5 sm:mb-2 rounded-full appearance-none bg-white/30 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors shrink-0"
            >
              <HugeiconsIcon
                icon={playing ? PauseIcon : PlayIcon}
                size={16}
                className="sm:size-[20px]"
              />
            </button>

            {/* Time */}
            <span className="text-[10px] sm:text-xs text-white/80 tabular-nums shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Speed — hidden on very small screens */}
            <div className="relative hidden xs:block">
              <button
                type="button"
                onClick={() => {
                  setShowSpeedMenu((v) => !v);
                  setShowQualityMenu(false);
                }}
                className="text-[10px] sm:text-xs text-white/80 hover:text-white px-1 sm:px-1.5 py-0.5 rounded"
              >
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-background border rounded-lg shadow-lg py-1 min-w-[72px] z-50">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSpeed(r)}
                      className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${playbackRate === r ? "text-primary font-semibold" : "text-foreground"}`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality — hidden on very small screens */}
            <div className="relative hidden xs:block">
              <button
                type="button"
                onClick={() => {
                  setShowQualityMenu((v) => !v);
                  setShowSpeedMenu(false);
                }}
                className="text-[10px] sm:text-xs text-white/80 hover:text-white px-1 sm:px-1.5 py-0.5 rounded"
              >
                {quality}
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-8 right-0 bg-background border rounded-lg shadow-lg py-1 min-w-[100px] z-50">
                  {["1080p", "720p", "360p", "Audio Only"].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${quality === q ? "text-primary font-semibold" : "text-foreground"}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mute */}
            <button
              type="button"
              onClick={toggleMute}
              className="text-white/80 hover:text-white transition-colors shrink-0"
            >
              <HugeiconsIcon
                icon={muted ? VolumeMuteIcon : VolumeHighIcon}
                size={14}
                className="sm:size-[18px]"
              />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white transition-colors shrink-0"
            >
              <HugeiconsIcon
                icon={fullscreen ? CollapseIcon : FullScreenIcon}
                size={14}
                className="sm:size-[18px]"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Lesson info */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs text-muted-foreground mb-0.5">
            Video Lesson
          </p>
          <h2 className="text-base sm:text-lg font-bold leading-snug">
            {lesson.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Duration: {lesson.duration}
          </p>
        </div>
        <div className="shrink-0 sm:pt-1">
          {!completed ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCompleted(true);
                onComplete();
              }}
              className="rounded-full w-full sm:w-auto"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={14}
                className="mr-1.5"
              />
              <span className="text-xs">Mark Complete</span>
            </Button>
          ) : (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Attachments / description */}
      <div className="border-t border-border/60 pt-4">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          In this lesson, we cover the fundamentals of{" "}
          {lesson.title.toLowerCase()}. Follow along with the video and take
          notes on key concepts.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-7 sm:h-8"
          >
            Download Slides
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-7 sm:h-8"
          >
            Download Notes
          </Button>
        </div>
      </div>
    </div>
  );
}
