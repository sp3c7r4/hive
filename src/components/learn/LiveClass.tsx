"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LiveStreaming01Icon,
  Calendar01Icon,
  Clock01Icon,
  PlayIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import type { Lesson } from "./types";

/* ---------------------------------------------------------------- */
/*  Countdown helper                                                 */
/* ---------------------------------------------------------------- */

function useCountdown(targetTime: Date) {
  const [remaining, setRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = targetTime.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }
      setRemaining({
        total: diff,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return remaining;
}

/* ---------------------------------------------------------------- */
/*  State machine                                                    */
/* ---------------------------------------------------------------- */

type LiveState = "before" | "soon" | "live" | "after";

function determineState(targetTime: Date): LiveState {
  const diff = targetTime.getTime() - Date.now();
  if (diff <= 0) return "after";
  if (diff <= 15 * 60 * 1000) return "soon";
  return "before";
}

/* ---------------------------------------------------------------- */
/*  Countdown unit                                                   */
/* ---------------------------------------------------------------- */

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl sm:text-2xl font-bold tabular-nums bg-muted rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 min-w-[44px] sm:min-w-[52px] text-center">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-[10px] text-muted-foreground mt-0.5 sm:mt-1">{label}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Component                                                        */
/* ---------------------------------------------------------------- */

interface LiveClassProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function LiveClass({ lesson, onComplete }: LiveClassProps) {
  const scheduledTime = useMemo(
    () => (lesson.scheduledTime ? new Date(lesson.scheduledTime) : new Date(Date.now() + 3600000)),
    [lesson.scheduledTime]
  );

  const [state, setState] = useState<LiveState>(() => determineState(scheduledTime));
  const countdown = useCountdown(scheduledTime);
  const [joined, setJoined] = useState(false);
  const [attendedMinutes, setAttendedMinutes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showRecording, setShowRecording] = useState(false);

  useEffect(() => {
    if (state === "live") {
      const timer = setTimeout(() => {
        setState("after");
        setAttendedMinutes(45);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const formattedDate = useMemo(() => {
    return scheduledTime.toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [scheduledTime]);

  const formattedTime = useMemo(() => {
    return scheduledTime.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [scheduledTime]);

  /* Compact date for mobile */
  const compactDate = useMemo(() => {
    return scheduledTime.toLocaleDateString("en-NG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [scheduledTime]);

  const handleJoin = useCallback(() => {
    setJoined(true);
    setState("live");
  }, []);

  const handleMarkComplete = useCallback(() => {
    setCompleted(true);
    onComplete();
  }, [onComplete]);

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <Badge
            variant="secondary"
            className="rounded-full text-[10px] px-2 py-0 h-5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          >
            <HugeiconsIcon icon={LiveStreaming01Icon} size={11} className="mr-1" />
            Live Class
          </Badge>
          {state === "before" && (
            <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">
              Upcoming
            </Badge>
          )}
          {state === "soon" && (
            <Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Starting soon
            </Badge>
          )}
          {state === "live" && (
            <Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
              ● Live now
            </Badge>
          )}
          {state === "after" && (
            <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">
              Ended
            </Badge>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-bold leading-snug">{lesson.title}</h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm text-muted-foreground mt-1.5">
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Calendar01Icon} size={13} className="shrink-0" />
            <span className="hidden sm:inline">{formattedDate}</span>
            <span className="sm:hidden">{compactDate}</span>
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={13} className="shrink-0" />
            {formattedTime}
          </span>
        </div>
      </div>

      <Separator />

      {/* Before class: countdown */}
      {(state === "before" || state === "soon") && (
        <div className="flex flex-col items-center gap-4 sm:gap-6 py-6 sm:py-8">
          <div className="size-16 sm:size-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center">
            <HugeiconsIcon icon={LiveStreaming01Icon} size={28} className="sm:size-[36px] text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold">Class starts in</p>
            <div className="flex items-center gap-2 sm:gap-3 mt-3 justify-center">
              <CountdownUnit value={countdown.days} label="Days" />
              <CountdownUnit value={countdown.hours} label="Hrs" />
              <CountdownUnit value={countdown.minutes} label="Min" />
              <CountdownUnit value={countdown.seconds} label="Sec" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              className="rounded-full w-full sm:w-auto"
              disabled={state !== "soon"}
              onClick={handleJoin}
            >
              <HugeiconsIcon icon={PlayIcon} size={15} className="mr-1.5" />
              {state === "soon" ? "Join Now" : "Join (available 15 min before)"}
            </Button>
            <Button variant="outline" className="rounded-full w-full sm:w-auto">
              <HugeiconsIcon icon={Calendar01Icon} size={15} className="mr-1.5" />
              Add to Calendar
            </Button>
          </div>
        </div>
      )}

      {/* During class */}
      {state === "live" && !showRecording && (
        <div className="flex flex-col items-center gap-4 sm:gap-6 py-6 sm:py-8">
          {joined ? (
            <>
              <div className="aspect-video w-full bg-black rounded-lg sm:rounded-xl flex items-center justify-center relative">
                <div className="text-center px-4">
                  <div className="size-12 sm:size-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                    <div className="size-2.5 sm:size-3 rounded-full bg-red-500" />
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm">Live class in progress</p>
                  <p className="text-white/50 text-[11px] sm:text-xs mt-1">
                    Meeting opened in a new tab
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
                You are connected. The instructor is presenting.
                Attendance is being tracked automatically.
              </p>
            </>
          ) : (
            <>
              <div className="size-16 sm:size-20 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center animate-pulse">
                <div className="size-3 sm:size-4 rounded-full bg-red-500" />
              </div>
              <div className="text-center px-4">
                <p className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
                  Class is live now!
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Click join to open the meeting in a new tab
                </p>
              </div>
              <Button size="lg" className="rounded-full" onClick={handleJoin}>
                <HugeiconsIcon icon={PlayIcon} size={16} className="mr-2" />
                Join Class
              </Button>
            </>
          )}
        </div>
      )}

      {/* After class */}
      {state === "after" && (
        <div className="flex flex-col gap-4">
          {/* Attendance */}
          <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 sm:p-4">
            <div className="size-8 sm:size-10 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="sm:size-[18px] text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium">You attended for {attendedMinutes} minutes</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Attendance recorded automatically</p>
            </div>
          </div>

          {/* Recording */}
          {!showRecording ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 py-5 sm:py-6 border border-border/60 rounded-xl bg-muted/20 px-4">
              <div className="size-12 sm:size-16 rounded-full bg-muted flex items-center justify-center">
                <HugeiconsIcon icon={PlayIcon} size={22} className="sm:size-[28px] text-muted-foreground ml-0.5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Recording Available</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The instructor has uploaded the class recording
                </p>
              </div>
              <Button
                className="rounded-full"
                onClick={() => setShowRecording(true)}
              >
                <HugeiconsIcon icon={PlayIcon} size={15} className="mr-1.5" />
                Watch Recording
              </Button>
            </div>
          ) : (
            <div className="aspect-video bg-black rounded-lg sm:rounded-xl flex items-center justify-center">
              <div className="text-center px-4">
                <HugeiconsIcon icon={PlayIcon} size={36} className="sm:size-[48px] text-white/40 mx-auto mb-2" />
                <p className="text-white/60 text-sm">Class Recording</p>
                <p className="text-white/30 text-xs mt-1">Duration: {lesson.duration}</p>
              </div>
            </div>
          )}

          {/* Mark complete */}
          {!completed ? (
            <div className="flex justify-center pt-1 sm:pt-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handleMarkComplete}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="mr-1.5" />
                Mark as Complete
              </Button>
            </div>
          ) : (
            <div className="flex justify-center pt-1 sm:pt-2">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                Lesson Completed
              </span>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <Separator />
      <div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          This live class is an interactive session with the instructor. 
          Come prepared with questions and be ready to participate in discussions.
          The recording will be available after the session ends.
        </p>
      </div>
    </div>
  );
}
