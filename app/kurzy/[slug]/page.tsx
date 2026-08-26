import Link from "next/link";
import { notFound } from "next/navigation";
import CourseTerm from "@/components/courses/CourseTerm";
import { getCourseBySlug } from "@/lib/data/courses";
import type { Course } from "@/types/course";
import type { CourseLevel, CourseCategory } from "@/types/course";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const levelLabels: Record<CourseLevel, string> = {
  beginner: "Začiatočník",
  intermediate: "Mierne pokročilý",
  advanced: "Pokročilý",
};

const categoryLabels: Record<CourseCategory, string> = {
  children: "Deti",
  adults: "Dospelí",
  individual: "Individuálne plávanie",
  camp: "Plavecký tábor",
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Back */}
      <Link
        href="/kurzy"
        className="text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        ← Späť na kurzy
      </Link>

      {/* Header */}
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {categoryLabels[course.category]}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {levelLabels[course.level]}
            </span>

            {course.ageMin && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {course.ageMax
                  ? `${course.ageMin}–${course.ageMax} rokov`
                  : `${course.ageMin}+ rokov`}
              </span>
            )}
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {course.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {course.description}
          </p>
        </div>

        {/* Price */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Cena kurzu</p>

          <p className="mt-2 text-4xl font-bold text-slate-950">
            {course.price} €
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {course.numberOfLessons} lekcií
          </p>

          <Link
            href={
              course.terms[0] ? `/prihlasenie?term=${course.terms[0].id}` : "#"
            }
            className="mt-6 flex w-full items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Vybrať termín
          </Link>
        </div>
      </div>

      {/* Course information */}
      <section className="mt-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Lokalita</p>

            <p className="mt-2 font-semibold text-slate-950">
              {course.location.name}
            </p>

            {course.location.address && (
              <p className="mt-1 text-sm text-slate-500">
                {course.location.address}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Dĺžka lekcie</p>

            <p className="mt-2 font-semibold text-slate-950">
              {course.lessonDurationMinutes} minút
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Počet lekcií</p>

            <p className="mt-2 font-semibold text-slate-950">
              {course.numberOfLessons}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Vek</p>

            <p className="mt-2 font-semibold text-slate-950">
              {course.ageMin
                ? course.ageMax
                  ? `${course.ageMin}–${course.ageMax} rokov`
                  : `${course.ageMin}+ rokov`
                : "Bez obmedzenia"}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      {course.features.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-950">Čo kurz ponúka</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {course.features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-600">✓</span>

                  <span className="text-sm font-medium text-slate-700">
                    {feature}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Terms */}
      <section className="mt-16">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Dostupné termíny
          </h2>

          <p className="mt-2 text-slate-600">
            Vyberte si termín, ktorý vám najviac vyhovuje.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {course.terms.length > 0 ? (
            course.terms.map((term) => <CourseTerm key={term.id} term={term} />)
          ) : (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                Momentálne nie sú dostupné žiadne termíny.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
