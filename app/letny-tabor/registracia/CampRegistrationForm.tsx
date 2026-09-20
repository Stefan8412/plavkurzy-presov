"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  registerChildForCamp,
  type CampRegistrationActionState,
} from "./actions";

type CampRegistrationFormProps = {
  childId: string;
  campTermId: string;
  childMealPrice: number;
  adultMealPrice: number;
};

const initialState: CampRegistrationActionState = {
  success: false,
  message: "",
};

export default function CampRegistrationForm({
  childId,
  campTermId,
  childMealPrice,
  adultMealPrice,
}: CampRegistrationFormProps) {
  const [state, formAction, pending] = useActionState(
    registerChildForCamp,
    initialState,
  );

  const [mealPortion, setMealPortion] = useState<"child" | "adult">("child");

  const [recreationVoucher, setRecreationVoucher] = useState(false);

  const currentPrice =
    mealPortion === "adult" ? adultMealPrice : childMealPrice;

  if (state.success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <h2 className="text-2xl font-bold text-emerald-900">
          Prihláška bola odoslaná
        </h2>

        <p className="mt-3 text-emerald-800">{state.message}</p>

        <Link
          href="/letny-tabor"
          className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Späť na letný tábor
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="childId" value={childId} />
      <input type="hidden" name="campTermId" value={campTermId} />

      <section>
        <h3 className="text-lg font-bold text-slate-950">Obedová porcia</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="mealPortion"
                value="child"
                checked={mealPortion === "child"}
                onChange={() => setMealPortion("child")}
                className="mt-1"
              />

              <div>
                <p className="font-semibold text-slate-950">Detská porcia</p>

                <p className="mt-1 text-sm text-slate-500">
                  Cena turnusu: {childMealPrice} €
                </p>
              </div>
            </div>
          </label>

          <label className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="mealPortion"
                value="adult"
                checked={mealPortion === "adult"}
                onChange={() => setMealPortion("adult")}
                className="mt-1"
              />

              <div>
                <p className="font-semibold text-slate-950">Dospelá porcia</p>

                <p className="mt-1 text-sm text-slate-500">
                  Cena turnusu: {adultMealPrice} €
                </p>
              </div>
            </div>
          </label>
        </div>
      </section>

      <section>
        <label
          htmlFor="shirtSize"
          className="block text-lg font-bold text-slate-950"
        >
          Veľkosť trička
        </label>

        <select
          id="shirtSize"
          name="shirtSize"
          required
          defaultValue=""
          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="" disabled>
            Vyberte veľkosť
          </option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </select>
      </section>

      <section>
        <label
          htmlFor="healthInfo"
          className="block text-lg font-bold text-slate-950"
        >
          Lieky a alergie
        </label>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Užíva dieťa nejaké lieky? Ak áno, uveďte aké a kedy ich má užívať.
          Uveďte tiež prípadné alergie. Ak dieťa lieky neužíva a nemá alergie,
          napíšte „Nie“.
        </p>

        <textarea
          id="healthInfo"
          name="healthInfo"
          required
          rows={5}
          className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="recreationVoucher"
            checked={recreationVoucher}
            onChange={(event) => setRecreationVoucher(event.target.checked)}
            className="mt-1"
          />

          <div>
            <p className="font-semibold text-slate-950">
              Chcem uplatniť rekreačný poukaz
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Po zaškrtnutí vyplňte fakturačné údaje rodiča.
            </p>
          </div>
        </label>

        {recreationVoucher && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="billingName"
              required
              placeholder="Meno a priezvisko rodiča"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500"
            />

            <input
              type="text"
              name="billingStreet"
              required
              placeholder="Ulica a číslo"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500"
            />

            <input
              type="text"
              name="billingPostalCode"
              required
              placeholder="PSČ"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500"
            />

            <input
              type="text"
              name="billingCity"
              required
              placeholder="Obec / mesto"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500"
            />
          </div>
        )}
      </section>

      <section>
        <label
          htmlFor="excitement"
          className="block text-lg font-bold text-slate-950"
        >
          Ako veľmi sa dieťa teší na tábor?
        </label>

        <select
          id="excitement"
          name="excitement"
          defaultValue=""
          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500"
        >
          <option value="">Nevybrané</option>
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="privacyConsent"
            required
            className="mt-1"
          />

          <span className="text-sm leading-6 text-slate-700">
            Súhlasím so spracovaním osobných údajov potrebných na spracovanie
            prihlášky na letný tábor.{" "}
            <Link
              href="/ochrana-osobnych-udajov"
              target="_blank"
              className="font-semibold text-sky-600 hover:text-sky-700"
            >
              Ochrana osobných údajov
            </Link>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input type="checkbox" name="photoConsent" className="mt-1" />

          <span className="text-sm leading-6 text-slate-700">
            Súhlasím s vyhotovením a použitím fotografií dieťaťa na prezentačné
            účely a sociálne siete FEDDY.
          </span>
        </label>
      </section>

      {state.message && !state.success && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div className="rounded-2xl bg-sky-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-slate-700">Cena za turnus</span>

          <span className="text-2xl font-bold text-slate-950">
            {currentPrice} €
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Výsledná cena sa overí na serveri podľa vybraného turnusu a obedovej
          porcie.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#009ee9] px-6 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? "Odosielam prihlášku..."
          : `Odoslať prihlášku – ${currentPrice} €`}
      </button>
    </form>
  );
}
