import { NextResponse } from "next/server";
import { lookupPincode } from "@/lib/pincode";

/** City/state, delivery date and COD availability for a PIN code. Public. */
export async function GET(_req: Request, ctx: { params: Promise<{ pin: string }> }) {
  const { pin } = await ctx.params;
  const info = lookupPincode(pin);
  return NextResponse.json(info, {
    status: info.ok ? 200 : 400,
    headers: { "Cache-Control": "public, s-maxage=3600" },
  });
}
