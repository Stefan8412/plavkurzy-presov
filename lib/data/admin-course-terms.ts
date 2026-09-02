import { createClient } from "@/lib/supabase/server";

export type AdminCourseTerm = {
  id: string;
  courseTitle: string;
  locationName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  capacity: number;
  registeredCount: number;
  availablePlaces: number;
  status: "available" | "full" | "closed";
};

type CourseTermRow = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
  capacity: number;
  status: "available" | "full" | "closed";

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
};

type RegistrationRow = {
  course_term_id: string;
};

function first<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getAdminCourseTerms(): Promise<AdminCourseTerm[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return [];
  }

  const [
    { data: termsData, error: termsError },
    { data: registrationsData, error: registrationsError },
  ] = await Promise.all([
    supabase
      .from("course_terms")
      .select(
        `
        id,
        day_of_week,
        start_time,
        end_time,
        start_date,
        end_date,
        capacity,
        status,
        courses!course_terms_course_id_fkey (
          title
        ),
        locations!course_terms_location_id_fkey (
          name
        )
      `,
      )
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true }),

    supabase
      .from("registrations")
      .select("course_term_id")
      .in("status", ["pending", "confirmed"]),
  ]);

  if (termsError) {
    console.error("Chyba pri načítaní termínov kurzov:", termsError);

    throw new Error("Nepodarilo sa načítať termíny kurzov.");
  }

  if (registrationsError) {
    console.error(
      "Chyba pri načítaní registrácií termínov:",
      registrationsError,
    );

    throw new Error("Nepodarilo sa načítať registrácie.");
  }

  const terms = (termsData ?? []) as CourseTermRow[];
  const registrations = (registrationsData ?? []) as RegistrationRow[];

  const registeredByCourseTerm = new Map<string, number>();

  for (const registration of registrations) {
    registeredByCourseTerm.set(
      registration.course_term_id,
      (registeredByCourseTerm.get(registration.course_term_id) ?? 0) + 1,
    );
  }

  return terms.map((term) => {
    const course = first(term.courses);
    const location = first(term.locations);

    const registeredCount = registeredByCourseTerm.get(term.id) ?? 0;

    return {
      id: term.id,
      courseTitle: course?.title ?? "Neznámy kurz",
      locationName: location?.name ?? "Neznáma lokalita",
      dayOfWeek: term.day_of_week,
      startTime: term.start_time,
      endTime: term.end_time,
      startDate: term.start_date,
      endDate: term.end_date,
      capacity: term.capacity,
      registeredCount,
      availablePlaces: Math.max(term.capacity - registeredCount, 0),
      status: term.status,
    };
  });
}
