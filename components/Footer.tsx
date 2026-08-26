import Link from "next/link";

const courseLinks = [
  { label: "Kurzy pre deti", href: "/kurzy" },
  { label: "Kurzy pre dospelých", href: "/kurzy" },
  { label: "Individuálne plávanie", href: "/kurzy/individualne-plavanie" },
  { label: "Plavecký tábor", href: "/kurzy/plavecky-tabor" },
];

const companyLinks = [
  { label: "O nás", href: "/o-nas" },
  { label: "Tréneri", href: "/treneri" },
  { label: "Cenník", href: "/cennik" },
  { label: "Kontakt", href: "/kontakt" },
];

const legalLinks = [
  { label: "Obchodné podmienky", href: "/dokumenty/obchodne-podmienky" },
  { label: "Ochrana osobných údajov", href: "/ochrana-osobnych-udajov" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex flex-col leading-none"
              aria-label="Plavecká škola Prešov – domov"
            >
              <span className="text-xl font-bold">Plavecká škola</span>
              <span className="mt-1 text-sm font-semibold text-sky-400">
                Prešov
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Učíme deti aj dospelých cítiť sa vo vode bezpečne, sebavedomo a s
              radosťou.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-sm font-semibold transition-colors hover:border-sky-500 hover:text-sky-400"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-sm font-semibold transition-colors hover:border-sky-500 hover:text-sky-400"
              >
                ig
              </a>
            </div>
          </div>

          {/* Kurzy */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Kurzy
            </h2>

            <ul className="mt-5 space-y-3">
              {courseLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Škola */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Plavecká škola
            </h2>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Kontakt
            </h2>

            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <div>
                <p className="text-slate-500">E-mail</p>
                <a
                  href="mailto:info@plavaniepresov.sk"
                  className="mt-1 inline-block transition-colors hover:text-white"
                >
                  info@plavaniepresov.sk
                </a>
              </div>

              <div>
                <p className="text-slate-500">Telefón</p>
                <a
                  href="tel:+421000000000"
                  className="mt-1 inline-block transition-colors hover:text-white"
                >
                  +421 XXX XXX XXX
                </a>
              </div>

              <div>
                <p className="text-slate-500">Lokalita</p>
                <p className="mt-1">Prešov</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-slate-800 pt-8">
          <div className="flex flex-col gap-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Plavecká škola Prešov. Všetky práva
              vyhradené.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
