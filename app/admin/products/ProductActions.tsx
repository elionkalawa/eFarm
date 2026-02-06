"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

interface ProductActionsProps {
  productId: string;
  productName: string;
  isActive: boolean;
}

export function ProductActions({
  productId,
  productName,
  isActive,
}: ProductActionsProps) {
  const [status, setStatus] = useState(isActive ? "Active" : "Inactive");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    const isActiveNew = newStatus === "Active";
    
    try {
      // Call your API to update status
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: isActiveNew }),
      });

      if (!response.ok) {
        setStatus(isActive ? "Active" : "Inactive");
        console.error("Failed to update product status");
      }
    } catch (error) {
      setStatus(isActive ? "Active" : "Inactive");
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      // Call your API to delete product
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete product");
        setIsDeleting(false);
      } else {
        // Redirect or refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`rounded-full px-3 py-1 text-xs font-semibold border-0 cursor-pointer transition-colors ${
          status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        <option value="Active" className="bg-white text-gray-900">
          Active
        </option>
        <option value="Inactive" className="bg-white text-gray-900">
          Inactive
        </option>
      </select>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center rounded-md bg-red-100 text-red-600 p-1.5 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete product"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
