import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type ComgateStatusResponse = {
  code: number;
  message: string;
  transId?: string;
  status?: "PENDING" | "PAID" | "CANCELLED" | "AUTHORIZED";
  price?: string;
  curr?: string;
  refId?: string;
};

async function getComgatePaymentStatus(
  transId: string,
): Promise<ComgateStatusResponse> {
  const merchantId = process.env.COMGATE_MERCHANT_ID;
  const secret = process.env.COMGATE_SECRET;

  if (!merchantId || !secret) {
    throw new Error("Chýba konfigurácia Comgate.");
  }

  const authorization = Buffer.from(`${merchantId}:${secret}`).toString(
    "base64",
  );

  const response = await fetch(
    `https://payments.comgate.cz/v2.0/payment/transId/${encodeURIComponent(
      transId,
    )}.json`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${authorization}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const data = (await response.json()) as ComgateStatusResponse;

  if (!response.ok || data.code !== 0) {
    console.error("Comgate status error:", data);

    throw new Error(data.message || "Nepodarilo sa overiť stav platby.");
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    let transId: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await request.json();

      transId = body.transId ?? body.id ?? null;
    } else {
      const formData = await request.formData();

      transId =
        String(formData.get("transId") ?? formData.get("id") ?? "") || null;
    }

    if (!transId) {
      return new NextResponse("Missing transId", {
        status: 400,
      });
    }

    const comgatePayment = await getComgatePaymentStatus(transId);

    if (
      comgatePayment.status !== "PAID" &&
      comgatePayment.status !== "CANCELLED"
    ) {
      return new NextResponse("OK", {
        status: 200,
      });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.rpc("process_comgate_payment_status", {
      p_provider_payment_id: transId,
      p_status: comgatePayment.status,
    });

    if (error) {
      console.error("Chyba pri spracovaní Comgate platby:", error);

      return new NextResponse("ERROR", {
        status: 500,
      });
    }

    return new NextResponse("OK", {
      status: 200,
    });
  } catch (error) {
    console.error("Comgate push error:", error);

    return new NextResponse("ERROR", {
      status: 500,
    });
  }
}
