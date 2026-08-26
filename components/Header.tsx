import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Button from "./ui/Button";

const navigation = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Rozvrh", href: "/rozvrh" },
  { label: "O nás", href: "/o-nas" },
  { label: "Tréneri", href: "/treneri" },
  { label: "Cenník", href: "/cennik" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  return (
    <header className="relative z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex flex-col leading-none"
          aria-label="Plavecká škola Prešov – domov"
        >
          <span className="text-lg font-bold tracking-tight text-slate-950">
            Plavecká škola
          </span>

          <span className="mt-1 text-sm font-semibold text-sky-600">
            Prešov
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-sky-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/prihlasenie"
            className="hidden text-sm font-semibold text-slate-700 transition-colors hover:text-sky-600 sm:block"
          >
            Prihlásiť sa
          </Link>

          <Button
            href="/kurzy"
            className="hidden rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 sm:block"
          >
            Vybrať kurz
          </Button>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
