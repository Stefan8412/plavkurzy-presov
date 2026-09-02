import { createClient } from "@/lib/supabase/server";

export type AdminCourseTermDetail = {
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

function first<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getAdminCourseTermDetail(
  termId: string,
): Promise<AdminCourseTermDetail | null> {
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

  const { data: termData, error: termError } = await supabase
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
    .eq("id", termId)
    .single();

  if (termError || !termData) {
    console.error("Chyba pri načítaní detailu termínu:", termError);

    return null;
  }

  const term = termData as CourseTermRow;

  const course = first(term.courses);
  const location = first(term.locations);

  const { count: registeredCount, error: registrationsError } = await supabase
    .from("registrations")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("course_term_id", term.id)
    .in("status", ["pending", "confirmed"]);

  if (registrationsError) {
    console.error(
      "Chyba pri načítaní obsadenosti termínu:",
      registrationsError,
    );

    throw new Error("Nepodarilo sa načítať obsadenosť termínu.");
  }

  const activeRegistrations = registeredCount ?? 0;

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
    registeredCount: activeRegistrations,
    availablePlaces: Math.max(term.capacity - activeRegistrations, 0),
    status: term.status,
  };
}
