"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import type { PincodeInfo } from "@/lib/pincode";

/** PIN-code delivery check showing the date and COD availability. */
export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<PincodeInfo | null>(null);
  const [busy, setBusy] = useState(false);

  const check = async () => {
    if (!/^\d{6}$/.test(pin)) {
      setResult({ ok: false, error: "Enter a valid 6-digit PIN code." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/pincode/${pin}`);
      setResult((await res.json()) as PincodeInfo);
      try {
        localStorage.setItem("ff_pincode", pin);
      } catch {}
    } catch {
      setResult({ ok: false, error: "Couldn’t check right now. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-paper border border-line rounded-[4px] p-4">
      <label htmlFor="pincode" className="block text-[13px] font-semibold mb-2">Check delivery</label>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void check();
        }}
      >
        <input id="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="PIN code" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} className="flex-1 min-h-12 px-3.5 border border-field bg-white rounded-[2px]" />
        <button type="submit" disabled={busy} className={buttonClass("outline")}>Check</button>
      </form>
      <p aria-live="polite" className="text-[13px] mt-2 min-h-5">
        {result?.ok && (
          <span className="text-olive">
            ✓ Delivery by {result.deliveryBy} · {result.cod ? "Cash on delivery available" : "Prepaid only"}
          </span>
        )}
        {result && !result.ok && <span className="text-clay">{result.error}</span>}
      </p>
    </div>
  );
}
