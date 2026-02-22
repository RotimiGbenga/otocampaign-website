import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Debug log (check terminal)
    console.log("Volunteer payload:", body);

    const { fullName, email, phone, lga, message } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !lga) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
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

    console.log("Volunteer saved:", volunteer);

    return NextResponse.json({
      success: true,
      message: "Volunteer saved successfully",
    });
  } catch (error: any) {
    console.error("VOLUNTEER API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process volunteer submission",
        error: error.message,
      },
      { status: 500 }
    );
  }
}