import Link from "next/link";

export default function CourseNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
          404
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          Kurz sa nenašiel
        </h1>

        <p className="mt-4 text-slate-600">
          Tento kurz už nemusí byť dostupný alebo neexistuje.
        </p>

        <Link
          href="/kurzy"
          className="mt-8 inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Zobraziť všetky kurzy
        </Link>
      </div>
    </main>
  );
}
