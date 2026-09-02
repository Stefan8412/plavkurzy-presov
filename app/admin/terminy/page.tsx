import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getAdminCourseTerms } from "@/lib/data/admin-course-terms";

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

export default async function AdminCourseTermsPage() {
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

  const terms = await getAdminCourseTerms();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#009ee9] transition hover:underline"
          >
            ← Späť do administrácie
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Administrácia
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Termíny kurzov
          </h1>

          <p className="mt-3 text-slate-600">
            Prehľad pravidelných termínov, kapacít a obsadenosti kurzov.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {terms.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Zatiaľ nie sú vytvorené žiadne termíny kurzov.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Kurz
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Termín
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Obdobie
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Kapacita
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Prihlásených
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Voľných
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
                  {terms.map((term) => (
                    <tr key={term.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {term.courseTitle}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {term.locationName}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {dayLabels[term.dayOfWeek] ?? "—"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {term.startTime.slice(0, 5)} –{" "}
                          {term.endTime.slice(0, 5)}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {formatDate(term.startDate)} –{" "}
                        {formatDate(term.endDate)}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-slate-900">
                        {term.capacity}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-[#071b55]">
                        {term.registeredCount}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={
                            term.availablePlaces === 0
                              ? "font-bold text-red-600"
                              : "font-bold text-emerald-700"
                          }
                        >
                          {term.availablePlaces}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {term.status === "closed" ? (
                          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            Zatvorený
                          </span>
                        ) : term.status === "full" ? (
                          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                            Plný
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Dostupný
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/admin/terminy/${term.id}`}
                          className="inline-flex rounded-full bg-[#071b55] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                          Upraviť
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
