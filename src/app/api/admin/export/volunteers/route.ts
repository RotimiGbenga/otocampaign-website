import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

function escapeCsvCell(value: string): string {
  const str = String(value ?? "");
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q")?.trim() ?? "";
  const lga = searchParams.get("lga")?.trim() ?? "";

  const where: Prisma.VolunteerWhereInput = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (lga) {
    where.lga = lga;
  }

  const volunteers = await prisma.volunteer.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "LGA",
    "Message",
    "Created At",
  ];
  const rows = volunteers.map((v) => [
    escapeCsvCell(v.fullName),
    escapeCsvCell(v.email),
    escapeCsvCell(v.phone),
    escapeCsvCell(v.lga),
    escapeCsvCell(v.message ?? ""),
    escapeCsvCell(
      new Date(v.createdAt).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    ),
  ]);

  const csv =
    headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
  const bom = "\uFEFF";
  const body = bom + csv;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="volunteers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
