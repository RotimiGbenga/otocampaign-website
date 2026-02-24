import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { volunteerSchema } from "@/lib/validations";

export const runtime = "nodejs";

async function parseVolunteerBody(req: Request): Promise<unknown> {
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
    const skills = formData.getAll("skills");
    const availability = formData.getAll("availability");
    return {
      fullName: formData.get("fullName") ?? "",
      email: formData.get("email") ?? "",
      phone: formData.get("phone") ?? "",
      lga: formData.get("lga") ?? "",
      message: formData.get("message") ?? "",
      skills: skills.filter((v): v is string => typeof v === "string"),
      availability: availability.filter((v): v is string => typeof v === "string"),
    };
  }

  throw new Error("Unsupported content type. Use JSON or FormData.");
}

export async function POST(req: Request) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await parseVolunteerBody(req);
    } catch (parseError) {
      const msg = parseError instanceof Error ? parseError.message : "Invalid request body";
      console.error("[VOLUNTEER] Parse error:", msg);
      return NextResponse.json(
        { success: false, message: msg },
        { status: 400 }
      );
    }

    const parsed = volunteerSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      const message = firstError?.message ?? "Validation failed. Please check required fields.";
      return NextResponse.json(
        { success: false, message, details: parsed.error.flatten().fieldErrors },
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
        message: message || "",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Volunteer registered successfully",
        data: volunteer,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const code = error && typeof error === "object" && "code" in error ? (error as { code?: string }).code : undefined;
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("[VOLUNTEER] POST failed:", { code, message: errMessage, err: error });

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process volunteer submission",
        error: errMessage,
      },
      { status: 500 }
    );
  }
}