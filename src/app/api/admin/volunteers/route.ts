import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SORT_FIELDS = ["fullName", "email", "createdAt"] as const;

export async function GET(request: NextRequest) {
  // Auth enforced by middleware

  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const orderField =
      SORT_FIELDS.includes(sortBy as (typeof SORT_FIELDS)[number])
        ? sortBy
        : "createdAt";

    const volunteers = await prisma.volunteer.findMany({
      orderBy: { [orderField]: sortOrder },
    });
    return NextResponse.json(volunteers);
  } catch (error) {
    console.error("Admin volunteers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}
