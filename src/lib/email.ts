import "server-only";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  _transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
  return _transporter;
}

function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.ADMIN_EMAIL &&
    (process.env.SMTP_USER || process.env.SMTP_HOST.includes("localhost"))
  );
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type VolunteerNotificationData = {
  fullName: string;
  email: string;
  phone: string;
  lga: string;
  skills?: string[];
  availability?: string[];
  message?: string;
  createdAt: Date;
};

export type ContactNotificationData = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  createdAt: Date;
};

/**
 * Sends volunteer notification email. Never throws – failures are logged only.
 * Form submissions succeed even if email fails.
 */
export async function sendVolunteerNotification(
  data: VolunteerNotificationData
): Promise<void> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMAIL] SMTP not configured – skipping volunteer notification");
    }
    return;
  }

  try {
    const transporter = getTransporter();
    if (!transporter) return;

    const adminEmail = process.env.ADMIN_EMAIL!;
    const skills = data.skills?.length
      ? escapeHtml(data.skills.join(", "))
      : (data.message?.match(/Skills:\s*([^|]+)/)?.[1]?.trim() ?? "-");
    const availability = data.availability?.length
      ? escapeHtml(data.availability.join(", "))
      : (data.message?.match(/Availability:\s*([^|]+)/)?.[1]?.trim() ?? "-");

    const html = `
      <h2>New Volunteer – OTO Campaign</h2>
      <p>A new supporter has registered as a volunteer.</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Full Name</strong></td><td>${escapeHtml(data.fullName)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(data.phone)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td><strong>LGA</strong></td><td>${escapeHtml(data.lga)}</td></tr>
        <tr><td><strong>Skills & Availability</strong></td><td>${skills === "-" && availability === "-" ? "-" : `${skills} | ${availability}`}</td></tr>
        <tr><td><strong>Submission Date</strong></td><td>${formatTimestamp(data.createdAt)}</td></tr>
      </table>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? adminEmail,
      to: adminEmail,
      subject: "New Volunteer – OTO Campaign",
      html,
    });
  } catch (err) {
    console.error("[EMAIL] Volunteer notification failed:", err);
  }
}

/**
 * Sends contact notification email. Never throws – failures are logged only.
 * Form submissions succeed even if email fails.
 */
export async function sendContactNotification(
  data: ContactNotificationData
): Promise<void> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[EMAIL] SMTP not configured – skipping contact notification");
    }
    return;
  }

  try {
    const transporter = getTransporter();
    if (!transporter) return;

    const adminEmail = process.env.ADMIN_EMAIL!;
    const html = `
      <h2>New Contact – OTO Campaign</h2>
      <p>A new message has been received through the contact form.</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(data.name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(data.phone ?? "-")}</td></tr>
        <tr><td><strong>Message</strong></td><td>${escapeHtml(data.message)}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${formatTimestamp(data.createdAt)}</td></tr>
      </table>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? adminEmail,
      to: adminEmail,
      subject: "New Contact Message – OTO Campaign",
      html,
    });
  } catch (err) {
    console.error("[EMAIL] Contact notification failed:", err);
  }
}
