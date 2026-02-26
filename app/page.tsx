"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import { useAuth } from "@/providers/AuthProvider";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="w-full">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden pt-20">
        <Image
          src="/catalog prod.jpg"
          alt="Farm with tractor"
          fill
          className="absolute inset-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white w-full">
          <div className="max-w-xl">
            <div className="inline-block bg-green-900/30 border border-green-500 rounded-full px-4 py-1 mb-6">
              <span className="text-green-300 text-sm font-medium">Quality Farm Inputs</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Premium Farm Inputs & <br />Agricultural Solutions
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Access high-quality seeds, fertilizers, equipment, and feeds to boost your farm productivity and yields. Trusted by thousands of farmers across the region.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={user ? "/home" : "/register"}>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-colors">
                  {user ? "Explore Products" : "Get Started"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <button className="border-2 border-green-400 text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-yellow-400 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">5000+ Farmers</h3>
                <p className="text-gray-700">Trust eFarm for quality inputs</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                🌾
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Increased Yields</h3>
                <p className="text-gray-700">Average 30% productivity boost</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                🚚
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Fast Delivery</h3>
                <p className="text-gray-700">Next-day delivery available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Product Categories
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to succeed in modern farming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Seeds */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-64 relative bg-gray-200 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=500&auto=format&fit=crop"
                  alt="Seeds"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="bg-green-700 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Premium Seeds</h3>
                <p className="text-green-100 mb-4">
                  High-quality, certified seeds with superior germination rates for improved yields.
                </p>
                <Link href={user ? "/home?category=Seeds" : "/register"} className="inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors font-semibold">
                  Browse Seeds
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Fertilizers */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-64 relative bg-gray-200 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad576?q=80&w=500&auto=format&fit=crop"
                  alt="Fertilizer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="bg-green-700 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Balanced Fertilizers</h3>
                <p className="text-green-100 mb-4">
                  Soil-tested and balanced nutrients for optimal crop growth and soil health.
                </p>
                <Link href={user ? "/home?category=Fertilizer" : "/register"} className="inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors font-semibold">
                  Browse Fertilizers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Equipment & Feeds */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-64 relative bg-gray-200 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=500&auto=format&fit=crop"
                  alt="Equipment & Feeds"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="bg-green-700 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Equipment & Feeds</h3>
                <p className="text-green-100 mb-4">
                  Reliable farm tools, pesticides, and premium livestock feeds for complete farming needs.
                </p>
                <Link href={user ? "/home" : "/register"} className="inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors font-semibold">
                  Browse All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose eFarm?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Quality Assured</h3>
                    <p className="text-gray-600">All products tested and certified for quality and safety</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Expert Support</h3>
                    <p className="text-gray-600">Access to agricultural experts and farming guidance</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Fair Pricing</h3>
                    <p className="text-gray-600">Competitive prices with bulk discounts available</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Reliable Delivery</h3>
                    <p className="text-gray-600">Fast and dependable shipping across the region</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad576?q=80&w=600&auto=format&fit=crop"
                alt="Farm"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers who are boosting their productivity with eFarm inputs.
          </p>
          <Link href={user ? "/home" : "/register"}>
            <button className="bg-white hover:bg-gray-100 text-green-700 font-bold py-3 px-8 rounded-full transition-colors text-lg">
              Start Shopping Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
