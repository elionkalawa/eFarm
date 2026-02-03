"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { Product, User } from "@/types";
import { placeOrderAction } from "@/app/(main)/products/actions";

export default function OrderForm({
  product,
  user,
}: {
  product: Product;
  user: User | null;
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const totalPrice = product.price * quantity;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await placeOrderAction({
        product_id: product.id,
        user_id: user.id,
        quantity: quantity,
        total_price: totalPrice,
      });

      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error || "Failed to place order.");
      }
    } catch (err: unknown) {
      console.error("Order error:", err);
      let errorMessage = "An unexpected error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <CheckCircle
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Order placed successfully!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Your order for {quantity} {product.name} has been placed. You
                can view the status in your orders page.
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={() => router.push("/orders")}
                  className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  View my orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleOrder} className="mt-10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
        <span className="text-sm font-medium text-gray-500">
          Available: {product.stock_quantity}
        </span>
      </div>

      <div className="mt-2">
        <input
          type="number"
          min="1"
          max={product.stock_quantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
        />
      </div>

      <div className="mt-4 flex justify-between items-center bg-gray-50 p-3 rounded-md">
        <span className="text-base font-medium text-gray-900">Total</span>
        <span className="text-xl font-bold text-indigo-600">
          KES {totalPrice.toLocaleString()}
        </span>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || product.stock_quantity < 1}
        className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : product.stock_quantity < 1 ? (
          "Out of Stock"
        ) : (
          "Place Order"
        )}
      </button>
    </form>
  );
}
