import { createClient } from "@/lib/supabase/server";

export type AdminLesson = {
  id: string;
  lessonDate: string;
  status: "scheduled" | "cancelled" | "completed";

  courseTermId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;

  courseTitle: string;
  locationName: string;

  registeredCount: number;
  absentCount: number;
  expectedCount: number;
};

type LessonRow = {
  id: string;
  lesson_date: string;
  status: "scheduled" | "cancelled" | "completed";

  course_terms:
    | {
        id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;

        courses:
          | {
              title: string;
            }
          | {
              title: string;
            }[]
          | null;

        locations:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }
    | {
        id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;

        courses:
          | {
              title: string;
            }
          | {
              title: string;
            }[]
          | null;

        locations:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }[]
    | null;
};

type RegistrationRow = {
  course_term_id: string;
};

type AbsenceRow = {
  lesson_id: string;
};

function first<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getAdminLessons(): Promise<AdminLesson[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return [];
  }

  const [
    { data: lessonsData, error: lessonsError },
    { data: registrationsData, error: registrationsError },
    { data: absencesData, error: absencesError },
  ] = await Promise.all([
    supabase
      .from("lessons")
      .select(
        `
        id,
        lesson_date,
        status,
        course_terms!lessons_course_term_id_fkey (
          id,
          day_of_week,
          start_time,
          end_time,
          courses!course_terms_course_id_fkey (
            title
          ),
          locations!course_terms_location_id_fkey (
            name
          )
        )
      `,
      )
      .order("lesson_date", { ascending: true }),

    supabase
      .from("registrations")
      .select("course_term_id")
      .in("status", ["pending", "confirmed"]),

    supabase.from("lesson_absences").select("lesson_id"),
  ]);

  if (lessonsError) {
    console.error("Chyba pri načítaní admin lekcií:", lessonsError);
    throw new Error("Nepodarilo sa načítať lekcie.");
  }

  if (registrationsError) {
    console.error(
      "Chyba pri načítaní registrácií pre lekcie:",
      registrationsError,
    );

    throw new Error("Nepodarilo sa načítať počet prihlásených.");
  }

  if (absencesError) {
    console.error("Chyba pri načítaní odhlásení pre lekcie:", absencesError);

    throw new Error("Nepodarilo sa načítať počet odhlásených.");
  }

  const lessons = (lessonsData ?? []) as LessonRow[];
  const registrations = (registrationsData ?? []) as RegistrationRow[];
  const absences = (absencesData ?? []) as AbsenceRow[];

  const registeredByCourseTerm = new Map<string, number>();

  for (const registration of registrations) {
    const current =
      registeredByCourseTerm.get(registration.course_term_id) ?? 0;

    registeredByCourseTerm.set(registration.course_term_id, current + 1);
  }

  const absentByLesson = new Map<string, number>();

  for (const absence of absences) {
    const current = absentByLesson.get(absence.lesson_id) ?? 0;

    absentByLesson.set(absence.lesson_id, current + 1);
  }

  const result: AdminLesson[] = [];

  for (const lesson of lessons) {
    const term = first(lesson.course_terms);

    if (!term) {
      continue;
    }

    const course = first(term.courses);
    const location = first(term.locations);

    if (!course) {
      continue;
    }

    const registeredCount = registeredByCourseTerm.get(term.id) ?? 0;

    const absentCount = absentByLesson.get(lesson.id) ?? 0;

    result.push({
      id: lesson.id,
      lessonDate: lesson.lesson_date,
      status: lesson.status,

      courseTermId: term.id,
      dayOfWeek: term.day_of_week,
      startTime: term.start_time,
      endTime: term.end_time,

      courseTitle: course.title,
      locationName: location?.name ?? "Neznáma lokalita",

      registeredCount,
      absentCount,
      expectedCount: Math.max(registeredCount - absentCount, 0),
    });
  }

  return result;
}
