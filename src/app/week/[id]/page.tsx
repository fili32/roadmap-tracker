import Link from "next/link";
import { notFound } from "next/navigation";
import TopicChecklist from "@/components/TopicChecklist";
import WeekProgress from "@/components/WeekProgress";
import { roadmap } from "@/data/roadmap";

// Pre-render /week/1 ... /week/8 at build time.
export function generateStaticParams() {
  return roadmap.map((week) => ({ id: String(week.id) }));
}

export default async function WeekPage({ params }: PageProps<"/week/[id]">) {
  const { id } = await params;
  const week = roadmap.find((w) => String(w.id) === id);
  if (!week) notFound();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to overview
      </Link>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
          <span className="text-blue-600">Week {week.id}</span>
          <WeekProgress week={week} />
        </div>
        <h1 className="mt-1 mb-4 text-2xl font-bold text-slate-900">{week.title}</h1>
        <TopicChecklist week={week} />
      </div>
    </main>
  );
}
