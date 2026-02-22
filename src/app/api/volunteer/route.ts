import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { volunteerSchema } from "@/lib/validations";
import { sendVolunteerNotification } from "@/lib/email";
import type { VolunteerResponse } from "@/lib/types/api";

export async function POST(
  request: NextRequest
): Promise<NextResponse<VolunteerResponse>> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body", message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = volunteerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      const message =
        firstError?.message ?? "Validation failed. Please check required fields.";
      return NextResponse.json(
        {
          success: false,
          error: message,
          message,
          details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, lga, message } = parsed.data;

    const volunteer = await prisma.volunteer.create({
      data: {
        fullName,
        email,
        phone,
        lga,
        message: message || null,
      },
    });

    sendVolunteerNotification({
      fullName: volunteer.fullName,
      email: volunteer.email,
      phone: volunteer.phone,
      lga: volunteer.lga,
      message: volunteer.message ?? undefined,
      createdAt: volunteer.createdAt,
    }).catch((err) => {
      console.error("[API] Volunteer email failed (submission succeeded):", err);
    });

    return NextResponse.json({
      success: true,
      message: "Volunteer registered successfully",
      data: { id: volunteer.id },
    });
  } catch (error) {
    console.error("[API] Volunteer submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process volunteer submission",
        message: "Failed to process volunteer submission",
      },
      { status: 500 }
    );
  }
}
