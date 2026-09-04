"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const subject = formData.get("subject");
  const message = formData.get("message");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return {
      success: false,
      message: "Vyplňte prosím všetky povinné údaje.",
    };
  }

  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    return {
      success: false,
      message: "Vyplňte prosím všetky povinné údaje.",
    };
  }

  const subjectLabels: Record<string, string> = {
    children: "Skupinový kurz pre deti",
    individual: "Individuálne plávanie",
    schools: "Plávanie pre MŠ / ZŠ",
    camp: "Plavecký tábor",
    other: "Iné",
  };

  const selectedSubject = subjectLabels[subject] ?? subject;

  try {
    const { error } = await resend.emails.send({
      from: "FEDDY web <web@plavaniepresov.sk>",
      to: ["plavaniepo@gmail.com"],
      replyTo: email,
      subject: `Kontaktný formulár: ${selectedSubject}`,
      text: `
Meno: ${name}
E-mail: ${email}
Telefón: ${typeof phone === "string" && phone.trim() ? phone : "Neuvedený"}
Záujem o: ${selectedSubject}

Správa:
${message}
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);

      return {
        success: false,
        message: "Správu sa nepodarilo odoslať. Skúste to prosím znova.",
      };
    }

    return {
      success: true,
      message: "Ďakujeme. Správa bola úspešne odoslaná.",
    };
  } catch (error) {
    console.error("Contact form error:", error);

    return {
      success: false,
      message: "Správu sa nepodarilo odoslať. Skúste to prosím znova.",
    };
  }
}
