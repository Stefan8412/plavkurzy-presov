"use server";

import { createRegistration } from "@/lib/data/registrations";

export async function registerChildForCourse(
  formData: FormData,
): Promise<void> {
  const childId = formData.get("childId");
  const courseTermId = formData.get("courseTermId");

  if (typeof childId !== "string" || !childId) {
    throw new Error("Chýba ID dieťaťa.");
  }

  if (typeof courseTermId !== "string" || !courseTermId) {
    throw new Error("Chýba ID termínu.");
  }

  const result = await createRegistration({
    childId,
    courseTermId,
  });

  if (!result.success) {
    throw new Error(result.error);
  }
}
