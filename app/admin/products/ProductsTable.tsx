"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  views: number;
  is_active: boolean;
  image_url: string | null;
  sku?: string;
}

interface ProductsTableProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 7;

export function ProductsTable({ products }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil((products?.length || 0) / ITEMS_PER_PAGE),
    [products]
  );

  const paginatedProducts = useMemo(() => {
    if (!products) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 6;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <>
      <table className="min-w-full divide-y border-0 divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Product Name
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Purchase Unit Price
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Products
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Views
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {paginatedProducts?.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  {product.image_url ? (
                    <div className="h-10 w-10 shrink-0 relative">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded bg-gray-200" />
                  )}
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {product.category || "Uncategorized"}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                KES {product.price?.toFixed(2) || "0.00"}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {product.stock_quantity || 0}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {product.views || 0}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${
                    product.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-1.5 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {(!products || products.length === 0) && (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-gray-500"
              >
                No products found. Add one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-0 pb-4 flex items-center bg-white justify-center gap-1">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-gray-600">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-gray-600">...</span>
              )}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
