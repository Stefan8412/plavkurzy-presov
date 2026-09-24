import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { createClient } from "@/lib/supabase/server";
import { getAdminLessonDetail } from "@/lib/data/admin-lesson-detail";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sk-SK").format(new Date(`${date}T12:00:00`));
}

function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: Request, { params }: RouteProps) {
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
        { error: "Nemáte oprávnenie na export lekcie." },
        { status: 403 },
      );
    }

    const { id } = await params;

    const lesson = await getAdminLessonDetail(id);

    if (!lesson) {
      return NextResponse.json(
        { error: "Lekcia nebola nájdená." },
        { status: 404 },
      );
    }

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "FEDDY Plavecká škola";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Lekcia", {
      views: [
        {
          state: "frozen",
          ySplit: 1,
        },
      ],
    });

    worksheet.columns = [
      {
        header: "Dátum",
        key: "date",
        width: 15,
      },
      {
        header: "Čas",
        key: "time",
        width: 16,
      },
      {
        header: "Kurz",
        key: "course",
        width: 32,
      },
      {
        header: "Miesto",
        key: "location",
        width: 26,
      },
      {
        header: "Meno",
        key: "firstName",
        width: 22,
      },
      {
        header: "Priezvisko",
        key: "lastName",
        width: 25,
      },
      {
        header: "Stav",
        key: "status",
        width: 18,
      },
      {
        header: "Dochádzka",
        key: "attendance",
        width: 18,
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

    for (const child of lesson.children) {
      const row = worksheet.addRow({
        date: formatDate(lesson.lessonDate),

        time: `${lesson.startTime.slice(0, 5)} – ${lesson.endTime.slice(0, 5)}`,

        course: lesson.courseTitle,

        location: lesson.locationName,

        firstName: child.firstName,

        lastName: child.lastName,

        status: child.isAbsent ? "Odhlásený" : "Príde",

        attendance: child.attended ? "Áno" : "Nie",
      });

      row.alignment = {
        vertical: "middle",
      };

      const statusCell = row.getCell("status");

      if (child.isAbsent) {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFFEDD5",
          },
        };
      } else {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFDCFCE7",
          },
        };
      }

      const attendanceCell = row.getCell("attendance");

      if (child.attended) {
        attendanceCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFDCFCE7",
          },
        };
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

      row.height = 24;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = safeFileName(
      `lekcia-${lesson.courseTitle}-${lesson.lessonDate}`,
    );

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition": `attachment; filename="${fileName}.xlsx"`,

        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Chyba exportu lekcie:", error);

    return NextResponse.json(
      {
        error: "Export lekcie sa nepodarilo vytvoriť.",
      },
      {
        status: 500,
      },
    );
  }
}
