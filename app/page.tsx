import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";

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
    <main>
      {/* Hero */}
      <section className="overflow-hidden bg-[#eefaff]">
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#009ee9] shadow-sm">
              FEDDY plavecká škola
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-[#071b55] md:text-6xl">
              Plávanie hrou,
              <span className="block text-[#009ee9]">hra plávaním.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Pomáhame deťom aj dospelým cítiť sa vo vode bezpečne, sebavedomo a
              s radosťou z pohybu.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kurzy"
                className="rounded-full bg-[#009ee9] px-7 py-4 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0087c9] hover:shadow-md"
              >
                Vybrať plavecký kurz
              </Link>

              <Link
                href="/cennik"
                className="rounded-full border border-[#071b55]/15 bg-white px-7 py-4 font-bold text-[#071b55] transition hover:border-[#009ee9] hover:text-[#009ee9]"
              >
                Pozrieť cenník
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm font-semibold text-[#071b55]">
              <span>✓ Malé skupiny</span>
              <span>✓ Skúsení tréneri</span>
              <span>✓ Bezpečný prístup</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#fbbf24]/30 blur-2xl" />
            <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-[#009ee9]/20 blur-3xl" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-sky-200 shadow-2xl">
              <Image
                src="/images/hero-feddy.jpg"
                alt="Plavecká škola FEDDY"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-6 rounded-2xl bg-white px-5 py-4 shadow-lg">
              <p className="text-sm font-semibold text-slate-500">
                Plavecká škola
              </p>
              <p className="mt-1 text-lg font-bold text-[#071b55]">Prešov</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <Section>
        <SectionHeading
          eyebrow="Naša ponuka"
          title="Nájdite správny kurz"
          description="Kurzy prispôsobené veku a skúsenostiam."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.title}
              className="group rounded-3xl border border-sky-100 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-sm font-bold text-[#009ee9]">
                {course.age}
              </span>

              <h3 className="mt-4 text-2xl font-bold text-[#071b55]">
                {course.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {course.description}
              </p>

              <Link
                href="/kurzy"
                className="mt-6 inline-block font-bold text-[#009ee9]"
              >
                Zistiť viac →
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <section className="bg-[#071b55] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#38bdf8]">
              Prečo FEDDY
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Viac než len plávanie
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-sky-100/80">
              Chceme, aby si deti vytvorili prirodzený a pozitívny vzťah k vode
              a zároveň sa naučili správne plavecké základy.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009ee9]/20 text-lg font-bold text-[#38bdf8]">
                  {index + 1}
                </div>

                <h3 className="text-xl font-bold">{benefit.title}</h3>

                <p className="mt-3 leading-7 text-sky-100/70">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Jednoduché prihlásenie
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Ako to funguje?
            </h2>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <span className="text-5xl font-extrabold text-[#009ee9]/15">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-bold text-[#071b55]">
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
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#009ee9] px-8 py-16 text-center text-white md:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
            Začnite ešte dnes
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Pripravení začať plávať?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg text-sky-50">
            Vyberte si kurz a nájdite vhodný termín pre vás alebo vaše dieťa.
          </p>

          <Link
            href="/kurzy"
            className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-bold text-[#071b55] transition hover:bg-sky-50"
          >
            Pozrieť kurzy
          </Link>
        </div>
      </section>
    </main>
  );
}
