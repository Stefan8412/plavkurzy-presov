import { createClient } from "@/lib/supabase/server";

export type AvailableReplacementLesson = {
  id: string;
  courseTermId: string;
  lessonDate: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  occupiedPlaces: number;
  availablePlaces: number;
};

type SourceLessonRow = {
  id: string;
  course_term_id: string;
  lesson_date: string;
};

type CourseTermRow = {
  id: string;
  course_id: string;
  start_date: string;
  end_date: string;
  capacity: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

type LessonRow = {
  id: string;
  course_term_id: string;
  lesson_date: string;
  status: "scheduled" | "cancelled" | "completed";
};

type RegistrationRow = {
  child_id: string;
  course_term_id: string;
};

type AbsenceRow = {
  child_id: string;
  lesson_id: string;
};

type ReplacementRow = {
  child_id: string;
  replacement_lesson_id: string;
};

export async function getAvailableReplacementLessons({
  childId,
  absenceId,
}: {
  childId: string;
  absenceId: string;
}): Promise<AvailableReplacementLesson[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  /*
   * 1. Overíme, že dieťa patrí prihlásenému rodičovi.
   */
  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError || !child) {
    return [];
  }

  /*
   * 2. Načítame odhlásenie.
   */
  const { data: absence, error: absenceError } = await supabase
    .from("lesson_absences")
    .select("id, lesson_id, child_id")
    .eq("id", absenceId)
    .eq("child_id", childId)
    .maybeSingle();

  if (absenceError || !absence) {
    return [];
  }

  /*
   * Ak už bola za toto odhlásenie vybraná náhrada,
   * ďalšie termíny neponúkame.
   */
  const { data: existingReplacement } = await supabase
    .from("lesson_replacements")
    .select("id")
    .eq("absence_id", absenceId)
    .maybeSingle();

  if (existingReplacement) {
    return [];
  }

  /*
   * 3. Zistíme pôvodnú lekciu.
   */
  const { data: sourceLessonData, error: sourceLessonError } = await supabase
    .from("lessons")
    .select("id, course_term_id, lesson_date")
    .eq("id", absence.lesson_id)
    .maybeSingle();

  if (sourceLessonError || !sourceLessonData) {
    return [];
  }

  const sourceLesson = sourceLessonData as SourceLessonRow;

  /*
   * 4. Zistíme kurz a obdobie pôvodného termínu.
   */
  const { data: sourceTermData, error: sourceTermError } = await supabase
    .from("course_terms")
    .select(
      `
      id,
      course_id,
      start_date,
      end_date,
      capacity,
      day_of_week,
      start_time,
      end_time
    `,
    )
    .eq("id", sourceLesson.course_term_id)
    .maybeSingle();

  if (sourceTermError || !sourceTermData) {
    return [];
  }

  const sourceTerm = sourceTermData as CourseTermRow;

  /*
   * 5. Nájdeme všetky termíny toho istého kurzu
   * v rovnakom období.
   */
  const { data: termsData, error: termsError } = await supabase
    .from("course_terms")
    .select(
      `
      id,
      course_id,
      start_date,
      end_date,
      capacity,
      day_of_week,
      start_time,
      end_time
    `,
    )
    .eq("course_id", sourceTerm.course_id)
    .eq("start_date", sourceTerm.start_date)
    .eq("end_date", sourceTerm.end_date);

  if (termsError) {
    console.error("Chyba pri načítaní náhradných termínov:", termsError);
    return [];
  }

  const terms = (termsData ?? []) as CourseTermRow[];

  if (terms.length === 0) {
    return [];
  }

  /*
   * 6. Zistíme, na ktorých pravidelných termínoch
   * je toto dieťa už prihlásené.
   *
   * Tie ako náhradu neponúkneme.
   */
  const { data: childRegistrationsData, error: childRegistrationsError } =
    await supabase
      .from("registrations")
      .select("child_id, course_term_id")
      .eq("child_id", childId)
      .in("status", ["pending", "confirmed"]);

  if (childRegistrationsError) {
    console.error(
      "Chyba pri načítaní registrácií dieťaťa:",
      childRegistrationsError,
    );
    return [];
  }

  const childRegisteredTermIds = new Set(
    ((childRegistrationsData ?? []) as RegistrationRow[]).map(
      (registration) => registration.course_term_id,
    ),
  );

  /*
   * Kandidátmi sú teda ostatné termíny rovnakého kurzu.
   */
  const candidateTerms = terms.filter(
    (term) => !childRegisteredTermIds.has(term.id),
  );

  if (candidateTerms.length === 0) {
    return [];
  }

  const candidateTermIds = candidateTerms.map((term) => term.id);

  /*
   * 7. Načítame konkrétne budúce lekcie.
   */
  const today = new Date().toISOString().slice(0, 10);

  const { data: lessonsData, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, course_term_id, lesson_date, status")
    .in("course_term_id", candidateTermIds)
    .gte("lesson_date", today)
    .eq("status", "scheduled")
    .order("lesson_date", { ascending: true });

  if (lessonsError) {
    console.error("Chyba pri načítaní náhradných lekcií:", lessonsError);
    return [];
  }

  const lessons = (lessonsData ?? []) as LessonRow[];

  if (lessons.length === 0) {
    return [];
  }

  const lessonIds = lessons.map((lesson) => lesson.id);

  /*
   * 8. Načítame bežné registrácie na kandidátske termíny.
   */
  const { data: registrationsData, error: registrationsError } = await supabase
    .from("registrations")
    .select("child_id, course_term_id")
    .in("course_term_id", candidateTermIds)
    .in("status", ["pending", "confirmed"]);

  if (registrationsError) {
    console.error("Chyba pri načítaní obsadenosti:", registrationsError);
    return [];
  }

  const registrations = (registrationsData ?? []) as RegistrationRow[];

  /*
   * 9. Načítame odhlásenia z konkrétnych lekcií.
   */
  const { data: absencesData, error: absencesError } = await supabase
    .from("lesson_absences")
    .select("child_id, lesson_id")
    .in("lesson_id", lessonIds);

  if (absencesError) {
    console.error("Chyba pri načítaní odhlásení:", absencesError);
    return [];
  }

  const absences = (absencesData ?? []) as AbsenceRow[];

  /*
   * 10. Načítame už existujúce náhrady.
   */
  const { data: replacementsData, error: replacementsError } = await supabase
    .from("lesson_replacements")
    .select("child_id, replacement_lesson_id")
    .in("replacement_lesson_id", lessonIds);

  if (replacementsError) {
    console.error("Chyba pri načítaní náhrad:", replacementsError);
    return [];
  }

  const replacements = (replacementsData ?? []) as ReplacementRow[];

  const termById = new Map(terms.map((term) => [term.id, term]));

  /*
   * 11. Vypočítame reálnu obsadenosť každej lekcie:
   *
   * registrácie
   * - odhlásenia
   * + náhradníci
   */
  return lessons
    .map((lesson) => {
      const term = termById.get(lesson.course_term_id);

      if (!term) {
        return null;
      }

      const regularRegistrations = registrations.filter(
        (registration) => registration.course_term_id === lesson.course_term_id,
      ).length;

      const lessonAbsences = absences.filter(
        (absence) => absence.lesson_id === lesson.id,
      ).length;

      const lessonReplacements = replacements.filter(
        (replacement) => replacement.replacement_lesson_id === lesson.id,
      ).length;

      const occupiedPlaces = Math.max(
        regularRegistrations - lessonAbsences + lessonReplacements,
        0,
      );

      const availablePlaces = Math.max(term.capacity - occupiedPlaces, 0);

      if (availablePlaces <= 0) {
        return null;
      }

      return {
        id: lesson.id,
        courseTermId: lesson.course_term_id,
        lessonDate: lesson.lesson_date,
        dayOfWeek: term.day_of_week,
        startTime: term.start_time,
        endTime: term.end_time,
        capacity: term.capacity,
        occupiedPlaces,
        availablePlaces,
      };
    })
    .filter((lesson): lesson is AvailableReplacementLesson => lesson !== null);
}
export type SelectedReplacementLesson = {
  id: string;
  absenceId: string;
  lessonId: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
};

type SelectedReplacementRow = {
  id: string;
  absence_id: string;
  replacement_lesson_id: string;
};

type SelectedLessonRow = {
  id: string;
  lesson_date: string;
  course_term_id: string;
};

type SelectedCourseTermRow = {
  id: string;
  start_time: string;
  end_time: string;
};

export async function getSelectedReplacementLessons(
  childId: string,
): Promise<Record<string, SelectedReplacementLesson>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }

  /*
   * Overíme vlastníctvo dieťaťa.
   */
  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError || !child) {
    return {};
  }

  /*
   * Načítame všetky náhrady dieťaťa.
   */
  const { data: replacementsData, error: replacementsError } = await supabase
    .from("lesson_replacements")
    .select("id, absence_id, replacement_lesson_id")
    .eq("child_id", childId);

  if (replacementsError) {
    console.error("Chyba pri načítaní vybraných náhrad:", replacementsError);

    return {};
  }

  const replacements = (replacementsData ?? []) as SelectedReplacementRow[];

  if (replacements.length === 0) {
    return {};
  }

  const lessonIds = replacements.map(
    (replacement) => replacement.replacement_lesson_id,
  );

  /*
   * Načítame konkrétne lekcie.
   */
  const { data: lessonsData, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, lesson_date, course_term_id")
    .in("id", lessonIds);

  if (lessonsError) {
    console.error("Chyba pri načítaní náhradných lekcií:", lessonsError);
    return {};
  }

  const lessons = (lessonsData ?? []) as SelectedLessonRow[];

  const courseTermIds = [
    ...new Set(lessons.map((lesson) => lesson.course_term_id)),
  ];

  /*
   * Načítame časy termínov.
   */
  const { data: termsData, error: termsError } = await supabase
    .from("course_terms")
    .select("id, start_time, end_time")
    .in("id", courseTermIds);

  if (termsError) {
    console.error("Chyba pri načítaní časov náhrad:", termsError);
    return {};
  }

  const terms = (termsData ?? []) as SelectedCourseTermRow[];

  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  const termById = new Map(terms.map((term) => [term.id, term]));

  const result: Record<string, SelectedReplacementLesson> = {};

  for (const replacement of replacements) {
    const lesson = lessonById.get(replacement.replacement_lesson_id);

    if (!lesson) {
      continue;
    }

    const term = termById.get(lesson.course_term_id);

    if (!term) {
      continue;
    }

    result[replacement.absence_id] = {
      id: replacement.id,
      absenceId: replacement.absence_id,
      lessonId: lesson.id,
      lessonDate: lesson.lesson_date,
      startTime: term.start_time,
      endTime: term.end_time,
    };
  }

  return result;
}
