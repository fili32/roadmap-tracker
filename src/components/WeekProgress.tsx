"use client";

import { useProgress } from "../hooks/useProgress";
import { calculateProgress } from "../lib/calculateProgress";
import type { Week } from "../types";

export default function WeekProgress({ week }: { week: Week }) {
  const { progress } = useProgress();
  const { done, total } = calculateProgress([week], progress);

  return (
    <span className={done === total ? "text-green-600" : "text-slate-500"}>
      {done}/{total} topics done
    </span>
  );
}
