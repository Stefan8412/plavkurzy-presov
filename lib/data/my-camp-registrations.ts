import { createClient } from "@/lib/supabase/server";

export type MyCampRegistration = {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  mealPortion: "child" | "adult";
  totalPrice: number;
  shirtSize: "S" | "M" | "L";

  child: {
    firstName: string;
    lastName: string;
  };

  term: {
    name: string;
    startDate: string;
    endDate: string;
  };

  payment: {
    amount: number;
    currency: string;
    status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  } | null;
};

type CampRegistrationRow = {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  meal_portion: "child" | "adult";
  total_price: number | string;
  shirt_size: "S" | "M" | "L";

  children:
    | {
        first_name: string;
        last_name: string;
      }
    | {
        first_name: string;
        last_name: string;
      }[]
    | null;

  camp_terms:
    | {
        name: string;
        start_date: string;
        end_date: string;
      }
    | {
        name: string;
        start_date: string;
        end_date: string;
      }[]
    | null;

  camp_payments:
    | {
        amount: number | string;
        currency: string;
        status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
      }
    | {
        amount: number | string;
        currency: string;
        status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
      }[]
    | null;
};

export async function getMyCampRegistrations(): Promise<MyCampRegistration[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("camp_registrations")
    .select(
      `
      id,
      status,
      meal_portion,
      total_price,
      shirt_size,
      children (
        first_name,
        last_name
      ),
      camp_terms (
        name,
        start_date,
        end_date
      ),
      camp_payments (
        amount,
        currency,
        status
      )
    `,
    )
    .eq("parent_id", user.id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load my camp registrations:", error);
    throw new Error("Nepodarilo sa načítať prihlášky na letný tábor.");
  }

  return ((data ?? []) as CampRegistrationRow[]).map((row) => {
    const child = Array.isArray(row.children) ? row.children[0] : row.children;

    const term = Array.isArray(row.camp_terms)
      ? row.camp_terms[0]
      : row.camp_terms;

    const payment = Array.isArray(row.camp_payments)
      ? row.camp_payments[0]
      : row.camp_payments;

    if (!child || !term) {
      throw new Error("Prihláška na tábor obsahuje neúplné údaje.");
    }

    return {
      id: row.id,
      status: row.status,
      mealPortion: row.meal_portion,
      totalPrice: Number(row.total_price),
      shirtSize: row.shirt_size,

      child: {
        firstName: child.first_name,
        lastName: child.last_name,
      },

      term: {
        name: term.name,
        startDate: term.start_date,
        endDate: term.end_date,
      },

      payment: payment
        ? {
            amount: Number(payment.amount),
            currency: payment.currency,
            status: payment.status,
          }
        : null,
    };
  });
}
