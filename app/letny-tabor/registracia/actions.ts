"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createComgatePayment } from "@/lib/comgate";

export type CampRegistrationActionState = {
  success: boolean;
  message: string;
};

export async function registerChildForCamp(
  _prevState: CampRegistrationActionState,
  formData: FormData,
): Promise<CampRegistrationActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Musíte byť prihlásený.",
    };
  }

  const childId = String(formData.get("childId") ?? "");
  const campTermId = String(formData.get("campTermId") ?? "");
  const mealPortion = String(formData.get("mealPortion") ?? "");
  const shirtSize = String(formData.get("shirtSize") ?? "");
  const healthInfo = String(formData.get("healthInfo") ?? "").trim();

  const recreationVoucher = formData.get("recreationVoucher") === "on";

  const billingName = String(formData.get("billingName") ?? "").trim();
  const billingStreet = String(formData.get("billingStreet") ?? "").trim();
  const billingPostalCode = String(
    formData.get("billingPostalCode") ?? "",
  ).trim();
  const billingCity = String(formData.get("billingCity") ?? "").trim();

  const privacyConsent = formData.get("privacyConsent") === "on";
  const photoConsent = formData.get("photoConsent") === "on";

  const excitementValue = String(formData.get("excitement") ?? "");
  const excitement = excitementValue ? Number(excitementValue) : null;

  if (!childId || !campTermId) {
    return {
      success: false,
      message: "Chýba dieťa alebo turnus.",
    };
  }

  if (!["child", "adult"].includes(mealPortion)) {
    return {
      success: false,
      message: "Vyberte veľkosť obedovej porcie.",
    };
  }

  if (!["S", "M", "L"].includes(shirtSize)) {
    return {
      success: false,
      message: "Vyberte veľkosť trička.",
    };
  }

  if (!healthInfo) {
    return {
      success: false,
      message: "Vyplňte informácie o liekoch a alergiách.",
    };
  }

  if (!privacyConsent) {
    return {
      success: false,
      message:
        "Pre odoslanie prihlášky je potrebné potvrdiť spracovanie osobných údajov.",
    };
  }

  if (
    excitement !== null &&
    (!Number.isInteger(excitement) || excitement < 1 || excitement > 10)
  ) {
    return {
      success: false,
      message: "Hodnota tešenia sa na tábor musí byť od 1 do 10.",
    };
  }

  if (
    recreationVoucher &&
    (!billingName || !billingStreet || !billingPostalCode || !billingCity)
  ) {
    return {
      success: false,
      message: "Pre rekreačný poukaz vyplňte všetky fakturačné údaje.",
    };
  }

  const { error } = await supabase.rpc("register_child_for_camp", {
    p_child_id: childId,
    p_camp_term_id: campTermId,
    p_meal_portion: mealPortion,
    p_shirt_size: shirtSize,
    p_health_info: healthInfo,
    p_recreation_voucher: recreationVoucher,
    p_billing_name: recreationVoucher ? billingName : null,
    p_billing_street: recreationVoucher ? billingStreet : null,
    p_billing_postal_code: recreationVoucher ? billingPostalCode : null,
    p_billing_city: recreationVoucher ? billingCity : null,
    p_privacy_consent: privacyConsent,
    p_photo_consent: photoConsent,
    p_excitement: excitement,
  });

  if (error) {
    console.error("Camp registration failed:", error);

    if (error.message.includes("už na tento turnus prihlásené")) {
      return {
        success: false,
        message: "Dieťa je už na tento turnus prihlásené.",
      };
    }

    if (
      error.message.includes("už obsadený") ||
      error.message.includes("nie je dostupný")
    ) {
      return {
        success: false,
        message: "Vybraný turnus už nemá voľné miesto.",
      };
    }

    return {
      success: false,
      message: "Prihlášku sa nepodarilo odoslať.",
    };
  }

  revalidatePath("/letny-tabor");
  revalidatePath("/letny-tabor/registracia");
  revalidatePath("/admin");

  return {
    success: true,
    message: "Prihláška na letný tábor bola úspešne odoslaná.",
  };
}
export async function payCampRegistration(registrationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musíte byť prihlásený.");
  }

  if (!user.email) {
    throw new Error("K účtu nie je priradený e-mail.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profil používateľa sa nenašiel.");
  }

  const { data: registration, error: registrationError } = await supabase
    .from("camp_registrations")
    .select(
      `
      id,
      parent_id,
      status
    `,
    )
    .eq("id", registrationId)
    .single();

  if (registrationError || !registration) {
    throw new Error("Prihláška na letný tábor sa nenašla.");
  }

  if (registration.parent_id !== user.id) {
    throw new Error("K tejto prihláške nemáte prístup.");
  }

  if (registration.status === "cancelled") {
    throw new Error("Zrušenú prihlášku nie je možné zaplatiť.");
  }

  const { data: payment, error: paymentError } = await supabase
    .from("camp_payments")
    .select(
      `
      amount,
      currency,
      status
    `,
    )
    .eq("camp_registration_id", registrationId)
    .single();

  if (paymentError || !payment) {
    throw new Error("Platba sa nenašla.");
  }

  if (payment.status === "paid") {
    redirect("/letny-tabor/registracia");
  }

  if (
    payment.status !== "pending" &&
    payment.status !== "cancelled" &&
    payment.status !== "failed"
  ) {
    throw new Error("Túto platbu momentálne nie je možné zaplatiť.");
  }

  if (payment.currency !== "EUR") {
    throw new Error("Nepodporovaná mena platby.");
  }

  const referenceId = `T${registrationId.replaceAll("-", "").slice(0, 19)}`;

  const comgatePayment = await createComgatePayment({
    amount: Number(payment.amount),
    referenceId,
    label: "FEDDY letny tabor",
    email: user.email,
    fullName: `${profile.first_name} ${profile.last_name}`,
  });

  const { error: referenceError } = await supabase.rpc(
    "set_camp_comgate_payment_reference",
    {
      p_registration_id: registrationId,
      p_provider_payment_id: comgatePayment.transId,
    },
  );

  if (referenceError) {
    console.error(
      "Chyba pri ukladaní Comgate transId pre tábor:",
      referenceError,
    );

    throw new Error(
      "Platba bola vytvorená, ale nepodarilo sa uložiť jej identifikátor.",
    );
  }

  redirect(comgatePayment.redirect);
}
