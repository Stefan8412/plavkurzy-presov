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
  courseTermIds: string[];
  frequency: 1 | 2;
};

type CreateRegistrationResult =
  | {
      success: true;
      registrationGroupId: string;
      totalPrice: number;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Vytvorí registráciu dieťaťa na jeden alebo dva termíny.
 *
 * 1× týždenne = 1 termín
 * 2× týždenne = 2 termíny
 *
 * Samotná kontrola kapacity a vytvorenie registrácií
 * prebieha atomicky v PostgreSQL RPC funkcii.
 */
export async function createRegistration({
  childId,
  courseTermIds,
  frequency,
}: CreateRegistrationInput): Promise<CreateRegistrationResult> {
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
   * 2. Kontrola vstupných údajov
   */
  if (frequency !== 1 && frequency !== 2) {
    return {
      success: false,
      error: "Neplatná frekvencia kurzu.",
    };
  }

  if (courseTermIds.length !== frequency) {
    return {
      success: false,
      error: "Počet vybraných termínov nezodpovedá frekvencii kurzu.",
    };
  }

  if (new Set(courseTermIds).size !== courseTermIds.length) {
    return {
      success: false,
      error: "Vybrané termíny musia byť rozdielne.",
    };
  }

  /**
   * 3. Overenie, že dieťa patrí prihlásenému rodičovi
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
   * 4. Atomická registrácia cez PostgreSQL RPC.
   *
   * Databáza skontroluje:
   * - vlastníctvo dieťaťa,
   * - počet termínov,
   * - rovnaký kurz,
   * - dostupnosť,
   * - kapacitu,
   * - existujúce registrácie,
   * - cenu.
   */
  const { data, error } = await supabase.rpc("register_child_for_terms", {
    p_child_id: childId,
    p_course_term_ids: courseTermIds,
    p_frequency: frequency,
  });

  if (error) {
    console.error("Failed to create registration:", error);

    if (error.message.includes("už na jeden z vybraných termínov")) {
      return {
        success: false,
        error: "Toto dieťa je už na jeden z vybraných termínov prihlásené.",
      };
    }

    if (error.message.includes("už nie je dostupný")) {
      return {
        success: false,
        error: "Jeden z vybraných termínov už nie je dostupný.",
      };
    }

    if (error.message.includes("už obsadený")) {
      return {
        success: false,
        error: "Jeden z vybraných termínov je už obsadený.",
      };
    }

    if (error.message.includes("Termín neexistuje")) {
      return {
        success: false,
        error: "Jeden z vybraných termínov neexistuje.",
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

    if (error.message.includes("rovnakého kurzu")) {
      return {
        success: false,
        error: "Vybrané termíny musia patriť do rovnakého kurzu.",
      };
    }

    if (error.message.includes("musia byť rozdielne")) {
      return {
        success: false,
        error: "Vybrané termíny musia byť rozdielne.",
      };
    }

    if (error.message.includes("nezodpovedá zvolenej frekvencii")) {
      return {
        success: false,
        error: "Počet vybraných termínov nezodpovedá zvolenej frekvencii.",
      };
    }

    if (error.message.includes("Cena kurzu nie je nastavená")) {
      return {
        success: false,
        error: "Cena kurzu nie je nastavená.",
      };
    }

    return {
      success: false,
      error: "Registráciu sa nepodarilo vytvoriť.",
    };
  }

  /**
   * RPC vracia jeden riadok:
   *
   * {
   *   registration_group_id,
   *   registration_status,
   *   total_price
   * }
   */
  const registration = Array.isArray(data) ? data[0] : data;

  if (!registration?.registration_group_id) {
    return {
      success: false,
      error: "Registráciu sa nepodarilo vytvoriť.",
    };
  }

  return {
    success: true,
    registrationGroupId: registration.registration_group_id,
    totalPrice: Number(registration.total_price),
  };
}

/**
 * Nájde registráciu konkrétneho dieťaťa
 * na konkrétny termín.
 *
 * Túto funkciu zatiaľ ponechávame kvôli existujúcej
 * stránke prihlásenia.
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
