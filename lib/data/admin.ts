import { createClient } from "@/lib/supabase/server";

export type AdminRegistrationTerm = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  startDate: string;
  endDate: string;
};

export type AdminRegistration = {
  id: string;
  registrationGroupId: string;
  status: string;
  registeredAt: string;
  frequencyPerWeek: 1 | 2;
  totalPrice: number;

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

  terms: AdminRegistrationTerm[];
};

type RawRegistration = {
  id: string;
  registration_group_id: string;
  status: string;
  registered_at: string;
  frequency_per_week: number;
  total_price: number;
  children: any;
  course_terms: any;
};

type AdminRegistrationGroup = AdminRegistration & {
  statuses: string[];
};

function getGroupStatus(statuses: string[]) {
  if (statuses.length === 0) {
    return "pending";
  }

  if (statuses.every((status) => status === "cancelled")) {
    return "cancelled";
  }

  if (statuses.every((status) => status === "completed")) {
    return "completed";
  }

  if (statuses.every((status) => status === "confirmed")) {
    return "confirmed";
  }

  if (statuses.some((status) => status === "pending")) {
    return "pending";
  }

  if (statuses.some((status) => status === "confirmed")) {
    return "confirmed";
  }

  if (statuses.some((status) => status === "completed")) {
    return "completed";
  }

  return statuses[0];
}

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
      registration_group_id,
      status,
      registered_at,
      frequency_per_week,
      total_price,

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
        id,
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

  const rows = (data ?? []) as unknown as RawRegistration[];

  const groups = new Map<string, AdminRegistrationGroup>();

  for (const registration of rows) {
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

    const groupId = registration.registration_group_id;

    const mappedTerm: AdminRegistrationTerm = {
      id: term?.id ?? "",
      dayOfWeek: term?.day_of_week ?? 0,
      startTime: term?.start_time ?? "",
      startDate: term?.start_date ?? "",
      endDate: term?.end_date ?? "",
    };

    const existingGroup = groups.get(groupId);

    if (existingGroup) {
      existingGroup.terms.push(mappedTerm);
      existingGroup.statuses.push(registration.status);

      if (registration.registered_at < existingGroup.registeredAt) {
        existingGroup.registeredAt = registration.registered_at;
      }

      continue;
    }

    groups.set(groupId, {
      id: registration.id,
      registrationGroupId: groupId,
      status: registration.status,
      statuses: [registration.status],
      registeredAt: registration.registered_at,
      frequencyPerWeek: registration.frequency_per_week === 2 ? 2 : 1,
      totalPrice: Number(registration.total_price),

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

      terms: [mappedTerm],
    });
  }

  const registrations: AdminRegistration[] = Array.from(groups.values()).map(
    (registration) => {
      registration.terms.sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) {
          return a.dayOfWeek - b.dayOfWeek;
        }

        return a.startTime.localeCompare(b.startTime);
      });

      return {
        id: registration.id,
        registrationGroupId: registration.registrationGroupId,
        status: getGroupStatus(registration.statuses),
        registeredAt: registration.registeredAt,
        frequencyPerWeek: registration.frequencyPerWeek,
        totalPrice: registration.totalPrice,
        child: registration.child,
        parent: registration.parent,
        course: registration.course,
        terms: registration.terms,
      };
    },
  );

  return registrations;
}
