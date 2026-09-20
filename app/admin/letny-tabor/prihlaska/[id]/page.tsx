import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminCampRegistration } from "@/lib/data/admin-camp-registrations";
import {
  cancelCampRegistration,
  markCampRegistrationPaid,
} from "@/app/admin/letny-tabor/actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sk-SK").format(new Date(`${date}T12:00:00`));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export default async function AdminCampRegistrationPage({ params }: PageProps) {
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

  const registration = await getAdminCampRegistration(id);

  if (!registration) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
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
            Detail prihlášky
          </h1>

          <p className="mt-3 text-slate-600">
            {registration.child.firstName} {registration.child.lastName}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">Dieťa</h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Meno a priezvisko
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.child.firstName} {registration.child.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Dátum narodenia
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(registration.child.dateOfBirth)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Veľkosť trička
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.shirtSize}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Nadšenie z tábora
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.excitement !== null
                    ? `${registration.excitement} / 10`
                    : "Neuvedené"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">
              Rodič / zákonný zástupca
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Meno a priezvisko
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.parent.firstName ?? ""}{" "}
                  {registration.parent.lastName ?? ""}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Telefón</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.parent.phone ?? "Neuvedený"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">Údaje o tábore</h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Porcia stravy
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.mealPortion === "adult"
                    ? "Dospelá porcia"
                    : "Detská porcia"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Cena</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatPrice(registration.totalPrice)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Stav prihlášky
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.status === "confirmed"
                    ? "Potvrdená"
                    : registration.status === "cancelled"
                      ? "Zrušená"
                      : "Čaká na potvrdenie"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Prihláška vytvorená
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatDateTime(registration.createdAt)}
                </p>
              </div>
              {registration.status !== "cancelled" && (
                <form
                  action={async () => {
                    "use server";
                    await cancelCampRegistration(registration.id);
                  }}
                >
                  <button
                    type="submit"
                    className="mt-2 inline-flex rounded-full border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Zrušiť prihlášku
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#071b55]">Platba</h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Suma</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.payment
                    ? formatPrice(registration.payment.amount)
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Stav platby
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.payment?.status === "paid"
                    ? "Zaplatené"
                    : registration.payment?.status === "failed"
                      ? "Neúspešná"
                      : registration.payment?.status === "cancelled"
                        ? "Zrušená"
                        : registration.payment?.status === "refunded"
                          ? "Vrátená"
                          : "Čaká na platbu"}
                </p>
              </div>

              {registration.payment?.paidAt && (
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Zaplatené
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {formatDateTime(registration.payment.paidAt)}
                  </p>
                </div>
              )}
              {registration.payment?.status !== "paid" &&
                registration.status !== "cancelled" && (
                  <form
                    action={async () => {
                      "use server";
                      await markCampRegistrationPaid(registration.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="mt-2 inline-flex rounded-full bg-[#071b55] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Označiť ako zaplatené
                    </button>
                  </form>
                )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#071b55]">
            Zdravotné informácie
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {registration.healthInfo}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#071b55]">
            Rekreačný poukaz a fakturačné údaje
          </h2>

          <p className="mt-4 font-semibold text-slate-900">
            Rekreačný poukaz: {registration.recreationVoucher ? "Áno" : "Nie"}
          </p>

          {registration.recreationVoucher && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Meno / názov
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.billingName ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Ulica</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.billingStreet ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">PSČ</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.billingPostalCode ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Mesto</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {registration.billingCity ?? "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#071b55]">Súhlasy</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Ochrana osobných údajov
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {registration.privacyConsent ? "Áno" : "Nie"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Foto / sociálne siete
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {registration.photoConsent ? "Áno" : "Nie"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
