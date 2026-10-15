export function generateUsername(email: string): string {
  const prefix = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix.substring(0, 12)}_${suffix}`;
}
