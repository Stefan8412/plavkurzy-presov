import Link from "next/link";
import type { CourseTerm as CourseTermType } from "@/types/course";

type CourseTermProps = {
  term: CourseTermType;
};

const dayLabels = {
  monday: "Pondelok",
  tuesday: "Utorok",
  wednesday: "Streda",
  thursday: "Štvrtok",
  friday: "Piatok",
  saturday: "Sobota",
  sunday: "Nedeľa",
};

export default function CourseTerm({ term }: CourseTermProps) {
  const isAvailable = term.status === "available" && term.availableSpots > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-950">
              {dayLabels[term.dayOfWeek]}
            </span>

            <span className="text-slate-300">•</span>

            <span className="font-semibold text-sky-600">
              {term.startTime} – {term.endTime}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {term.startDate} – {term.endDate}
          </p>

          {term.trainerName && (
            <p className="mt-2 text-sm text-slate-600">
              Tréner:{" "}
              <span className="font-medium text-slate-900">
                {term.trainerName}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">Voľné miesta</p>

            <p
              className={`mt-1 text-sm font-semibold ${
                isAvailable ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {isAvailable
                ? `${term.availableSpots} / ${term.capacity}`
                : "Obsadené"}
            </p>
          </div>

          {isAvailable ? (
            <Link
              href={`/prihlasenie?term=${term.id}`}
              className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Prihlásiť
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
            >
              Obsadené
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
