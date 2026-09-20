import { createClient } from "@/lib/supabase/server";

export type CampTerm = {
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
  registered_count: number;
  available_spots: number;
  child_meal_price: number;
  adult_meal_price: number;
  status: "available" | "full" | "closed";
};

export async function getAvailableCampTerms(): Promise<CampTerm[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_available_camp_terms");

  if (error) {
    console.error("Failed to load available camp terms:", error);
    throw new Error("Nepodarilo sa načítať turnusy letného tábora.");
  }

  const rows = (data ?? []) as CampTermRow[];

  return rows.map((term) => ({
    id: term.id,
    name: term.name,
    startDate: term.start_date,
    endDate: term.end_date,
    capacity: Number(term.capacity),
    registeredCount: Number(term.registered_count),
    availableSpots: Number(term.available_spots),
    childMealPrice: Number(term.child_meal_price),
    adultMealPrice: Number(term.adult_meal_price),
    status: term.status,
  }));
}
