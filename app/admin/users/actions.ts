"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";

export async function updateUserRoleAction(
  userId: string,
  newRole: "admin" | "user",
) {
  const supabase = await createAdminClient();
  const user = await getUser();

  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  // Prevent admin from removing their own admin status (safety check)
  if (user.id === userId && newRole === "user") {
    return { success: false, error: "You cannot remove your own admin status" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Update role error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  const supabase = await createAdminClient();
  const user = await getUser();

  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  // Prevent admin from deleting themselves
  if (user.id === userId) {
    return { success: false, error: "You cannot delete your own account" };
  }

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) {
    console.error("Delete user error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
