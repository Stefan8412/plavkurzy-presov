import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminRegistrations } from "@/lib/data/admin";

import { confirmRegistration, cancelRegistration } from "./actions";

const dayLabels: Record<number, string> = {
  1: "Pondelok",
  2: "Utorok",
  3: "Streda",
  4: "Štvrtok",
  5: "Piatok",
  6: "Sobota",
  7: "Nedeľa",
};

const statusLabels: Record<string, string> = {
  pending: "Čaká na potvrdenie",
  confirmed: "Potvrdená",
  cancelled: "Zrušená",
  completed: "Dokončená",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sk-SK").format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function AdminPage() {
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

  const registrations = await getAdminRegistrations();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Administrácia
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Registrácie na kurzy
          </h1>

          <p className="mt-3 text-slate-600">
            Prehľad detí prihlásených na jednotlivé kurzy a termíny.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Všetky registrácie</p>
            <p className="mt-2 text-3xl font-bold text-[#071b55]">
              {registrations.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Čakajú na potvrdenie</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {
                registrations.filter(
                  (registration) => registration.status === "pending",
                ).length
              }
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Potvrdené</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {
                registrations.filter(
                  (registration) => registration.status === "confirmed",
                ).length
              }
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Zrušené</p>
            <p className="mt-2 text-3xl font-bold text-slate-500">
              {
                registrations.filter(
                  (registration) => registration.status === "cancelled",
                ).length
              }
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {registrations.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-xl font-bold text-[#071b55]">
                Zatiaľ žiadne registrácie
              </h2>

              <p className="mt-2 text-slate-600">
                Keď sa niekto prihlási na kurz, zobrazí sa tu.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dieťa
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Rodič
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Kurz
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Termín
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Stav
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Prihlásené
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Akcie
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {registrations.map((registration) => (
                    <tr
                      key={registration.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {registration.child.firstName}{" "}
                          {registration.child.lastName}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {registration.parent.firstName}{" "}
                          {registration.parent.lastName}
                        </p>

                        {registration.parent.phone && (
                          <a
                            href={`tel:${registration.parent.phone}`}
                            className="mt-1 block text-sm text-[#009ee9] hover:underline"
                          >
                            {registration.parent.phone}
                          </a>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {registration.course.title}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm">
                        <p className="font-medium text-slate-900">
                          {dayLabels[registration.term.dayOfWeek] ?? "—"}{" "}
                          {registration.term.startTime
                            ? registration.term.startTime.slice(0, 5)
                            : ""}
                        </p>

                        <p className="mt-1 text-slate-500">
                          {registration.term.startDate
                            ? formatDate(registration.term.startDate)
                            : "—"}
                          {" – "}
                          {registration.term.endDate
                            ? formatDate(registration.term.endDate)
                            : "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            registration.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700"
                              : registration.status === "pending"
                                ? "bg-amber-50 text-amber-700"
                                : registration.status === "cancelled"
                                  ? "bg-slate-100 text-slate-600"
                                  : "bg-sky-50 text-sky-700"
                          }`}
                        >
                          {statusLabels[registration.status] ??
                            registration.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                        {formatDateTime(registration.registeredAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {registration.status !== "confirmed" && (
                            <form
                              action={confirmRegistration.bind(
                                null,
                                registration.id,
                              )}
                            >
                              <button
                                type="submit"
                                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                              >
                                Potvrdiť
                              </button>
                            </form>
                          )}

                          {registration.status !== "cancelled" && (
                            <form
                              action={cancelRegistration.bind(
                                null,
                                registration.id,
                              )}
                            >
                              <button
                                type="submit"
                                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                              >
                                Zrušiť
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
