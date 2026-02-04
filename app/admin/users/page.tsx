import { createAdminClient } from "@/lib/supabase/server";
import UserList from "./UserList";
import { getUser } from "@/lib/auth";

export default async function AdminUsersPage() {
  const supabase = await createAdminClient();

  // Fetch profiles containing everything (including emails now)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = profiles || [];
  const currentUser = await getUser();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto bg-gray-100/90 py-3 px-3 rounded-2xl">
          <h1 className="text-xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all registered users. You can grant or revoke
            administrative privileges here.
          </p>
        </div>
      </div>

      <UserList initialUsers={users} currentUserId={currentUser?.id || ""} />
    </div>
  );
}
