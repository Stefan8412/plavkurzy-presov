"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="hidden text-sm font-semibold text-[#071b55] transition-colors hover:text-[#009ee9] disabled:opacity-50 sm:block"
    >
      {loading ? "Odhlasujem..." : "Odhlásiť sa"}
    </button>
  );
}
