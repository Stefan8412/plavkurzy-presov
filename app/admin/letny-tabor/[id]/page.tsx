import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateCampTerm } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { getAdminCampTermDetail } from "@/lib/data/admin-camp-term-detail";
import { getAdminCampRegistrations } from "@/lib/data/admin-camp-registrations";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sk-SK").format(new Date(`${date}T12:00:00`));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCampTermDetailPage({ params }: PageProps) {
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

  const term = await getAdminCampTermDetail(id);

  if (!term) {
    notFound();
  }
  const registrations = await getAdminCampRegistrations(id);
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Link
            href="/admin/letny-tabor"
            className="text-sm font-semibold text-[#009ee9] transition hover:underline"
          >
            ← Späť na letný tábor
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Administrácia
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Upraviť turnus
          </h1>

          <p className="mt-3 text-slate-600">{term.name}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">
              Informácie o turnuse
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-500">Názov</p>

                <p className="mt-1 font-semibold text-slate-900">{term.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Termín</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(term.startDate)} – {formatDate(term.endDate)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Cena – detská porcia
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatPrice(term.childMealPrice)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Cena – dospelá porcia
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatPrice(term.adultMealPrice)}
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

                  <p
                    className={
                      term.availableSpots === 0
                        ? "mt-1 text-xl font-bold text-red-600"
                        : "mt-1 text-xl font-bold text-emerald-700"
                    }
                  >
                    {term.availableSpots}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">
              Nastavenie turnusu
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Môžete upraviť názov, dátumy, kapacitu, ceny a dostupnosť turnusu.
            </p>

            <form action={updateCampTerm} className="mt-6 space-y-6">
              <input type="hidden" name="termId" value={term.id} />

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Názov turnusu
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={term.name}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Od
                  </label>

                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    defaultValue={term.startDate}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Do
                  </label>

                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    defaultValue={term.endDate}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

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
                  min={Math.max(term.registeredCount, 1)}
                  step="1"
                  defaultValue={term.capacity}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Kapacita nemôže byť nižšia ako aktuálny počet prihlásených:{" "}
                  {term.registeredCount}.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="childMealPrice"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Cena – detská porcia
                  </label>

                  <div className="relative">
                    <input
                      id="childMealPrice"
                      name="childMealPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      defaultValue={term.childMealPrice}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      €
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adultMealPrice"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Cena – dospelá porcia
                  </label>

                  <div className="relative">
                    <input
                      id="adultMealPrice"
                      name="adultMealPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      defaultValue={term.adultMealPrice}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      €
                    </span>
                  </div>
                </div>
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
                  defaultValue={
                    term.status === "closed" ? "closed" : "available"
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                >
                  <option value="available">Dostupný</option>
                  <option value="closed">Zatvorený</option>
                </select>

                <p className="mt-2 text-xs text-slate-500">
                  Pri zatvorenom turnuse sa nové prihlášky nebudú prijímať.
                </p>
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
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-[#071b55]">
              Prihlásené deti
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Celkový počet prihlášok: {registrations.length}
            </p>
          </div>

          {registrations.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-slate-500">
                Na tento turnus zatiaľ nie je žiadna prihláška.
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
                      Tábor
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Platba
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
                  {registrations.map((registration) => (
                    <tr
                      key={registration.id}
                      className="align-top transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {registration.child.firstName}{" "}
                          {registration.child.lastName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Narodenie:{" "}
                          {formatDate(registration.child.dateOfBirth)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Tričko: {registration.shirtSize}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {registration.parent.firstName ?? ""}{" "}
                          {registration.parent.lastName ?? ""}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {registration.parent.phone ?? "—"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {registration.mealPortion === "adult"
                            ? "Dospelá porcia"
                            : "Detská porcia"}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {formatPrice(registration.totalPrice)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Rekreačný poukaz:{" "}
                          {registration.recreationVoucher ? "Áno" : "Nie"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {registration.payment?.status === "paid"
                            ? "Zaplatené"
                            : registration.payment?.status === "failed"
                              ? "Neúspešná"
                              : registration.payment?.status === "cancelled"
                                ? "Zrušená"
                                : "Čaká na platbu"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {registration.payment
                            ? formatPrice(registration.payment.amount)
                            : "—"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {registration.status === "confirmed" ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Potvrdená
                          </span>
                        ) : registration.status === "cancelled" ? (
                          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            Zrušená
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                            Čaká
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <Link
                          href={`/admin/letny-tabor/prihlaska/${registration.id}`}
                          className="inline-flex rounded-full bg-[#071b55] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                          Zobraziť
                        </Link>
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
