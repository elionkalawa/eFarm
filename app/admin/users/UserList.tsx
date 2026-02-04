"use client";

import { useState } from "react";
import { updateUserRoleAction, deleteUserAction } from "./actions";
import { Loader2, Shield, User, ShieldAlert, MapPin, Mail, Phone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at: string;
  location?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === currentUserId) {
      alert("You cannot delete your own account.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(userId);
    try {
      const result = await deleteUserAction(userId);
      if (result.success) {
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Delete user failed:", err);
      alert("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-8 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex flex-col items-center pt-6 pb-4">
              {/* Avatar */}
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white mb-3 overflow-hidden">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8" />
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-900">
                {user.full_name || "Unnamed User"}
              </h3>

              {/* Role Badge */}
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold mt-2 ${
                  user.role === "admin"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Card Body */}
            <div className="px-6 py-4 space-y-3">
              {/* Location */}
              {user.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{user.location}</span>
                </div>
              )}

              {/* Email */}
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">{user.email}</span>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{user.phone}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Card Footer - Action Buttons */}
            <div className="px-2 py-2 flex gap-1">
              <button
                onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
                disabled={deletingId === user.id || loadingId === user.id}
                className="flex-[1] inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-2xl shadow-sm text-red-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === user.id ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <Trash2 className="mr-0 h-4 w-4" />
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleRoleToggle(user.id, user.role)}
                disabled={loadingId === user.id || deletingId === user.id}
                className={`flex-[4] inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-2xl shadow-sm text-white transition-colors ${
                  user.role === "admin"
                    ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                    : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
