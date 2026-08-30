import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";
import AddChildForm from "./AddChildForm";
import { getCourseTermById } from "@/lib/data/courses";
import { getChildren } from "@/lib/data/children";
import { getRegistrationForChildAndTerm } from "@/lib/data/registrations";
import RegistrationForm from "./RegistrationForm";

type LoginPageProps = {
  searchParams: Promise<{
    term?: string;
    child?: string;
  }>;
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

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const termId = params.term;
  const childId = params.child;

  // --------------------------------------------------
  // Supabase + používateľ
  // --------------------------------------------------

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --------------------------------------------------
  // Prihlásenie bez vybraného termínu
  // --------------------------------------------------

  if (!termId) {
    // Ak je používateľ už prihlásený,
    // zistíme jeho rolu.
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        redirect("/admin");
      }

      // Prihlásený rodič bez konkrétneho termínu
      // pokračuje na zoznam kurzov.
      redirect("/kurzy");
    }

    // Neprihlásený používateľ → klasický login
    return (
      <main className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na domov
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            FEDDY
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Prihlásenie
          </h1>

          <p className="mt-3 text-slate-600">Prihláste sa do svojho účtu.</p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LoginForm />

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">Ešte nemáte účet?</p>

            <Link
              href="/registracia"
              className="mt-2 inline-block text-sm font-semibold text-[#009ee9] hover:text-[#0087c9]"
            >
              Vytvoriť účet
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // --------------------------------------------------
  // Termín
  // --------------------------------------------------

  const term = await getCourseTermById(termId);

  if (!term) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href="/kurzy"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na kurzy
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Termín neexistuje
          </h1>

          <p className="mt-3 text-slate-600">
            Tento termín už nemusí byť dostupný.
          </p>

          <Link
            href="/kurzy"
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Zobraziť kurzy
          </Link>
        </div>
      </main>
    );
  }

  const isAvailable = term.status === "available" && term.availableSpots > 0;

  // --------------------------------------------------
  // Ak používateľ nie je prihlásený
  // --------------------------------------------------

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href="/kurzy"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na kurzy
        </Link>

        <div className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Prihlásenie na kurz
          </h1>

          <p className="mt-3 text-slate-600">Vybraný termín</p>
        </div>

        {/* Termín */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Termín kurzu</p>

              <h2 className="mt-2 text-xl font-bold text-slate-950">
                {dayLabels[term.dayOfWeek]}
              </h2>

              <p className="mt-1 text-lg font-semibold text-sky-600">
                {term.startTime} – {term.endTime}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {term.startDate} – {term.endDate}
              </p>

              {term.trainerName && (
                <p className="mt-3 text-sm text-slate-600">
                  Tréner:{" "}
                  <span className="font-medium text-slate-900">
                    {term.trainerName}
                  </span>
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-slate-500">Voľné miesta</p>

              <p
                className={`mt-1 text-lg font-bold ${
                  isAvailable ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {isAvailable
                  ? `${term.availableSpots} / ${term.capacity}`
                  : "Obsadené"}
              </p>
            </div>
          </div>
        </section>

        {/* Login */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-xl font-bold text-slate-950">Prihlásenie</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Prihláste sa do svojho účtu a pokračujte v registrácii na kurz.
          </p>

          <div className="mt-6">
            <LoginForm termId={termId} />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Ešte nemáte účet?
          </p>

          <Link
            href={`/registracia?term=${termId}`}
            className="mt-2 block text-center text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            Vytvoriť účet
          </Link>
        </section>
      </main>
    );
  }

  // --------------------------------------------------
  // Prihlásený používateľ → deti
  // --------------------------------------------------

  const children = await getChildren();

  // --------------------------------------------------
  // Ak máme childId → overíme, že patrí používateľovi
  // --------------------------------------------------

  const selectedChild = childId
    ? children.find((child) => child.id === childId)
    : undefined;

  const existingRegistration =
    selectedChild && childId
      ? await getRegistrationForChildAndTerm({
          childId,
          courseTermId: termId,
        })
      : null;

  // --------------------------------------------------
  // Vybrané dieťa
  // --------------------------------------------------

  if (childId && !selectedChild) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href={`/prihlasenie?term=${termId}`}
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na výber dieťaťa
        </Link>

        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-900">Dieťa sa nenašlo</h1>

          <p className="mt-3 text-sm leading-6 text-red-700">
            Vybrané dieťa neexistuje alebo nepatrí k vášmu účtu.
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Súhrn registrácie
  // --------------------------------------------------

  if (selectedChild) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href={`/prihlasenie?term=${termId}`}
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Zmeniť dieťa
        </Link>

        <div className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Kontrola prihlásenia
          </h1>

          <p className="mt-3 text-slate-600">
            Skontrolujte údaje pred pokračovaním.
          </p>
        </div>

        {/* Dieťa */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Prihlasované dieťa
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {selectedChild.firstName} {selectedChild.lastName}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Narodenie:{" "}
            {new Date(selectedChild.dateOfBirth).toLocaleDateString("sk-SK")}
          </p>

          {selectedChild.gender && (
            <p className="mt-1 text-sm text-slate-500">
              Pohlavie:{" "}
              {selectedChild.gender === "male"
                ? "Chlapec"
                : selectedChild.gender === "female"
                  ? "Dievča"
                  : "Iné"}
            </p>
          )}
        </section>

        {/* Termín */}
        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Kurz</p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            {term.courseTitle}
          </h2>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-slate-500">Vybraný termín</p>

            <h2 className="mt-2 text-xl font-bold text-slate-950">
              {dayLabels[term.dayOfWeek]}
            </h2>

            <p className="mt-1 text-lg font-semibold text-sky-600">
              {term.startTime} – {term.endTime}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {term.startDate} – {term.endDate}
            </p>

            {term.trainerName && (
              <p className="mt-3 text-sm text-slate-600">
                Tréner:{" "}
                <span className="font-medium text-slate-900">
                  {term.trainerName}
                </span>
              </p>
            )}

            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Voľné miesta</span>

                <span
                  className={`text-sm font-semibold ${
                    isAvailable ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {isAvailable
                    ? `${term.availableSpots} / ${term.capacity}`
                    : "Obsadené"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Ďalší krok */}
        <section className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-slate-500">Cena kurzu</p>

              <p className="mt-1 text-2xl font-bold text-slate-950">
                {term.coursePrice} {term.courseCurrency}
              </p>
            </div>

            <div>
              {existingRegistration ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                    <p className="font-semibold text-emerald-800">
                      Dieťa je už prihlásené
                    </p>

                    <p className="mt-1 text-sm text-emerald-700">
                      Stav:{" "}
                      <span className="font-semibold">
                        {existingRegistration.status === "pending"
                          ? "Čaká na potvrdenie"
                          : existingRegistration.status === "confirmed"
                            ? "Potvrdená"
                            : existingRegistration.status === "completed"
                              ? "Dokončená"
                              : "Zrušená"}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={`/prihlasenie?term=${termId}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Vybrať iné dieťa
                  </Link>
                </div>
              ) : isAvailable && childId ? (
                <RegistrationForm childId={childId} courseTermId={termId} />
              ) : isAvailable ? (
                <span className="text-sm text-slate-500">
                  Najprv vyberte dieťa.
                </span>
              ) : (
                <span className="rounded-full bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500">
                  Termín je obsadený
                </span>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // --------------------------------------------------
  // Zoznam detí
  // --------------------------------------------------

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <Link
        href="/kurzy"
        className="text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        ← Späť na kurzy
      </Link>

      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Prihlásenie na kurz
        </h1>

        <p className="mt-3 text-slate-600">
          Vyberte dieťa, ktoré chcete prihlásiť na tento termín.
        </p>
      </div>

      {/* Termín */}
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Vybraný termín</p>

        <h2 className="mt-2 text-xl font-bold text-slate-950">
          {dayLabels[term.dayOfWeek]}
        </h2>

        <p className="mt-1 text-lg font-semibold text-sky-600">
          {term.startTime} – {term.endTime}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          {term.startDate} – {term.endDate}
        </p>
      </section>

      {/* Deti */}
      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        <h2 className="text-xl font-bold text-slate-950">Vyberte dieťa</h2>

        <p className="mt-2 text-sm text-slate-600">
          Ste prihlásený ako{" "}
          <span className="font-medium text-slate-900">{user.email}</span>
        </p>

        {children.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <h3 className="font-semibold text-slate-950">
              Zatiaľ nemáte pridané žiadne dieťa
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Najprv pridajte dieťa, ktoré chcete prihlásiť na kurz.
            </p>

            <div className="mt-6">
              <AddChildForm />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {child.firstName} {child.lastName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Narodenie:{" "}
                        {new Date(child.dateOfBirth).toLocaleDateString(
                          "sk-SK",
                        )}
                      </p>
                    </div>

                    <Link
                      href={`/prihlasenie?term=${termId}&child=${child.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                    >
                      Vybrať dieťa
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-950">
                Pridať ďalšie dieťa
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Ak chcete prihlásiť ďalšie dieťa, môžete ho pridať do svojho
                účtu.
              </p>

              <div className="mt-6">
                <AddChildForm />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
