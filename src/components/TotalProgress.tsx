"use client";

import { roadmap } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";
import { calculateProgress } from "../lib/calculateProgress";
import ProgressBar from "./ProgressBar";

export default function TotalProgress() {
  const { progress } = useProgress();
  const { done, total } = calculateProgress(roadmap, progress);

  return <ProgressBar done={done} total={total} />;
}
