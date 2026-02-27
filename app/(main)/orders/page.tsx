import { createAdminClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="mb-4">
      <div className="mx-auto max-w-8xl px-0 sm:px-4 lg:px-0.5">
        <div className="rounded-4xl overflow-hidden relative">
          <Image
            src="/576.jpg"
            alt="Catalog background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/20" />
          <div className="relative text-white p-2 m-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 pr-6 px-4 py-2 bg-white/5 rounded-3xl backdrop-blur-xs shadow-2xl">
              <h2 className="text-3xl md:text-3xl hover:scale-110 transition-transform duration-300 font-extrabold font-sans leading-tight ">
                Simamia Orders Zako kwa Urahisi!
              </h2>
              <p className="text-sm md:text-base hover:scale-105 transition-transform duration-300 text-indigo-100 mb-6">
                            Angalia, fuatilia, na dhibiti oda zako zote mahali pamoja.              </p>
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function OrdersPage() {
  const supabase = await createAdminClient();
  const user = await getUser();

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please log in to view your orders.</p>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      products (
        name,
        price,
        image_url,
        description
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });


  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Your Orders
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Orders Zako place moja!.
      </p>

      <div className="mt-8 space-y-6">
        {orders?.map((order) => {
          const price = order.products?.price || 0;
          const total = order.quantity * price;
          const statusClass =
            order.status === "approved"
              ? "text-green-600"
              : order.status === "rejected"
              ? "text-red-600"
              : "text-yellow-600";

          let statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
          if (order.status === "approved") {
            statusText = "Delivered";
          }

          return (
            <div
              key={order.id}
              className="bg-white shadow-2xl sm:rounded-lg p-6"
            >
              {/* header with order info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <div className="text-sm text-gray-500">
                  Order Number: <span className="font-semibold">#{order.id.slice(0,8)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Order Date: <span className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Total Amount: <span className="font-semibold">
                    KES {total.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  Status:{' '}
                  <span className={statusClass}>{statusText}</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/orders/${order.id}/invoice`}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Invoice
                  </Link>
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-3 py-1 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    View Order
                  </Link>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex items-center space-x-5">
                {order.products?.image_url && (
                  <Image
                    src={order.products.image_url}
                    alt={order.products.name}
                    width={110}
                    height={110}
                    className="rounded-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-lg">
                    {order.products?.name || 'Unknown Product'}
                  </div>
                  {order.products?.description && (
                    <div className="text-sm text-gray-500 w-1/2 line-clamp-2">
                      {order.products.description}
                    </div>
                  )}
                  <div className="text-lg text-green-500">
                    Quantity : {order.quantity}
                  </div>
                </div>
                <div className="font-semibold text-2xl text-gray-900">
                  KES {total.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        {(!orders || orders.length === 0) && (
          <div className="py-10 text-center text-gray-500">
            You haven&apos;t placed any orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
