"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCampTerm, type CampTermActionState } from "./actions";

const initialState: CampTermActionState = {
  success: false,
  message: "",
};

export default function NewCampTermForm() {
  const [state, formAction, pending] = useActionState(
    createCampTerm,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
          Nový turnus
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#071b55]">
          Pridať turnus letného tábora
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Nastavte názov, dátumy, maximálnu kapacitu a cenu podľa veľkosti
          obedovej porcie.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-700"
          >
            Názov turnusu
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="napr. 1. turnus"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-slate-700"
            >
              Od
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold text-slate-700"
            >
              Do
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-semibold text-slate-700"
          >
            Kapacita
          </label>

          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            step="1"
            required
            defaultValue="50"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="childMealPrice"
              className="block text-sm font-semibold text-slate-700"
            >
              Cena – detská porcia
            </label>

            <div className="relative mt-2">
              <input
                id="childMealPrice"
                name="childMealPrice"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue="185"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                €
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="adultMealPrice"
              className="block text-sm font-semibold text-slate-700"
            >
              Cena – dospelá porcia
            </label>

            <div className="relative mt-2">
              <input
                id="adultMealPrice"
                name="adultMealPrice"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue="195"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                €
              </span>
            </div>
          </div>
        </div>

        {state.message && (
          <div
            className={
              state.success
                ? "rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                : "rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            }
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex rounded-full bg-[#009ee9] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Vytváram turnus..." : "Vytvoriť turnus"}
        </button>
      </form>
    </div>
  );
}
