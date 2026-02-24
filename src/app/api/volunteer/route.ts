import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

interface VolunteerBody {
  fullName: string;
  email: string;
  phone: string;
  lga: string;
  message?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VolunteerBody;

    const { fullName, email, phone, lga, message } = body;

    if (!fullName || !email || !phone || !lga) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        fullName,
        email,
        phone,
        lga,
        message: message || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Volunteer registered successfully",
      data: volunteer,
    });
  } catch (error: unknown) {
    const code = error && typeof error === "object" && "code" in error ? (error as { code?: string }).code : undefined;
    const message = error instanceof Error ? error.message : String(error);
    console.error("[VOLUNTEER] POST failed:", { code, message, err: error });

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process volunteer submission",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}