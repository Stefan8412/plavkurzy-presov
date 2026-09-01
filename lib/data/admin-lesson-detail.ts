import { createClient } from "@/lib/supabase/server";

export type AdminLessonChild = {
  childId: string;
  firstName: string;
  lastName: string;
  isAbsent: boolean;
};

export type AdminLessonDetail = {
  id: string;
  lessonDate: string;
  status: "scheduled" | "cancelled" | "completed";
  startTime: string;
  endTime: string;
  courseTitle: string;
  locationName: string;
  children: AdminLessonChild[];
};

type LessonRow = {
  id: string;
  lesson_date: string;
  status: "scheduled" | "cancelled" | "completed";
  course_terms:
    | {
        id: string;
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
  child_id: string;
  children:
    | {
        id: string;
        first_name: string;
        last_name: string;
      }
    | {
        id: string;
        first_name: string;
        last_name: string;
      }[]
    | null;
};

type AbsenceRow = {
  child_id: string;
};

function first<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getAdminLessonDetail(
  lessonId: string,
): Promise<AdminLessonDetail | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return null;
  }

  const { data: lessonData, error: lessonError } = await supabase
    .from("lessons")
    .select(
      `
      id,
      lesson_date,
      status,
      course_terms!lessons_course_term_id_fkey (
        id,
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
    .eq("id", lessonId)
    .single();

  if (lessonError || !lessonData) {
    console.error("Chyba pri načítaní detailu lekcie:", lessonError);
    return null;
  }

  const lesson = lessonData as LessonRow;
  const term = first(lesson.course_terms);

  if (!term) {
    return null;
  }

  const course = first(term.courses);
  const location = first(term.locations);

  if (!course) {
    return null;
  }

  const [
    { data: registrationsData, error: registrationsError },
    { data: absencesData, error: absencesError },
  ] = await Promise.all([
    supabase
      .from("registrations")
      .select(
        `
        child_id,
        children!registrations_child_id_fkey (
          id,
          first_name,
          last_name
        )
      `,
      )
      .eq("course_term_id", term.id)
      .in("status", ["pending", "confirmed"]),

    supabase
      .from("lesson_absences")
      .select("child_id")
      .eq("lesson_id", lesson.id),
  ]);

  if (registrationsError) {
    console.error("Chyba pri načítaní detí na lekcii:", registrationsError);
    throw new Error("Nepodarilo sa načítať deti.");
  }

  if (absencesError) {
    console.error("Chyba pri načítaní odhlásení z lekcie:", absencesError);
    throw new Error("Nepodarilo sa načítať odhlásenia.");
  }

  const registrations = (registrationsData ?? []) as RegistrationRow[];

  const absences = (absencesData ?? []) as AbsenceRow[];

  const absentChildIds = new Set(absences.map((absence) => absence.child_id));

  const children: AdminLessonChild[] = registrations
    .map((registration) => {
      const child = first(registration.children);

      if (!child) {
        return null;
      }

      return {
        childId: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
        isAbsent: absentChildIds.has(child.id),
      };
    })
    .filter((child): child is AdminLessonChild => child !== null)
    .sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(
        `${b.lastName} ${b.firstName}`,
        "sk",
      ),
    );

  return {
    id: lesson.id,
    lessonDate: lesson.lesson_date,
    status: lesson.status,
    startTime: term.start_time,
    endTime: term.end_time,
    courseTitle: course.title,
    locationName: location?.name ?? "Neznáma lokalita",
    children,
  };
}
