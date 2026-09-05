import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Cenník", href: "/cennik" },
  { label: "O nás", href: "/o-nas" },
  { label: "Pre škôlky a školy", href: "/skolky-skoly" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Footer() {
  return (
    <footer className="bg-[#071b55] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block"
              aria-label="FEDDY Plavecká škola – domov"
            >
              <Image
                src="/images/logo-feddy1.png"
                alt="FEDDY Plavecká škola"
                width={170}
                height={170}
                className="h-auto w-[140px]"
              />
            </Link>

            <p className="mt-5 max-w-sm leading-7 text-sky-100/70">
              Plavecká škola pre deti aj dospelých v Prešove. Plávanie hrou, hra
              plávaním.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#38bdf8]">
              Navigácia
            </h2>

            <nav className="mt-5 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sky-100/75 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#38bdf8]">
              Kontakt
            </h2>

            <div className="mt-5 space-y-3">
              <a
                href="tel:+421902575215"
                className="block text-sky-100/75 transition hover:text-white"
              >
                0902 575 215
              </a>

              <a
                href="mailto:plavaniepo@gmail.com"
                className="block break-all text-sky-100/75 transition hover:text-white"
              >
                plavaniepo@gmail.com
              </a>
              <a
                href="https://www.facebook.com/plavaniepresov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sky-100/75 transition hover:text-white"
              >
                Facebook – Plavecká škola FEDDY
              </a>

              <Link
                href="/kontakt"
                className="inline-flex pt-2 font-bold text-[#38bdf8] transition hover:text-white"
              >
                Kontaktné informácie →
              </Link>
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#38bdf8]">
              FEDDY IT, o. z.
            </h2>

            <address className="mt-5 not-italic leading-7 text-sky-100/75">
              Kukučínova 867/47
              <br />
              080 05 Prešov
            </address>

            <Link
              href="/kurzy"
              className="mt-6 inline-flex rounded-full bg-[#009ee9] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0087c9]"
            >
              Vybrať kurz
            </Link>
          </div>
        </div>
        {/* Payments */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="mb-4 text-sm font-semibold text-sky-100/70">
            Bezpečné platby cez Comgate
          </p>

          <Image
            src="/images/comgate-payments.png"
            alt="Comgate – Visa, Mastercard, Google Pay a Apple Pay"
            width={2000}
            height={185}
            className="h-auto w-full max-w-[520px]"
          />
        </div>
        {/* Partners */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="mb-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#38bdf8]">
            Naši partneri
          </p>

          <div className="grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-4">
            <div className="flex items-center justify-center">
              <Image
                src="/images/partner-1.png"
                alt="Partner 1"
                width={220}
                height={100}
                className="max-h-16 w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center">
              <Image
                src="/images/partner-2.png"
                alt="Partner 2"
                width={220}
                height={100}
                className="max-h-16 w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center">
              <Image
                src="/images/partner-3.png"
                alt="Partner 3"
                width={220}
                height={100}
                className="max-h-16 w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center">
              <Image
                src="/images/partner-4.png"
                alt="Partner 4"
                width={220}
                height={100}
                className="max-h-16 w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-sky-100/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} FEDDY Plavecká škola. Všetky práva
            vyhradené.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/ochrana-osobnych-udajov"
              className="transition hover:text-white"
            >
              Ochrana osobných údajov
            </Link>

            <Link
              href="/obchodne-podmienky"
              className="transition hover:text-white"
            >
              Obchodné podmienky
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
