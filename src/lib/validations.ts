import { z } from "zod";

function buildStructuredMessage(opts: {
  supportType?: string[];
  occupation?: string;
  city?: string;
  skills?: string[];
  availability?: string[];
  contactPermission?: string;
}): string {
  const parts: string[] = [];
  if (opts.supportType?.length) {
    parts.push(`Support Type: ${opts.supportType.join(", ")}`);
  }
  if (opts.occupation?.trim()) {
    parts.push(`Occupation: ${opts.occupation.trim()}`);
  }
  if (opts.city?.trim()) {
    parts.push(`City: ${opts.city.trim()}`);
  }
  if (opts.skills?.length) {
    parts.push(`Skills: ${opts.skills.join(", ")}`);
  }
  if (opts.availability?.length) {
    parts.push(`Availability: ${opts.availability.join(", ")}`);
  }
  if (opts.contactPermission) {
    parts.push(`Contact Permission: ${opts.contactPermission}`);
  }
  return parts.join("\n") || "";
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
    .transform((s) => (typeof s === "string" ? s.trim() : "") || "")
    .optional()
    .default(""),
  message: z.string().max(2000).optional().default(""),
  supportType: z.array(z.string()).optional(),
  occupation: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  contactPermission: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
}).transform((data) => {
  const message =
    data.message ||
    buildStructuredMessage({
      supportType: data.supportType,
      occupation: data.occupation,
      city: data.city,
      skills: data.skills,
      availability: data.availability,
      contactPermission: data.contactPermission,
    });
  return {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    state: data.state,
    lga: data.lga || "",
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
