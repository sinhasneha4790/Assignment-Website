/**
 * PIN-code serviceability and delivery estimates from our Guwahati warehouse.
 * Approximate by postal region until a courier partner's API is wired in
 * (open question for the owner). Shared by /api/pincode and checkout.
 */

/** India Post postal circles by the first two digits of the PIN. */
const STATES: [number, number, string][] = [
  [11, 11, "Delhi"],
  [12, 13, "Haryana"],
  [14, 16, "Punjab"],
  [17, 17, "Himachal Pradesh"],
  [18, 19, "Jammu & Kashmir"],
  [20, 28, "Uttar Pradesh"],
  [30, 34, "Rajasthan"],
  [36, 39, "Gujarat"],
  [40, 44, "Maharashtra"],
  [45, 48, "Madhya Pradesh"],
  [49, 49, "Chhattisgarh"],
  [50, 50, "Telangana"],
  [51, 53, "Andhra Pradesh"],
  [56, 59, "Karnataka"],
  [60, 64, "Tamil Nadu"],
  [67, 69, "Kerala"],
  [70, 74, "West Bengal"],
  [75, 77, "Odisha"],
  [78, 78, "Assam"],
  [79, 79, "North East"],
  [80, 85, "Bihar & Jharkhand"],
];

export type PincodeInfo =
  | { ok: true; pincode: string; state: string; minDays: number; maxDays: number; cod: boolean; deliveryBy: string }
  | { ok: false; error: string };

export function isValidPincode(pin: string): boolean {
  return /^[1-8]\d{5}$/.test(pin);
}

/** Adds working days (Mon–Sat) to a date, in IST. */
export function addWorkingDays(from: Date, days: number): Date {
  const d = new Date(from.getTime());
  let added = 0;
  while (added < days) {
    d.setUTCDate(d.getUTCDate() + 1);
    const ist = new Date(d.getTime() + 330 * 60_000);
    if (ist.getUTCDay() !== 0) added++;
  }
  return d;
}

export function formatDeliveryDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

export function lookupPincode(pin: string, now = new Date()): PincodeInfo {
  if (!isValidPincode(pin)) return { ok: false, error: "Enter a valid 6-digit PIN code." };
  const prefix = Number(pin.slice(0, 2));
  const region = STATES.find(([lo, hi]) => prefix >= lo && prefix <= hi);
  if (!region) return { ok: false, error: "We don’t deliver to this PIN code yet." };
  const state = region[2];
  // Guwahati warehouse: Assam is next door, the rest of the North East a day more, metros 4–6 days.
  const [minDays, maxDays] = prefix === 78 ? [1, 2] : prefix === 79 ? [3, 5] : prefix === 70 || prefix === 71 ? [3, 4] : [4, 6];
  return { ok: true, pincode: pin, state, minDays, maxDays, cod: true, deliveryBy: formatDeliveryDate(addWorkingDays(now, maxDays)) };
}
