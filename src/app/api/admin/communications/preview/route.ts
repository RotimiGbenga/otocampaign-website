import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { buildVolunteerWhereClause } from "@/lib/broadcast-filters";

export const runtime = "nodejs";

function parseFilters(searchParams: URLSearchParams): {
  all?: boolean;
  lgas?: string[];
  skills?: string[];
  availability?: string[];
} {
  const all = searchParams.get("all") === "true";
  const lgas = searchParams.get("lgas")?.split(",").filter(Boolean);
  const skills = searchParams.get("skills")?.split(",").filter(Boolean);
  const availability = searchParams.get("availability")?.split(",").filter(Boolean);
  return { all, lgas, skills, availability };
}

export async function GET(request: NextRequest) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filters = parseFilters(searchParams);
    const where = buildVolunteerWhereClause(filters);
    const count = await prisma.volunteer.count({ where });
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[COMMUNICATIONS] Preview failed:", err);
    return NextResponse.json(
      { error: "Failed to get recipient count" },
      { status: 500 }
    );
  }
}
