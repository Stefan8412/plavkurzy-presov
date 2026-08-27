"use client";

import { useState } from "react";
import type { Child } from "@/lib/data/children";

type ChildSelectorProps = {
  children: Child[];
  termId: string;
};

export default function ChildSelector({
  children,
  termId,
}: ChildSelectorProps) {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  function handleContinue() {
    if (!selectedChildId) {
      return;
    }

    window.location.href = `/prihlasenie?term=${termId}&child=${selectedChildId}`;
  }

  return (
    <section className="mt-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Vyberte dieťa</h2>

        <p className="mt-2 text-sm text-slate-500">
          Vyberte dieťa, ktoré chcete prihlásiť na tento termín.
        </p>
      </div>

      {children.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <p className="font-medium text-slate-900">
            Zatiaľ nemáte pridané žiadne dieťa.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Najprv pridajte dieťa, ktoré chcete prihlásiť na kurz.
          </p>

          <button
            type="button"
            className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            + Pridať dieťa
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4">
            {children.map((child) => {
              const selected = selectedChildId === child.id;

              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                      : "border-slate-200 bg-white hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {child.firstName} {child.lastName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Narodený/á:{" "}
                        {new Date(child.dateOfBirth).toLocaleDateString(
                          "sk-SK",
                        )}
                      </p>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-sky-600 bg-sky-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!selectedChildId}
            onClick={handleContinue}
            className="mt-6 w-full rounded-full bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Pokračovať
          </button>
        </>
      )}
    </section>
  );
}
