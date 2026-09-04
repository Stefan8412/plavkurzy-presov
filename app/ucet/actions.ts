"use server";

import { createClient } from "@/lib/supabase/server";

export type ChangePasswordState = {
  success: boolean;
  message: string;
};

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Pre zmenu hesla sa musíte prihlásiť.",
    };
  }

  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");

  if (typeof password !== "string" || typeof passwordConfirm !== "string") {
    return {
      success: false,
      message: "Vyplňte prosím obe polia.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Nové heslo musí mať aspoň 8 znakov.",
    };
  }

  if (password !== passwordConfirm) {
    return {
      success: false,
      message: "Zadané heslá sa nezhodujú.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Password update error:", error);

    return {
      success: false,
      message: "Heslo sa nepodarilo zmeniť. Skúste to prosím znova.",
    };
  }

  return {
    success: true,
    message: "Heslo bolo úspešne zmenené.",
  };
}
