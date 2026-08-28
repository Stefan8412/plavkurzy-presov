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

/**
 * Vytvorí novú registráciu dieťaťa na konkrétny termín.
 *
 * Bezpečnostné kontroly:
 * - používateľ musí byť prihlásený
 * - dieťa musí patriť prihlásenému rodičovi
 * - termín musí existovať
 * - rovnaké dieťa nemôže byť 2x registrované na rovnaký termín
 */
export async function createRegistration({
  childId,
  courseTermId,
  note,
}: {
  childId: string;
  courseTermId: string;
  note?: string;
}): Promise<Registration> {
  const supabase = await createClient();

  // 1. Overenie prihláseného používateľa
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  // 2. Overenie, že dieťa patrí aktuálnemu používateľovi
  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError) {
    console.error("Failed to fetch child:", childError);
    throw new Error("Nepodarilo sa overiť dieťa.");
  }

  if (!child) {
    throw new Error("Dieťa neexistuje alebo vám nepatrí.");
  }

  // 3. Overenie existencie termínu
  const { data: term, error: termError } = await supabase
    .from("course_terms")
    .select("id, status")
    .eq("id", courseTermId)
    .maybeSingle();

  if (termError) {
    console.error("Failed to fetch course term:", termError);
    throw new Error("Nepodarilo sa overiť termín.");
  }

  if (!term) {
    throw new Error("Vybraný termín neexistuje.");
  }

  if (term.status !== "available") {
    throw new Error("Tento termín momentálne nie je dostupný.");
  }

  // 4. Vytvorenie registrácie
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      child_id: childId,
      course_term_id: courseTermId,
      status: "pending",
      note: note?.trim() || null,
    })
    .select(
      `
      id,
      child_id,
      course_term_id,
      status,
      note,
      registered_at,
      updated_at
    `,
    )
    .single();

  if (error) {
    // PostgreSQL unique constraint:
    // (child_id, course_term_id)
    if (error.code === "23505") {
      throw new Error("Toto dieťa je už na tento termín prihlásené.");
    }

    console.error("Failed to create registration:", error);
    throw new Error("Registráciu sa nepodarilo vytvoriť.");
  }

  return {
    id: data.id,
    childId: data.child_id,
    courseTermId: data.course_term_id,
    status: data.status as RegistrationStatus,
    note: data.note,
    registeredAt: data.registered_at,
  };
}
