import { NextResponse } from "next/server";
import { clearSession, currentUser } from "@/lib/auth";
import { logAccess } from "@/lib/accesslog";

export async function POST(req: Request) {
  const user = await currentUser();
  if (user) await logAccess(req, { userId: user.id, email: user.email, event: "logout" });
  await clearSession();
  return NextResponse.json({ ok: true });
}
