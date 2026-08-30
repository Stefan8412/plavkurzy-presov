import Link from "next/link";

const groupCourses = [
  {
    title: "Plávanie pre deti 3–4 roky",
    schedule: "pondelok 17:00 · utorok 16:30 · štvrtok 17:00",
    prices: [
      { label: "1× týždenne", price: "230 €" },
      { label: "2× týždenne", price: "430 €" },
    ],
  },
  {
    title: "Skupinové plávanie 4–10 rokov",
    schedule:
      "pondelok 17:00 · utorok 16:30 · streda 18:00 · štvrtok 17:00 · piatok 18:00",
    prices: [
      { label: "1× týždenne", price: "210 €" },
      { label: "2× týždenne", price: "400 €" },
    ],
  },
  {
    title: "Kondičné plávanie od 10 rokov",
    schedule: "utorok 16:30 · streda 18:00 · piatok 18:00",
    prices: [
      { label: "1× týždenne", price: "195 €" },
      { label: "2× týždenne", price: "380 €" },
    ],
  },
];

export default function PricePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#eefaff]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            FEDDY plavecká škola
          </p>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#071b55] md:text-6xl">
            Cenník
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Prehľad aktuálne zverejnených cien plaveckých kurzov, individuálnych
            hodín a ďalších aktivít.
          </p>
        </div>
      </section>

      {/* Group courses */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Aquapark Delňa
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Skupinové kurzy
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Jesenný kurz 2026/2027
            </p>

            <p className="mt-2 font-semibold text-[#071b55]">
              21. 9. 2026 – 22. 1. 2027
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {groupCourses.map((course) => (
              <article
                key={course.title}
                className="flex flex-col rounded-3xl border border-sky-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex-1">
                  <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#009ee9]">
                    Skupinový kurz
                  </span>

                  <h3 className="mt-5 text-2xl font-bold text-[#071b55]">
                    {course.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {course.schedule}
                  </p>

                  <div className="mt-7 space-y-3">
                    {course.prices.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                      >
                        <span className="text-sm font-semibold text-slate-600">
                          {item.label}
                        </span>

                        <span className="text-xl font-extrabold text-[#071b55]">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/kurzy"
                  className="mt-7 inline-flex items-center justify-center rounded-full bg-[#009ee9] px-5 py-3 font-bold text-white transition hover:bg-[#0087c9]"
                >
                  Vybrať kurz
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-2xl bg-sky-50 px-5 py-4 text-sm leading-6 text-slate-600">
            Uvedené sumy sú členské príspevky za celý kurz v období od 21. 9.
            2026 do 22. 1. 2027, nie cena za jednu lekciu.
          </p>
        </div>
      </section>

      {/* Individual lessons */}
      <section className="bg-[#071b55] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#38bdf8]">
              Individuálne hodiny
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Hodiny jeden na jedného
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-sky-100/75">
              Individuálny prístup pre plavcov, ktorí sa chcú zlepšovať vlastným
              tempom.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-[#38bdf8]">
                Jedna hodina
              </p>

              <h3 className="mt-4 text-2xl font-bold">Individuálna hodina</h3>

              <p className="mt-3 text-sky-100/70">
                60 minút s trénerom · 1 osoba
              </p>

              <p className="mt-7 text-5xl font-extrabold">28 €</p>

              <p className="mt-5 text-sm leading-6 text-sky-100/65">
                Cena nezahŕňa vstup účastníka do bazéna. Výučba prebieha na
                bazéne ZŠ Májové námestie alebo v Aquaparku Delňa.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-[#38bdf8]">
                Výhodný balík
              </p>

              <h3 className="mt-4 text-2xl font-bold">Balík 10 hodín</h3>

              <p className="mt-3 text-sky-100/70">dlhodobá akcia · 1 osoba</p>

              <p className="mt-7 text-5xl font-extrabold">230 €</p>

              <p className="mt-5 text-sm leading-6 text-sky-100/65">
                Objednáva sa e-mailom. Napíšte nám, pre koho sú hodiny určené,
                aké má plavec skúsenosti a aké časy vám vyhovujú.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/kontakt"
              className="inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#071b55] transition hover:bg-sky-50"
            >
              Kontaktovať nás
            </Link>
          </div>
        </div>
      </section>

      {/* Other offers */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#009ee9]">
                Denný plavecký tábor
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#071b55]">
                185 € za turnus
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Cena leta 2026 pre deti 4–14 rokov. Zahŕňa vstup do aquaparku,
                plavecký výcvik, celodenný program, stravu a odborný dohľad
                trénerov.
              </p>

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Turnusy 2026 sú ukončené.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#009ee9]">
                Materské a základné školy
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#071b55]">
                Cenová ponuka na mieru
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Plavecké výcviky pre MŠ a ZŠ pripravujeme v rozsahu 5 alebo 10
                vyučovacích hodín. Termíny a cenu pripravíme podľa vašich
                požiadaviek.
              </p>

              <Link
                href="/kontakt"
                className="mt-6 inline-flex font-bold text-[#009ee9]"
              >
                Vyžiadať ponuku →
              </Link>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#009ee9]">
                SPŠ Strojnícka
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#071b55]">
                Kurzy na školskom bazéne
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Aktuálnu dostupnosť kurzov, termíny a ceny si overte
                telefonicky.
              </p>

              <a
                href="tel:+421902575215"
                className="mt-6 inline-flex font-bold text-[#009ee9]"
              >
                0902 575 215
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* 2 percent discount */}
      <section className="bg-[#eefaff] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-8 rounded-[2rem] bg-white p-8 shadow-sm md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
                Zľava
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#071b55] md:text-4xl">
                Darujte nám 2 % z dane a získate zľavu 10 €
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Zľavu 10 € môžete uplatniť na plavecký kurz, plavecký tábor aj
                individuálne hodiny plávania.
              </p>
            </div>

            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#fbbf24] text-center text-3xl font-extrabold text-[#071b55]">
              -10 €
            </div>
          </div>
        </div>
      </section>

      {/* Good to know */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
            <h2 className="text-3xl font-bold text-[#071b55]">Dobré vedieť</h2>

            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                ✓ Sumy pri skupinových kurzoch sú členské príspevky za celý
                kurz, nie za jednu lekciu.
              </p>

              <p>
                ✓ Cena individuálnej hodiny nezahŕňa vstup účastníka do bazéna.
              </p>

              <p>
                ✓ Tábor je možné financovať aj prostredníctvom rekreačného
                poukazu.
              </p>

              <p>
                ✓ Nie ste si istí, ktorý kurz vybrať? Zavolajte nám na{" "}
                <a
                  href="tel:+421902575215"
                  className="font-bold text-[#009ee9]"
                >
                  0902 575 215
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#009ee9] px-8 py-16 text-center text-white md:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
            Máte vybraté?
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Prihláste dieťa na plavecký kurz
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-50">
            Vyberte si kurz a následne konkrétny termín, ktorý vám vyhovuje.
          </p>

          <Link
            href="/kurzy"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-4 font-bold text-[#071b55] transition hover:bg-sky-50"
          >
            Vybrať kurz
          </Link>
        </div>
      </section>
    </main>
  );
}
