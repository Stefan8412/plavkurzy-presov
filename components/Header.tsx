import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import LogoutButton from "./LogoutButton";
import Button from "./ui/Button";
import { createClient } from "@/lib/supabase/server";

const navigation = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Pre škôlky a školy", href: "/skolky-skoly" },
  { label: "O nás", href: "/o-nas" },
  /* { label: "Tréneri", href: "/treneri" }, */
  { label: "Cenník", href: "/cennik" },
  { label: "Kontakt", href: "/kontakt" },
];

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="relative z-50 border-b border-sky-100 bg-white">
      <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link
          href="/"
          className="shrink-0"
          aria-label="FEDDY Plavecká škola – domov"
        >
          <Image
            src="/images/logo-feddy.png"
            alt="FEDDY Plavecká škola"
            width={150}
            height={150}
            priority
            className="h-auto w-[105px] sm:w-[120px] lg:w-[135px]"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#071b55] transition-colors hover:text-[#009ee9]"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-[#071b55] transition-colors hover:text-[#009ee9]"
            >
              Administrácia
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <LogoutButton />
          ) : (
            <Link
              href="/prihlasenie"
              className="hidden text-sm font-semibold text-[#071b55] transition-colors hover:text-[#009ee9] sm:block"
            >
              Prihlásiť sa
            </Link>
          )}

          <Button
            href="/kurzy"
            className="hidden rounded-full bg-[#009ee9] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0087c9] hover:shadow-md md:block"
          >
            Vybrať kurz
          </Button>

          <MobileMenu isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
