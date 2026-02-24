import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { sendContactNotification } from "@/lib/email";
import type { ContactResponse } from "@/lib/types/api";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const parsed = contactSchema.safeParse({
      name,
      email,
      ...(phone ? { phone } : {}),
      message,
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      const errMessage =
        firstError?.message ?? "Validation failed. Please check required fields.";
      return NextResponse.json(
        {
          success: false,
          error: errMessage,
          message: errMessage,
          details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        },
        { status: 400 }
      );
    }

    const { name: validName, email: validEmail, phone: validPhone, message: validMessage } = parsed.data;

    const contact = await prisma.contact.create({
      data: {
        name: validName,
        email: validEmail,
        phone: validPhone ?? null,
        message: validMessage,
      },
    });

    sendContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      createdAt: contact.createdAt,
    }).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[CONTACT] Email notification failed (submission succeeded):", { message: msg, err });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message saved successfully",
        data: { id: contact.id },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const code = error && typeof error === "object" && "code" in error ? (error as { code?: string }).code : undefined;
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("[CONTACT] POST failed:", { code, message: errMessage, err: error });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save contact message",
        message: "Failed to save contact message",
        detail: process.env.NODE_ENV === "development" ? errMessage : undefined,
      },
      { status: 500 }
    );
  }
}
