import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    registration?: string;
  }>;
};

export default async function RegistrationSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const registrationId = params.registration;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
          Prihláška bola odoslaná
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Vaša prihláška na kurz bola úspešne vytvorená. O jej potvrdení vás
          budeme informovať.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-slate-500">Stav prihlášky</span>

            <span className="text-sm font-semibold text-amber-600">
              Čaká na potvrdenie
            </span>
          </div>

          {registrationId && (
            <div className="mt-3 flex justify-between gap-4">
              <span className="text-sm text-slate-500">Číslo prihlášky</span>

              <span className="max-w-[220px] break-all text-right text-xs font-medium text-slate-700">
                {registrationId}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/kurzy"
            className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Späť na kurzy
          </Link>

          <Link
            href="/"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Domov
          </Link>
        </div>
      </div>
    </main>
  );
}
