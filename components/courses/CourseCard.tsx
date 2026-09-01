import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/types/course";

type CourseCardProps = {
  course: Course;
};

const levelLabels = {
  beginner: "Začiatočník",
  intermediate: "Mierne pokročilý",
  advanced: "Pokročilý",
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex aspect-[16/10] items-center justify-center bg-sky-50 p-8">
        <Image
          src="/images/logo-feddy1.png"
          alt="FEDDY Plavecká škola"
          width={320}
          height={220}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            {course.ageMin && course.ageMax
              ? `${course.ageMin}–${course.ageMax} rokov`
              : course.ageMin
                ? `${course.ageMin}+ rokov`
                : "Všetky vekové kategórie"}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {levelLabels[course.level]}
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
          {course.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {course.description}
        </p>

        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Lokalita</span>
            <span className="font-medium text-slate-900">
              {course.location.name}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Termíny</span>
            <span className="font-medium text-slate-900">
              {course.terms.length}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Lekcia</span>
            <span className="font-medium text-slate-900">
              {course.lessonDurationMinutes} min
            </span>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">1× týždenne</span>

              <span className="font-semibold text-slate-950">
                {course.price} €
              </span>
            </div>

            {course.priceTwiceWeekly !== undefined && (
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-slate-500">2× týždenne</span>

                <span className="font-semibold text-slate-950">
                  {course.priceTwiceWeekly} €
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          {course.status === "available" ? (
            <Link
              href={`/kurzy/${course.slug}`}
              className="flex w-full items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Zobraziť kurz
            </Link>
          ) : (
            <div className="flex w-full items-center justify-center rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-500">
              Kurz je obsadený
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
