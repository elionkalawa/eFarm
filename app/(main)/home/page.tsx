"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search, SlidersHorizontal, Share2, ShoppingCart } from "lucide-react";

function HeroSection() {
  return (
    <section className="mb-6">
      <div className="mx-auto max-w-8xl px-0 sm:px-6 lg:px-0.5">
        <div className="rounded-2xl overflow-hidden relative">
          <Image
            src="/576.jpg"
            alt="Catalog background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/20" />
          <div className="relative text-white p-4 m-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 pr-6">
              <h2 className="text-4xl md:text-6xl hover:scale-110 transition-transform duration-300 font-extrabold font-sans leading-tight mb-4">
                Elevate your farm produce.
              </h2>
              <p className="text-sm md:text-base hover:scale-105 transition-transform duration-300 text-indigo-100 mb-6">
                From premium seeds and balanced fertilizers to reliable tools and nutritious feeds, we supply high-quality, field-tested inputs to help your farm thrive. Locally sourced, trusted by farmers, and backed by expert advice and fast delivery. Grow healthier crops and increase yields with products made for real farms.
              </p>
              <div className="flex hover:scale-102 transition-transform duration-300 gap-4">
                <button className="bg-indigo-600 hover:bg-green-500 hover:shadow-2xl text-white py-2 px-4 rounded-full shadow">
                  Shop with us today!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [supabase]);

  const filteredProducts = useMemo(() => {
    let result = [...products].filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, category, sortBy, products]);

  const categories = [
    "All",
    "Fertilizer",
    "Seeds",
    "Pesticides",
    "Equipment",
    "Feeds",
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products Catalogue
            </h1>
            <p className="text-gray-500">Find the best inputs for your farm.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-64 text-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid pointer-events-none grid-cols-1 gap-x-6 gap-y-10 bg-gray-50 shadow-sm px-4 rounded-2xl py-4 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-2">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="h-48 pointer-events-auto aspect-w-2 w-full overflow-hidden bg-gray-200 group-hover:opacity-75 relative ">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="h-full w-full object-fill object-center"
                    />
                  ) : (
                    <div className="h-12 w-full bg-gray-50 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div>
                    <div className="h-12">
                      <h3 className="text-sm  font-semibold text-black">
                      <Link href={`/products/${product.id}`}>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                        />
                        {product.name}
                      </Link>
                    </h3>
                    </div>
                    
                    <p className="mt-1 text-xs text-indigo-600 font-medium">
                      {product.category}
                    </p>
                    
                    <p className="mt-3 text-lg font-bold text-gray-900">
                      Ksh. {product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center gap-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <button className="w-full pointer-events-auto bg-indigo-600 hover:shadow-2xl hover:scale-109 ease-in-out duration-300 text-white py-2 px-1 rounded-full text-sm font-light hover:bg-green-500 transition-shadow">
                        View Details.
                      </button>
                    </Link>
                    <button className="text-indigo-600 hover:text-green-500 pointer-events-auto py-2 px-3 rounded-full text-sm font-bold transition-colors flex items-center justify-center">
                      <ShoppingCart className=" h-4 w-4 hover:animate-bounce transition duration-300" />
                    </button>
                    <Link href={`/products/${product.id}`}>
                      <button className="text-gray-700 py-2 px-2 hover:text-green-500 pointer-events-auto rounded-full text-sm font-bold transition-colors flex items-center justify-center">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
