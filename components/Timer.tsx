"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  initialSeconds: number;
}

export function Timer({ initialSeconds }: TimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    if (remaining <= 0) {
      setRunning(false);
      return;
    }

    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [running, remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100">
      <span className="tabular-nums">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
      <button
        type="button"
        className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-slate-900 hover:bg-emerald-400"
        onClick={() => setRunning((prev) => !prev)}
      >
        {running ? "Pause" : remaining === 0 ? "Restart" : "Start"}
      </button>
      {remaining !== initialSeconds && remaining !== 0 && (
        <button
          type="button"
          className="text-[10px] text-slate-400 hover:text-slate-200"
          onClick={() => {
            setRemaining(initialSeconds);
            setRunning(false);
          }}
        >
          Reset
        </button>
      )}
      {remaining === 0 && (
        <span className="text-[10px] text-emerald-300">Done!</span>
      )}
    </div>
  );
}
