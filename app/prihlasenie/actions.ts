"use server";

import { redirect } from "next/navigation";
import { createRegistration } from "@/lib/data/registrations";

export async function registerChildForCourse(formData: FormData) {
  const childId = formData.get("childId");
  const courseTermId = formData.get("courseTermId");

  if (typeof childId !== "string" || !childId) {
    throw new Error("Dieťa nebolo vybrané.");
  }

  if (typeof courseTermId !== "string" || !courseTermId) {
    throw new Error("Termín nebol vybraný.");
  }

  const registration = await createRegistration({
    childId,
    courseTermId,
  });

  redirect(`/prihlasenie/uspesne?registration=${registration.id}`);
}
