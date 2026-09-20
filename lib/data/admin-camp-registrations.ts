import { createClient } from "@/lib/supabase/server";

export type AdminCampRegistration = {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  mealPortion: "child" | "adult";
  totalPrice: number;
  shirtSize: "S" | "M" | "L";
  healthInfo: string;
  recreationVoucher: boolean;
  billingName: string | null;
  billingStreet: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  privacyConsent: boolean;
  photoConsent: boolean;
  excitement: number | null;
  createdAt: string;

  child: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };

  parent: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };

  payment: {
    id: string;
    amount: number;
    status: string;
    provider: string | null;
    paidAt: string | null;
  } | null;
};

type RegistrationRow = {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  meal_portion: "child" | "adult";
  total_price: number;
  shirt_size: "S" | "M" | "L";
  health_info: string;
  recreation_voucher: boolean;
  billing_name: string | null;
  billing_street: string | null;
  billing_postal_code: string | null;
  billing_city: string | null;
  privacy_consent: boolean;
  photo_consent: boolean;
  excitement: number | null;
  created_at: string;

  children:
    | {
        id: string;
        first_name: string;
        last_name: string;
        date_of_birth: string;
      }
    | {
        id: string;
        first_name: string;
        last_name: string;
        date_of_birth: string;
      }[]
    | null;

  profiles:
    | {
        id: string;
        first_name: string | null;
        last_name: string | null;

        phone: string | null;
      }
    | {
        id: string;
        first_name: string | null;
        last_name: string | null;

        phone: string | null;
      }[]
    | null;

  camp_payments:
    | {
        id: string;
        amount: number;
        status: string;
        provider: string | null;
        paid_at: string | null;
      }
    | {
        id: string;
        amount: number;
        status: string;
        provider: string | null;
        paid_at: string | null;
      }[]
    | null;
};

function firstRelation<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export async function getAdminCampRegistrations(
  campTermId: string,
): Promise<AdminCampRegistration[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("camp_registrations")
    .select(
      `
      id,
      status,
      meal_portion,
      total_price,
      shirt_size,
      health_info,
      recreation_voucher,
      billing_name,
      billing_street,
      billing_postal_code,
      billing_city,
      privacy_consent,
      photo_consent,
      excitement,
      created_at,
      children (
        id,
        first_name,
        last_name,
        date_of_birth
      ),
      profiles (
        id,
        first_name,
        last_name,
     
        phone
      ),
      camp_payments (
        id,
        amount,
        status,
        provider,
        paid_at
      )
    `,
    )
    .eq("camp_term_id", campTermId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load camp registrations:", error);
    throw new Error("Nepodarilo sa načítať prihlášky na letný tábor.");
  }

  const rows = (data ?? []) as RegistrationRow[];

  return rows.flatMap((row) => {
    const child = firstRelation(row.children);
    const parent = firstRelation(row.profiles);
    const payment = firstRelation(row.camp_payments);

    if (!child || !parent) {
      return [];
    }

    return [
      {
        id: row.id,
        status: row.status,
        mealPortion: row.meal_portion,
        totalPrice: Number(row.total_price),
        shirtSize: row.shirt_size,
        healthInfo: row.health_info,
        recreationVoucher: row.recreation_voucher,
        billingName: row.billing_name,
        billingStreet: row.billing_street,
        billingPostalCode: row.billing_postal_code,
        billingCity: row.billing_city,
        privacyConsent: row.privacy_consent,
        photoConsent: row.photo_consent,
        excitement: row.excitement,
        createdAt: row.created_at,

        child: {
          id: child.id,
          firstName: child.first_name,
          lastName: child.last_name,
          dateOfBirth: child.date_of_birth,
        },

        parent: {
          id: parent.id,
          firstName: parent.first_name,
          lastName: parent.last_name,

          phone: parent.phone,
        },

        payment: payment
          ? {
              id: payment.id,
              amount: Number(payment.amount),
              status: payment.status,
              provider: payment.provider,
              paidAt: payment.paid_at,
            }
          : null,
      },
    ];
  });
}
export async function getAdminCampRegistration(
  registrationId: string,
): Promise<AdminCampRegistration | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("camp_registrations")
    .select("camp_term_id")
    .eq("id", registrationId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load camp registration:", error);
    throw new Error("Nepodarilo sa načítať prihlášku na letný tábor.");
  }

  if (!data) {
    return null;
  }

  const registrations = await getAdminCampRegistrations(data.camp_term_id);

  return (
    registrations.find((registration) => registration.id === registrationId) ??
    null
  );
}
