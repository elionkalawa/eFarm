"use client";

import { useCart } from "@/providers/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center space-y-2">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h1>
            <p className="text-gray-500 text-center max-w-md">
              Start adding products to your cart and they will appear here.
            </p>
            <Link
              href="/home"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="h-2 w-2" />
              <span className="text-sm">Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/home" className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-lg shadow p-6 flex gap-6"
              >
                {item.product.image_url && (
                  <div className="relative h-32 w-32 shrink-0">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.category}
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    Ksh. {item.product.price.toLocaleString()}
                  </p>

                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-gray-900 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      Ksh. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  title="Remove from cart"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-6 mb-4 border-b border-gray-200 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>Ksh. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Ksh. 0</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Ksh. 0</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-green-500">Total:</span>
                <span className="text-2xl font-bold text-green-500">
                  Ksh. {total.toLocaleString()}
                </span>
              </div>

              <div className="flex space-x-3 mb-3">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg text-white py-3 px-4 rounded-full font-bold transition-colors">
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="flex-1 border border-gray-300 text-gray-700 hover:shadow-lg hover:bg-gray-50 py-3 px-4 rounded-full font-bold transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
