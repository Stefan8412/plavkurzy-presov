import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getChildren } from "@/lib/data/children";
import { getAvailableCampTerms } from "@/lib/data/camp";
import AddChildForm from "@/app/prihlasenie/AddChildForm";
import CampRegistrationForm from "./CampRegistrationForm";

type CampRegistrationPageProps = {
  searchParams: Promise<{
    term?: string;
    child?: string;
  }>;
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("sk-SK");
}

function buildCampRegistrationUrl({
  termId,
  childId,
}: {
  termId?: string;
  childId?: string;
}) {
  const params = new URLSearchParams();

  if (termId) {
    params.set("term", termId);
  }

  if (childId) {
    params.set("child", childId);
  }

  const query = params.toString();

  return query
    ? `/letny-tabor/registracia?${query}`
    : "/letny-tabor/registracia";
}

export default async function CampRegistrationPage({
  searchParams,
}: CampRegistrationPageProps) {
  const params = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const nextUrl = buildCampRegistrationUrl({
      termId: params.term,
      childId: params.child,
    });

    redirect(`/prihlasenie?next=${encodeURIComponent(nextUrl)}`);
  }

  const [children, terms] = await Promise.all([
    getChildren(),
    getAvailableCampTerms(),
  ]);

  const selectedTerm = params.term
    ? terms.find((term) => term.id === params.term)
    : undefined;

  const selectedChild = params.child
    ? children.find((child) => child.id === params.child)
    : undefined;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <Link
        href="/letny-tabor"
        className="text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        ← Späť na letný tábor
      </Link>

      <div className="mt-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
          Denný letný plavecký tábor FEDDY
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Prihlásenie na tábor
        </h1>

        <p className="mt-3 text-slate-600">
          Vyberte turnus a dieťa, ktoré chcete prihlásiť.
        </p>
      </div>

      {terms.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">
            Momentálne nie sú vypísané žiadne turnusy
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Nové termíny letného tábora zverejníme po ich otvorení.
          </p>

          <Link
            href="/letny-tabor"
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Späť na letný tábor
          </Link>
        </section>
      ) : (
        <>
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              1. Vyberte turnus
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {terms.map((term) => {
                const isSelected = selectedTerm?.id === term.id;

                return (
                  <Link
                    key={term.id}
                    href={buildCampRegistrationUrl({
                      termId: term.id,
                      childId: selectedChild?.id,
                    })}
                    className={`rounded-2xl border p-5 transition ${
                      isSelected
                        ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                        : "border-slate-200 bg-white hover:border-sky-300"
                    }`}
                  >
                    <h3 className="font-bold text-slate-950">{term.name}</h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {formatDate(term.startDate)} – {formatDate(term.endDate)}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-sky-700">
                      Voľné miesta: {term.availableSpots} / {term.capacity}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Cena od {term.childMealPrice} €
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-slate-950">
              2. Vyberte dieťa
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Prihlásený účet:{" "}
              <span className="font-medium text-slate-900">{user.email}</span>
            </p>

            {children.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
                <h3 className="font-semibold text-slate-950">
                  Zatiaľ nemáte pridané žiadne dieťa
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Najprv pridajte dieťa, ktoré chcete prihlásiť na tábor.
                </p>

                <div className="mt-6">
                  <AddChildForm />
                </div>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-3">
                  {children.map((child) => {
                    const isSelected = selectedChild?.id === child.id;

                    return (
                      <Link
                        key={child.id}
                        href={buildCampRegistrationUrl({
                          termId: selectedTerm?.id,
                          childId: child.id,
                        })}
                        className={`block rounded-2xl border p-5 transition ${
                          isSelected
                            ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                            : "border-slate-200 bg-white hover:border-sky-300"
                        }`}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-950">
                              {child.firstName} {child.lastName}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Narodenie:{" "}
                              {new Date(
                                `${child.dateOfBirth}T12:00:00`,
                              ).toLocaleDateString("sk-SK")}
                            </p>
                          </div>

                          <span className="text-sm font-semibold text-sky-600">
                            {isSelected ? "Vybrané" : "Vybrať"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="font-semibold text-slate-950">
                    Pridať ďalšie dieťa
                  </h3>

                  <div className="mt-6">
                    <AddChildForm />
                  </div>
                </div>
              </>
            )}
          </section>

          {selectedTerm && selectedChild && (
            <>
              <section className="mt-6 rounded-3xl bg-[#071b55] p-6 text-white sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
                  Vybrané
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {selectedChild.firstName} {selectedChild.lastName}
                </h2>

                <p className="mt-2 text-slate-200">
                  {selectedTerm.name} · {formatDate(selectedTerm.startDate)} –{" "}
                  {formatDate(selectedTerm.endDate)}
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  Voľné miesta: {selectedTerm.availableSpots} /{" "}
                  {selectedTerm.capacity}
                </p>
              </section>

              <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
                    3. Údaje k prihláške
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    Dokončenie prihlášky
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Doplňte údaje potrebné pre účasť dieťaťa na letnom tábore.
                  </p>
                </div>

                <CampRegistrationForm
                  childId={selectedChild.id}
                  campTermId={selectedTerm.id}
                  childMealPrice={selectedTerm.childMealPrice}
                  adultMealPrice={selectedTerm.adultMealPrice}
                />
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}
