import { createClient } from "@/lib/supabase/server";

export type AdminPayment = {
  registrationGroupId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  provider: string | null;
  providerPaymentId: string | null;
  paidAt: string | null;
};

type PaymentRow = {
  registration_group_id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  provider: string | null;
  provider_payment_id: string | null;
  paid_at: string | null;
};

export async function getAdminPayments(): Promise<AdminPayment[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return [];
  }

  const { data, error } = await supabase.from("payments").select(`
      registration_group_id,
      amount,
      currency,
      status,
      provider,
      provider_payment_id,
      paid_at
    `);

  if (error) {
    console.error("Chyba pri načítaní platieb:", error);
    throw new Error("Nepodarilo sa načítať platby.");
  }

  return ((data ?? []) as PaymentRow[]).map((payment) => ({
    registrationGroupId: payment.registration_group_id,
    amount: Number(payment.amount),
    currency: payment.currency,
    status: payment.status,
    provider: payment.provider,
    providerPaymentId: payment.provider_payment_id,
    paidAt: payment.paid_at,
  }));
}
