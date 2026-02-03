"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function LandingNavbar() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            eFarm
          </Link>

          <div className="hidden sm:flex space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Features
            </Link>
            <Link
              href="/products"
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Catalogue
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                href={isAdmin ? "/admin/orders" : "/home"}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Go to App
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
