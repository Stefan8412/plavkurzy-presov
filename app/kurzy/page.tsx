import CourseCard from "@/components/courses/CourseCard";
import { getCourses } from "@/lib/data/courses";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
          Naše kurzy
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Vyberte si kurz plávania
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Kurzy pre deti aj dospelých, vedené skúsenými trénermi v malých
          skupinách.
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-950">
            Momentálne nemáme dostupné kurzy
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Skúste to prosím neskôr alebo nás kontaktujte.
          </p>
        </div>
      )}
    </main>
  );
}
