import { cancelLessonAbsence, createLessonAbsence } from "./actions";

import type { ChildLesson } from "@/lib/data/lessons";

type LessonsListProps = {
  childId: string;
  lessons: ChildLesson[];
};

const dayFormatter = new Intl.DateTimeFormat("sk-SK", {
  weekday: "long",
});

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function LessonsList({ childId, lessons }: LessonsListProps) {
  if (lessons.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#009ee9]">
              Harmonogram
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#071b55]">
              Moje lekcie
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {lessons.length} lekcií
          </p>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Dieťa je automaticky prihlásené na všetky lekcie. Ak na konkrétnu
          lekciu nepríde, môžete ho odhlásiť.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const date = new Date(`${lesson.lessonDate}T12:00:00`);

          const isCancelled = lesson.status === "cancelled";

          return (
            <article
              key={lesson.id}
              className={`rounded-2xl border p-4 ${
                isCancelled
                  ? "border-slate-200 bg-slate-50"
                  : lesson.isAbsent
                    ? "border-orange-200 bg-orange-50/50"
                    : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold capitalize text-slate-500">
                    {dayFormatter.format(date)}
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#071b55]">
                    {dateFormatter.format(date)}
                  </p>
                </div>

                {isCancelled ? (
                  <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    Zrušená
                  </span>
                ) : lesson.isAbsent ? (
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                    Odhlásený
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Prihlásený
                  </span>
                )}
              </div>

              {!isCancelled && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  {lesson.isAbsent && lesson.absenceId ? (
                    <form action={cancelLessonAbsence}>
                      <input
                        type="hidden"
                        name="absenceId"
                        value={lesson.absenceId}
                      />

                      <input type="hidden" name="childId" value={childId} />

                      <button
                        type="submit"
                        className="w-full rounded-xl border border-[#009ee9] px-3 py-2 text-sm font-semibold text-[#071b55] transition hover:bg-sky-50"
                      >
                        Zrušiť odhlásenie
                      </button>
                    </form>
                  ) : (
                    <form action={createLessonAbsence}>
                      <input type="hidden" name="lessonId" value={lesson.id} />

                      <input type="hidden" name="childId" value={childId} />

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-[#071b55] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Odhlásiť
                      </button>
                    </form>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
