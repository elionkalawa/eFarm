"use client";

import { useState } from "react";
import { updateUserRoleAction } from "./actions";
import { Loader2, Shield, User, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at: string;
}

interface UserListProps {
  initialUsers: Profile[];
  currentUserId: string;
}

export default function UserList({
  initialUsers,
  currentUserId,
}: UserListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    if (userId === currentUserId && newRole === "user") {
      alert("You cannot remove your own admin status.");
      return;
    }

    if (
      !confirm(`Are you sure you want to change this users role to ${newRole}?`)
    ) {
      return;
    }

    setLoadingId(userId);
    try {
      const result = await updateUserRoleAction(userId, newRole);
      if (result.success) {
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Role update failed:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Joined
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {initialUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          <User className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.full_name || "Unnamed User"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {user.email}
                          </div>
                          <div className="text-gray-400 text-[10px] truncate max-w-[150px]">
                            {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        disabled={loadingId === user.id}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                          user.role === "admin"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } disabled:opacity-50`}
                      >
                        {loadingId === user.id ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : user.role === "admin" ? (
                          <>
                            <ShieldAlert className="mr-1.5 h-4 w-4" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <Shield className="mr-1.5 h-4 w-4" />
                            Make Admin
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
