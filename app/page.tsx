"use client";

import Link from "next/link";
import { Leaf, ShieldCheck, Truck, User, ArrowRight } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import { useAuth } from "@/providers/AuthProvider";

export default function LandingPage() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
              Empowering Farmers with <br />
              <span className="text-indigo-600">Smart Agriculture</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
              Access certified fertilizers, seeds, and expert tools to maximize
              your farm&apos;s productivity. All in one secure digital
              marketplace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={
                  user ? (isAdmin ? "/admin/orders" : "/home") : "/register"
                }
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                {user ? "Enter Dashboard" : "Start Free Trial"}
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                Browse Catalogue
              </Link>
            </div>
          </div>
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">
              Core Benefits
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900">
              Why choose eFarm?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Leaf className="text-white" />}
              title="Certified Inputs"
              description="100% verified seeds and fertilizers from top global manufacturers."
            />
            <FeatureCard
              icon={<Truck className="text-white" />}
              title="Global Logistics"
              description="Real-time tracking for every order directly to your local distribution point."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-white" />}
              title="Secure Escrow"
              description="Your money is safe until you confirm receipt of quality products."
            />
            <FeatureCard
              icon={<User className="text-white" />}
              title="Expert Support"
              description="24/7 access to agricultural experts and platform technical support."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-indigo-100">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-indigo-100">Certified Suppliers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-indigo-100">Orders Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-indigo-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold text-indigo-600">eFarm</div>
          <div className="text-gray-500 text-sm">
            © 2026 eFarm. All agricultural rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-indigo-600">
              Twitter
            </Link>
            <Link href="#" className="text-gray-400 hover:text-indigo-600">
              Facebook
            </Link>
            <Link href="#" className="text-gray-400 hover:text-indigo-600">
              LinkedIn
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-all hover:translate-y-[-4px]">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
