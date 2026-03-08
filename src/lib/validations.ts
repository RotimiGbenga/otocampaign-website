import { z } from "zod";

function buildMessageFromSkillsAvailability(
  skills: string[],
  availability: string[]
): string {
  const parts: string[] = [];
  if (skills.length > 0) {
    parts.push(`Skills: ${skills.join(", ")}`);
  }
  if (availability.length > 0) {
    parts.push(`Availability: ${availability.join(", ")}`);
  }
  return parts.join(" | ") || "";
}

export const volunteerSchema = z.object({
  fullName: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "Full name is required").max(200)),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase(),
  phone: z.string().min(1, "Phone is required").max(50),
  country: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "Country is required").max(100)),
  state: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "State is required").max(100)),
  lga: z
    .union([z.string(), z.undefined(), z.null()])
    .transform((s) => (typeof s === "string" ? s.trim() : "") || undefined)
    .optional(),
  message: z.string().max(2000).optional().default(""),
  skills: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
}).transform((data) => {
  const message =
    data.message ||
    buildMessageFromSkillsAvailability(
      data.skills ?? [],
      data.availability ?? []
    );
  return {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    state: data.state,
    lga: data.lga || undefined,
    message: message.slice(0, 2000),
  };
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200)
    .transform((s) => s.trim()),
  email: z.string().email("Invalid email address").toLowerCase(),
  phone: z.string().max(20).optional(),
  message: z.string().min(1, "Message is required").max(5000),
});

export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
