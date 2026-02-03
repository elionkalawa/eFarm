"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { hashPassword, comparePassword, login } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AuthFormData {
  email?: string;
  password?: string;
  fullName?: string;
}

export async function loginAction(formData: AuthFormData) {
  const supabase = await createAdminClient();

  if (!formData.email || !formData.password) {
    return { success: false, error: "Email and password are required." };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", formData.email)
    .single();

  if (error || !profile) {
    return { success: false, error: "Invalid email or password." };
  }

  const passwordMatch = await comparePassword(
    formData.password,
    profile.password_hash,
  );

  if (!passwordMatch) {
    return { success: false, error: "Invalid email or password." };
  }

  // Create custom JWT session
  await login({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
  });

  return { success: true };
}

export async function registerAction(formData: AuthFormData) {
  const supabase = await createAdminClient();

  if (!formData.email || !formData.password || !formData.fullName) {
    return { success: false, error: "All fields are required." };
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", formData.email)
    .single();

  if (existingUser) {
    return { success: false, error: "A user with this email already exists." };
  }

  const hashedPassword = await hashPassword(formData.password);
  const userId = crypto.randomUUID();

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        email: formData.email,
        password_hash: hashedPassword,
        full_name: formData.fullName,
        role: "user",
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Automatically log in after registration
  await login({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
  });

  return { success: true, hasSession: true };
}

export async function logoutAction() {
  const { logout } = await import("@/lib/auth");
  await logout();
  redirect("/login");
}
