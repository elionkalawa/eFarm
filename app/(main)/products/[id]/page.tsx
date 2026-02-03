import { createAdminClient as createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import OrderForm from "@/components/OrderForm";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { getUser } = await import("@/lib/auth");

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const user = await getUser();

  return (
    <div className="bg-white">
      <div className="pt-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <div className="flex flex-col-reverse">
              <div className="aspect-h-1 aspect-w-1 w-full relative h-[400px]">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover object-center sm:rounded-lg"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 sm:rounded-lg">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  KES {product.price}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      product.stock_quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Category: {product.category}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">
                  Description
                </h3>
                <div className="mt-2 text-base text-gray-500">
                  {product.description || "No description available."}
                </div>
              </div>

              <div className="mt-10">
                <OrderForm product={product} user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
