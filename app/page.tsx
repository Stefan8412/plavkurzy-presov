import Link from "next/link";
import Header from "@/components/Header";

const courses = [
  {
    title: "Plávanie pre najmenších",
    description: "Prvé skúsenosti s vodou v bezpečnom a hravom prostredí.",
    age: "3–4 roky",
  },
  {
    title: "Plávanie pre deti",
    description: "Skupinové kurzy pre deti rôznych úrovní a skúseností.",
    age: "4–10 rokov",
  },
  {
    title: "Plávanie 10+",
    description: "Rozvoj techniky, kondície a sebavedomia vo vode.",
    age: "10+ rokov",
  },
];

const benefits = [
  {
    title: "Skúsení tréneri",
    description: "Naši tréneri majú skúsenosti s výučbou detí aj dospelých.",
  },
  {
    title: "Bezpečné prostredie",
    description:
      "Bezpečnosť a pozitívny vzťah k vode sú pre nás na prvom mieste.",
  },
  {
    title: "Malé skupiny",
    description: "Vďaka menším skupinám sa môžeme venovať každému plavcovi.",
  },
];

const steps = [
  {
    number: "01",
    title: "Vyberte kurz",
    description: "Nájdite kurz podľa veku, úrovne a termínu.",
  },
  {
    number: "02",
    title: "Prihláste dieťa",
    description: "Vyplníte jednoduchú online prihlášku.",
  },
  {
    number: "03",
    title: "Začnite plávať",
    description: "Prídete na prvú hodinu a pustíte sa do toho.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-sky-50">
          <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Plavecká škola Prešov
              </p>

              <h1 className="text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
                Plávanie, ktoré deti baví.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Naučíme vaše deti milovať vodu, zlepšiť svoje plavecké
                schopnosti a cítiť sa vo vode bezpečne.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/kurzy"
                  className="rounded-full bg-sky-600 px-7 py-4 font-semibold text-white transition hover:bg-sky-700"
                >
                  Vybrať plavecký kurz
                </Link>

                <Link
                  href="/o-nas"
                  className="rounded-full border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-800 transition hover:border-slate-400"
                >
                  Spoznajte nás
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sky-200">
              <div className="flex h-full items-center justify-center">
                <span className="text-sm font-medium text-sky-800">
                  FOTO / VIDEO
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Naša ponuka
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                Nájdite správny kurz
              </h2>

              <p className="mt-4 text-lg text-slate-600">
                Kurzy prispôsobené veku, skúsenostiam a potrebám každého plavca.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="text-sm font-semibold text-sky-600">
                    {course.age}
                  </span>

                  <h3 className="mt-3 text-2xl font-bold text-slate-950">
                    {course.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {course.description}
                  </p>

                  <Link
                    href="/kurzy"
                    className="mt-6 inline-block font-semibold text-sky-600"
                  >
                    Zistiť viac →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-slate-950 py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-400">
                Prečo my
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Viac než len plávanie
              </h2>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <div className="mb-5 h-12 w-12 rounded-2xl bg-sky-500/20" />

                  <h3 className="text-xl font-bold">{benefit.title}</h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Jednoduché prihlásenie
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                Ako to funguje?
              </h2>
            </div>

            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <span className="text-5xl font-bold text-sky-100">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-sky-600 px-8 py-16 text-center text-white md:px-16">
            <h2 className="text-4xl font-bold tracking-tight">
              Pripravení začať plávať?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-lg text-sky-100">
              Vyberte si kurz a nájdite vhodný termín pre vás alebo vaše dieťa.
            </p>

            <Link
              href="/kurzy"
              className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              Pozrieť kurzy
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Plavecká škola Prešov</p>

          <div className="flex gap-6">
            <Link href="/kontakt" className="hover:text-slate-900">
              Kontakt
            </Link>
            <Link href="/dokumenty" className="hover:text-slate-900">
              Dokumenty
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
