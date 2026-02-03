"use client";

import { updateOrderStatusAction } from "@/app/admin/orders/actions";
import { Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (status: "approved" | "rejected") => {
    setLoading(true);
    const result = await updateOrderStatusAction(orderId, status);
    if (result.success) {
      router.refresh();
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  if (currentStatus !== "pending") {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => updateStatus("approved")}
        disabled={loading}
        className="text-green-600 hover:text-green-900 disabled:opacity-50"
        title="Approve"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Check className="h-5 w-5" />
        )}
      </button>
      <button
        onClick={() => updateStatus("rejected")}
        disabled={loading}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
        title="Reject"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <X className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
