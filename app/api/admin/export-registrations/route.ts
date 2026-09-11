import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { createClient } from "@/lib/supabase/server";
import { getAdminRegistrations } from "@/lib/data/admin";
import { getAdminPayments } from "@/lib/data/admin-payments";

export const runtime = "nodejs";

const dayLabels: Record<number, string> = {
  1: "Pondelok",
  2: "Utorok",
  3: "Streda",
  4: "Štvrtok",
  5: "Piatok",
  6: "Sobota",
  7: "Nedeľa",
};

const registrationStatusLabels: Record<string, string> = {
  pending: "Čaká na potvrdenie",
  confirmed: "Potvrdená",
  cancelled: "Zrušená",
  completed: "Dokončená",
};

const paymentStatusLabels: Record<string, string> = {
  paid: "Zaplatené",
  pending: "Čaká na platbu",
  failed: "Platba zlyhala",
  refunded: "Vrátená",
  cancelled: "Zrušená",
};

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("sk-SK").format(new Date(date));
}

function formatDateTime(date: string | null | undefined) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("sk-SK", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatTerm(term: {
  dayOfWeek: number;
  startTime?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}) {
  const day = dayLabels[term.dayOfWeek] ?? "";
  const time = term.startTime ? term.startTime.slice(0, 5) : "";

  const dateRange =
    term.startDate || term.endDate
      ? ` (${formatDate(term.startDate)} – ${formatDate(term.endDate)})`
      : "";

  return `${day} ${time}${dateRange}`.trim();
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Používateľ nie je prihlásený." },
        { status: 401 },
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Nemáte oprávnenie na export registrácií." },
        { status: 403 },
      );
    }

    const [registrations, payments] = await Promise.all([
      getAdminRegistrations(),
      getAdminPayments(),
    ]);

    const paymentByRegistrationGroup = new Map(
      payments.map((payment) => [payment.registrationGroupId, payment]),
    );

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "FEDDY Plavecká škola";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Registrácie", {
      views: [
        {
          state: "frozen",
          ySplit: 1,
        },
      ],
    });

    worksheet.columns = [
      {
        header: "Dátum registrácie",
        key: "registeredAt",
        width: 21,
      },
      {
        header: "Stav registrácie",
        key: "registrationStatus",
        width: 22,
      },
      {
        header: "Platba",
        key: "paymentStatus",
        width: 20,
      },
      {
        header: "Meno dieťaťa",
        key: "child",
        width: 26,
      },
      {
        header: "Meno rodiča",
        key: "parent",
        width: 26,
      },
      {
        header: "Telefón",
        key: "phone",
        width: 18,
      },
      {
        header: "E-mail",
        key: "email",
        width: 32,
      },
      {
        header: "Kurz",
        key: "course",
        width: 32,
      },
      {
        header: "Frekvencia",
        key: "frequency",
        width: 16,
      },
      {
        header: "Termín 1",
        key: "term1",
        width: 34,
      },
      {
        header: "Termín 2",
        key: "term2",
        width: 34,
      },
      {
        header: "Cena",
        key: "price",
        width: 14,
      },
      {
        header: "Poznámka rodiča",
        key: "notes",
        width: 45,
      },
    ];

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF071B55",
      },
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    headerRow.height = 24;

    for (const registration of registrations) {
      const payment = paymentByRegistrationGroup.get(
        registration.registrationGroupId,
      );

      const terms = registration.terms ?? [];

      const row = worksheet.addRow({
        registeredAt: formatDateTime(registration.registeredAt),

        registrationStatus:
          registrationStatusLabels[registration.status] ?? registration.status,

        paymentStatus: payment
          ? (paymentStatusLabels[payment.status] ?? payment.status)
          : "Nezaplatené",

        child:
          `${registration.child.firstName} ${registration.child.lastName}`.trim(),

        parent:
          `${registration.parent.firstName} ${registration.parent.lastName}`.trim(),

        phone: registration.parent.phone ?? "",

        email: registration.parent.email ?? "",

        course: registration.course.title,

        frequency: `${registration.frequencyPerWeek}× týždenne`,

        term1: terms[0] ? formatTerm(terms[0]) : "",

        term2: terms[1] ? formatTerm(terms[1]) : "",

        price: registration.totalPrice ?? null,

        notes: registration.child.notes?.trim() ?? "",
      });

      row.alignment = {
        vertical: "top",
        wrapText: true,
      };

      const paymentCell = row.getCell("paymentStatus");

      if (payment?.status === "paid") {
        paymentCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFDCFCE7",
          },
        };
      } else if (payment?.status === "pending") {
        paymentCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFEF3C7",
          },
        };
      } else if (payment?.status === "failed") {
        paymentCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFEE2E2",
          },
        };
      } else if (payment?.status === "refunded") {
        paymentCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFE0F2FE",
          },
        };
      }

      if (registration.status === "cancelled") {
        row.font = {
          color: {
            argb: "FF64748B",
          },
        };
      }

      const priceCell = row.getCell("price");

      if (typeof registration.totalPrice === "number") {
        priceCell.numFmt = '#,##0.00 "€"';
      }
    }

    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: worksheet.columnCount,
      },
    };

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      row.height = 34;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const date = new Date().toISOString().slice(0, 10);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="registracie-feddy-${date}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Chyba exportu registrácií:", error);

    return NextResponse.json(
      {
        error: "Export registrácií sa nepodarilo vytvoriť.",
      },
      {
        status: 500,
      },
    );
  }
}
