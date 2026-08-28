"use client";

import { useActionState } from "react";
import {
  registerChildForCourse,
  type RegistrationActionState,
} from "./actions";

type RegistrationFormProps = {
  childId: string;
  courseTermId: string;
};

const initialState: RegistrationActionState = {
  success: false,
  message: "",
};

export default function RegistrationForm({
  childId,
  courseTermId,
}: RegistrationFormProps) {
  const [state, formAction, isPending] = useActionState(
    registerChildForCourse,
    initialState,
  );

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h3 className="font-semibold text-emerald-800">
          Prihláška bola úspešne odoslaná
        </h3>

        <p className="mt-2 text-sm text-emerald-700">
          Dieťa bolo prihlásené na vybraný termín.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="childId" value={childId} />

      <input type="hidden" name="courseTermId" value={courseTermId} />

      {state.message && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Odosielam prihlášku..." : "Potvrdiť prihlášku"}
      </button>
    </form>
  );
}
