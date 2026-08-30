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

export async function confirmRegistration(registrationId: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", registrationId);

  if (error) {
    console.error("Failed to confirm registration:", error);
    throw new Error("Registráciu sa nepodarilo potvrdiť.");
  }

  revalidatePath("/admin");
}

export async function cancelRegistration(registrationId: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", registrationId);

  if (error) {
    console.error("Failed to cancel registration:", error);
    throw new Error("Registráciu sa nepodarilo zrušiť.");
  }

  revalidatePath("/admin");
}
