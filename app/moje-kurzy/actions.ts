"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createComgatePayment } from "@/lib/comgate";

export async function payRegistration(registrationGroupId: string) {
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
    .from("registrations")
    .select(
      `
        id,
        child_id,
        registration_group_id,
        children!registrations_child_id_fkey (
          parent_id
        ),
        course_terms!registrations_course_term_id_fkey (
          courses!course_terms_course_id_fkey (
            title
          )
        )
      `,
    )
    .eq("registration_group_id", registrationGroupId)
    .limit(1)
    .single();

  if (registrationError || !registration) {
    throw new Error("Registrácia sa nenašla.");
  }

  const childRelation = Array.isArray(registration.children)
    ? registration.children[0]
    : registration.children;

  if (childRelation?.parent_id !== user.id) {
    throw new Error("K tejto registrácii nemáte prístup.");
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select(
      `
      registration_group_id,
      amount,
      currency,
      status
    `,
    )
    .eq("registration_group_id", registrationGroupId)
    .single();

  if (paymentError || !payment) {
    throw new Error("Platba sa nenašla.");
  }

  if (payment.status === "paid") {
    redirect("/moje-kurzy");
  }

  if (payment.status !== "pending") {
    throw new Error("Túto platbu momentálne nie je možné zaplatiť.");
  }

  if (payment.currency !== "EUR") {
    throw new Error("Nepodporovaná mena platby.");
  }

  const courseTermRelation = Array.isArray(registration.course_terms)
    ? registration.course_terms[0]
    : registration.course_terms;

  const courseRelation = Array.isArray(courseTermRelation?.courses)
    ? courseTermRelation?.courses[0]
    : courseTermRelation?.courses;

  const courseTitle = courseRelation?.title ?? "Plavecký kurz FEDDY";

  const referenceId = registrationGroupId.replaceAll("-", "").slice(0, 20);

  const comgatePayment = await createComgatePayment({
    amount: Number(payment.amount),
    referenceId,
    label: "FEDDY kurz",
    email: user.email,
    fullName: `${profile.first_name} ${profile.last_name}`,
  });

  const { error: referenceError } = await supabase.rpc(
    "set_comgate_payment_reference",
    {
      p_registration_group_id: registrationGroupId,
      p_provider_payment_id: comgatePayment.transId,
    },
  );

  if (referenceError) {
    console.error("Chyba pri ukladaní Comgate transId:", referenceError);

    throw new Error(
      "Platba bola vytvorená, ale nepodarilo sa uložiť jej identifikátor.",
    );
  }

  redirect(comgatePayment.redirect);
}
