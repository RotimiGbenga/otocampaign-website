/**
 * SMS service layer – ready for future providers (Termii, Twilio, Africa's Talking).
 * Phone numbers should be in E.164 format for API compatibility.
 */

/**
 * Normalizes Nigerian phone to E.164 format (+234...).
 * Handles: 080..., 234..., +234..., 802...
 */
export function normalizeToE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    const local = digits.slice(-10);
    if (local.startsWith("0")) {
      return "+234" + local.slice(1);
    }
    if (digits.startsWith("234")) {
      return "+" + digits;
    }
    return "+234" + local;
  }
  return phone;
}

export type SmsProvider = "termii" | "twilio" | "africas_talking";

export interface SmsSendOptions {
  to: string;
  message: string;
  provider?: SmsProvider;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Placeholder for future SMS provider integration.
 * Configure provider via env: SMS_PROVIDER, TERMII_API_KEY, TWILIO_*, etc.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendSms(_options: SmsSendOptions): Promise<SmsSendResult> {
  return {
    success: false,
    error: "SMS not yet configured. Add provider (Termii, Twilio, Africa's Talking) in lib/sms.ts",
  };
}
