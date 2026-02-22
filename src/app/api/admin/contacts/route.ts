import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SORT_FIELDS = ["name", "email", "createdAt"] as const;

export async function GET(request: NextRequest) {
  // Auth enforced by middleware

  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const orderField = SORT_FIELDS.includes(sortBy as (typeof SORT_FIELDS)[number])
      ? sortBy
      : "createdAt";

    const contacts = await prisma.contact.findMany({
      orderBy: { [orderField]: sortOrder },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Admin contacts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
