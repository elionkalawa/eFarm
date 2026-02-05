import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, data } = body;
    if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });

    const supabase = await createAdminClient();
    const { error } = await supabase.from("profiles").update(data).eq("id", userId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
