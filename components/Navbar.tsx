"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export default function Navbar() {
  const { user, profile, signOut: handleSignOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = profile?.role === "admin";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-indigo-600 tracking-tight"
              >
                eFarm Inputs
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href={user ? "/home" : "/"}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              {user && (
                <>
                  <Link
                    href="/home"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Catalogue
                  </Link>
                  <Link
                    href="/orders"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="border-transparent text-indigo-600 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {profile?.full_name || user.email}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium uppercase",
                    isAdmin
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800",
                  )}
                >
                  {isAdmin ? "Admin" : "User"}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("sm:hidden", isOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                href={isAdmin ? "/admin/products" : "/products"}
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href={isAdmin ? "/admin/orders" : "/orders"}
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Orders
              </Link>
            </>
          )}
        </div>
        <div className="pt-4 pb-4 border-t border-gray-200">
          {user ? (
            <div className="flex items-center px-4">
              <div className="shrink-0">
                <User className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {profile?.full_name || user.email}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user.email}
                </div>
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="ml-auto bg-white shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-1 px-2">
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
