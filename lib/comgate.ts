type CreateComgatePaymentInput = {
  amount: number;
  referenceId: string;
  label: string;
  email: string;
  fullName: string;
};

type CreateComgatePaymentResult = {
  transId: string;
  redirect: string;
};

export async function createComgatePayment(
  input: CreateComgatePaymentInput,
): Promise<CreateComgatePaymentResult> {
  const merchantId = process.env.COMGATE_MERCHANT_ID;
  const secret = process.env.COMGATE_SECRET;
  const testMode = process.env.COMGATE_TEST === "true";

  if (!merchantId || !secret) {
    throw new Error("Chýba konfigurácia Comgate.");
  }

  const authorization = Buffer.from(`${merchantId}:${secret}`).toString(
    "base64",
  );

  const response = await fetch(
    "https://payments.comgate.cz/v2.0/payment.json",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        test: testMode,
        country: "SK",
        price: Math.round(input.amount * 100),
        curr: "EUR",
        label: input.label,
        refId: input.referenceId,
        method: "ALL",
        email: input.email,
        fullName: input.fullName,
      }),
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok || data.code !== 0 || !data.transId || !data.redirect) {
    console.error("Comgate create payment error:", data);

    throw new Error(data.message || "Platbu sa nepodarilo vytvoriť.");
  }

  return {
    transId: data.transId,
    redirect: data.redirect,
  };
}
