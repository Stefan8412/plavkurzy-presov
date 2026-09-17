"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createCoursePeriod } from "./actions";

const monthNames = [
  "Január",
  "Február",
  "Marec",
  "Apríl",
  "Máj",
  "Jún",
  "Júl",
  "August",
  "September",
  "Október",
  "November",
  "December",
];

const dayNames = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatSelectedDate(value: string) {
  return new Intl.DateTimeFormat("sk-SK").format(parseLocalDate(value));
}

function getMonthsBetween(start: Date, end: Date) {
  const months: Date[] = [];

  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= last) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

function getMonthDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const firstDayIndex = (firstDay.getDay() + 6) % 7;

  const cells: Array<Date | null> = [];

  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    cells.push(new Date(year, monthIndex, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export default function NewCoursePeriodForm() {
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noSwimmingDays, setNoSwimmingDays] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validPeriod =
    startDate !== "" &&
    endDate !== "" &&
    parseLocalDate(endDate) >= parseLocalDate(startDate);

  const months = useMemo(() => {
    if (!validPeriod) {
      return [];
    }

    return getMonthsBetween(parseLocalDate(startDate), parseLocalDate(endDate));
  }, [startDate, endDate, validPeriod]);

  function toggleNoSwimmingDay(date: Date) {
    const key = formatDateKey(date);

    setNoSwimmingDays((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key].sort(),
    );
  }

  function isInsidePeriod(date: Date) {
    if (!validPeriod) {
      return false;
    }

    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);

    return date >= start && date <= end;
  }

  function handleCreatePeriod() {
    if (!validPeriod || isPending) {
      return;
    }

    const formattedStartDate = formatSelectedDate(startDate);
    const formattedEndDate = formatSelectedDate(endDate);

    const confirmed = window.confirm(
      `Naozaj chcete vytvoriť nové obdobie kurzov?\n\n` +
        `Obdobie: ${formattedStartDate} – ${formattedEndDate}\n` +
        `Dní bez plávania: ${noSwimmingDays.length}\n\n` +
        `Vytvoria sa nové termíny kurzov a jednotlivé lekcie.\n` +
        `Údaje sa zapíšu do databázy.`,
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        const result = await createCoursePeriod({
          startDate,
          endDate,
          noSwimmingDays,
        });

        setSuccessMessage(
          `Obdobie bolo vytvorené. Vytvorených termínov: ${result.createdTerms}, lekcií: ${result.createdLessons}.`,
        );

        setStartDate("");
        setEndDate("");
        setNoSwimmingDays([]);

        router.refresh();
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nové obdobie sa nepodarilo vytvoriť.",
        );
      }
    });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
          Nové obdobie
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#071b55]">
          Vytvoriť nové obdobie kurzov
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Zadajte začiatok a koniec nového obdobia a označte dni, počas ktorých
          sa nepláva.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Začiatok obdobia
          </span>

          <input
            type="date"
            value={startDate}
            disabled={isPending}
            onChange={(event) => {
              setStartDate(event.target.value);
              setNoSwimmingDays([]);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Koniec obdobia
          </span>

          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            disabled={isPending}
            onChange={(event) => {
              setEndDate(event.target.value);
              setNoSwimmingDays([]);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#009ee9] disabled:opacity-50"
          />
        </label>
      </div>

      {startDate && endDate && !validPeriod && (
        <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          Koniec obdobia nemôže byť pred začiatkom.
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <p className="font-semibold text-[#071b55]">Dni, keď sa nepláva</p>

        {!validPeriod ? (
          <p className="mt-1 text-sm text-slate-500">
            Kalendár sa zobrazí po zadaní začiatku a konca obdobia.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-500">
              Kliknite na deň, počas ktorého sa nebude plávať. Označené dni budú
              pri vytváraní lekcií vynechané.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {months.map((month) => (
                <div
                  key={`${month.getFullYear()}-${month.getMonth()}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <h3 className="text-center font-bold text-[#071b55]">
                    {monthNames[month.getMonth()]} {month.getFullYear()}
                  </h3>

                  <div className="mt-4 grid grid-cols-7 gap-1">
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className="py-1 text-center text-xs font-bold text-slate-400"
                      >
                        {day}
                      </div>
                    ))}

                    {getMonthDays(month).map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} />;
                      }

                      const key = formatDateKey(date);
                      const insidePeriod = isInsidePeriod(date);
                      const selected = noSwimmingDays.includes(key);

                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={!insidePeriod || isPending}
                          onClick={() => toggleNoSwimmingDay(date)}
                          className={`aspect-square rounded-xl text-sm font-semibold transition ${
                            !insidePeriod
                              ? "cursor-default text-slate-200"
                              : selected
                                ? "bg-red-600 text-white"
                                : "text-slate-700 hover:bg-sky-50 hover:text-[#009ee9]"
                          }`}
                          title={
                            selected
                              ? "Nepláva sa – kliknutím zrušíte označenie"
                              : insidePeriod
                                ? "Kliknutím označíte deň bez plávania"
                                : undefined
                          }
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {noSwimmingDays.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-700">
                  Označené dni bez plávania ({noSwimmingDays.length}):
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {noSwimmingDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        setNoSwimmingDays((current) =>
                          current.filter((item) => item !== day),
                        )
                      }
                      className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {formatSelectedDate(day)} ×
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          disabled={!validPeriod || isPending}
          onClick={handleCreatePeriod}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#071b55] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {isPending ? "Vytváram obdobie..." : "Vytvoriť obdobie a lekcie"}
        </button>
      </div>
    </div>
  );
}
