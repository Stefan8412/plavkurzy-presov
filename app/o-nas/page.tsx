import Image from "next/image";
import Link from "next/link";

const trainers = [
  {
    name: "Ing. Ivana Fedáková",
    qualification: "Tréner I. kvalifikačného stupňa — plávanie",
    image: "/images/ivana.webp",
  },
  {
    name: "Ing. Jozef Fedák",
    qualification: "Tréner I. kvalifikačného stupňa — plávanie",
    image: "/images/jozef.webp",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#eefaff]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              O nás
            </p>

            <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#071b55] md:text-6xl">
              Za školou stojíme my,
              <span className="block text-[#009ee9]">
                manželia Ivana a Jozef
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Spojili sme lásku k deťom, športu a vode. Plaveckú školu FEDDY
              tvoríme ako miesto, kde sa deti učia plávať bezpečne, s istotou a
              najmä s radosťou.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kurzy"
                className="rounded-full bg-[#009ee9] px-7 py-4 font-bold text-white transition hover:bg-[#0087c9]"
              >
                Pozrieť kurzy
              </Link>

              <Link
                href="/kontakt"
                className="rounded-full border border-[#071b55]/15 bg-white px-7 py-4 font-bold text-[#071b55] transition hover:border-[#009ee9] hover:text-[#009ee9]"
              >
                Kontaktovať nás
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#fbbf24]/30 blur-2xl" />
            <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-[#009ee9]/20 blur-3xl" />

            <div className="relative grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sky-100 shadow-xl">
                <Image
                  src="/images/ivana.webp"
                  alt="Ing. Ivana Fedáková"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[2rem] bg-sky-100 shadow-xl">
                <Image
                  src="/images/jozef.webp"
                  alt="Ing. Jozef Fedák"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#fbbf24] px-5 py-3 text-sm font-bold text-[#071b55] shadow-lg">
              Ivana & Jozef
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Náš príbeh
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Rodina, pohyb a voda
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-slate-600">
            <p>
              Sme rodičmi troch detí —{" "}
              <strong className="font-semibold text-[#071b55]">
                Adama, Dorky a Kamilky
              </strong>
              . Sú pre nás každodennou inšpiráciou a motiváciou, aby sme deťom
              odovzdávali to najlepšie.
            </p>

            <p>
              Plavecká škola FEDDY je miesto, kde deti objavujú radosť z vody,
              učia sa plávať s istotou a rozvíjajú zdravý vzťah k pohybu.
            </p>

            <p>
              Naše tréningy a kurzy vedieme odborne, hravo a vždy s dôrazom na
              bezpečie každého dieťaťa.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#071b55] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#38bdf8]">
              Na čom nám záleží
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Plávanie, ktoré má zmysel
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009ee9]/20 text-xl font-bold text-[#38bdf8]">
                01
              </div>

              <h3 className="mt-5 text-xl font-bold">Odborný prístup</h3>

              <p className="mt-3 leading-7 text-sky-100/70">
                Tréningy vedieme systematicky a podľa veku, skúseností a
                schopností každého plavca.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009ee9]/20 text-xl font-bold text-[#38bdf8]">
                02
              </div>

              <h3 className="mt-5 text-xl font-bold">Hravosť</h3>

              <p className="mt-3 leading-7 text-sky-100/70">
                Deti sa najlepšie učia vtedy, keď ich pohyb baví. Preto
                prepájame výučbu plávania s hrou a prirodzeným objavovaním.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009ee9]/20 text-xl font-bold text-[#38bdf8]">
                03
              </div>

              <h3 className="mt-5 text-xl font-bold">Bezpečie</h3>

              <p className="mt-3 leading-7 text-sky-100/70">
                Bezpečnosť vo vode je základom každého kurzu a zároveň dôležitou
                súčasťou budovania sebavedomia dieťaťa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Čo ponúkame
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Plávanie pre deti aj školy
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Ponúkame kurzy pre jednotlivcov aj skupiny, plavecký výcvik pre
              škôlky aj plavecké kurzy pre školy, aby si deti od malička
              vybudovali pozitívny vzťah k vode.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Skupinové plavecké kurzy",
              "Individuálne hodiny",
              "Plavecký výcvik pre škôlky",
              "Plavecké kurzy pre školy",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-sky-100 bg-[#f8fdff] p-6"
              >
                <div className="mb-4 text-2xl text-[#009ee9]">✓</div>

                <h3 className="font-bold text-[#071b55]">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="bg-[#eefaff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
              Tréneri
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
              Spoznajte nás
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              FEDDY vedieme osobne a s rovnakým prístupom, aký by sme chceli aj
              pre vlastné deti.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            {trainers.map((trainer) => (
              <article
                key={trainer.name}
                className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-sky-100">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-bold text-[#071b55]">
                    {trainer.name}
                  </h3>

                  <p className="mt-2 font-semibold leading-6 text-[#009ee9]">
                    {trainer.qualification}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#009ee9] px-8 py-16 text-center text-white md:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
            FEDDY plavecká škola
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Príďte objaviť radosť z vody
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-50">
            Vyberte kurz podľa veku a skúseností a nájdite vhodný termín.
          </p>

          <Link
            href="/kurzy"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-4 font-bold text-[#071b55] transition hover:bg-sky-50"
          >
            Pozrieť kurzy
          </Link>
        </div>
      </section>
    </main>
  );
}
