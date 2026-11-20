"use client";

import { roadmap } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";
import { calculateProgress } from "../lib/calculateProgress";
import ProgressBar from "./ProgressBar";
import WeekCard from "./WeekCard";

function App() {
  const { progress, toggle } = useProgress();
  const { done, total } = calculateProgress(roadmap, progress);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">Roadmap Tracker</h1>

      <div className="mb-8">
        <ProgressBar done={done} total={total} />
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
