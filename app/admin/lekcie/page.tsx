import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getAdminLessons } from "@/lib/data/admin-lessons";

const dayLabels: Record<number, string> = {
  1: "Pondelok",
  2: "Utorok",
  3: "Streda",
  4: "Štvrtok",
  5: "Piatok",
  6: "Sobota",
  7: "Nedeľa",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sk-SK").format(new Date(`${date}T12:00:00`));
}

type PageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function AdminLessonsPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prihlasenie");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const lessons = await getAdminLessons();

  const params = await searchParams;
  const selectedDate = params.date ?? "";

  const filteredLessons = selectedDate
    ? lessons.filter((lesson) => lesson.lessonDate === selectedDate)
    : lessons;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Administrácia
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Lekcie
          </h1>

          <p className="mt-3 text-slate-600">
            Kompletný harmonogram konkrétnych lekcií.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <form
            method="GET"
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Vybrať dátum
              </label>

              <input
                id="date"
                name="date"
                type="date"
                defaultValue={selectedDate}
                min="2026-09-21"
                max="2027-01-22"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100 sm:max-w-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-full bg-[#071b55] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Zobraziť
              </button>

              {selectedDate && (
                <Link
                  href="/admin/lekcie"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Zobraziť všetky
                </Link>
              )}
            </div>
          </form>

          {selectedDate && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600">
                Zobrazené lekcie pre{" "}
                <span className="font-semibold text-slate-900">
                  {formatDate(selectedDate)}
                </span>
                :{" "}
                <span className="font-semibold text-[#071b55]">
                  {filteredLessons.length}
                </span>
              </p>
            </div>
          )}
        </div>

        {filteredLessons.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-bold text-[#071b55]">Žiadne lekcie</h2>

            <p className="mt-2 text-slate-600">
              Pre vybraný dátum nie sú naplánované žiadne lekcie.
            </p>

            {selectedDate && (
              <Link
                href="/admin/lekcie"
                className="mt-5 inline-flex rounded-full bg-[#071b55] px-5 py-3 text-sm font-semibold text-white"
              >
                Zobraziť všetky lekcie
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dátum
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Čas
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Kurz
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Lokalita
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Prihlásených
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Odhlásených
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Očakávame
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Stav
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Detail
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLessons.map((lesson) => (
                    <tr
                      key={lesson.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {formatDate(lesson.lessonDate)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {dayLabels[lesson.dayOfWeek] ?? "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                        {lesson.startTime.slice(0, 5)} –{" "}
                        {lesson.endTime.slice(0, 5)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {lesson.courseTitle}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {lesson.locationName}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-[#071b55]">
                        {lesson.registeredCount}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-orange-700">
                        {lesson.absentCount}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-emerald-700">
                        {lesson.expectedCount}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {lesson.status === "cancelled" ? (
                          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            Zrušená
                          </span>
                        ) : lesson.status === "completed" ? (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Dokončená
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Naplánovaná
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/admin/lekcie/${lesson.id}`}
                          className="inline-flex rounded-full bg-[#071b55] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
