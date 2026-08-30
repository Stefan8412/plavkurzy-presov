import Link from "next/link";

const includedItems = [
  {
    title: "5-dňový plavecký výcvik",
    description:
      "Výcvik v rozsahu 5 alebo 10 vyučovacích hodín. Presný rozsah dohodneme podľa veku a počtu detí.",
  },
  {
    title: "Kvalifikovaní inštruktori",
    description:
      "Tréneri I. kvalifikačného stupňa v špecializácii plávanie v zmysle Zákona o športe.",
  },
  {
    title: "Tréner je s deťmi vo vode",
    description:
      "Tréner neučí od okraja bazéna. Počas výučby je vo vode spolu s deťmi.",
  },
  {
    title: "Rozdelenie detí podľa úrovne",
    description:
      "Deti rozdeľujeme podľa toho, čo vo vode naozaj zvládajú. Neplavec nezaostáva a plavec sa nenudí.",
  },
  {
    title: "Vstup do bazéna v cene",
    description: "Vstup do bazéna je súčasťou ceny plaveckého výcviku.",
  },
  {
    title: "Plavecké pomôcky",
    description:
      "Dosky, plávacie tyče a ďalšie potrebné pomôcky zabezpečujeme my.",
  },
  {
    title: "Diplom pre každé dieťa",
    description: "Každé dieťa dostane na konci výcviku diplom za absolvovanie.",
  },
  {
    title: "Medaila a odmena",
    description:
      "K diplomu patrí medaila a na záver čaká deti aj malá sladká odmena.",
  },
];

const reasons = [
  {
    number: "01",
    title: "Registrovaný partner SAŠPV",
    description:
      "Sme registrovaným partnerom Slovenskej asociácie poskytovateľov a podporovateľov školských plaveckých výcvikov.",
  },
  {
    number: "02",
    title: "Metodika SWIMM2",
    description:
      "Naši tréneri absolvovali školenie SWIMM2 – Inovatívne plavecké výcviky žiakov ZŠ – aj kurz Budem plavcom.",
  },
  {
    number: "03",
    title: "Špecializovaná kvalifikácia",
    description:
      "Máme skúsenosti a odborné školenie aj pre prácu s deťmi so zdravotným znevýhodnením.",
  },
  {
    number: "04",
    title: "Kvalifikovaní tréneri",
    description:
      "Ing. Ivana Fedáková aj Ing. Jozef Fedák sú tréneri I. kvalifikačného stupňa v špecializácii plávanie.",
  },
];

const steps = [
  {
    number: "01",
    title: "Napíšete nám základné údaje",
    description:
      "Potrebujeme vedieť rozsah výcviku, počet a vek detí, názov školy alebo škôlky a kontakt na vás.",
  },
  {
    number: "02",
    title: "Pripravíme nezáväznú ponuku",
    description:
      "Podľa vašich požiadaviek pripravíme cenovú ponuku a bližšie informácie o možnostiach výcviku.",
  },
  {
    number: "03",
    title: "Dohodneme termíny",
    description: "Spoločne nastavíme vhodné termíny a organizačné detaily.",
  },
  {
    number: "04",
    title: "Začíname plávať",
    description:
      "Výcvik vedú naši kvalifikovaní tréneri, ktorí sú počas výučby s deťmi vo vode.",
  },
];

const faq = [
  {
    question: "Koľko hodín má plavecký výcvik?",
    answer:
      "Pripravujeme výcviky v rozsahu 5 alebo 10 vyučovacích hodín. Rozsah dohodneme podľa veku detí a cieľov výcviku.",
  },
  {
    question: "Musia deti vedieť plávať?",
    answer:
      "Nie. Deti rozdeľujeme podľa ich reálnych schopností vo vode – od úplných neplavcov až po deti, ktoré si zdokonaľujú techniku.",
  },
  {
    question: "Koľko výcvik stojí?",
    answer:
      "Cena sa pripravuje individuálne podľa počtu detí, rozsahu výcviku a ďalších požiadaviek školy alebo škôlky.",
  },
  {
    question: "Kto vedie výcvik?",
    answer:
      "Výcvik vedú kvalifikovaní tréneri Plaveckej školy FEDDY. Ivana aj Jozef Fedákovci sú tréneri I. kvalifikačného stupňa v špecializácii plávanie.",
  },
];

