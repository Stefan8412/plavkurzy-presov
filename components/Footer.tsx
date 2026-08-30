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
