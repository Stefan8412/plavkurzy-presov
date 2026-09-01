"use client";

import { useState } from "react";
import Link from "next/link";
import type { CourseTerm } from "@/types/course";

type CourseTermSelectorProps = {
  terms: CourseTerm[];
  priceOnceWeekly: number;
  priceTwiceWeekly?: number;
};

type Frequency = 1 | 2;

const dayLabels = {
  monday: "Pondelok",
  tuesday: "Utorok",
  wednesday: "Streda",
  thursday: "Štvrtok",
  friday: "Piatok",
  saturday: "Sobota",
  sunday: "Nedeľa",
};

export default function CourseTermSelector({
  terms,
  priceOnceWeekly,
  priceTwiceWeekly,
}: CourseTermSelectorProps) {
  const [frequency, setFrequency] = useState<Frequency>(1);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);

  function changeFrequency(newFrequency: Frequency) {
    setFrequency(newFrequency);
    setSelectedTerms([]);
  }

  function toggleTerm(termId: string) {
    setSelectedTerms((current) => {
      if (current.includes(termId)) {
        return current.filter((id) => id !== termId);
      }

      if (current.length >= frequency) {
        if (frequency === 1) {
          return [termId];
        }

        return current;
      }

      return [...current, termId];
    });
  }

  const selectionComplete = selectedTerms.length === frequency;

  const registrationHref =
    frequency === 1 && selectedTerms[0]
      ? `/prihlasenie?term=${selectedTerms[0]}&frequency=1`
      : frequency === 2 && selectedTerms[0] && selectedTerms[1]
        ? `/prihlasenie?term=${selectedTerms[0]}&term2=${selectedTerms[1]}&frequency=2`
        : "#";

  return (
    <div>
      {/* Frequency */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => changeFrequency(1)}
          className={`rounded-2xl border p-5 text-left transition ${
            frequency === 1
              ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
              : "border-slate-200 bg-white hover:border-sky-300"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-950">1× týždenne</p>
              <p className="mt-1 text-sm text-slate-500">
                Vyberiete jeden termín
              </p>
            </div>

            <p className="text-xl font-bold text-[#071b55]">
              {priceOnceWeekly} €
            </p>
          </div>
        </button>

        {priceTwiceWeekly !== undefined && (
          <button
            type="button"
            onClick={() => changeFrequency(2)}
            className={`rounded-2xl border p-5 text-left transition ${
              frequency === 2
                ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                : "border-slate-200 bg-white hover:border-sky-300"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-950">2× týždenne</p>
                <p className="mt-1 text-sm text-slate-500">
                  Vyberiete dva termíny
                </p>
              </div>

              <p className="text-xl font-bold text-[#071b55]">
                {priceTwiceWeekly} €
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Instruction */}
      <div className="mt-8 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-sm font-medium text-slate-700">
          {frequency === 1
            ? "Vyberte jeden deň a čas tréningu."
            : "Vyberte dva dni a časy tréningov."}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Vybrané: {selectedTerms.length} z {frequency}
        </p>
      </div>

      {/* Terms */}
      <div className="mt-5 space-y-4">
        {terms.map((term) => {
          const isAvailable =
            term.status === "available" && term.availableSpots > 0;

          const isSelected = selectedTerms.includes(term.id);

          const selectionLimitReached =
            selectedTerms.length >= frequency && !isSelected;

          return (
            <button
              key={term.id}
              type="button"
              disabled={!isAvailable || selectionLimitReached}
              onClick={() => toggleTerm(term.id)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                  : isAvailable && !selectionLimitReached
                    ? "border-slate-200 bg-white hover:border-sky-300"
                    : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-950">
                      {dayLabels[term.dayOfWeek]}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span className="font-semibold text-sky-600">
                      {term.startTime} – {term.endTime}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {term.startDate} – {term.endDate}
                  </p>

                  {term.trainerName && (
                    <p className="mt-2 text-sm text-slate-600">
                      Tréner:{" "}
                      <span className="font-medium text-slate-900">
                        {term.trainerName}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Voľné miesta</p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isAvailable ? "text-emerald-600" : "text-slate-500"
                      }`}
                    >
                      {isAvailable
                        ? `${term.availableSpots} / ${term.capacity}`
                        : "Obsadené"}
                    </p>
                  </div>

                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && "✓"}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Vybraný variant</p>

            <p className="mt-1 text-lg font-bold text-slate-950">
              {frequency}× týždenne
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Cena:{" "}
              <span className="font-semibold text-slate-900">
                {frequency === 1 ? priceOnceWeekly : priceTwiceWeekly} €
              </span>
            </p>
          </div>

          {selectionComplete ? (
            <Link
              href={registrationHref}
              className="flex items-center justify-center rounded-full bg-sky-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Pokračovať na prihlásenie
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full bg-slate-100 px-7 py-3 text-sm font-semibold text-slate-400"
            >
              {frequency === 1
                ? "Vyberte termín"
                : `Vyberte ${frequency - selectedTerms.length} ${
                    frequency - selectedTerms.length === 1
                      ? "ďalší termín"
                      : "ďalšie termíny"
                  }`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
