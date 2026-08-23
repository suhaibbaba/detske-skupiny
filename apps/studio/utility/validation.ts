export function phoneValidator(val: unknown): true | string {
  if (!val) return true; // allow empty if not required

  const value = String(val).trim();

  // Normalize unicode spaces (NBSP etc.) to regular space
  const normalized = value.replace(/\p{Zs}+/gu, " ");

  // Count digits
  const digits = normalized.replace(/\D/g, "");
  if (digits.length < 7) return "Enter at least 7 digits.";

  // Check allowed characters
  const allowed = /^[0-9()\s+.\-]+$/u.test(normalized);
  if (!allowed) return "Only digits, spaces, (), -, . and + are allowed.";

  // Check only one leading +
  if (/\+/g.test(normalized.replace(/^\+/, ""))) {
    return "Only a single leading + is allowed.";
  }

  return true;
}
