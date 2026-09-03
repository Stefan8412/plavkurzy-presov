import Link from "next/link";
import { redirect } from "next/navigation";
import { payRegistration } from "./actions";

import { createClient } from "@/lib/supabase/server";
import { getMyCourseRegistrations } from "@/lib/data/my-courses";
import { getLessonsForChildRegistration } from "@/lib/data/lessons";

import LessonsList from "@/app/prihlasenie/LessonsList";

export default async function MyCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prihlasenie");
  }

  const registrations = await getMyCourseRegistrations();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
          FEDDY
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
          Moje kurzy
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Tu nájdete aktívne kurzy vašich detí a všetky plánované lekcie.
        </p>
      </div>

      {registrations.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Zatiaľ nemáte žiadny aktívny kurz
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Vyberte si kurz a prihláste dieťa na jeden alebo dva pravidelné
            termíny.
          </p>

          <Link
            href="/kurzy"
            className="mt-6 inline-flex rounded-full bg-[#071b55] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Zobraziť kurzy
          </Link>
        </section>
      ) : (
        <div className="mt-8 space-y-10">
          {await Promise.all(
            registrations.map(async (registration) => {
              const lessons = await getLessonsForChildRegistration(
                registration.childId,
                registration.courseTermIds,
              );

              return (
                <section
                  key={registration.registrationGroupId}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
                >
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Dieťa
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-[#071b55]">
                          {registration.childFirstName}{" "}
                          {registration.childLastName}
                        </h2>

                        <p className="mt-4 text-sm font-medium text-slate-500">
                          Kurz
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-slate-950">
                          {registration.courseTitle}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#009ee9]">
                          {registration.frequencyPerWeek}× týždenne
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-slate-500">
                          Členský príspevok
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-950">
                          {registration.totalPrice} €
                        </p>

                        <div className="mt-3">
                          {registration.status === "pending" ? (
                            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                              Čaká na potvrdenie
                            </span>
                          ) : registration.status === "confirmed" ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Potvrdená
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              Dokončená
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            Platba
                          </p>

                          <div className="mt-2">
                            {!registration.payment ? (
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                Nezaplatené
                              </span>
                            ) : registration.payment.status === "paid" ? (
                              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Zaplatené
                              </span>
                            ) : registration.payment.status === "pending" ? (
                              <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                Čaká na platbu
                              </span>
                            ) : registration.payment.status === "failed" ? (
                              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                Platba zlyhala
                              </span>
                            ) : registration.payment.status === "refunded" ? (
                              <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                Platba vrátená
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                Platba zrušená
                              </span>
                            )}
                          </div>
                          {registration.payment?.status === "pending" &&
                            (registration.status === "pending" ||
                              registration.status === "confirmed") && (
                              <form
                                action={payRegistration.bind(
                                  null,
                                  registration.registrationGroupId,
                                )}
                                className="mt-4"
                              >
                                <button
                                  type="submit"
                                  className="inline-flex w-full items-center justify-center rounded-full bg-[#009ee9] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0087c9] sm:w-auto"
                                >
                                  Zaplatiť cez Comgate
                                </button>
                              </form>
                            )}
                        </div>

                        {registration.payment && (
                          <div className="sm:text-right">
                            <p className="text-sm text-slate-500">
                              Suma na úhradu
                            </p>

                            <p className="mt-1 text-lg font-bold text-[#071b55]">
                              {registration.payment.amount}{" "}
                              {registration.payment.currency === "EUR"
                                ? "€"
                                : registration.payment.currency}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(registration.status === "pending" ||
                    registration.status === "confirmed") && (
                    <LessonsList
                      childId={registration.childId}
                      lessons={lessons}
                    />
                  )}
                </section>
              );
            }),
          )}
        </div>
      )}
    </main>
  );
}
