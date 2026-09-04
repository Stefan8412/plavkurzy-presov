import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prihlasenie");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-sky-100 bg-[#eefaff]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009ee9]">
            Môj účet
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#071b55]">
            Nastavenie účtu
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Tu si môžete zmeniť prihlasovacie heslo k svojmu účtu.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <h2 className="text-2xl font-bold text-[#071b55]">Zmeniť heslo</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Nové heslo musí obsahovať aspoň 8 znakov.
          </p>

          <ChangePasswordForm />
        </div>
      </section>
    </main>
  );
}
