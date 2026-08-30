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

  try {
    const result = await createRegistration({
      childId,
      courseTermId,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }
    revalidatePath("/prihlasenie");
    return {
      success: true,
      message: "Prihláška bola úspešne odoslaná.",
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
    .eq("id", registrationId);

  if (error) {
    console.error("Failed to cancel registration:", error);
    throw new Error("Registráciu sa nepodarilo zrušiť.");
  }

  revalidatePath("/prihlasenie");
}
