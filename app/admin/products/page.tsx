import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { ProductsTable } from "./ProductsTable";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="px-3 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto bg-white py-3 px-3 rounded-2xl">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-0 text-sm text-gray-700">
            A list of all agricultural input products including name, price, and
            stock.
          </p>
        </div>
        <div className="mt-4 rounded-b-full sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <ProductsTable products={products || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
