"use server";

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
