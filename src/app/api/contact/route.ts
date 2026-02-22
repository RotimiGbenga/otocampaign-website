import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { sendContactNotification } from "@/lib/email";
import type { ContactResponse } from "@/lib/types/api";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
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

    const parsed = contactSchema.safeParse(body);

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

    const { name, email, phone, message } = parsed.data;

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    sendContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      createdAt: contact.createdAt,
    }).catch((err) => {
      console.error("[API] Contact email failed (submission succeeded):", err);
    });

    return NextResponse.json({
      success: true,
      message: "Message saved successfully",
      data: { id: contact.id },
    });
  } catch (error) {
    console.error("[API] Contact submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save contact message",
        message: "Failed to save contact message",
      },
      { status: 500 }
    );
  }
}
