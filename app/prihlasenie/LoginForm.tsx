"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  termId?: string;
  secondTermId?: string;
  frequency?: 1 | 2;
};

export default function LoginForm({
  termId,
  secondTermId,
  frequency = 1,
}: LoginFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !user) {
      if (loginError?.message.toLowerCase().includes("email not confirmed")) {
        setError(
          "E-mail ešte nebol potvrdený. Skontrolujte svoju e-mailovú schránku a potvrďte účet.",
        );
      } else {
        setError("Nesprávny e-mail alebo heslo.");
      }

      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Failed to load profile:", profileError);
      setError("Nepodarilo sa načítať používateľský účet.");
      setLoading(false);
      return;
    }

    if (profile?.role === "admin") {
      router.push("/admin");
      router.refresh();
      return;
    }

    if (!termId) {
      router.push("/kurzy");
      router.refresh();
      return;
    }

    const params = new URLSearchParams();

    params.set("term", termId);
    params.set("frequency", String(frequency));

    if (frequency === 2 && secondTermId) {
      params.set("term2", secondTermId);
    }

    router.push(`/prihlasenie?${params.toString()}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
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

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Heslo
        </label>

        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder="••••••••"
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
        {loading ? "Prihlasujem..." : "Prihlásiť sa"}
      </button>
    </form>
  );
}
