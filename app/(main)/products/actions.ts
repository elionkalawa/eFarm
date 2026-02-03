"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function placeOrderAction(data: {
  product_id: string;
  user_id: string;
  quantity: number;
  total_price: number;
}) {
  const supabase = await createAdminClient();

  // 1. Double check stock before final insert
  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", data.product_id)
    .single();

  if (!product || product.stock_quantity < data.quantity) {
    return { success: false, error: "Insufficient stock." };
  }

  // 2. Insert the order
  const { error: insertError } = await supabase.from("orders").insert({
    product_id: data.product_id,
    user_id: data.user_id,
    quantity: data.quantity,
    total_price: data.total_price,
    status: "pending",
  });

  if (insertError) {
    console.error("Order insertion error:", insertError);
    return { success: false, error: insertError.message };
  }

  // 3. Update product stock (MVP simplicity, ideally in a transaction)
  const { error: updateError } = await supabase
    .from("products")
    .update({ stock_quantity: product.stock_quantity - data.quantity })
    .eq("id", data.product_id);

  if (updateError) {
    console.error("Stock update error:", updateError);
    // Even if this fails, the order has been placed.
    // In a production app, we would use a DB transaction.
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath(`/products/${data.product_id}`);

  return { success: true };
}
