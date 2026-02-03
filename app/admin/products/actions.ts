"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveProductAction(formData: {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  image_url: string | null;
}) {
  const supabase = await createClient();

  const productData = {
    name: formData.name,
    category: formData.category,
    description: formData.description,
    price: Number(formData.price),
    stock_quantity: Number(formData.stock_quantity),
    is_active: formData.is_active,
    image_url: formData.image_url,
  };

  try {
    if (formData.id) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", formData.id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase.from("products").insert([productData]);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/home");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return { success: false, error: message };
  }
}
