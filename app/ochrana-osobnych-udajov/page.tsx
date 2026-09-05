import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov | Plavecká škola FEDDY",
  description:
    "Informácie o spracúvaní osobných údajov Plaveckou školou FEDDY.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            FEDDY
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55] sm:text-5xl">
            Ochrana osobných údajov
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-slate-600">
            Informácie o tom, ako spracúvame a chránime osobné údaje pri
            používaní webovej stránky a služieb Plaveckej školy FEDDY.
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
              <p>Prevádzkovateľom osobných údajov je:</p>

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
              2. Aké osobné údaje spracúvame
            </h2>

            <p className="mt-4 leading-7">
              V závislosti od spôsobu využívania našich služieb môžeme spracúvať
              najmä nasledujúce osobné údaje:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
              <li>meno a priezvisko rodiča alebo zákonného zástupcu,</li>
              <li>e-mailovú adresu a telefónne číslo,</li>
              <li>
                meno, priezvisko a dátum narodenia dieťaťa prihláseného na kurz,
              </li>
              <li>
                informácie uvedené rodičom v poznámke k dieťaťu alebo
                registrácii,
              </li>
              <li>informácie o vybranom kurze a termíne,</li>
              <li>
                informácie o registrácii, jej stave a odhlásení z jednotlivých
                lekcií,
              </li>
              <li>
                informácie súvisiace s platbou, napríklad suma, stav platby a
                identifikátor platobnej transakcie,
              </li>
              <li>
                údaje, ktoré nám dobrovoľne poskytnete prostredníctvom
                kontaktného formulára alebo e-mailovej komunikácie,
              </li>
              <li>
                technické údaje potrebné na bezpečnú prevádzku webovej stránky a
                používateľského účtu.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              3. Na aké účely údaje používame
            </h2>

            <p className="mt-4 leading-7">
              Osobné údaje spracúvame najmä na účely:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
              <li>vytvorenia a správy používateľského účtu,</li>
              <li>registrácie dieťaťa na plavecký kurz,</li>
              <li>organizácie kurzov a jednotlivých lekcií,</li>
              <li>evidencie odhlásení z lekcií,</li>
              <li>spracovania a evidencie platieb,</li>
              <li>komunikácie s rodičmi a zákonnými zástupcami,</li>
              <li>vybavovania otázok zaslaných cez kontaktný formulár,</li>
              <li>plnenia zákonných povinností prevádzkovateľa,</li>
              <li>
                ochrany našich práv, bezpečnosti systému a predchádzania
                zneužitiu služieb.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              4. Právny základ spracúvania
            </h2>

            <p className="mt-4 leading-7">
              Osobné údaje spracúvame v súlade s Nariadením Európskeho
              parlamentu a Rady (EÚ) 2016/679 (GDPR) a príslušnými právnymi
              predpismi Slovenskej republiky.
            </p>

            <p className="mt-4 leading-7">
              Právnym základom spracúvania môže byť najmä plnenie zmluvy alebo
              vykonanie opatrení pred uzatvorením zmluvy, plnenie zákonnej
              povinnosti, oprávnený záujem prevádzkovateľa alebo súhlas
              dotknutej osoby, ak sa súhlas pre konkrétny účel vyžaduje.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              5. Údaje o deťoch
            </h2>

            <p className="mt-4 leading-7">
              Pri registrácii na detské plavecké kurzy spracúvame údaje dieťaťa,
              ktoré nám poskytne jeho rodič alebo zákonný zástupca. Tieto údaje
              používame iba v rozsahu potrebnom na organizáciu a poskytovanie
              plaveckých kurzov a súvisiacich služieb.
            </p>

            <p className="mt-4 leading-7">
              Prosíme rodičov a zákonných zástupcov, aby do voľných textových
              polí uvádzali iba informácie, ktoré sú skutočne potrebné pre
              organizáciu kurzu a bezpečný priebeh plávania.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">6. Platby</h2>

            <p className="mt-4 leading-7">
              Online platby za kurzy sú spracúvané prostredníctvom platobnej
              brány Comgate. Prevádzkovateľ webovej stránky nespracúva ani
              neuchováva kompletné údaje platobnej karty.
            </p>

            <p className="mt-4 leading-7">
              V našom systéme evidujeme iba údaje potrebné na priradenie a
              kontrolu platby, napríklad sumu, stav platby a identifikátor
              transakcie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              7. Príjemcovia a poskytovatelia služieb
            </h2>

            <p className="mt-4 leading-7">
              Pri prevádzke webovej stránky a poskytovaní služieb môžeme
              využívať externých poskytovateľov technických a platobných
              služieb. Ide najmä o služby zabezpečujúce hosting a prevádzku
              aplikácie, databázu a autentifikáciu používateľov, odosielanie
              e-mailov a spracovanie online platieb.
            </p>

            <p className="mt-4 leading-7">
              Medzi používaných poskytovateľov patria najmä Vercel, Supabase,
              Resend a Comgate. Títo poskytovatelia spracúvajú údaje iba v
              rozsahu potrebnom na poskytovanie príslušnej služby a podľa
              podmienok, ktoré sa na ich služby vzťahujú.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              8. Doba uchovávania údajov
            </h2>

            <p className="mt-4 leading-7">
              Osobné údaje uchovávame iba počas obdobia, ktoré je potrebné na
              splnenie účelu, na ktorý boli získané, a následne počas obdobia
              vyžadovaného príslušnými právnymi predpismi alebo potrebného na
              ochranu našich oprávnených práv a nárokov.
            </p>

            <p className="mt-4 leading-7">
              Údaje používateľského účtu a údaje súvisiace s registráciami
              môžeme uchovávať počas trvania používateľského účtu a následne v
              nevyhnutnom rozsahu podľa zákonných povinností.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              9. Bezpečnosť osobných údajov
            </h2>

            <p className="mt-4 leading-7">
              Prijímame primerané technické a organizačné opatrenia na ochranu
              osobných údajov pred neoprávneným prístupom, stratou, zneužitím,
              zmenou alebo zverejnením.
            </p>

            <p className="mt-4 leading-7">
              Prístup k administrácii a osobným údajom je obmedzený na oprávnené
              osoby a komunikácia s webovou aplikáciou je zabezpečená šifrovaným
              pripojením.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              10. Vaše práva
            </h2>

            <p className="mt-4 leading-7">
              V súvislosti so spracúvaním osobných údajov máte za podmienok
              stanovených GDPR najmä právo:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
              <li>požiadať o prístup k svojim osobným údajom,</li>
              <li>požiadať o opravu nesprávnych alebo neúplných údajov,</li>
              <li>požiadať o vymazanie osobných údajov,</li>
              <li>požiadať o obmedzenie spracúvania,</li>
              <li>namietať proti spracúvaniu,</li>
              <li>uplatniť právo na prenosnosť údajov, ak je uplatniteľné,</li>
              <li>
                kedykoľvek odvolať súhlas, ak je spracúvanie založené na
                súhlase.
              </li>
            </ul>

            <p className="mt-4 leading-7">
              Svoje práva môžete uplatniť prostredníctvom e-mailu{" "}
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
              11. Právo podať sťažnosť
            </h2>

            <p className="mt-4 leading-7">
              Ak sa domnievate, že pri spracúvaní vašich osobných údajov
              dochádza k porušeniu právnych predpisov, máte právo podať návrh
              alebo sťažnosť príslušnému dozornému orgánu, ktorým je Úrad na
              ochranu osobných údajov Slovenskej republiky.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071b55]">
              12. Zmeny týchto informácií
            </h2>

            <p className="mt-4 leading-7">
              Tieto informácie môžeme primerane aktualizovať, najmä ak sa zmení
              spôsob spracúvania osobných údajov, používané služby alebo
              príslušné právne predpisy. Aktuálna verzia je vždy zverejnená na
              tejto webovej stránke.
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
