import { createClient } from "@/lib/supabase/server";

import type {
  Course,
  CourseCategory,
  CourseLevel,
  CourseStatus,
  CourseTerm,
  DayOfWeek,
} from "@/types/course";

/**
 * ============================================================
 * Database types
 * ============================================================
 */

type RegistrationStatus = "pending" | "confirmed" | "cancelled" | "completed";

type CourseTermRow = {
  id: string;
  course_id: string;
  location_id: string;
  trainer_id: string | null;

  day_of_week: number;

  start_time: string;
  end_time: string;

  start_date: string;
  end_date: string;

  capacity: number;
  status: CourseStatus;

  locations:
    | {
        name: string;
        address: string | null;
      }
    | {
        name: string;
        address: string | null;
      }[]
    | null;

  trainers:
    | {
        first_name: string;
        last_name: string;
      }[]
    | null;

  registrations:
    | {
        id: string;
        status: RegistrationStatus;
      }[]
    | null;
};

type CourseTermDetail = CourseTerm & {
  courseTitle: string;

  coursePrice: number;
  coursePriceTwiceWeekly?: number;

  courseCurrency: "EUR";

  courseNumberOfLessons: number;
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string;

  category: CourseCategory;
  level: CourseLevel;

  age_min: number | null;
  age_max: number | null;

  price: number;
  price_twice_weekly: number | null;

  currency: "EUR";

  lesson_duration_minutes: number;
  number_of_lessons: number;

  active: boolean;

  features: string[] | null;

  course_terms: CourseTermRow[] | null;
};

/**
 * ============================================================
 * Helpers
 * ============================================================
 */

/**
 * Database:
 *
 * 1 = Monday
 * 2 = Tuesday
 * 3 = Wednesday
 * 4 = Thursday
 * 5 = Friday
 * 6 = Saturday
 * 7 = Sunday
 */
const dayNames: Record<number, DayOfWeek> = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday",
};

function mapDayOfWeek(day: number): DayOfWeek {
  return dayNames[day] ?? "monday";
}

/**
 * Convert database CourseTerm into frontend CourseTerm.
 */
function mapCourseTerm(term: CourseTermRow): CourseTerm {
  const activeRegistrations =
    term.registrations?.filter(
      (registration) =>
        registration.status === "pending" ||
        registration.status === "confirmed",
    ).length ?? 0;

  const availableSpots = Math.max(term.capacity - activeRegistrations, 0);

  const trainer = term.trainers?.[0];

  return {
    id: term.id,

    courseId: term.course_id,

    dayOfWeek: mapDayOfWeek(term.day_of_week),

    startTime: term.start_time,
    endTime: term.end_time,

    startDate: term.start_date,
    endDate: term.end_date,

    capacity: term.capacity,

    availableSpots,

    trainerId: term.trainer_id ?? undefined,

    trainerName: trainer
      ? `${trainer.first_name} ${trainer.last_name}`
      : undefined,

    status: availableSpots === 0 ? "full" : term.status,
  };
}

/**
 * Convert database Course into frontend Course.
 */
function mapCourse(course: CourseRow): Course {
  const terms = (course.course_terms ?? []).map(mapCourseTerm);

  let status: CourseStatus = "closed";

  if (terms.some((term) => term.status === "available")) {
    status = "available";
  } else if (terms.some((term) => term.status === "full")) {
    status = "full";
  }

  return {
    id: course.id,

    slug: course.slug,

    title: course.title,

    description: course.description,

    category: course.category,

    level: course.level,

    ageMin: course.age_min ?? undefined,

    ageMax: course.age_max ?? undefined,

    location: (() => {
      const locations = course.course_terms?.[0]?.locations;

      const location = Array.isArray(locations) ? locations[0] : locations;

      return {
        name: location?.name ?? "Neznáma lokalita",
        address: location?.address ?? undefined,
      };
    })(),

    price: course.price,

    priceTwiceWeekly: course.price_twice_weekly ?? undefined,

    currency: course.currency,

    lessonDurationMinutes: course.lesson_duration_minutes,

    numberOfLessons: course.number_of_lessons,

    status,

    features: course.features ?? [],

    terms,
  };
}

/**
 * ============================================================
 * Queries
 * ============================================================
 */

/**
 * Get all active courses.
 *
 * Used by:
 *
 * /kurzy
 */
export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      slug,
      title,
      description,
      category,
      level,
      age_min,
      age_max,
      price,
      price_twice_weekly,
      currency,
      lesson_duration_minutes,
      number_of_lessons,
      active,

      features,

      course_terms (
        id,
        course_id,
        location_id,
        trainer_id,
        day_of_week,
        start_time,
        end_time,
        start_date,
        end_date,
        capacity,
        status,

        locations!course_terms_location_id_fkey (
          name,
          address
        ),

        trainers!course_terms_trainer_id_fkey (
          first_name,
          last_name
        ),

        registrations (
          id,
          status
        )
      )
    `,
    )
    .eq("active", true)
    .order("title");

  if (error) {
    console.error("Failed to fetch courses:", error);

    throw new Error("Failed to fetch courses");
  }

  return (data as CourseRow[]).map(mapCourse);
}

/**
 * Get one course by slug.
 *
 * Used by:
 *
 * /kurzy/[slug]
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      slug,
      title,
      description,
      category,
      level,
      age_min,
      age_max,
      price,
      price_twice_weekly,
      currency,
      lesson_duration_minutes,
      number_of_lessons,
      active,

      features,

      course_terms (
        id,
        course_id,
        location_id,
        trainer_id,
        day_of_week,
        start_time,
        end_time,
        start_date,
        end_date,
        capacity,
        status,

        locations!course_terms_location_id_fkey (
          name,
          address
        ),

        trainers!course_terms_trainer_id_fkey (
          first_name,
          last_name
        ),

        registrations (
          id,
          status
        )
      )
    `,
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch course:", error);

    throw new Error("Failed to fetch course");
  }

  if (!data) {
    return null;
  }

  return mapCourse(data as CourseRow);
}

/**
 * Get one course term by ID.
 */
export async function getCourseTermById(
  termId: string,
): Promise<CourseTermDetail | null> {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(termId)) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_terms")
    .select(
      `
      id,
      course_id,
      location_id,
      trainer_id,
      day_of_week,
      start_time,
      end_time,
      start_date,
      end_date,
      capacity,
      status,

      locations!course_terms_location_id_fkey (
        name,
        address
      ),

      trainers!course_terms_trainer_id_fkey (
        first_name,
        last_name
      ),

      registrations (
        id,
        status
      ),

      courses!course_terms_course_id_fkey (
        title,
        price,
        price_twice_weekly,
        currency,
        number_of_lessons
      )
    `,
    )
    .eq("id", termId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch course term:", error);

    throw new Error("Failed to fetch course term");
  }

  if (!data) {
    return null;
  }

  const course = Array.isArray(data.courses) ? data.courses[0] : data.courses;

  if (!course) {
    console.error("Course not found for term:", termId);

    throw new Error("Course not found for course term");
  }

  const mappedTerm = mapCourseTerm(data as unknown as CourseTermRow);

  return {
    ...mappedTerm,

    courseTitle: course.title,

    coursePrice: course.price,

    coursePriceTwiceWeekly: course.price_twice_weekly ?? undefined,

    courseCurrency: course.currency,

    courseNumberOfLessons: course.number_of_lessons,
  };
}
