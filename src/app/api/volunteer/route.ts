import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { volunteerSchema } from "@/lib/validations";
import { sendVolunteerNotification } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const state = String(formData.get("state") ?? "").trim();
    const lga = String(formData.get("lga") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const occupation = String(formData.get("occupation") ?? "").trim();
    const supportType = formData
      .getAll("supportType")
      .filter((v): v is string => typeof v === "string");
    const skills = formData
      .getAll("skills")
      .filter((v): v is string => typeof v === "string");
    const availability = formData
      .getAll("availability")
      .filter((v): v is string => typeof v === "string");
    const contactPermission = String(formData.get("contactPermission") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const parsed = volunteerSchema.safeParse({
      fullName,
      email,
      phone,
      country,
      state,
      lga: lga || "",
      city: city || undefined,
      occupation: occupation || undefined,
      message: message || undefined,
      supportType,
      skills,
      availability,
      contactPermission: contactPermission || undefined,
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      const errMessage =
        firstError?.message ?? "Validation failed. Please check required fields.";
      return NextResponse.json(
        { success: false, message: errMessage, details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName: fn, email: em, phone: ph, lga: lg, message: msg } = parsed.data;

    const volunteer = await prisma.volunteer.create({
      data: {
        fullName: fn,
        email: em,
        phone: ph,
        country: parsed.data.country,
        state: parsed.data.state,
        lga: (lg ?? parsed.data.lga) || "",
        message: msg || "",
      },
    });

    sendVolunteerNotification({
      fullName: volunteer.fullName,
      email: volunteer.email,
      phone: volunteer.phone,
      country: volunteer.country ?? undefined,
      state: volunteer.state ?? undefined,
      lga: volunteer.lga ?? undefined,
      supportType: supportType.length ? supportType : undefined,
      occupation: occupation || undefined,
      skills: skills.length ? skills : undefined,
      availability: availability.length ? availability : undefined,
      contactPermission: contactPermission || undefined,
      message: volunteer.message ?? undefined,
      createdAt: volunteer.createdAt,
    }).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[VOLUNTEER] Email notification failed (submission succeeded):", { message: msg, err });
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
        detail: process.env.NODE_ENV === "development" ? errMessage : undefined,
      },
      { status: 500 }
    );
  }
}