import Link from "next/link";

export default function SummerCampPage() {
  return (
    <main>
      <section className="bg-sky-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Leto s FEDDY
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Denný letný plavecký tábor
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Týždeň plný plávania, pohybu, zábavy a nových kamarátstiev. Deti
              čaká pestrý program pod vedením skúsených inštruktorov v bezpečnom
              a príjemnom prostredí.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/letny-tabor/registracia"
                className="rounded-full bg-[#009ee9] px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Prihlásiť dieťa
              </Link>

              <a
                href="#informacie"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Viac informácií
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="informacie" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Termín
            </p>

            <h2 className="mt-3 text-xl font-bold text-slate-950">
              Júl a august
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Vyberiete si konkrétny týždenný turnus podľa dostupnosti.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Trvanie
            </p>

            <h2 className="mt-3 text-xl font-bold text-slate-950">5 dní</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Denný tábor prebieha počas pracovného týždňa.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Cena
            </p>

            <h2 className="mt-3 text-xl font-bold text-slate-950">od 185 €</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Detská porcia 185 €, dospelá porcia 195 €.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Kapacita
            </p>

            <h2 className="mt-3 text-xl font-bold text-slate-950">
              Max. 50 detí
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Kapacita sa eviduje samostatne pre každý turnus.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-3xl bg-slate-50 p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              O tábore
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Leto plné pohybu a zážitkov
            </h2>

            <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">
              <p>
                Letný plavecký tábor je určený pre deti, ktoré sa chcú naučiť
                plávať, zlepšiť svoje plavecké zručnosti alebo si jednoducho
                užiť leto plné pohybu a zábavy.
              </p>

              <p>
                Pod vedením skúsených inštruktorov čaká na deti pestrý program
                plný športových aj oddychových aktivít.
              </p>

              <p>
                Pri prihlasovaní si rodič vyberie konkrétny turnus, veľkosť
                trička a veľkosť obedovej porcie. Je možné uviesť aj informácie
                o liekoch, alergiách a údaje potrebné na uplatnenie rekreačného
                poukazu.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-[#071b55] p-8 text-center text-white sm:p-10">
            <h2 className="text-3xl font-bold">
              Tešíme sa na každého malého plavca
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-200">
              Vyberte si dostupný letný turnus a prihláste svoje dieťa
              jednoducho online.
            </p>

            <Link
              href="/letny-tabor/registracia"
              className="mt-7 inline-flex rounded-full bg-[#009ee9] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Prihlásiť dieťa na tábor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
