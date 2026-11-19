import type { Progress, Week } from "../types";

interface WeekCardProps {
  week: Week;
  progress: Progress;
  onToggle: (topicId: string) => void;
}

export default function WeekCard({ week, progress, onToggle }: WeekCardProps) {
  const done = week.topics.filter((t) => progress[t.id]).length;
  const complete = done === week.topics.length;

  return (
    <section
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        complete ? "border-green-400" : "border-slate-200"
      }`}
    >
      <header className="mb-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
          <span className="text-blue-600">Week {week.id}</span>
          <span className={complete ? "text-green-600" : "text-slate-500"}>
            {done}/{week.topics.length}
          </span>
        </div>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">{week.title}</h2>
      </header>

      <ul className="space-y-2">
        {week.topics.map((topic) => (
          <li key={topic.id}>
            <label className="flex cursor-pointer items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                className="size-4 accent-blue-600"
                checked={!!progress[topic.id]}
                onChange={() => onToggle(topic.id)}
              />
              <span className={progress[topic.id] ? "text-slate-400 line-through" : ""}>
                {topic.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
