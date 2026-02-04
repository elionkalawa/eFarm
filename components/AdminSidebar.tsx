"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Add Product", href: "/admin/products/create", icon: PlusCircle },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen sticky top-0",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <Link href="/admin" className="text-xl font-bold text-indigo-600">
            EFarm
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600",
              )}
            >
              <item.icon
                size={22}
                className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "group-hover:text-indigo-600",
                )}
              />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-4 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full",
            collapsed ? "justify-center" : "",
          )}
        >
          <LogOut size={22} />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
