import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth-edge";

export const runtime = "nodejs";

function escapeCsvCell(value: string): string {
  const str = String(value ?? "");
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const isAuth = await verifyAdminSession(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "Message",
    "Created At",
  ];
  const rows = contacts.map((c) => [
    escapeCsvCell(c.name),
    escapeCsvCell(c.email),
    escapeCsvCell(c.phone ?? ""),
    escapeCsvCell(c.message),
    escapeCsvCell(
      new Date(c.createdAt).toLocaleString("en-NG", {
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
      "Content-Disposition": `attachment; filename="contacts-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
