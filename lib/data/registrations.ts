import { createClient } from "@/lib/supabase/server";

export type RegistrationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type Registration = {
  id: string;
  childId: string;
  courseTermId: string;
  status: RegistrationStatus;
  note: string | null;
  registeredAt: string;
};

type RegistrationRow = {
  id: string;
  child_id: string;
  course_term_id: string;
  status: string;
  note: string | null;
  registered_at: string;
};

type CreateRegistrationInput = {
  childId: string;
  courseTermId: string;
};

/**
 * Vytvorí registráciu dieťaťa na konkrétny termín.
 */
export async function createRegistration({
  childId,
  courseTermId,
}: CreateRegistrationInput): Promise<
  | {
      success: true;
      registrationId: string;
    }
  | {
      success: false;
      error: string;
    }
> {
  const supabase = await createClient();

  /**
   * 1. Overenie prihláseného používateľa
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Musíte byť prihlásený.",
    };
  }

  /**
   * 2. Overenie, že dieťa patrí prihlásenému rodičovi
   */
  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError) {
    console.error("Failed to fetch child:", childError);

    return {
      success: false,
      error: "Dieťa sa nepodarilo načítať.",
    };
  }

  if (!child) {
    return {
      success: false,
      error: "Toto dieťa vám nepatrí.",
    };
  }

  /**
   * 3. Overenie termínu
   */
  const { data: courseTerm, error: termError } = await supabase
    .from("course_terms")
    .select("id, capacity, status")
    .eq("id", courseTermId)
    .maybeSingle();

  if (termError) {
    console.error("Failed to fetch course term:", termError);

    return {
      success: false,
      error: "Termín sa nepodarilo načítať.",
    };
  }

  if (!courseTerm) {
    return {
      success: false,
      error: "Tento termín neexistuje.",
    };
  }

  if (courseTerm.status !== "available") {
    return {
      success: false,
      error: "Tento termín už nie je dostupný.",
    };
  }

  /**
   * 4. Kontrola existujúcej registrácie
   */
  const { data: existingRegistration, error: existingError } = await supabase
    .from("registrations")
    .select("id, status")
    .eq("child_id", childId)
    .eq("course_term_id", courseTermId)
    .maybeSingle();

  if (existingError) {
    console.error("Failed to check existing registration:", existingError);

    return {
      success: false,
      error: "Nepodarilo sa overiť existujúcu registráciu.",
    };
  }

  /**
   * 5. Existujúca aktívna registrácia
   */
  if (existingRegistration && existingRegistration.status !== "cancelled") {
    return {
      success: false,
      error: "Toto dieťa je už na tento termín prihlásené.",
    };
  }

  /**
   * 6. Ak bola stará registrácia zrušená,
   *    vytvoríme novú registráciu.
   */
  if (existingRegistration && existingRegistration.status === "cancelled") {
    const { data, error } = await supabase
      .from("registrations")
      .update({
        status: "pending",
        note: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRegistration.id)
      .select("id, child_id, course_term_id, status, note, registered_at")
      .single();

    if (error) {
      console.error("Failed to reactivate registration:", error);

      return {
        success: false,
        error: "Registráciu sa nepodarilo vytvoriť.",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Registráciu sa nepodarilo vytvoriť.",
      };
    }

    return {
      success: true,
      registrationId: data.id,
    };
  }

  /**
   * 7. Kontrola kapacity
   */
  const { count: activeRegistrations, error: countError } = await supabase
    .from("registrations")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("course_term_id", courseTermId)
    .in("status", ["pending", "confirmed"]);

  if (countError) {
    console.error("Failed to count registrations:", countError);

    return {
      success: false,
      error: "Nepodarilo sa overiť voľné miesto.",
    };
  }

  const registeredCount = activeRegistrations ?? 0;

  if (registeredCount >= courseTerm.capacity) {
    return {
      success: false,
      error: "Tento termín je už obsadený.",
    };
  }

  /**
   * 8. Vytvorenie novej registrácie
   */
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      child_id: childId,
      course_term_id: courseTermId,
      status: "pending",
    })
    .select("id, child_id, course_term_id, status, note, registered_at")
    .single();

  if (error) {
    console.error("Failed to create registration:", error);

    /**
     * PostgreSQL unique constraint:
     * unique (child_id, course_term_id)
     */
    if (error.code === "23505") {
      return {
        success: false,
        error: "Toto dieťa je už na tento termín prihlásené.",
      };
    }

    return {
      success: false,
      error: "Registráciu sa nepodarilo vytvoriť.",
    };
  }

  if (!data) {
    return {
      success: false,
      error: "Registráciu sa nepodarilo vytvoriť.",
    };
  }

  return {
    success: true,
    registrationId: data.id,
  };
}

/**
 * Nájde registráciu konkrétneho dieťaťa
 * na konkrétny termín.
 */
export async function getRegistrationForChildAndTerm({
  childId,
  courseTermId,
}: {
  childId: string;
  courseTermId: string;
}): Promise<Registration | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("registrations")
    .select("id, child_id, course_term_id, status, note, registered_at")
    .eq("child_id", childId)
    .eq("course_term_id", courseTermId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch registration:", error);

    throw new Error("Registráciu sa nepodarilo načítať.");
  }

  if (!data) {
    return null;
  }

  const row = data as RegistrationRow;

  return {
    id: row.id,
    childId: row.child_id,
    courseTermId: row.course_term_id,
    status: row.status as RegistrationStatus,
    note: row.note,
    registeredAt: row.registered_at,
  };
}
