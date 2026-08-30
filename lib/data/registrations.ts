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
   * 3. Atomická registrácia cez PostgreSQL RPC.
   *
   * Kapacitu, existujúcu registráciu aj súbežné
   * požiadavky rieši databáza v jednej transakcii.
   */
  const { data, error } = await supabase.rpc("register_child_for_term", {
    p_child_id: childId,
    p_course_term_id: courseTermId,
  });

  if (error) {
    console.error("Failed to create registration:", error);

    /**
     * Chyby vytvorené našou PostgreSQL funkciou.
     */
    if (error.message.includes("už na tento termín prihlásené")) {
      return {
        success: false,
        error: "Toto dieťa je už na tento termín prihlásené.",
      };
    }

    if (error.message.includes("už nie je dostupný")) {
      return {
        success: false,
        error: "Tento termín už nie je dostupný.",
      };
    }

    if (error.message.includes("už obsadený")) {
      return {
        success: false,
        error: "Tento termín je už obsadený.",
      };
    }

    if (error.message.includes("Termín neexistuje")) {
      return {
        success: false,
        error: "Tento termín neexistuje.",
      };
    }

    if (error.message.includes("Dieťa neexistuje")) {
      return {
        success: false,
        error: "Dieťa neexistuje.",
      };
    }

    if (error.message.includes("nemáte prístup")) {
      return {
        success: false,
        error: "K tomuto dieťaťu nemáte prístup.",
      };
    }

    return {
      success: false,
      error: "Registráciu sa nepodarilo vytvoriť.",
    };
  }

  /**
   * RPC vracia jeden riadok:
   * {
   *   registration_id,
   *   registration_status
   * }
   */
  const registration = Array.isArray(data) ? data[0] : data;

  if (!registration?.registration_id) {
    return {
      success: false,
      error: "Registráciu sa nepodarilo vytvoriť.",
    };
  }

  return {
    success: true,
    registrationId: registration.registration_id,
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
