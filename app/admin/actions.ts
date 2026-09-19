"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Nemáte oprávnenie vykonať túto akciu.");
  }

  return supabase;
}

function revalidateRegistrationPaths() {
  revalidatePath("/admin");
  revalidatePath("/prihlasenie");
  revalidatePath("/moje-kurzy");
  revalidatePath("/kurzy");
}

export async function confirmRegistration(registrationId: string) {
  const supabase = await requireAdmin();

  const { data: registration, error: registrationError } = await supabase
    .from("registrations")
    .select("id, registration_group_id")
    .eq("id", registrationId)
    .single();

  if (registrationError || !registration) {
    throw new Error("Registrácia sa nenašla.");
  }

  const { error: updateError } = await supabase
    .from("registrations")
    .update({
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("registration_group_id", registration.registration_group_id);

  if (updateError) {
    console.error("Chyba pri potvrdení registrácie:", updateError);

    throw new Error("Registráciu sa nepodarilo potvrdiť.");
  }

  revalidateRegistrationPaths();
}

export async function cancelRegistration(registrationId: string) {
  const supabase = await requireAdmin();

  const { data: registration, error: registrationError } = await supabase
    .from("registrations")
    .select("id, registration_group_id")
    .eq("id", registrationId)
    .single();

  if (registrationError || !registration) {
    throw new Error("Registrácia sa nenašla.");
  }

  const { error: updateError } = await supabase
    .from("registrations")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("registration_group_id", registration.registration_group_id);

  if (updateError) {
    console.error("Chyba pri zrušení registrácie:", updateError);

    throw new Error("Registráciu sa nepodarilo zrušiť.");
  }

  revalidateRegistrationPaths();
}

export async function markRegistrationPaid(registrationId: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.rpc("admin_mark_registration_paid", {
    p_registration_id: registrationId,
  });

  if (error) {
    console.error("Chyba pri manuálnom označení platby:", error);

    throw new Error("Platbu sa nepodarilo označiť ako zaplatenú.");
  }

  revalidateRegistrationPaths();
}
