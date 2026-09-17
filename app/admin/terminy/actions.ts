"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type CreateCoursePeriodInput = {
  startDate: string;
  endDate: string;
  noSwimmingDays: string[];
};

export async function createCoursePeriod(input: CreateCoursePeriodInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prihlasenie");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Nemáte oprávnenie vytvárať obdobia kurzov.");
  }

  if (!input.startDate || !input.endDate) {
    throw new Error("Zadajte začiatok a koniec obdobia.");
  }

  if (input.endDate < input.startDate) {
    throw new Error("Koniec obdobia nemôže byť pred začiatkom.");
  }

  const { data: sourceTerm, error: sourceError } = await supabase
    .from("course_terms")
    .select("start_date, end_date")
    .order("end_date", { ascending: false })
    .limit(1)
    .single();

  if (sourceError || !sourceTerm) {
    console.error("Zdrojové obdobie sa nepodarilo načítať:", sourceError);
    throw new Error("Nenašlo sa zdrojové obdobie kurzov.");
  }

  const { data, error } = await supabase.rpc(
    "create_course_period_with_lessons",
    {
      p_source_start_date: sourceTerm.start_date,
      p_source_end_date: sourceTerm.end_date,
      p_new_start_date: input.startDate,
      p_new_end_date: input.endDate,
      p_no_swimming_days: input.noSwimmingDays,
    },
  );

  if (error) {
    console.error("Chyba pri vytváraní nového obdobia:", error);
    throw new Error(error.message || "Nové obdobie sa nepodarilo vytvoriť.");
  }

  const result = Array.isArray(data) ? data[0] : data;

  revalidatePath("/admin");
  revalidatePath("/admin/terminy");
  revalidatePath("/admin/lekcie");
  revalidatePath("/kurzy");

  return {
    success: true,
    createdTerms: Number(result?.created_terms ?? 0),
    createdLessons: Number(result?.created_lessons ?? 0),
  };
}

export async function updateCourseTerm(formData: FormData) {
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
    throw new Error("Nemáte oprávnenie upravovať termíny.");
  }

  const termId = String(formData.get("termId") ?? "");
  const capacityValue = String(formData.get("capacity") ?? "");
  const statusValue = String(formData.get("status") ?? "");

  if (!termId) {
    throw new Error("Chýba ID termínu.");
  }

  const capacity = Number(capacityValue);

  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw new Error("Kapacita musí byť celé číslo väčšie ako 0.");
  }

  if (
    statusValue !== "available" &&
    statusValue !== "full" &&
    statusValue !== "closed"
  ) {
    throw new Error("Neplatný stav termínu.");
  }

  const { data: term, error: termError } = await supabase
    .from("course_terms")
    .select("id, capacity, status")
    .eq("id", termId)
    .single();

  if (termError || !term) {
    console.error("Termín sa nepodarilo načítať:", termError);
    throw new Error("Termín sa nenašiel.");
  }

  const { count: registeredCount, error: registrationsError } = await supabase
    .from("registrations")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("course_term_id", termId)
    .in("status", ["pending", "confirmed"]);

  if (registrationsError) {
    console.error(
      "Chyba pri kontrole obsadenosti termínu:",
      registrationsError,
    );

    throw new Error("Nepodarilo sa skontrolovať obsadenosť termínu.");
  }

  const activeRegistrations = registeredCount ?? 0;

  if (capacity < activeRegistrations) {
    throw new Error(
      `Kapacita nemôže byť nižšia ako počet aktuálne prihlásených (${activeRegistrations}).`,
    );
  }

  let finalStatus: "available" | "full" | "closed";

  if (statusValue === "closed") {
    finalStatus = "closed";
  } else if (capacity <= activeRegistrations) {
    finalStatus = "full";
  } else {
    finalStatus = "available";
  }

  const { data: updatedTerm, error: updateError } = await supabase
    .from("course_terms")
    .update({
      capacity,
      status: finalStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", termId)
    .select("id, capacity, status")
    .single();

  if (updateError) {
    console.error("Chyba pri úprave termínu:", updateError);
    throw new Error(`Termín sa nepodarilo upraviť: ${updateError.message}`);
  }

  if (!updatedTerm) {
    throw new Error("Supabase nezmenil žiadny termín.");
  }

  console.log("Termín úspešne upravený:", updatedTerm);

  revalidatePath("/admin");
  revalidatePath("/admin/terminy");
  revalidatePath(`/admin/terminy/${termId}`);
  revalidatePath("/kurzy");

  redirect("/admin/terminy");
}
