import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { sendContactNotification } from "@/lib/email";
import type { ContactResponse } from "@/lib/types/api";

export const runtime = "nodejs";

async function parseContactBody(req: NextRequest): Promise<unknown> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return (await req.json()) as unknown;
    } catch {
      throw new Error("Invalid JSON body");
    }
  }

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await req.formData();
    return {
      name: formData.get("name") ?? "",
      email: formData.get("email") ?? "",
      phone: formData.get("phone") ?? "",
      message: formData.get("message") ?? "",
    };
  }

  throw new Error("Unsupported content type. Use JSON or FormData.");
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
  try {
    let body: unknown;
    try {
      body = await parseContactBody(request);
    } catch (parseError) {
      const msg = parseError instanceof Error ? parseError.message : "Invalid request body";
      console.error("[CONTACT] Parse error:", msg);
      return NextResponse.json(
        { success: false, error: msg, message: msg },
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
    const message = error instanceof Error ? error.message : String(error);
    console.error("[CONTACT] POST failed:", { code, message, err: error });
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
