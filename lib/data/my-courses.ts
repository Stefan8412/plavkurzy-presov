import { createClient } from "@/lib/supabase/server";

export type MyCourseRegistration = {
  registrationGroupId: string;
  childId: string;
  childFirstName: string;
  childLastName: string;
  courseTitle: string;
  frequencyPerWeek: 1 | 2;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed";
  courseTermIds: string[];
};

type RegistrationRow = {
  registration_group_id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  frequency_per_week: number;
  total_price: number;

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

  course_terms:
    | {
        id: string;
        courses:
          | {
              title: string;
            }
          | {
              title: string;
            }[]
          | null;
      }
    | {
        id: string;
        courses:
          | {
              title: string;
            }
          | {
              title: string;
            }[]
          | null;
      }[]
    | null;
};

function first<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getMyCourseRegistrations(): Promise<
  MyCourseRegistration[]
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("registrations")
    .select(
      `
      registration_group_id,
      status,
      frequency_per_week,
      total_price,
      children!registrations_child_id_fkey (
        id,
        first_name,
        last_name
      ),
      course_terms!registrations_course_term_id_fkey (
        id,
        courses!course_terms_course_id_fkey (
          title
        )
      )
    `,
    )
    .in("status", ["pending", "confirmed", "completed"])
    .order("registered_at", { ascending: false });

  if (error) {
    console.error("Chyba pri načítaní mojich kurzov:", error);
    throw new Error("Nepodarilo sa načítať vaše kurzy.");
  }

  const rows = (data ?? []) as RegistrationRow[];

  const groups = new Map<string, MyCourseRegistration>();

  for (const row of rows) {
    const child = first(row.children);
    const courseTerm = first(row.course_terms);
    const course = first(courseTerm?.courses ?? null);

    if (!child || !courseTerm || !course) {
      continue;
    }

    const existing = groups.get(row.registration_group_id);

    if (existing) {
      if (!existing.courseTermIds.includes(courseTerm.id)) {
        existing.courseTermIds.push(courseTerm.id);
      }

      continue;
    }

    groups.set(row.registration_group_id, {
      registrationGroupId: row.registration_group_id,
      childId: child.id,
      childFirstName: child.first_name,
      childLastName: child.last_name,
      courseTitle: course.title,
      frequencyPerWeek: row.frequency_per_week === 2 ? 2 : 1,
      totalPrice: row.total_price,
      status:
        row.status === "completed"
          ? "completed"
          : row.status === "confirmed"
            ? "confirmed"
            : "pending",
      courseTermIds: [courseTerm.id],
    });
  }

  return Array.from(groups.values());
}