export default function SchoolsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#eefaff]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Pre materské a základné školy
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-extrabold tracking-tight text-[#071b55] md:text-6xl">
            Plavecký výcvik pre škôlky a školy v Prešove
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Učíme plávať celé triedy materských a základných škôl. Výcvik vedú
            kvalifikovaní tréneri, ktorí sú počas výučby spolu s deťmi vo vode.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/kontakt"
              className="rounded-full bg-[#009ee9] px-7 py-4 font-bold text-white transition hover:bg-[#0087c9]"
            >
              Vyžiadať nezáväznú ponuku
            </Link>

            <a
              href="tel:+421902575215"
              className="rounded-full border border-[#071b55]/15 bg-white px-7 py-4 font-bold text-[#071b55] transition hover:border-[#009ee9] hover:text-[#009ee9]"
            >
              0902 575 215
            </a>
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Čo dostanete
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Čo je súčasťou plaveckého výcviku
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {includedItems.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-sky-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 font-bold text-[#009ee9]">
                  ✓
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#071b55]">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Feddy */}
      <section className="bg-[#071b55] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#38bdf8]">
              Prečo FEDDY
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Prečo zveriť plavecký výcvik triedy práve nám
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-sky-100/75">
              Školský plavecký výcvik je organizačne náročný. Preto staviame na
              odbornosti, jasnej metodike a bezpečnom prístupe.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {reasons.map((reason) => (
              <article
                key={reason.number}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <span className="text-4xl font-extrabold text-[#38bdf8]/30">
                  {reason.number}
                </span>

                <h3 className="mt-4 text-2xl font-bold">{reason.title}</h3>

                <p className="mt-3 leading-7 text-sky-100/70">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Ako to funguje
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Od prvého kontaktu po prvú hodinu vo vode
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="text-5xl font-extrabold text-[#009ee9]/15">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-bold text-[#071b55]">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer */}
      <section className="bg-[#eefaff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 rounded-[2rem] bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
                Nezáväzná ponuka
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
                Pripravíme vám ponuku na mieru
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-slate-600">
                Podľa vašich požiadaviek pripravíme nezáväznú cenovú ponuku
                plaveckého výcviku.
              </p>

              <div className="mt-8 space-y-3 text-slate-600">
                <p>✓ rozsah výcviku – 5 alebo 10 hodín</p>
                <p>✓ počet účastníkov</p>
                <p>✓ vek detí</p>
                <p>✓ názov školy alebo škôlky</p>
                <p>✓ kontaktná osoba</p>
                <p>✓ e-mail a telefón</p>
              </div>
            </div>

            <div className="rounded-3xl bg-[#071b55] p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#38bdf8]">
                Kontakt
              </p>

              <a
                href="tel:+421902575215"
                className="mt-5 block text-2xl font-bold transition hover:text-[#38bdf8]"
              >
                0902 575 215
              </a>

              <a
                href="mailto:plavaniepo@gmail.com"
                className="mt-3 block text-lg font-semibold text-sky-100 transition hover:text-white"
              >
                plavaniepo@gmail.com
              </a>

              <p className="mt-6 leading-7 text-sky-100/70">
                Pošlite nám základné informácie o vašej skupine a ozveme sa vám
                s návrhom ďalšieho postupu.
              </p>

              <a
                href="mailto:plavaniepo@gmail.com?subject=Žiadosť o cenovú ponuku – plavecký výcvik"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#071b55] transition hover:bg-sky-50"
              >
                Napísať e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Časté otázky
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Otázky učiteľov a riaditeliek
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faq.map((item) => (
              <article
                key={item.question}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-bold text-[#071b55]">
                  {item.question}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#009ee9] px-8 py-16 text-center text-white md:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
            Plavecký výcvik pre vašu triedu
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Pripravíme výcvik na mieru vašej škole
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-50">
            Napíšte nám počet a vek detí a požadovaný rozsah výcviku. Nezáväznú
            ponuku vám pripravíme individuálne.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:plavaniepo@gmail.com?subject=Žiadosť o cenovú ponuku – plavecký výcvik"
              className="rounded-full bg-white px-7 py-4 font-bold text-[#071b55] transition hover:bg-sky-50"
            >
              Vyžiadať ponuku
            </a>

            <a
              href="tel:+421902575215"
              className="rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
            >
              0902 575 215
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
