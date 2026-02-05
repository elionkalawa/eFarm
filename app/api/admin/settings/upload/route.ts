import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const userId = form.get("userId") as string | null;
    if (!file || !userId) return NextResponse.json({ success: false, error: "file and userId required" }, { status: 400 });

    const supabase = await createAdminClient();

    const filename = `${Date.now()}-${file.name}`;
    const path = `${userId}/${filename}`;
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, new Uint8Array(buffer), { upsert: true });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    // Try to get public URL
    const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = (publicData as any)?.publicUrl || null;

    // Update profile record
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
