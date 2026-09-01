import { createClient } from "@/lib/supabase/server";

export type ChildLesson = {
  id: string;
  courseTermId: string;
  lessonDate: string;
  status: "scheduled" | "cancelled" | "completed";
  isAbsent: boolean;
  absenceId: string | null;
  absenceNote: string | null;
};

type LessonRow = {
  id: string;
  course_term_id: string;
  lesson_date: string;
  status: "scheduled" | "cancelled" | "completed";
};

type AbsenceRow = {
  id: string;
  lesson_id: string;
  note: string | null;
};

export async function getLessonsForChildRegistration(
  childId: string,
  courseTermIds: string[],
): Promise<ChildLesson[]> {
  if (!childId || courseTermIds.length === 0) {
    return [];
  }

  const supabase = await createClient();

  const { data: lessonsData, error: lessonsError } = await supabase
    .from("lessons")
    .select(
      `
      id,
      course_term_id,
      lesson_date,
      status
    `,
    )
    .in("course_term_id", courseTermIds)
    .order("lesson_date", { ascending: true });

  if (lessonsError) {
    console.error("Chyba pri načítaní lekcií:", lessonsError);
    throw new Error("Nepodarilo sa načítať lekcie.");
  }

  const lessons = (lessonsData ?? []) as LessonRow[];

  if (lessons.length === 0) {
    return [];
  }

  const lessonIds = lessons.map((lesson) => lesson.id);

  const { data: absencesData, error: absencesError } = await supabase
    .from("lesson_absences")
    .select(
      `
      id,
      lesson_id,
      note
    `,
    )
    .eq("child_id", childId)
    .in("lesson_id", lessonIds);

  if (absencesError) {
    console.error("Chyba pri načítaní odhlásení:", absencesError);
    throw new Error("Nepodarilo sa načítať odhlásenia z lekcií.");
  }

  const absences = (absencesData ?? []) as AbsenceRow[];

  const absenceByLessonId = new Map(
    absences.map((absence) => [absence.lesson_id, absence]),
  );

  return lessons.map((lesson) => {
    const absence = absenceByLessonId.get(lesson.id);

    return {
      id: lesson.id,
      courseTermId: lesson.course_term_id,
      lessonDate: lesson.lesson_date,
      status: lesson.status,
      isAbsent: Boolean(absence),
      absenceId: absence?.id ?? null,
      absenceNote: absence?.note ?? null,
    };
  });
}
