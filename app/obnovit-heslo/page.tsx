"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (password.length < 8) {
      setError("Nové heslo musí mať aspoň 8 znakov.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Zadané heslá sa nezhodujú.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error("Password update error:", updateError);

      setError(
        "Heslo sa nepodarilo zmeniť. Odkaz mohol vypršať. Požiadajte o nový odkaz na obnovenie hesla.",
      );

      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-900">
            Heslo bolo zmenené
          </h1>

          <p className="mt-3 text-sm leading-6 text-emerald-700">
            Vaše nové heslo bolo úspešne nastavené.
          </p>

          <button
            type="button"
            onClick={() => {
              router.push("/prihlasenie");
              router.refresh();
            }}
            className="mt-6 inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Prejsť na prihlásenie
          </button>
        </div>
      </main>
    );
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
          Nastavenie nového hesla
        </h1>

        <p className="mt-3 text-slate-600">
          Zadajte nové heslo, ktoré budete používať na prihlásenie.
        </p>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Nové heslo
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Minimálne 8 znakov"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-slate-700"
            >
              Zopakujte nové heslo
            </label>

            <input
              id="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Zopakujte nové heslo"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Mením heslo..." : "Nastaviť nové heslo"}
          </button>
        </form>
      </section>
    </main>
  );
}
