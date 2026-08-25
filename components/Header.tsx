import Link from "next/link";

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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Plavecká škola
          <span className="block text-sm font-medium text-sky-600">Prešov</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-sky-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/kurzy"
          className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Vybrať kurz
        </Link>
      </div>
    </header>
  );
}
