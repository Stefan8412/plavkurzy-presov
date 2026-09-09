import type { ChildLesson } from "@/lib/data/lessons";
import type {
  AvailableReplacementLesson,
  SelectedReplacementLesson,
} from "@/lib/data/lesson-replacements";
import {
  cancelLessonAbsence,
  cancelLessonReplacement,
  createLessonAbsence,
  createLessonReplacement,
} from "./actions";

type LessonsListProps = {
  childId: string;
  lessons: ChildLesson[];
  replacementOptions: Record<string, AvailableReplacementLesson[]>;
  selectedReplacements?: Record<string, SelectedReplacementLesson>;
};

const dayFormatter = new Intl.DateTimeFormat("sk-SK", {
  weekday: "long",
});

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function LessonsList({
  childId,
  lessons,
  replacementOptions,
  selectedReplacements = {},
}: LessonsListProps) {
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
                    <div className="space-y-3">
                      {selectedReplacements[lesson.absenceId] &&
                        (() => {
                          const selected =
                            selectedReplacements[lesson.absenceId];

                          const selectedDate = new Date(
                            `${selected.lessonDate}T12:00:00`,
                          );

                          return (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                ✓ Náhradná lekcia rezervovaná
                              </p>

                              <p className="mt-2 font-bold capitalize text-[#071b55]">
                                {dayFormatter.format(selectedDate)}{" "}
                                {dateFormatter.format(selectedDate)}
                              </p>

                              <p className="mt-1 text-sm text-slate-600">
                                {selected.startTime.slice(0, 5)} –{" "}
                                {selected.endTime.slice(0, 5)}
                              </p>
                              <form
                                action={cancelLessonReplacement}
                                className="mt-3"
                              >
                                <input
                                  type="hidden"
                                  name="replacementId"
                                  value={selected.id}
                                />

                                <input
                                  type="hidden"
                                  name="childId"
                                  value={childId}
                                />

                                <button
                                  type="submit"
                                  className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  Zrušiť náhradu
                                </button>
                              </form>
                            </div>
                          );
                        })()}
                      {!selectedReplacements[lesson.absenceId] &&
                        (replacementOptions[lesson.absenceId] ?? []).length >
                          0 && (
                          <div className="rounded-xl bg-sky-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#009ee9]">
                              Dostupná náhrada
                            </p>

                            <div className="mt-2 space-y-2">
                              {(replacementOptions[lesson.absenceId] ?? []).map(
                                (replacement) => {
                                  const replacementDate = new Date(
                                    `${replacement.lessonDate}T12:00:00`,
                                  );

                                  return (
                                    <div
                                      key={replacement.id}
                                      className="rounded-lg bg-white px-3 py-2 text-sm"
                                    >
                                      <p className="font-bold capitalize text-[#071b55]">
                                        {dayFormatter.format(replacementDate)}{" "}
                                        {dateFormatter.format(replacementDate)}
                                      </p>

                                      <p className="mt-1 text-xs text-slate-500">
                                        {replacement.startTime.slice(0, 5)} –{" "}
                                        {replacement.endTime.slice(0, 5)}
                                      </p>

                                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                                        Voľné miesta:{" "}
                                        {replacement.availablePlaces}
                                      </p>
                                      <form
                                        action={createLessonReplacement}
                                        className="mt-3"
                                      >
                                        <input
                                          type="hidden"
                                          name="childId"
                                          value={childId}
                                        />
                                        <input
                                          type="hidden"
                                          name="absenceId"
                                          value={lesson.absenceId!}
                                        />
                                        <input
                                          type="hidden"
                                          name="replacementLessonId"
                                          value={replacement.id}
                                        />

                                        <button
                                          type="submit"
                                          className="w-full rounded-lg bg-[#009ee9] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0087c9]"
                                        >
                                          Vybrať náhradu
                                        </button>
                                      </form>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}

                      {!selectedReplacements[lesson.absenceId] &&
                        (replacementOptions[lesson.absenceId] ?? []).length ===
                          0 && (
                          <p className="text-xs leading-5 text-slate-500">
                            Momentálne nie je dostupný žiadny náhradný termín.
                          </p>
                        )}

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
                    </div>
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
