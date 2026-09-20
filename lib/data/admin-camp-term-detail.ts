import { createClient } from "@/lib/supabase/server";

export type AdminCampTermDetail = {
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

export async function getAdminCampTermDetail(
  termId: string,
): Promise<AdminCampTermDetail | null> {
  const supabase = await createClient();

  const { data: term, error: termError } = await supabase
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
    .eq("id", termId)
    .maybeSingle();

  if (termError) {
    console.error("Failed to load camp term:", termError);
    throw new Error("Nepodarilo sa načítať turnus.");
  }

  if (!term) {
    return null;
  }

  const { count, error: countError } = await supabase
    .from("camp_registrations")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("camp_term_id", termId)
    .in("status", ["pending", "confirmed"]);

  if (countError) {
    console.error("Failed to load camp registration count:", countError);

    throw new Error("Nepodarilo sa načítať obsadenosť turnusu.");
  }

  const row = term as CampTermRow;
  const registeredCount = count ?? 0;

  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    capacity: Number(row.capacity),
    registeredCount,
    availableSpots: Math.max(Number(row.capacity) - registeredCount, 0),
    childMealPrice: Number(row.child_meal_price),
    adultMealPrice: Number(row.adult_meal_price),
    status: row.status,
  };
}
