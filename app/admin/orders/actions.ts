"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(
  orderId: string,
  status: "approved" | "rejected" | "pending",
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Update order status error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  return { success: true };
}
