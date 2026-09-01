import Link from "next/link";
import { notFound } from "next/navigation";
import CourseTermSelector from "@/components/courses/CourseTermSelector";
import { getCourseBySlug } from "@/lib/data/courses";
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
      <Link
        href="/kurzy"
        className="text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        ← Späť na kurzy
      </Link>

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
          <p className="text-sm font-semibold text-slate-500">
            Členský príspevok
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-sky-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">1× týždenne</p>

                  <p className="mt-1 text-xs text-slate-500">
                    Jeden vybraný termín
                  </p>
                </div>

                <p className="text-2xl font-bold text-[#071b55]">
                  {course.price} €
                </p>
              </div>
            </div>

            {course.priceTwiceWeekly !== undefined && (
              <div className="rounded-2xl bg-sky-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">2× týždenne</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Dva vybrané termíny
                    </p>
                  </div>

                  <p className="text-2xl font-bold text-[#071b55]">
                    {course.priceTwiceWeekly} €
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Kurz prebieha v období od 21. 9. 2026 do 22. 1. 2027.
          </p>

          <a
            href="#terminy"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Vybrať frekvenciu a termín
          </a>
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
            <p className="text-sm text-slate-500">Obdobie kurzu</p>

            <p className="mt-2 font-semibold text-slate-950">
              21. 9. 2026 – 22. 1. 2027
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
      <section id="terminy" className="mt-16 scroll-mt-28">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Vyberte si deň a čas
          </h2>

          <p className="mt-2 text-slate-600">
            Pri plávaní 1× týždenne vyberiete jeden termín. Pri plávaní 2×
            týždenne vyberiete dva termíny.
          </p>
        </div>

        <div className="mt-6">
          {course.terms.length > 0 ? (
            <CourseTermSelector
              terms={course.terms}
              priceOnceWeekly={course.price}
              priceTwiceWeekly={course.priceTwiceWeekly}
            />
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
