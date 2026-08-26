"use client";

import { useState } from "react";
import Link from "next/link";

const navigation = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Rozvrh", href: "/rozvrh" },
  { label: "O nás", href: "/o-nas" },
  { label: "Tréneri", href: "/treneri" },
  { label: "Cenník", href: "/cennik" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Zavrieť menu" : "Otvoriť menu"}
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200"
      >
        <span className="sr-only">
          {isOpen ? "Zavrieť menu" : "Otvoriť menu"}
        </span>

        <div className="flex flex-col gap-1.5">
          <span
            className={`block h-0.5 w-5 bg-slate-900 transition-transform ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-slate-900 transition-opacity ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-slate-900 transition-transform ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-20 border-b border-slate-200 bg-white shadow-lg">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-slate-100 py-4 text-base font-medium text-slate-800 last:border-0"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/kurzy"
              onClick={() => setIsOpen(false)}
              className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Vybrať kurz
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
