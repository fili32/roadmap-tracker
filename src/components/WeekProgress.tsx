"use client";

import { useProgress } from "../hooks/useProgress";
import { calculateProgress } from "../lib/calculateProgress";
import type { Week } from "../types";

export default function WeekProgress({ week }: { week: Week }) {
  const { progress } = useProgress();
  const { done, total } = calculateProgress([week], progress);
  const complete = done === total;

  return (
    <span className={complete ? "text-green-600" : "text-slate-500"}>
      {done}/{total} topics done
      {complete && (
        <span className="ml-2 rounded bg-green-100 px-1.5 text-green-800">Done</span>
      )}
    </span>
  );
}
