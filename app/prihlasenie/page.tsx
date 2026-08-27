import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

import { getCourseTermById } from "@/lib/data/courses";

type LoginPageProps = {
  searchParams: Promise<{
    term?: string;
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

  // Žiadny termín nebol vybraný
  if (!termId) {
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
            Vyberte si termín kurzu
          </h1>

          <p className="mt-3 text-slate-600">
            Pred prihlásením je potrebné vybrať konkrétny termín kurzu.
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

  // Načítanie konkrétneho CourseTerm
  const term = await getCourseTermById(termId);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // UUID neexistuje
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

      {/* Vybraný termín */}
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

      {/* Zatiaľ iba placeholder pre autentifikáciu */}
      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        {!user ? (
          <>
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
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-950">Ste prihlásený</h2>

            <p className="mt-2 text-sm text-slate-600">{user.email}</p>

            <p className="mt-4 text-sm text-slate-600">
              Môžeme pokračovať výberom dieťaťa.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
