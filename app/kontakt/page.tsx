import Link from "next/link";
import ContactForm from "./ContactForm";

const locations = [
  {
    name: "Aquapark Delňa",
    description: "Skupinové plavecké kurzy a vybrané individuálne hodiny.",
  },
  {
    name: "ZŠ Májové námestie",
    description:
      "Individuálne plavecké hodiny a výučba podľa aktuálnej ponuky.",
  },
  {
    name: "SPŠ Strojnícka",
    description: "Kurzy na školskom bazéne podľa aktuálnej dostupnosti.",
  },
];

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#eefaff]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            FEDDY plavecká škola
          </p>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#071b55] md:text-6xl">
            Kontakt
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Máte otázku ku kurzu, termínu alebo neviete, ktorú skupinu vybrať?
            Ozvite sa nám.
          </p>
        </div>
      </section>

      {/* Main contact */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Sme tu pre vás
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Ozvite sa nám
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              Radi vám poradíme s výberom kurzu, vhodnou úrovňou alebo aktuálnym
              termínom plávania.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href="tel:+421902575215"
                className="group flex items-center gap-5 rounded-3xl border border-sky-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
                  ☎
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Telefón
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#071b55] transition group-hover:text-[#009ee9]">
                    0902 575 215
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-5 rounded-3xl border border-sky-100 bg-white p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
                  ✉
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">E-mail</p>

                  <p className="mt-1 font-bold text-[#071b55]">
                    plavaniepo@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-[#071b55] p-7 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#38bdf8]">
                Neviete, ktorý kurz vybrať?
              </p>

              <h3 className="mt-3 text-2xl font-bold">Radi vám poradíme.</h3>

              <p className="mt-3 leading-7 text-sky-100/75">
                Povedzte nám vek plavca a jeho skúsenosti s vodou. Pomôžeme vám
                vybrať vhodný kurz.
              </p>

              <Link
                href="/kurzy"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-bold text-[#071b55] transition hover:bg-sky-50"
              >
                Pozrieť kurzy
              </Link>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-[2rem] border border-sky-100 bg-white p-7 shadow-sm md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Napíšte nám
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#071b55]">
              Kontaktný formulár
            </h2>

            <p className="mt-3 text-slate-600">
              Napíšte nám správu a ozveme sa vám čo najskôr.
            </p>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-[#eefaff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Kde plávame
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Naše lokality
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Kurzy a individuálne hodiny prebiehajú na viacerých plaveckých
              prevádzkach v Prešove.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {locations.map((location) => (
              <article
                key={location.name}
                className="rounded-3xl border border-sky-100 bg-white p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl">
                  📍
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#071b55]">
                  {location.name}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {location.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ mini section */}
      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Najčastejšie otázky
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Pred prvou hodinou
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Kliknite na otázku a zobrazí sa odpoveď.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Od koľkých rokov môže dieťa začať?</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  Skupinové kurzy začíname od 3 rokov. Najmenšie deti majú
                  vlastný kurz zameraný na zoznámenie s vodou, kde ide
                  predovšetkým o to, aby sa dieťa vo vode cítilo bezpečne a
                  získalo k nej pozitívny vzťah.
                </p>
              </div>
            </details>

            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Čo ak sa moje dieťa vody bojí?</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  To je úplne bežné a nie je to prekážka. Postupujeme citlivo a
                  rešpektujeme tempo každého dieťaťa – od zvykania si na vodu
                  cez ponáranie až po prvé samostatné metre. Traja naši tréneri
                  majú navyše špecializáciu na výučbu plávania detí so
                  zdravotným znevýhodnením.
                </p>
              </div>
            </details>

            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Ako rozdeľujete deti do skupín?</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  Deti rozdeľujeme podľa ich skutočnej plaveckej úrovne, nielen
                  podľa veku. Kurz pre deti od 4 do 10 rokov je určený úplným
                  začiatočníkom aj deťom, ktoré už vo vode zvládajú základné
                  plavecké prvky.
                </p>
              </div>
            </details>

            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Čo si má dieťa priniesť na lekciu?</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  Plavky (u chlapcov nie sú vhodné bermudy), šľapky k bazénu,
                  uterák a plavecké okuliare. Plavecká čiapka nie je povinná.
                </p>
              </div>
            </details>

            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Ako dlho trvá jedna lekcia?</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  Samotný program v bazéne tvorí 45 minút výučby a približne 5
                  minút hier vo vode. Pred vstupom do bazéna počítajte ešte s
                  5–10 minútami rozcvičky a následne so sprchou.
                </p>
              </div>
            </details>

            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Neviem, do ktorej skupiny dieťa patrí.</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  Kontaktujte nás. Podľa veku a doterajších skúseností s vodou
                  vám odporučíme vhodnú skupinu.
                </p>
              </div>
            </details>

            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Ako sa môžem prihlásiť?</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  Na stránke Kurzy si vyberiete kurz, konkrétny termín a
                  následne prihlásite dieťa cez svoj účet.
                </p>
              </div>
            </details>

            <details className="group rounded-3xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-bold text-[#071b55]">
                <span>Ponúkate aj individuálne hodiny?</span>
                <span className="text-2xl font-light text-[#009ee9] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                <p className="leading-7 text-slate-600">
                  Áno. Individuálne hodiny je možné dohodnúť podľa dostupnosti
                  trénera a bazéna.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#009ee9] px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Chcete začať plávať?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg text-sky-50">
            Pozrite si aktuálne kurzy a vyberte si termín, ktorý vám najviac
            vyhovuje.
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
