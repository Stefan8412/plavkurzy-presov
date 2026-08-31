"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-700"
        >
          Meno a priezvisko
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
          placeholder="Ján Novák"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700"
          >
            E-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
            placeholder="vas@email.sk"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-slate-700"
          >
            Telefón
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
            placeholder="+421 ..."
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-semibold text-slate-700"
        >
          Mám záujem o
        </label>

        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
        >
          <option value="" disabled>
            Vyberte možnosť
          </option>
          <option value="children">Skupinový kurz pre deti</option>
          <option value="individual">Individuálne plávanie</option>
          <option value="schools">Plávanie pre MŠ / ZŠ</option>
          <option value="camp">Plavecký tábor</option>
          <option value="other">Iné</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-slate-700"
        >
          Správa
        </label>

        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
          placeholder="Napíšte nám, s čím vám môžeme pomôcť..."
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#009ee9] px-6 py-4 font-bold text-white transition hover:bg-[#0087c9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Odosielam..." : "Odoslať správu"}
      </button>

      {state.message && (
        <p
          className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
            state.success
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
