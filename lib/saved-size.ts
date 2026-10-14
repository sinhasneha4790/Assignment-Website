import "server-only";
import { cookies } from "next/headers";
import { isSavableSize, SAVED_SIZE_COOKIE } from "@/lib/listing-params";

/** The shopper's saved size (cookie for now; the "self" family profile from phase 4). */
export async function getSavedSize(): Promise<string | null> {
  const raw = (await cookies()).get(SAVED_SIZE_COOKIE)?.value;
  if (!raw) return null;
  let v: string;
  try {
    v = decodeURIComponent(raw);
  } catch {
    return null;
  }
  return isSavableSize(v) ? v : null;
}
