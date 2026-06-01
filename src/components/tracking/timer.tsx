"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, StopCircle } from "lucide-react";

interface TimerProps {
  onStop: (durationMs: number) => void;
  running?: boolean;
  label?: string;
}

export function Timer({ onStop, running: externalRunning, label }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const running = externalRunning !== undefined ? externalRunning : isRunning;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    startRef.current = Date.now() - elapsed;
    const tick = () => setElapsed(Date.now() - (startRef.current ?? Date.now()));
    intervalRef.current = setInterval(tick, 200);
    setIsRunning(true);
  }, [elapsed]);

  const pause = useCallback(() => {
    clear();
    setIsRunning(false);
  }, [clear]);

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
    onStop(elapsed);
    setElapsed(0);
  }, [clear, onStop, elapsed]);

  useEffect(() => {
    return clear;
  }, [clear]);

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-xs font-medium text-on-surface-variant">{label}</span>
      )}

      <div className="flex items-center gap-1.5 bg-surface-container-low rounded-full px-3 py-1.5">
        <span className="font-mono text-lg tabular-nums text-on-surface min-w-[4rem] text-center">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      {!running ? (
        <button
          type="button"
          onClick={start}
          className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint transition-colors active:scale-95"
        >
          <Play size={16} />
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={pause}
            className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors active:scale-95"
          >
            <Pause size={16} />
          </button>
          <button
            type="button"
            onClick={stop}
            className="w-9 h-9 rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:bg-error-container/80 transition-colors active:scale-95"
          >
            <StopCircle size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export function formatDuration(ms: number): string {
  if (!ms) return "—";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) {
    return `${hours} saat ${minutes} dk`;
  }
  return `${minutes} dakika`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Az önce";
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} saat önce`;
  return date.toLocaleDateString("tr-TR");
}
