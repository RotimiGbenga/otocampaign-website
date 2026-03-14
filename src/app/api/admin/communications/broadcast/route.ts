import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { buildVolunteerWhereClause } from "@/lib/broadcast-filters";
import { sendBulkBroadcastEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseBody(body: unknown): {
  subject: string;
  body: string;
  filters: { all?: boolean; lgas?: string[]; skills?: string[]; availability?: string[] };
} {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid body");
  }
  const b = body as Record<string, unknown>;
  const subject = String(b.subject ?? "").trim();
  const bodyText = String(b.body ?? "").trim();
  const filters = (b.filters ?? {}) as {
    all?: boolean;
    lgas?: string[];
    skills?: string[];
    availability?: string[];
  };
  if (!subject || !bodyText) {
    throw new Error("Subject and body are required");
  }
  return { subject, body: bodyText, filters };
}

export async function POST(request: NextRequest) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { subject, body: bodyText, filters } = parseBody(body);

    const where = buildVolunteerWhereClause(filters);
    const volunteers = await prisma.volunteer.findMany({
      where,
      select: { email: true, fullName: true },
    });

    if (volunteers.length === 0) {
      return NextResponse.json(
        { success: false, message: "No recipients match the selected filters" },
        { status: 400 }
      );
    }

    const html = bodyText.replace(/\n/g, "<br>");
    const recipients = volunteers.map((v) => ({
      email: v.email,
      fullName: v.fullName,
    }));

    const { sent, failed } = await sendBulkBroadcastEmail(
      recipients,
      subject,
      html
    );

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: volunteers.length,
      message: `Broadcast completed. ${sent} sent, ${failed} failed.`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Broadcast failed";
    console.error("[COMMUNICATIONS] Broadcast failed:", err);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
