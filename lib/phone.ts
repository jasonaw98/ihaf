const E164 = /^\+[1-9]\d{7,14}$/;

/**
 * Normalises a phone number to E.164. Local numbers without a country code
 * are treated as Malaysian (012-345 6789 → +60123456789). Null if invalid.
 */
export function normalizePhone(value: string | null | undefined) {
  if (!value) return null;
  let digits = value.trim().replace(/[\s().-]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  else if (digits.startsWith("60")) digits = `+${digits}`;
  else if (digits.startsWith("0")) digits = `+60${digits.slice(1)}`;
  return E164.test(digits) ? digits : null;
}

/** Friendlier display for Malaysian numbers: +60 12-345 6789. */
export function formatPhone(phone: string) {
  const match = phone.match(/^\+60(1\d)(\d{3,4})(\d{4})$/);
  return match ? `+60 ${match[1]}-${match[2]} ${match[3]}` : phone;
}

export function whatsappLink(phone: string) {
  return `https://wa.me/${phone.replace(/^\+/, "")}`;
}

export const PHONE_ERROR = "Enter a valid phone number, e.g. 012-345 6789.";
