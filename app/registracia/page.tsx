import Link from "next/link";

import RegisterForm from "./RegisterForm";

type RegisterPageProps = {
  searchParams: Promise<{
    term?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const termId = params.term;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <Link
        href={termId ? `/prihlasenie?term=${termId}` : "/prihlasenie"}
        className="text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        ← Späť na prihlásenie
      </Link>

      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Vytvoriť účet
        </h1>

        <p className="mt-3 text-slate-600">
          Vytvorte si rodičovský účet pre prihlasovanie detí na plavecké kurzy.
        </p>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <RegisterForm termId={termId} />
      </section>

      <p className="mt-6 text-center text-sm text-slate-500">
        Už máte účet?{" "}
        <Link
          href={termId ? `/prihlasenie?term=${termId}` : "/prihlasenie"}
          className="font-semibold text-sky-600 hover:text-sky-700"
        >
          Prihlásiť sa
        </Link>
      </p>
    </main>
  );
}
