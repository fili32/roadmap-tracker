"use client";

import { useProgress } from "../hooks/useProgress";
import type { Week } from "../types";

export default function TopicChecklist({ week }: { week: Week }) {
  const { progress, toggle } = useProgress();

  return (
    <ul className="space-y-2">
      {week.topics.map((topic) => (
        <li key={topic.id}>
          <label className="flex cursor-pointer items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              className="size-4 accent-blue-600"
              checked={!!progress[topic.id]}
              onChange={() => toggle(topic.id)}
            />
            <span className={progress[topic.id] ? "text-slate-400 line-through" : ""}>
              {topic.title}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
