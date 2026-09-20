"use client";

import { useState, useTransition } from "react";

import { setLessonAttendance } from "./actions";

type AttendanceCheckboxProps = {
  lessonId: string;
  childId: string;
  initialAttended: boolean;
};

export default function AttendanceCheckbox({
  lessonId,
  childId,
  initialAttended,
}: AttendanceCheckboxProps) {
  const [attended, setAttended] = useState(initialAttended);
  const [isPending, startTransition] = useTransition();

  function handleChange(checked: boolean) {
    const previousValue = attended;

    setAttended(checked);

    startTransition(async () => {
      try {
        await setLessonAttendance(lessonId, childId, checked);
      } catch (error) {
        console.error("Nepodarilo sa uložiť dochádzku:", error);
        setAttended(previousValue);
      }
    });
  }

  return (
    <label
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
        attended
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-700"
      } ${isPending ? "opacity-60" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={attended}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.checked)}
        className="h-5 w-5 accent-emerald-600"
      />

      {isPending ? "Ukladám..." : "Bol na hodine"}
    </label>
  );
}
