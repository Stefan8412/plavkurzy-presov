import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Obchodné podmienky | Plavecká škola FEDDY",
  description:
    "Obchodné podmienky pre registráciu a účasť na kurzoch Plaveckej školy FEDDY.",
};

export default function TermsPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            FEDDY
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55] sm:text-5xl">
            Obchodné podmienky
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-slate-600">
            Podmienky registrácie, platby a účasti na plaveckých kurzoch
            Plaveckej školy FEDDY.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
        <div className="space-y-10 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              1. Prevádzkovateľ
            </h2>

            <div className="mt-4 leading-7">
              <p>
                Prevádzkovateľom Plaveckej školy FEDDY a webovej stránky
                plavaniepresov.sk je:
              </p>

              <p className="mt-3">
                <strong>FEDDY IT, o. z.</strong>
                <br />
                Kukučínova 867/47
                <br />
                080 05 Prešov
                <br />
                IČO: 51251051
                <br />
                E-mail:{" "}
                <a
                  href="mailto:plavaniepo@gmail.com"
                  className="font-medium text-[#009ee9] hover:underline"
                >
                  plavaniepo@gmail.com
                </a>
                <br />
                Telefón:{" "}
                <a
                  href="tel:+421902575215"
                  className="font-medium text-[#009ee9] hover:underline"
                >
                  0902 575 215
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              2. Predmet obchodných podmienok
            </h2>

            <p className="mt-4 leading-7">
              Tieto obchodné podmienky upravujú vzťah medzi FEDDY IT, o. z. a
              osobou, ktorá prostredníctvom webovej stránky alebo iným
              dohodnutým spôsobom prihlási seba alebo dieťa na plavecký kurz
              organizovaný Plaveckou školou FEDDY.
            </p>

            <p className="mt-4 leading-7">
              Odoslaním registrácie záujemca potvrdzuje, že sa oboznámil s
              týmito obchodnými podmienkami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              3. Registrácia na kurz
            </h2>

            <p className="mt-4 leading-7">
              Registrácia na kurz prebieha prostredníctvom webovej stránky
              plavaniepresov.sk. Pri registrácii si rodič alebo účastník vyberá
              kurz, frekvenciu a dostupný termín alebo termíny.
            </p>

            <p className="mt-4 leading-7">
              Pri registrácii dieťaťa je potrebné uviesť pravdivé a aktuálne
              údaje potrebné na jeho zaradenie do kurzu.
            </p>

            <p className="mt-4 leading-7">
              Dostupnosť jednotlivých termínov závisí od ich kapacity.
              Prevádzkovateľ si vyhradzuje právo registráciu odmietnuť alebo
              navrhnúť iný termín, ak nie je možné zabezpečiť účasť vo vybranej
              skupine.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">4. Cena kurzu</h2>

            <p className="mt-4 leading-7">
              Cena kurzu je uvedená na webovej stránke pri príslušnom kurze.
              Cena závisí od typu kurzu a zvolenej frekvencie účasti.
            </p>

            <p className="mt-4 leading-7">
              Cena platná v okamihu registrácie je cenou, ktorú účastník uhrádza
              za zvolený kurz, pokiaľ sa s prevádzkovateľom nedohodne inak.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              5. Platobné podmienky
            </h2>

            <p className="mt-4 leading-7">
              Platbu za kurz je možné vykonať spôsobom dostupným na webovej
              stránke. Online platby sú spracúvané prostredníctvom platobnej
              brány Comgate.
            </p>

            <p className="mt-4 leading-7">
              Platba sa považuje za uhradenú po úspešnom potvrdení platby
              platobnou bránou a jej zaevidovaní v systéme Plaveckej školy
              FEDDY.
            </p>

            <p className="mt-4 leading-7">
              Prevádzkovateľ nespracúva ani neuchováva kompletné údaje
              platobných kariet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              6. Zrušenie registrácie pred začiatkom kurzu
            </h2>

            <p className="mt-4 leading-7">
              Účastník alebo zákonný zástupca môže požiadať o zrušenie
              registrácie pred začiatkom príslušného kurzu.
            </p>

            <p className="mt-4 leading-7">
              <strong>
                Pri zrušení registrácie pred začiatkom kurzu bude už uhradená
                cena kurzu vrátená.
              </strong>
            </p>

            <p className="mt-4 leading-7">
              Žiadosť o zrušenie je potrebné oznámiť prevádzkovateľovi
              preukázateľným spôsobom, napríklad e-mailom na{" "}
              <a
                href="mailto:plavaniepo@gmail.com"
                className="font-medium text-[#009ee9] hover:underline"
              >
                plavaniepo@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              7. Zrušenie registrácie po začiatku kurzu
            </h2>

            <p className="mt-4 leading-7">
              <strong>
                Po začiatku kurzu sa uhradená cena kurzu pri zrušení registrácie
                zo strany účastníka alebo zákonného zástupcu nevracia.
              </strong>
            </p>

            <p className="mt-4 leading-7">
              Za začiatok kurzu sa považuje dátum začiatku zvoleného kurzu
              uvedený pri registrácii, bez ohľadu na to, či sa účastník prvej
              lekcie osobne zúčastnil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              8. Neúčasť na lekcii
            </h2>

            <p className="mt-4 leading-7">
              Ak sa účastník nemôže zúčastniť konkrétnej lekcie, môže svoju
              neúčasť oznámiť prostredníctvom používateľského účtu, ak je táto
              možnosť pri kurze dostupná.
            </p>

            <p className="mt-4 leading-7">
              Samotná neúčasť alebo odhlásenie z jednotlivej lekcie nezakladá
              nárok na vrátenie pomernej časti ceny kurzu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              9. Zmeny a zrušenie zo strany organizátora
            </h2>

            <p className="mt-4 leading-7">
              Plavecká škola FEDDY si vyhradzuje právo z organizačných,
              prevádzkových, bezpečnostných alebo iných závažných dôvodov
              upraviť harmonogram, miesto konania alebo trénera.
            </p>

            <p className="mt-4 leading-7">
              Ak dôjde k zrušeniu kurzu zo strany organizátora a kurz nebude
              možné uskutočniť, prevádzkovateľ sa s dotknutými účastníkmi
              dohodne na primeranom riešení, napríklad na náhradnom termíne
              alebo vrátení príslušnej platby.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              10. Zdravotný stav a bezpečnosť
            </h2>

            <p className="mt-4 leading-7">
              Rodič alebo zákonný zástupca zodpovedá za to, že zdravotný stav
              dieťaťa umožňuje jeho účasť na plaveckom kurze. Dospelý účastník
              zodpovedá za posúdenie vlastného zdravotného stavu.
            </p>

            <p className="mt-4 leading-7">
              O okolnostiach, ktoré môžu mať význam pre bezpečný priebeh
              plávania, je potrebné informovať Plaveckú školu FEDDY vopred.
            </p>

            <p className="mt-4 leading-7">
              Účastníci sú povinní dodržiavať pokyny trénerov, pravidlá
              bezpečnosti a prevádzkový poriadok zariadenia, v ktorom kurz
              prebieha.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              11. Zodpovednosť za osobné veci
            </h2>

            <p className="mt-4 leading-7">
              Účastníkom odporúčame nenosiť na kurz cennosti a nenechávať ich
              bez dozoru. Za stratu alebo poškodenie osobných vecí
              prevádzkovateľ zodpovedá iba v rozsahu stanovenom príslušnými
              právnymi predpismi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              12. Ochrana osobných údajov
            </h2>

            <p className="mt-4 leading-7">
              Informácie o spracúvaní osobných údajov sú uvedené v samostatnom
              dokumente{" "}
              <Link
                href="/ochrana-osobnych-udajov"
                className="font-medium text-[#009ee9] hover:underline"
              >
                Ochrana osobných údajov
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              13. Reklamácie a komunikácia
            </h2>

            <p className="mt-4 leading-7">
              Otázky, podnety alebo reklamácie týkajúce sa kurzu je možné zaslať
              na e-mail{" "}
              <a
                href="mailto:plavaniepo@gmail.com"
                className="font-medium text-[#009ee9] hover:underline"
              >
                plavaniepo@gmail.com
              </a>{" "}
              alebo riešiť telefonicky na čísle{" "}
              <a
                href="tel:+421902575215"
                className="font-medium text-[#009ee9] hover:underline"
              >
                0902 575 215
              </a>
              .
            </p>

            <p className="mt-4 leading-7">
              Prevádzkovateľ sa bude snažiť každý podnet alebo reklamáciu
              vyriešiť bez zbytočného odkladu a v súlade s platnými právnymi
              predpismi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              14. Záverečné ustanovenia
            </h2>

            <p className="mt-4 leading-7">
              Tieto obchodné podmienky sa riadia právnym poriadkom Slovenskej
              republiky.
            </p>

            <p className="mt-4 leading-7">
              Prevádzkovateľ si vyhradzuje právo tieto obchodné podmienky
              primerane meniť. Pre konkrétnu registráciu sa uplatnia podmienky
              platné v čase jej uskutočnenia, pokiaľ právne predpisy
              neustanovujú inak.
            </p>

            <p className="mt-4 text-sm text-slate-500">
              Posledná aktualizácia: september 2026
            </p>
          </section>

          <div className="border-t border-slate-200 pt-8">
            <Link
              href="/"
              className="font-semibold text-[#009ee9] transition hover:text-[#0087c9]"
            >
              ← Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
