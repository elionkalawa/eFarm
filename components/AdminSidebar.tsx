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
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const mainItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Add Product", href: "/admin/products/create", icon: PlusCircle },
];

const supportItems = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();
  
  const [dark, setDark] = useState<boolean>(false);
  const menuItems = [...mainItems, ...supportItems];

  // Initialize theme from localStorage or prefers-color-scheme
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) {
        const isDark = stored === "dark";
        setDark(isDark);
        document.documentElement.classList.toggle("dark", isDark);
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    } catch (e) {
      // ignore during SSR or if localStorage isn't available
    }
  }, []);

  function toggleDark() {
    try {
      const next = !dark;
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (e) {}
  }

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen sticky top-0",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div>
            <Link href="/admin" className="text-3xl font-bold text-indigo-600">
              EFarm
            </Link>
            <p className="text-xs text-gray-500 mt-1">Manage your products and orders</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-4 mt-4">
        {/* Main section */}
        <div className="px-3 text-xs text-gray-400 font-semibold uppercase">
          {!collapsed ? "Main" : ""}
        </div>
        <div className="space-y-2">
          {mainItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-gray-600 hover:bg-green-100 hover:text-green-600",
                )}
              >
                <item.icon
                  size={22}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-white" : "group-hover:text-green-600",
                  )}
                />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Support section */}
        <div className="mt-4 px-3 text-xs text-gray-400 font-semibold uppercase">
          {!collapsed ? "Support" : ""}
        </div>
        <div className="space-y-2">
          {supportItems.map((item) => {
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
                <item.icon size={22} className={cn(isActive ? "text-white" : "group-hover:text-indigo-600")} />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
          
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className={cn(
              "flex items-center gap-4 px-3 py-3 rounded-xl transition-all w-full",
              "text-gray-600 hover:bg-gray-50 hover:text-indigo-600",
            )}
          >
            {dark ? <Sun size={22} /> : <Moon size={22} />}
            {!collapsed && <span className="font-medium">{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>
        </div>
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
