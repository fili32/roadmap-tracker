import TotalProgress from "@/components/TotalProgress";
import WeekCard from "@/components/WeekCard";
import { roadmap } from "@/data/roadmap";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">Roadmap Tracker</h1>

      <div className="mb-8">
        <TotalProgress />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roadmap.map((week) => (
          <WeekCard key={week.id} week={week} />
        ))}
      </div>
    </main>
  );
}
