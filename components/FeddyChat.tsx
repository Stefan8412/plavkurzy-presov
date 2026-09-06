"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Question = {
  question: string;
  answer: string;
  keywords: string[];
  link?: {
    label: string;
    href: string;
  };
};

const questions: Question[] = [
  {
    question: "Čo si máme priniesť?",
    answer:
      "Na plávanie si prineste plavky, uterák, šľapky a hygienické potreby. Odporúčame aj fľašu s vodou. Ak používate plavecké okuliare, môžete si priniesť aj tie.",
    keywords: [
      "priniesť",
      "priniest",
      "doniesť",
      "doniest",
      "potrebujem",
      "plavky",
      "uterák",
      "uterak",
      "šľapky",
      "slapky",
      "okuliare",
    ],
  },
  {
    question: "Ktorý kurz je vhodný pre moje dieťa?",
    answer:
      "Pre deti vo veku 3–4 roky máme samostatný kurz. Pre deti od 4 do 10 rokov je určené skupinové plávanie a pre deti od 10 rokov kondičné plávanie. Nevadí, ak je dieťa neplavec – pri registrácii nám môžete do poznámky napísať jeho skúsenosti s vodou.",
    keywords: [
      "kurz",
      "vek",
      "roky",
      "rokov",
      "dieťa",
      "dieta",
      "dcéra",
      "dcera",
      "syn",
      "neplavec",
      "nevie plávať",
      "nevie plavat",
      "začiatočník",
      "zaciatocnik",
    ],
    link: {
      label: "Pozrieť kurzy",
      href: "/kurzy",
    },
  },
  {
    question: "Kde prebiehajú kurzy?",
    answer:
      "Kurzy Plaveckej školy FEDDY prebiehajú v Aquaparku Delňa v Prešove.",
    keywords: [
      "kde",
      "adresa",
      "miesto",
      "delňa",
      "delna",
      "aquapark",
      "bazén",
      "bazen",
      "prešov",
      "presov",
    ],
    link: {
      label: "Kontaktné informácie",
      href: "/kontakt",
    },
  },
  {
    question: "Koľko kurz stojí?",
    answer:
      "Cena závisí od vekovej skupiny a od toho, či dieťa pláva 1× alebo 2× týždenne. Aktuálne ceny nájdete v našom cenníku.",
    keywords: [
      "cena",
      "ceny",
      "stojí",
      "stoji",
      "koľko",
      "kolko",
      "cenník",
      "cennik",
      "eur",
      "€",
    ],
    link: {
      label: "Zobraziť cenník",
      href: "/cennik",
    },
  },
  {
    question: "Čo ak sa nemôžeme zúčastniť lekcie?",
    answer:
      "Ak sa dieťa nemôže zúčastniť konkrétnej lekcie, po prihlásení do svojho účtu ho môžete z danej lekcie odhlásiť. Odhlásenie z jednotlivej lekcie však neznamená vrátenie pomernej časti ceny kurzu.",
    keywords: [
      "neprídem",
      "neprideme",
      "neprídeme",
      "choroba",
      "chorý",
      "chory",
      "chorá",
      "chora",
      "odhlásiť",
      "odhlasit",
      "odhlásenie",
      "odhlasenie",
      "lekcia",
      "vynechať",
      "vynechat",
      "nemôžeme",
      "nemozeme",
    ],
    link: {
      label: "Moje kurzy",
      href: "/moje-kurzy",
    },
  },
  {
    question: "Ako môžem zaplatiť za kurz?",
    answer:
      "Po registrácii môžete kurz zaplatiť online cez platobnú bránu Comgate. Platba je následne automaticky priradená k vašej registrácii.",
    keywords: [
      "platba",
      "platiť",
      "platit",
      "zaplatiť",
      "zaplatit",
      "karta",
      "kartou",
      "comgate",
      "google pay",
      "apple pay",
    ],
  },
  {
    question: "Môže sa prihlásiť aj neplavec?",
    answer:
      "Áno. Na kurzy sa môžu prihlásiť aj deti, ktoré ešte nevedia plávať. Pri pridávaní dieťaťa nám môžete do poznámky uviesť, že je neplavec alebo aké má skúsenosti s vodou.",
    keywords: [
      "neplavec",
      "nevie plávať",
      "nevie plavat",
      "nepláva",
      "neplava",
      "začiatočník",
      "zaciatocnik",
    ],
  },
];

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("sk-SK")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findAnswer(value: string) {
  const normalizedQuestion = normalizeText(value);

  let bestMatch: Question | null = null;
  let bestScore = 0;

  for (const item of questions) {
    let score = 0;

    for (const keyword of item.keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (normalizedQuestion.includes(normalizedKeyword)) {
        score += normalizedKeyword.includes(" ") ? 2 : 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

export default function FeddyChat() {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [customQuestion, setCustomQuestion] = useState("");
  const [unknownQuestion, setUnknownQuestion] = useState<string | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedQuestion || unknownQuestion) {
      answerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedQuestion, unknownQuestion]);

  function closeChat() {
    setOpen(false);
  }

  function selectQuestion(question: Question) {
    setSelectedQuestion(question);
    setUnknownQuestion(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = customQuestion.trim();

    if (!value) {
      return;
    }

    const answer = findAnswer(value);

    if (answer) {
      setSelectedQuestion(answer);
      setUnknownQuestion(null);
    } else {
      setSelectedQuestion(null);
      setUnknownQuestion(value);
    }

    setCustomQuestion("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-4 w-[calc(100vw-40px)] max-w-[390px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#071b55] px-5 py-4 text-white">
            <div>
              <p className="font-bold">FEDDY poradca</p>
              <p className="mt-0.5 text-xs text-sky-100/70">
                Pomôžeme vám s kurzami
              </p>
            </div>

            <button
              type="button"
              onClick={closeChat}
              aria-label="Zavrieť poradcu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/10"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[65vh] overflow-y-auto p-5">
            <div className="max-w-[90%] rounded-2xl rounded-tl-md bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <p className="font-semibold text-[#071b55]">Ahoj 👋</p>

              <p className="mt-1">
                Som FEDDY poradca. Napíšte mi otázku alebo si vyberte jednu z
                častých otázok.
              </p>
            </div>

            {/* Custom question */}
            <form onSubmit={handleSubmit} className="mt-5">
              <label
                htmlFor="feddy-question"
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Vaša otázka
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  id="feddy-question"
                  type="text"
                  value={customQuestion}
                  onChange={(event) => setCustomQuestion(event.target.value)}
                  placeholder="Napr. Čo treba priniesť?"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#009ee9] focus:ring-2 focus:ring-sky-100"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-[#009ee9] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0087c9]"
                >
                  Odoslať
                </button>
              </div>
            </form>

            {/* Known answer */}
            {selectedQuestion && (
              <div ref={answerRef} className="mt-5">
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-[#009ee9] px-4 py-3 text-sm font-medium leading-6 text-white">
                  {selectedQuestion.question}
                </div>

                <div className="mt-3 max-w-[90%] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700">
                  <p>{selectedQuestion.answer}</p>

                  {selectedQuestion.link && (
                    <Link
                      href={selectedQuestion.link.href}
                      onClick={closeChat}
                      className="mt-3 inline-flex font-bold text-[#009ee9] hover:underline"
                    >
                      {selectedQuestion.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Unknown answer */}
            {unknownQuestion && (
              <div className="mt-5">
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-[#009ee9] px-4 py-3 text-sm font-medium leading-6 text-white">
                  {unknownQuestion}
                </div>

                <div className="mt-3 max-w-[90%] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700">
                  Túto otázku zatiaľ neviem spoľahlivo zodpovedať. Prosím,
                  kontaktujte nás telefonicky alebo e-mailom.
                  <div className="mt-3 space-y-1">
                    <a
                      href="tel:+421902575215"
                      className="block font-bold text-[#009ee9] hover:underline"
                    >
                      0902 575 215
                    </a>

                    <a
                      href="mailto:plavaniepo@gmail.com"
                      className="block font-bold text-[#009ee9] hover:underline"
                    >
                      plavaniepo@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Quick questions */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Časté otázky
              </p>

              <div className="space-y-2">
                {questions.map((item) => (
                  <button
                    key={item.question}
                    type="button"
                    onClick={() => selectQuestion(item)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-[#009ee9] hover:bg-sky-50 hover:text-[#071b55]"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 text-center">
              <p className="text-xs leading-5 text-slate-400">
                FEDDY poradca odpovedá na základné otázky o našich kurzoch.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Zavrieť FEDDY poradcu" : "Otvoriť FEDDY poradcu"}
          aria-expanded={open}
          className="flex items-center gap-3 rounded-full bg-[#009ee9] px-5 py-4 font-bold text-white shadow-lg transition hover:bg-[#0087c9] hover:shadow-xl"
        >
          <span className="text-xl" aria-hidden="true">
            {open ? "×" : "💬"}
          </span>

          <span className="hidden sm:inline">
            {open ? "Zavrieť" : "FEDDY poradca"}
          </span>
        </button>
      </div>
    </div>
  );
}
