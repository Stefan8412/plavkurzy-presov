"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AddChildFormProps = {
  onSuccess?: () => void;
};

export default function AddChildForm({ onSuccess }: AddChildFormProps) {
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Nie ste prihlásený.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("children").insert({
      parent_id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      date_of_birth: dateOfBirth,
      gender: gender || null,
      notes: notes.trim() || null,
    });

    if (error) {
      console.error("Failed to create child:", error);
      setError("Dieťa sa nepodarilo pridať.");
      setLoading(false);
      return;
    }

    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setGender("");
    setNotes("");

    setLoading(false);

    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="child-first-name"
            className="block text-sm font-medium text-slate-700"
          >
            Meno dieťaťa
          </label>

          <input
            id="child-first-name"
            type="text"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Janko"
          />
        </div>

        <div>
          <label
            htmlFor="child-last-name"
            className="block text-sm font-medium text-slate-700"
          >
            Priezvisko
          </label>

          <input
            id="child-last-name"
            type="text"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Novák"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="child-date-of-birth"
          className="block text-sm font-medium text-slate-700"
        >
          Dátum narodenia
        </label>

        <input
          id="child-date-of-birth"
          type="date"
          required
          value={dateOfBirth}
          onChange={(event) => setDateOfBirth(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div>
        <label
          htmlFor="child-gender"
          className="block text-sm font-medium text-slate-700"
        >
          Pohlavie
        </label>

        <select
          id="child-gender"
          value={gender}
          onChange={(event) =>
            setGender(event.target.value as "male" | "female" | "other" | "")
          }
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="">Nevybrať</option>
          <option value="male">Chlapec</option>
          <option value="female">Dievča</option>
          <option value="other">Iné</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="child-notes"
          className="block text-sm font-medium text-slate-700"
        >
          Poznámka
        </label>

        <textarea
          id="child-notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder="Voliteľné informácie pre trénera..."
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
        {loading ? "Pridávam..." : "Pridať dieťa"}
      </button>
    </form>
  );
}
