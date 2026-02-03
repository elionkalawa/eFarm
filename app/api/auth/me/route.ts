import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { User } from "@/types";

export async function GET() {
  const session = await getSession();

  if (!session) {
    console.log("[USER_API] No session found");
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = session.user as User;
  console.log("[USER_API] Session found for:", user.email, "Role:", user.role);
  return NextResponse.json({ user });
}
