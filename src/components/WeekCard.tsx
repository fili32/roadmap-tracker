import Link from "next/link";
import type { Week } from "../types";
import WeekProgress from "./WeekProgress";

export default function WeekCard({ week }: { week: Week }) {
  return (
    <Link
      href={`/week/${week.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-blue-600"
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Week {week.id}
      </div>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{week.title}</h2>
      <p className="mt-3 text-sm font-medium">
        <WeekProgress week={week} />
      </p>
    </Link>
  );
}
