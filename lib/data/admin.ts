import { createClient } from "@/lib/supabase/server";

export type AdminRegistration = {
  id: string;
  status: string;
  registeredAt: string;

  child: {
    firstName: string;
    lastName: string;
  };

  parent: {
    firstName: string;
    lastName: string;
    phone: string | null;
  };

  course: {
    title: string;
  };

  term: {
    dayOfWeek: number;
    startTime: string;
    startDate: string;
    endDate: string;
  };
};

export async function getAdminRegistrations(): Promise<AdminRegistration[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  const { data, error } = await supabase
    .from("registrations")
    .select(
      `
      id,
      status,
      registered_at,

      children!registrations_child_id_fkey (
        first_name,
        last_name,

        profiles!children_parent_id_fkey (
          first_name,
          last_name,
          phone
        )
      ),

      course_terms!registrations_course_term_id_fkey (
        day_of_week,
        start_time,
        start_date,
        end_date,

        courses!course_terms_course_id_fkey (
          title
        )
      )
    `,
    )
    .order("registered_at", { ascending: false });

  if (error) {
    console.error("Failed to load admin registrations:", error);
    throw new Error("Registrácie sa nepodarilo načítať.");
  }

  return (data ?? []).map((registration: any) => {
    const child = Array.isArray(registration.children)
      ? registration.children[0]
      : registration.children;

    const parent = Array.isArray(child?.profiles)
      ? child.profiles[0]
      : child?.profiles;

    const term = Array.isArray(registration.course_terms)
      ? registration.course_terms[0]
      : registration.course_terms;

    const course = Array.isArray(term?.courses)
      ? term.courses[0]
      : term?.courses;

    return {
      id: registration.id,
      status: registration.status,
      registeredAt: registration.registered_at,

      child: {
        firstName: child?.first_name ?? "",
        lastName: child?.last_name ?? "",
      },

      parent: {
        firstName: parent?.first_name ?? "",
        lastName: parent?.last_name ?? "",
        phone: parent?.phone ?? null,
      },

      course: {
        title: course?.title ?? "",
      },

      term: {
        dayOfWeek: term?.day_of_week ?? 0,
        startTime: term?.start_time ?? "",
        startDate: term?.start_date ?? "",
        endDate: term?.end_date ?? "",
      },
    };
  });
}
