"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage(null);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/obnovit-heslo`,
      },
    );

    if (resetError) {
      console.error("Password reset error:", resetError);
      setError(
        "Odkaz na obnovenie hesla sa nepodarilo odoslať. Skúste to prosím znova.",
      );
      setLoading(false);
      return;
    }

    setMessage(
      "Ak je tento e-mail zaregistrovaný, poslali sme naň odkaz na obnovenie hesla.",
    );

    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16 lg:px-8">
      <Link
        href="/prihlasenie"
        className="text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        ← Späť na prihlásenie
      </Link>

      <div className="mt-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
          FEDDY
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
          Zabudli ste heslo?
        </h1>

        <p className="mt-3 text-slate-600">
          Zadajte e-mail, ktorý používate na prihlásenie. Pošleme vám odkaz na
          nastavenie nového hesla.
        </p>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="vas@email.sk"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Odosielam..." : "Poslať odkaz na obnovenie hesla"}
          </button>
        </form>
      </section>
    </main>
  );
}
