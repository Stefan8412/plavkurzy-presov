import Link from "next/link";
import { notFound } from "next/navigation";

import { courses } from "@/data/courses";
import { courseTerms } from "@/data/courseTerms";

import CourseTerm from "@/components/courses/CourseTerm";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

type CoursePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  const course = courses.find((course) => course.slug === slug);

  if (!course) {
    notFound();
  }

  const terms = courseTerms.filter((term) => term.courseId === course.id);

  const ageLabel = course.ageMin
    ? course.ageMax
      ? `${course.ageMin}–${course.ageMax} rokov`
      : `${course.ageMin}+ rokov`
    : "Všetky vekové kategórie";

  return (
    <main>
      {/* Breadcrumb */}
      <div className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="transition-colors hover:text-sky-600">
              Domov
            </Link>

            <span>/</span>

            <Link
              href="/kurzy"
              className="transition-colors hover:text-sky-600"
            >
              Kurzy
            </Link>

            <span>/</span>

            <span className="truncate text-slate-900">{course.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-sky-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-sky-700">
                  {ageLabel}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600">
                  {course.lessonDurationMinutes} min
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                {course.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {course.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="#terminy">Vybrať termín</Button>

                <Button href="/kurzy" variant="secondary">
                  Späť na kurzy
                </Button>
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-sky-200">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium text-sky-800">
                  FOTO KURZU
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course information */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              O kurze
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              {course.description}
            </p>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-slate-950">
                Čo kurz ponúka
              </h3>

              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {course.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                      ✓
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Informácie o kurze
            </h2>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm text-slate-500">Vek</dt>

                <dd className="mt-1 font-medium text-slate-950">{ageLabel}</dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Dĺžka lekcie</dt>

                <dd className="mt-1 font-medium text-slate-950">
                  {course.lessonDurationMinutes} minút
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Počet lekcií</dt>

                <dd className="mt-1 font-medium text-slate-950">
                  {course.numberOfLessons}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Lokalita</dt>

                <dd className="mt-1 font-medium text-slate-950">
                  {course.location.name}
                </dd>

                {course.location.address && (
                  <p className="mt-1 text-sm text-slate-500">
                    {course.location.address}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-200 pt-5">
                <dt className="text-sm text-slate-500">Cena</dt>

                <dd className="mt-1 text-2xl font-bold text-slate-950">
                  {course.price} €
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      {/* Terms */}
      <section id="terminy" className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Rozvrh
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Vyberte si termín
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Vyberte si deň a čas, ktorý vám najviac vyhovuje.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {terms.length > 0 ? (
              terms.map((term) => <CourseTerm key={term.id} term={term} />)
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="font-medium text-slate-900">
                  Momentálne nemáme dostupné termíny.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Kontaktujte nás a radi vám poradíme.
                </p>

                <Link
                  href="/kontakt"
                  className="mt-5 inline-block font-semibold text-sky-600"
                >
                  Kontaktovať školu →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <Section>
        <div className="rounded-3xl bg-sky-600 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-3xl font-bold">Máte otázky?</h2>

          <p className="mx-auto mt-3 max-w-xl text-sky-100">
            Ak si nie ste istí, ktorý kurz alebo termín je vhodný, radi vám
            poradíme.
          </p>

          <div className="mt-6">
            <Button href="/kontakt" variant="secondary">
              Kontaktovať nás
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
