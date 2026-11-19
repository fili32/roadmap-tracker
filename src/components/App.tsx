"use client";

import { roadmap } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";
import ProgressBar from "./ProgressBar";
import WeekCard from "./WeekCard";

const allTopics = roadmap.flatMap((week) => week.topics);

function App() {
  const { progress, toggle } = useProgress();
  const done = allTopics.filter((t) => progress[t.id]).length;

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">Roadmap Tracker</h1>

      <div className="mb-8">
        <ProgressBar done={done} total={allTopics.length} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roadmap.map((week) => (
          <WeekCard key={week.id} week={week} progress={progress} onToggle={toggle} />
        ))}
      </div>
    </main>
  );
}

export default App;
