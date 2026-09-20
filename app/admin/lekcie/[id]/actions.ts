"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function setLessonAttendance(
  lessonId: string,
  childId: string,
  attended: boolean,
) {
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
    throw new Error("Nemáte oprávnenie meniť dochádzku.");
  }

  if (attended) {
    const { error } = await supabase.from("lesson_attendance").upsert(
      {
        lesson_id: lessonId,
        child_id: childId,
        attended: true,
        marked_by: user.id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "lesson_id,child_id",
      },
    );

    if (error) {
      console.error("Chyba pri uložení dochádzky:", error);
      throw new Error("Dochádzku sa nepodarilo uložiť.");
    }
  } else {
    const { error } = await supabase
      .from("lesson_attendance")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("child_id", childId);

    if (error) {
      console.error("Chyba pri odstránení dochádzky:", error);
      throw new Error("Dochádzku sa nepodarilo zmeniť.");
    }
  }

  revalidatePath(`/admin/lekcie/${lessonId}`);
  revalidatePath("/admin/lekcie");
  revalidatePath("/admin");
}
