import { describe, expect, it } from "vitest";
import { addWorkingDays, isValidPincode, lookupPincode } from "@/lib/pincode";

describe("pincode", () => {
  it("validates 6-digit Indian PIN codes", () => {
    expect(isValidPincode("781001")).toBe(true);
    expect(isValidPincode("081001")).toBe(false);
    expect(isValidPincode("78100")).toBe(false);
    expect(isValidPincode("abcdef")).toBe(false);
  });

  it("finds the state and a short estimate for Assam", () => {
    const r = lookupPincode("781001", new Date("2026-10-14T06:00:00Z"));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.state).toBe("Assam");
      expect(r.maxDays).toBe(2);
      expect(r.cod).toBe(true);
      expect(r.deliveryBy).toBe("Fri, 16 Oct");
    }
  });

  it("gives metros a longer estimate", () => {
    const r = lookupPincode("400001");
    expect(r.ok && r.state).toBe("Maharashtra");
    expect(r.ok && r.minDays).toBe(4);
  });

  it("rejects unknown regions", () => {
    expect(lookupPincode("999999").ok).toBe(false);
  });

  it("skips Sundays when adding working days", () => {
    // Sat 17 Oct 2026 + 1 working day = Mon 19 Oct.
    const d = addWorkingDays(new Date("2026-10-17T06:00:00Z"), 1);
    expect(d.toISOString().slice(0, 10)).toBe("2026-10-19");
  });
});
