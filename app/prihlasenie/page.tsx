import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";
import AddChildForm from "./AddChildForm";
import { getCourseTermById } from "@/lib/data/courses";
import { getChildren } from "@/lib/data/children";
import { getRegistrationForChildAndTerm } from "@/lib/data/registrations";
import RegistrationForm from "./RegistrationForm";
import { cancelOwnRegistration } from "./actions";
import { getLessonsForChildRegistration } from "@/lib/data/lessons";
import LessonsList from "./LessonsList";

type LoginPageProps = {
  searchParams: Promise<{
    term?: string;
    term2?: string;
    frequency?: string;
    child?: string;
  }>;
};

const dayLabels = {
  monday: "Pondelok",
  tuesday: "Utorok",
  wednesday: "Streda",
  thursday: "Štvrtok",
  friday: "Piatok",
  saturday: "Sobota",
  sunday: "Nedeľa",
};

function buildRegistrationUrl({
  termId,
  secondTermId,
  frequency,
  childId,
}: {
  termId: string;
  secondTermId?: string;
  frequency: 1 | 2;
  childId?: string;
}) {
  const params = new URLSearchParams();

  params.set("term", termId);
  params.set("frequency", String(frequency));

  if (frequency === 2 && secondTermId) {
    params.set("term2", secondTermId);
  }

  if (childId) {
    params.set("child", childId);
  }

  return `/prihlasenie?${params.toString()}`;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const termId = params.term;
  const secondTermId = params.term2;
  const childId = params.child;

  const frequency: 1 | 2 = params.frequency === "2" && secondTermId ? 2 : 1;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!termId) {
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        redirect("/admin");
      }

      redirect("/kurzy");
    }

    return (
      <main className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na domov
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            FEDDY
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Prihlásenie
          </h1>

          <p className="mt-3 text-slate-600">Prihláste sa do svojho účtu.</p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LoginForm />

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">Ešte nemáte účet?</p>

            <Link
              href="/registracia"
              className="mt-2 inline-block text-sm font-semibold text-[#009ee9] hover:text-[#0087c9]"
            >
              Vytvoriť účet
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const term = await getCourseTermById(termId);

  const secondTerm =
    frequency === 2 && secondTermId
      ? await getCourseTermById(secondTermId)
      : null;

  if (!term || (frequency === 2 && !secondTerm)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href="/kurzy"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na kurzy
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Termín neexistuje
          </h1>

          <p className="mt-3 text-slate-600">
            Jeden z vybraných termínov už nemusí byť dostupný.
          </p>

          <Link
            href="/kurzy"
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            Zobraziť kurzy
          </Link>
        </div>
      </main>
    );
  }

  if (
    frequency === 2 &&
    secondTerm &&
    secondTerm.courseTitle !== term.courseTitle
  ) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href="/kurzy"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na kurzy
        </Link>

        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-900">
            Neplatná kombinácia termínov
          </h1>

          <p className="mt-3 text-red-700">
            Vybrané termíny nepatria do rovnakého kurzu.
          </p>
        </div>
      </main>
    );
  }

  const firstTermAvailable =
    term.status === "available" && term.availableSpots > 0;

  const secondTermAvailable =
    frequency === 1 ||
    (!!secondTerm &&
      secondTerm.status === "available" &&
      secondTerm.availableSpots > 0);

  const isAvailable = firstTermAvailable && secondTermAvailable;

  const baseRegistrationUrl = buildRegistrationUrl({
    termId,
    secondTermId,
    frequency,
  });

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href="/kurzy"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na kurzy
        </Link>

        <div className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Prihlásenie na kurz
          </h1>

          <p className="mt-3 text-slate-600">
            Vybrali ste plávanie {frequency}× týždenne.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {frequency === 2 ? "Vybrané termíny" : "Vybraný termín"}
          </p>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-slate-950">
              {dayLabels[term.dayOfWeek]}
            </h2>

            <p className="mt-1 text-lg font-semibold text-sky-600">
              {term.startTime} – {term.endTime}
            </p>
          </div>

          {frequency === 2 && secondTerm && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <h2 className="text-xl font-bold text-slate-950">
                {dayLabels[secondTerm.dayOfWeek]}
              </h2>

              <p className="mt-1 text-lg font-semibold text-sky-600">
                {secondTerm.startTime} – {secondTerm.endTime}
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-xl font-bold text-slate-950">Prihlásenie</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Prihláste sa do svojho účtu a pokračujte v registrácii na kurz.
          </p>

          <div className="mt-6">
            <LoginForm
              termId={termId}
              secondTermId={secondTermId}
              frequency={frequency}
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Ešte nemáte účet?
          </p>

          <Link
            href={`/registracia?${new URLSearchParams({
              term: termId,
              frequency: String(frequency),
              ...(frequency === 2 && secondTermId
                ? { term2: secondTermId }
                : {}),
            }).toString()}`}
            className="mt-2 block text-center text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            Vytvoriť účet
          </Link>
        </section>
      </main>
    );
  }

  const children = await getChildren();

  const selectedChild = childId
    ? children.find((child) => child.id === childId)
    : undefined;

  const existingRegistrations =
    selectedChild && childId
      ? await Promise.all([
          getRegistrationForChildAndTerm({
            childId,
            courseTermId: termId,
          }),
          ...(frequency === 2 && secondTermId
            ? [
                getRegistrationForChildAndTerm({
                  childId,
                  courseTermId: secondTermId,
                }),
              ]
            : []),
        ])
      : [];

  const activeExistingRegistration = existingRegistrations.find(
    (registration) => registration && registration.status !== "cancelled",
  );

  const hasCancelledRegistration =
    !activeExistingRegistration &&
    existingRegistrations.some(
      (registration) => registration?.status === "cancelled",
    );
  const lessons =
    selectedChild && childId && activeExistingRegistration
      ? await getLessonsForChildRegistration(childId, [
          termId,
          ...(frequency === 2 && secondTermId ? [secondTermId] : []),
        ])
      : [];
  console.log("LESSONS DEBUG", {
    childId,
    frequency,
    termId,
    secondTermId,
    activeRegistration: activeExistingRegistration?.status,
    lessonsCount: lessons.length,
  });

  if (childId && !selectedChild) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href={baseRegistrationUrl}
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Späť na výber dieťaťa
        </Link>

        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-900">Dieťa sa nenašlo</h1>

          <p className="mt-3 text-sm leading-6 text-red-700">
            Vybrané dieťa neexistuje alebo nepatrí k vášmu účtu.
          </p>
        </div>
      </main>
    );
  }

  if (selectedChild) {
    const totalPrice =
      frequency === 2 ? term.coursePriceTwiceWeekly : term.coursePrice;

    return (
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href={baseRegistrationUrl}
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Zmeniť dieťa
        </Link>

        <div className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Kontrola prihlásenia
          </h1>

          <p className="mt-3 text-slate-600">
            Skontrolujte údaje pred pokračovaním.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Prihlasované dieťa
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {selectedChild.firstName} {selectedChild.lastName}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Narodenie:{" "}
            {new Date(selectedChild.dateOfBirth).toLocaleDateString("sk-SK")}
          </p>
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Kurz</p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            {term.courseTitle}
          </h2>

          <p className="mt-2 text-sm font-semibold text-sky-700">
            {frequency}× týždenne
          </p>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-slate-500">
              {frequency === 2 ? "1. termín" : "Vybraný termín"}
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-950">
              {dayLabels[term.dayOfWeek]}
            </h3>

            <p className="mt-1 text-lg font-semibold text-sky-600">
              {term.startTime} – {term.endTime}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {term.startDate} – {term.endDate}
            </p>
          </div>

          {frequency === 2 && secondTerm && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-sm font-medium text-slate-500">2. termín</p>

              <h3 className="mt-2 text-xl font-bold text-slate-950">
                {dayLabels[secondTerm.dayOfWeek]}
              </h3>

              <p className="mt-1 text-lg font-semibold text-sky-600">
                {secondTerm.startTime} – {secondTerm.endTime}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {secondTerm.startDate} – {secondTerm.endDate}
              </p>
            </div>
          )}
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Cena kurzu – {frequency}× týždenne
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950">
                {totalPrice} {term.courseCurrency}
              </p>
            </div>

            <div className="w-full sm:w-auto">
              {activeExistingRegistration ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                    <p className="font-semibold text-emerald-800">
                      {activeExistingRegistration.status === "completed"
                        ? "Kurz bol dokončený"
                        : "Dieťa je už prihlásené"}
                    </p>

                    <p className="mt-1 text-sm text-emerald-700">
                      Stav:{" "}
                      <span className="font-semibold">
                        {activeExistingRegistration.status === "pending"
                          ? "Čaká na potvrdenie"
                          : activeExistingRegistration.status === "confirmed"
                            ? "Potvrdená"
                            : "Dokončená"}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={baseRegistrationUrl}
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Vybrať iné dieťa
                  </Link>

                  {(activeExistingRegistration.status === "pending" ||
                    activeExistingRegistration.status === "confirmed") && (
                    <form
                      action={cancelOwnRegistration.bind(
                        null,
                        activeExistingRegistration.id,
                      )}
                    >
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                      >
                        Zrušiť prihlášku
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {hasCancelledRegistration && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                      <p className="font-semibold text-red-800">
                        Registrácia bola zrušená
                      </p>

                      <p className="mt-1 text-sm text-red-700">
                        Dieťa môžete znovu prihlásiť.
                      </p>
                    </div>
                  )}

                  {isAvailable && childId ? (
                    <RegistrationForm
                      childId={childId}
                      courseTermId={termId}
                      secondCourseTermId={
                        frequency === 2 ? secondTermId : undefined
                      }
                      frequency={frequency}
                    />
                  ) : (
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500">
                      Jeden z termínov je obsadený
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        {activeExistingRegistration &&
          (activeExistingRegistration.status === "pending" ||
            activeExistingRegistration.status === "confirmed") && (
            <LessonsList childId={childId!} lessons={lessons} />
          )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <Link
        href="/kurzy"
        className="text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        ← Späť na kurzy
      </Link>

      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Prihlásenie na kurz
        </h1>

        <p className="mt-3 text-slate-600">
          Vyberte dieťa, ktoré chcete prihlásiť na kurz.
        </p>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          {frequency === 2 ? "Vybrané termíny" : "Vybraný termín"}
        </p>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-slate-950">
            {dayLabels[term.dayOfWeek]}
          </h2>

          <p className="mt-1 text-lg font-semibold text-sky-600">
            {term.startTime} – {term.endTime}
          </p>
        </div>

        {frequency === 2 && secondTerm && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <h2 className="text-xl font-bold text-slate-950">
              {dayLabels[secondTerm.dayOfWeek]}
            </h2>

            <p className="mt-1 text-lg font-semibold text-sky-600">
              {secondTerm.startTime} – {secondTerm.endTime}
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        <h2 className="text-xl font-bold text-slate-950">Vyberte dieťa</h2>

        <p className="mt-2 text-sm text-slate-600">
          Ste prihlásený ako{" "}
          <span className="font-medium text-slate-900">{user.email}</span>
        </p>

        {children.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <h3 className="font-semibold text-slate-950">
              Zatiaľ nemáte pridané žiadne dieťa
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Najprv pridajte dieťa, ktoré chcete prihlásiť na kurz.
            </p>

            <div className="mt-6">
              <AddChildForm />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {child.firstName} {child.lastName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Narodenie:{" "}
                        {new Date(child.dateOfBirth).toLocaleDateString(
                          "sk-SK",
                        )}
                      </p>
                    </div>

                    <Link
                      href={buildRegistrationUrl({
                        termId,
                        secondTermId,
                        frequency,
                        childId: child.id,
                      })}
                      className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                    >
                      Vybrať dieťa
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-950">
                Pridať ďalšie dieťa
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Ak chcete prihlásiť ďalšie dieťa, môžete ho pridať do svojho
                účtu.
              </p>

              <div className="mt-6">
                <AddChildForm />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
