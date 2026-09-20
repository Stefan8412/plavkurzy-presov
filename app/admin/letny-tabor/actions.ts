"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CampTermActionState = {
  success: boolean;
  message: string;
};

export async function createCampTerm(
  _prevState: CampTermActionState,
  formData: FormData,
): Promise<CampTermActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Musíte byť prihlásený.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return {
      success: false,
      message: "Nemáte oprávnenie vytvárať turnusy.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const capacity = Number(formData.get("capacity"));
  const childMealPrice = Number(formData.get("childMealPrice"));
  const adultMealPrice = Number(formData.get("adultMealPrice"));

  if (!name) {
    return {
      success: false,
      message: "Zadajte názov turnusu.",
    };
  }

  if (!startDate || !endDate) {
    return {
      success: false,
      message: "Zadajte dátum začiatku a konca turnusu.",
    };
  }

  if (endDate < startDate) {
    return {
      success: false,
      message: "Dátum konca nemôže byť pred dátumom začiatku.",
    };
  }

  if (!Number.isInteger(capacity) || capacity <= 0) {
    return {
      success: false,
      message: "Kapacita musí byť kladné celé číslo.",
    };
  }

  if (!Number.isFinite(childMealPrice) || childMealPrice < 0) {
    return {
      success: false,
      message: "Cena s detskou porciou nie je platná.",
    };
  }

  if (!Number.isFinite(adultMealPrice) || adultMealPrice < 0) {
    return {
      success: false,
      message: "Cena s dospelou porciou nie je platná.",
    };
  }

  const { error } = await supabase.from("camp_terms").insert({
    name,
    start_date: startDate,
    end_date: endDate,
    capacity,
    child_meal_price: childMealPrice,
    adult_meal_price: adultMealPrice,
    status: "available",
  });

  if (error) {
    console.error("Failed to create camp term:", error);

    return {
      success: false,
      message: "Turnus sa nepodarilo vytvoriť.",
    };
  }

  revalidatePath("/admin/letny-tabor");
  revalidatePath("/letny-tabor");
  revalidatePath("/letny-tabor/registracia");

  return {
    success: true,
    message: "Turnus bol úspešne vytvorený.",
  };
}
export async function updateCampTerm(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Nemáte oprávnenie upravovať turnusy.");
  }

  const termId = String(formData.get("termId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const capacity = Number(formData.get("capacity"));
  const childMealPrice = Number(formData.get("childMealPrice"));
  const adultMealPrice = Number(formData.get("adultMealPrice"));
  const status = String(formData.get("status") ?? "");

  if (!termId) {
    throw new Error("Chýba ID turnusu.");
  }

  if (!name) {
    throw new Error("Zadajte názov turnusu.");
  }

  if (!startDate || !endDate) {
    throw new Error("Zadajte dátum začiatku a konca turnusu.");
  }

  if (endDate < startDate) {
    throw new Error("Dátum konca nemôže byť pred dátumom začiatku.");
  }

  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw new Error("Kapacita musí byť kladné celé číslo.");
  }

  if (!Number.isFinite(childMealPrice) || childMealPrice < 0) {
    throw new Error("Cena s detskou porciou nie je platná.");
  }

  if (!Number.isFinite(adultMealPrice) || adultMealPrice < 0) {
    throw new Error("Cena s dospelou porciou nie je platná.");
  }

  if (!["available", "closed"].includes(status)) {
    throw new Error("Neplatný stav turnusu.");
  }

  const { data: term, error: termError } = await supabase
    .from("camp_terms")
    .select("id")
    .eq("id", termId)
    .maybeSingle();

  if (termError || !term) {
    throw new Error("Turnus sa nenašiel.");
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
    console.error("Failed to count camp registrations:", countError);

    throw new Error("Nepodarilo sa overiť obsadenosť turnusu.");
  }

  const registeredCount = count ?? 0;

  if (capacity < registeredCount) {
    throw new Error(
      `Kapacita nemôže byť nižšia ako aktuálny počet prihlásených: ${registeredCount}.`,
    );
  }

  const { error } = await supabase
    .from("camp_terms")
    .update({
      name,
      start_date: startDate,
      end_date: endDate,
      capacity,
      child_meal_price: childMealPrice,
      adult_meal_price: adultMealPrice,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", termId);

  if (error) {
    console.error("Failed to update camp term:", error);
    throw new Error("Turnus sa nepodarilo upraviť.");
  }

  revalidatePath("/admin/letny-tabor");
  revalidatePath(`/admin/letny-tabor/${termId}`);
  revalidatePath("/letny-tabor");
  revalidatePath("/letny-tabor/registracia");
}
export async function markCampRegistrationPaid(registrationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nie ste prihlásený.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Nemáte oprávnenie na túto operáciu.");
  }

  const { error } = await supabase.rpc("admin_mark_camp_registration_paid", {
    p_registration_id: registrationId,
  });

  if (error) {
    console.error("Failed to mark camp registration as paid:", error);
    throw new Error("Nepodarilo sa označiť platbu ako zaplatenú.");
  }

  revalidatePath("/admin/letny-tabor");
  revalidatePath(`/admin/letny-tabor/prihlaska/${registrationId}`);
}
export async function cancelCampRegistration(registrationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nie ste prihlásený.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Nemáte oprávnenie na túto operáciu.");
  }

  const { error } = await supabase.rpc("admin_cancel_camp_registration", {
    p_registration_id: registrationId,
  });

  if (error) {
    console.error("Failed to cancel camp registration:", error);
    throw new Error("Nepodarilo sa zrušiť prihlášku.");
  }

  revalidatePath("/admin/letny-tabor");
  revalidatePath(`/admin/letny-tabor/prihlaska/${registrationId}`);
}
