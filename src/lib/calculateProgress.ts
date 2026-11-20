import type { Progress, Week } from "../types";

export function calculateProgress(
  weeks: Week[],
  progress: Progress,
): { done: number; total: number } {
  const topics = weeks.flatMap((week) => week.topics);
  return {
    done: topics.filter((t) => progress[t.id]).length,
    total: topics.length,
  };
}
