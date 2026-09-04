"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {
  success: false,
  message: "",
};

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-slate-700"
        >
          Nové heslo
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
          placeholder="Minimálne 8 znakov"
        />
      </div>

      <div>
        <label
          htmlFor="passwordConfirm"
          className="block text-sm font-semibold text-slate-700"
        >
          Zopakujte nové heslo
        </label>

        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
          placeholder="Zopakujte nové heslo"
        />
      </div>

      {state.message && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            state.success
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#009ee9] px-6 py-3 font-bold text-white transition hover:bg-[#0087c9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Mením heslo..." : "Zmeniť heslo"}
      </button>
    </form>
  );
}
