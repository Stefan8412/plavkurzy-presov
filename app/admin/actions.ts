"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return supabase;
}

async function getRegistrationGroupId(registrationId: string) {
  const supabase = await requireAdmin();

  const { data: registration, error } = await supabase
    .from("registrations")
    .select("registration_group_id")
    .eq("id", registrationId)
    .single();

  if (error || !registration?.registration_group_id) {
    throw new Error("Registrácia sa nenašla.");
  }

  return {
    supabase,
    registrationGroupId: registration.registration_group_id,
  };
}

export async function confirmRegistration(registrationId: string) {
  const { supabase, registrationGroupId } =
    await getRegistrationGroupId(registrationId);

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("registration_group_id", registrationGroupId);

  if (error) {
    console.error("Failed to confirm registration:", error);
    throw new Error("Registráciu sa nepodarilo potvrdiť.");
  }

  revalidatePath("/admin");
  revalidatePath("/prihlasenie");
}

export async function cancelRegistration(registrationId: string) {
  const { supabase, registrationGroupId } =
    await getRegistrationGroupId(registrationId);

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("registration_group_id", registrationGroupId);

  if (error) {
    console.error("Failed to cancel registration:", error);
    throw new Error("Registráciu sa nepodarilo zrušiť.");
  }

  revalidatePath("/admin");
  revalidatePath("/prihlasenie");
}
