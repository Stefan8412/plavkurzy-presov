import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateCourseTerm } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { getAdminCourseTermDetail } from "@/lib/data/admin-course-term-detail";

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
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCourseTermDetailPage({ params }: PageProps) {
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

  const { id } = await params;

  const term = await getAdminCourseTermDetail(id);

  if (!term) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Link
            href="/admin/terminy"
            className="text-sm font-semibold text-[#009ee9] transition hover:underline"
          >
            ← Späť na termíny
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Administrácia
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Upraviť termín
          </h1>

          <p className="mt-3 text-slate-600">{term.courseTitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">
              Informácie o termíne
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-500">Kurz</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {term.courseTitle}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Lokalita</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {term.locationName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Deň a čas</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {dayLabels[term.dayOfWeek] ?? "—"},{" "}
                  {term.startTime.slice(0, 5)} – {term.endTime.slice(0, 5)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Obdobie</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(term.startDate)} – {formatDate(term.endDate)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium text-slate-500">Kapacita</p>

                  <p className="mt-1 text-xl font-bold text-[#071b55]">
                    {term.capacity}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium text-slate-500">
                    Prihlásených
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#071b55]">
                    {term.registeredCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium text-slate-500">Voľných</p>

                  <p className="mt-1 text-xl font-bold text-emerald-700">
                    {term.availablePlaces}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">
              Nastavenie termínu
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Zmeniť môžete kapacitu a dostupnosť termínu.
            </p>

            <form action={updateCourseTerm} className="mt-6 space-y-6">
              <input type="hidden" name="termId" value={term.id} />

              <div>
                <label
                  htmlFor="capacity"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Kapacita
                </label>

                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={term.registeredCount}
                  defaultValue={term.capacity}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Kapacita nemôže byť nižšia ako aktuálny počet prihlásených:{" "}
                  {term.registeredCount}.
                </p>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Stav
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={term.status}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                >
                  <option value="available">Dostupný</option>

                  <option value="full">Plný</option>

                  <option value="closed">Zatvorený</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-full bg-[#071b55] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Uložiť zmeny
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
