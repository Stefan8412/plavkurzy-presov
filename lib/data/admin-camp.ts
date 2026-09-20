import { createClient } from "@/lib/supabase/server";

export type AdminCampTerm = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  registeredCount: number;
  availableSpots: number;
  childMealPrice: number;
  adultMealPrice: number;
  status: "available" | "full" | "closed";
};

type CampTermRow = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  capacity: number;
  child_meal_price: number;
  adult_meal_price: number;
  status: "available" | "full" | "closed";
};

type CampRegistrationRow = {
  camp_term_id: string;
};

export async function getAdminCampTerms(): Promise<AdminCampTerm[]> {
  const supabase = await createClient();

  const { data: terms, error: termsError } = await supabase
    .from("camp_terms")
    .select(
      `
      id,
      name,
      start_date,
      end_date,
      capacity,
      child_meal_price,
      adult_meal_price,
      status
    `,
    )
    .order("start_date", { ascending: true });

  if (termsError) {
    console.error("Failed to load camp terms:", termsError);
    throw new Error("Nepodarilo sa načítať turnusy letného tábora.");
  }

  if (!terms || terms.length === 0) {
    return [];
  }

  const termIds = terms.map((term) => term.id);

  const { data: registrations, error: registrationsError } = await supabase
    .from("camp_registrations")
    .select("camp_term_id")
    .in("camp_term_id", termIds)
    .in("status", ["pending", "confirmed"]);

  if (registrationsError) {
    console.error(
      "Failed to load camp registration counts:",
      registrationsError,
    );
    throw new Error("Nepodarilo sa načítať obsadenosť turnusov.");
  }

  const counts = new Map<string, number>();

  for (const registration of (registrations ?? []) as CampRegistrationRow[]) {
    counts.set(
      registration.camp_term_id,
      (counts.get(registration.camp_term_id) ?? 0) + 1,
    );
  }

  return (terms as CampTermRow[]).map((term) => {
    const registeredCount = counts.get(term.id) ?? 0;

    return {
      id: term.id,
      name: term.name,
      startDate: term.start_date,
      endDate: term.end_date,
      capacity: Number(term.capacity),
      registeredCount,
      availableSpots: Math.max(Number(term.capacity) - registeredCount, 0),
      childMealPrice: Number(term.child_meal_price),
      adultMealPrice: Number(term.adult_meal_price),
      status: term.status,
    };
  });
}
