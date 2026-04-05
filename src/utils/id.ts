/**
 * Generate a UUID v4 string.
 * Uses crypto.randomUUID() where available, with a fallback for
 * older browsers and non-secure contexts.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: RFC4122 v4 UUID via crypto.getRandomValues or Math.random
  const getRandomValues =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? (buf: Uint8Array) => crypto.getRandomValues(buf)
      : (buf: Uint8Array) => {
          for (let i = 0; i < buf.length; i++) {
            buf[i] = Math.floor(Math.random() * 256);
          }
          return buf;
        };

  const buf = new Uint8Array(16);
  getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40; // version 4
  buf[8] = (buf[8] & 0x3f) | 0x80; // variant 10

  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
