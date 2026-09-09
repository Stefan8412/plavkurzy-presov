"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createRegistration } from "@/lib/data/registrations";

export type RegistrationActionState = {
  success: boolean;
  message: string;
};

export async function registerChildForCourse(
  _prevState: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const childId = formData.get("childId");
  const courseTermId = formData.get("courseTermId");
  const secondCourseTermId = formData.get("secondCourseTermId");
  const frequencyValue = formData.get("frequency");

  if (typeof childId !== "string" || !childId) {
    return {
      success: false,
      message: "Chýba ID dieťaťa.",
    };
  }

  if (typeof courseTermId !== "string" || !courseTermId) {
    return {
      success: false,
      message: "Chýba ID termínu.",
    };
  }

  const frequency = frequencyValue === "2" ? 2 : 1;

  const courseTermIds = [courseTermId];

  if (frequency === 2) {
    if (typeof secondCourseTermId !== "string" || !secondCourseTermId) {
      return {
        success: false,
        message: "Pri frekvencii 2× týždenne musíte vybrať dva termíny.",
      };
    }

    courseTermIds.push(secondCourseTermId);
  }

  try {
    const result = await createRegistration({
      childId,
      courseTermIds,
      frequency,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    revalidatePath("/prihlasenie");
    revalidatePath("/kurzy");

    return {
      success: true,
      message:
        frequency === 2
          ? "Prihláška na dva termíny bola úspešne odoslaná."
          : "Prihláška bola úspešne odoslaná.",
    };
  } catch (error) {
    console.error("Registration action failed:", error);

    return {
      success: false,
      message: "Prihlášku sa nepodarilo odoslať.",
    };
  }
}

export async function cancelOwnRegistration(registrationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: registration, error: registrationError } = await supabase
    .from("registrations")
    .select(
      `
      id,
      status,
      registration_group_id,
      children!registrations_child_id_fkey (
        parent_id
      )
    `,
    )
    .eq("id", registrationId)
    .single();

  if (registrationError || !registration) {
    throw new Error("Registrácia sa nenašla.");
  }

  const child = Array.isArray(registration.children)
    ? registration.children[0]
    : registration.children;

  if (!child || child.parent_id !== user.id) {
    throw new Error("K tejto registrácii nemáte prístup.");
  }

  if (
    registration.status !== "pending" &&
    registration.status !== "confirmed"
  ) {
    throw new Error("Túto registráciu už nie je možné zrušiť.");
  }

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("registration_group_id", registration.registration_group_id);

  if (error) {
    console.error("Failed to cancel registration:", error);
    throw new Error("Registráciu sa nepodarilo zrušiť.");
  }

  revalidatePath("/prihlasenie");
  revalidatePath("/admin");
}
export async function createLessonAbsence(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  const lessonId = String(formData.get("lessonId") ?? "");
  const childId = String(formData.get("childId") ?? "");

  if (!lessonId || !childId) {
    throw new Error("Chýbajú údaje o lekcii alebo dieťati.");
  }

  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id, parent_id")
    .eq("id", childId)
    .single();

  if (childError || !child) {
    throw new Error("Dieťa sa nepodarilo nájsť.");
  }

  if (child.parent_id !== user.id) {
    throw new Error("K tomuto dieťaťu nemáte prístup.");
  }

  const { error } = await supabase.from("lesson_absences").insert({
    lesson_id: lessonId,
    child_id: childId,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Dieťa je už z tejto lekcie odhlásené.");
    }

    console.error("Chyba pri odhlásení z lekcie:", error);
    throw new Error("Dieťa sa nepodarilo odhlásiť z lekcie.");
  }

  revalidatePath("/prihlasenie");
  revalidatePath("/moje-kurzy");
}

export async function cancelLessonAbsence(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  const absenceId = String(formData.get("absenceId") ?? "");
  const childId = String(formData.get("childId") ?? "");

  if (!absenceId || !childId) {
    throw new Error("Chýbajú údaje o odhlásení alebo dieťati.");
  }

  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id, parent_id")
    .eq("id", childId)
    .single();

  if (childError || !child) {
    throw new Error("Dieťa sa nepodarilo nájsť.");
  }

  if (child.parent_id !== user.id) {
    throw new Error("K tomuto dieťaťu nemáte prístup.");
  }

  const { error } = await supabase
    .from("lesson_absences")
    .delete()
    .eq("id", absenceId)
    .eq("child_id", childId);

  if (error) {
    console.error("Chyba pri zrušení odhlásenia:", error);
    throw new Error("Odhlásenie sa nepodarilo zrušiť.");
  }

  revalidatePath("/prihlasenie");
  revalidatePath("/moje-kurzy");
}
export async function createLessonReplacement(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  const childId = String(formData.get("childId") ?? "");
  const absenceId = String(formData.get("absenceId") ?? "");
  const replacementLessonId = String(formData.get("replacementLessonId") ?? "");

  if (!childId || !absenceId || !replacementLessonId) {
    throw new Error("Chýbajú údaje pre náhradnú lekciu.");
  }

  const { data, error } = await supabase.rpc("create_lesson_replacement", {
    p_child_id: childId,
    p_absence_id: absenceId,
    p_replacement_lesson_id: replacementLessonId,
  });

  if (error) {
    console.error("Chyba pri vytvorení náhradnej lekcie:", error);

    if (error.message.includes("už bola vybraná")) {
      throw new Error("Za toto odhlásenie už bola náhradná lekcia vybraná.");
    }

    if (error.message.includes("už obsadená")) {
      throw new Error("Táto náhradná lekcia už nemá voľné miesto.");
    }

    if (error.message.includes("rovnakého kurzu a obdobia")) {
      throw new Error("Náhradná lekcia musí byť v rovnakom kurze a období.");
    }

    if (error.message.includes("pravidelne prihlásené")) {
      throw new Error("Dieťa je už na tomto termíne prihlásené.");
    }

    throw new Error("Náhradnú lekciu sa nepodarilo vybrať.");
  }

  revalidatePath("/moje-kurzy");

  return data;
}
export async function cancelLessonReplacement(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  const replacementId = String(formData.get("replacementId") ?? "");
  const childId = String(formData.get("childId") ?? "");

  if (!replacementId || !childId) {
    throw new Error("Chýbajú údaje o náhradnej lekcii.");
  }

  const { error } = await supabase.rpc("cancel_lesson_replacement", {
    p_replacement_id: replacementId,
    p_child_id: childId,
  });

  if (error) {
    console.error("Chyba pri zrušení náhradnej lekcie:", error);

    if (error.message.includes("nemáte prístup")) {
      throw new Error("K tejto náhradnej lekcii nemáte prístup.");
    }

    if (error.message.includes("sa nenašla")) {
      throw new Error("Náhradná lekcia sa nenašla.");
    }

    throw new Error("Náhradnú lekciu sa nepodarilo zrušiť.");
  }

  revalidatePath("/moje-kurzy");
}
