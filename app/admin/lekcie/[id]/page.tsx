import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getAdminLessonDetail } from "@/lib/data/admin-lesson-detail";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default async function AdminLessonDetailPage({ params }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prihlasenie");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;

  const lesson = await getAdminLessonDetail(id);

  if (!lesson) {
    notFound();
  }

  const absentCount = lesson.children.filter((child) => child.isAbsent).length;

  const expectedCount = lesson.children.length - absentCount;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            href="/admin/lekcie"
            className="text-sm font-semibold text-[#009ee9] transition hover:underline"
          >
            ← Späť na lekcie
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Detail lekcie
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            {lesson.courseTitle}
          </h1>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
            <p className="font-semibold capitalize text-slate-900">
              {formatDate(lesson.lessonDate)}
            </p>

            <p>
              {lesson.startTime.slice(0, 5)} – {lesson.endTime.slice(0, 5)}
            </p>

            <p>{lesson.locationName}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Prihlásených</p>

            <p className="mt-2 text-3xl font-bold text-[#071b55]">
              {lesson.children.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Odhlásených</p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {absentCount}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Očakávame</p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {expectedCount}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-[#071b55]">Deti na lekcii</h2>
          </div>

          {lesson.children.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">
                Na túto lekciu zatiaľ nie je prihlásené žiadne dieťa.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lesson.children.map((child) => (
                <div
                  key={child.childId}
                  className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="font-semibold text-slate-900">
                    {child.firstName} {child.lastName}
                  </p>

                  {child.isAbsent ? (
                    <span className="inline-flex w-fit rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
                      Odhlásený
                    </span>
                  ) : (
                    <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                      Príde
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
