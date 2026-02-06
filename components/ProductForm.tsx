"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient as createRawClient } from "@supabase/supabase-js";
import { Loader2, Upload } from "lucide-react";
import { Product } from "@/types";
import { saveProductAction } from "@/app/admin/products/actions";

const supabase = createRawClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface ProductFormProps {
  initialData?: Partial<Product> | null;
  isEdit?: boolean;
}

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  image_url: string;
}

export default function ProductForm({
  initialData,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null,
  );
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    console.log(
      "Supabase URL being used:",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
    console.log("Testing reachability to Supabase...");
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .limit(1);
      if (error) {
        alert("🚨 DB Connection Failed: " + error.message);
        console.error("DB Error:", error);
      } else {
        alert("✅ DB Connection Success! Tables are reachable.");
        console.log("Sample Data:", data);
      }
    } catch (e) {
      console.error("Network Crash Detail:", e);
      alert("🚨 Network Crash: " + String(e));
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock_quantity: initialData?.stock_quantity || 0,
      is_active: initialData?.is_active ?? true,
      image_url: initialData?.image_url || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log("1. Submitting form data via Server Action...");
    setLoading(true);
    setError(null);

    try {
      let finalImageUrl = data.image_url || null;

      if (imageFile) {
        console.log("2. Uploading image to storage...");
        try {
          finalImageUrl = await uploadImage(imageFile);
          console.log("3. Upload success:", finalImageUrl);
        } catch (uploadErr) {
          console.error("Upload failed:", uploadErr);
          throw new Error(
            "Image upload failed. This usually happens if the storage bucket is missing.",
          );
        }
      }

      console.log("4. Calling Server Action...");
      const result = await saveProductAction({
        ...data,
        id: initialData?.id,
        image_url: finalImageUrl,
      });

      if (result.success) {
        console.log("5. Success! Redirecting...");
        setLoading(false);
        router.push("/admin/products");
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to save product.");
      }
    } catch (err: unknown) {
      console.error("Detailed Error:", err);
      let message = "An error occurred while saving.";
      if (err instanceof Error) message = err.message;
      else if (typeof err === "object" && err && "message" in err)
        message = String((err as { message: unknown }).message);

      setError(message);
      setLoading(false);
      alert("Error: " + message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {isEdit ? "Edit Product" : "New Product"}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Fill in the details for the agricultural input.
              </p>
            </div>
            <button
              type="button"
              onClick={testConnection}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full border border-gray-200 transition-colors"
            >
              Test Connection
            </button>
          </div>

          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Product Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: true })}
                  className="block w-full max-w-lg rounded-md  border-gray-300 shadow-sm focus:border-indigo-500 sm:max-w-xs sm:text-sm p-2 border text-gray-900"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">Required</span>
                )}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Category
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  id="category"
                  {...register("category", { required: true })}
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm p-2 border text-gray-900"
                >
                  <option value="">Select a category</option>
                  <option value="Fertilizer">Fertilizers</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Pesticides">Pesticides</option>
                  <option value="Herbicide">Herbicides</option>
                  <option value="Equipment">Equipments</option>
                  <option value="Feeds">Animal Feeds</option>
                </select>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Description
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                  placeholder="Enter product details..."
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Price (KES)
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  {...register("price", {
                    required: true,
                    min: 0,
                    valueAsNumber: true,
                  })}
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm p-2 border text-gray-900"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="stock_quantity"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Stock Quantity
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="number"
                  id="stock_quantity"
                  {...register("stock_quantity", {
                    required: true,
                    min: 0,
                    valueAsNumber: true,
                  })}
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm p-2 border text-gray-900"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Product Image
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2 space-y-4">
                <div className="flex items-center space-x-4">
                  {(imagePreview || initialData?.image_url) && (
                    <div className="relative h-24 w-24">
                      {/* Using standard img for preview to bypass Next.js hostname strictness during drafting */}
                      <img
                        src={imagePreview || initialData?.image_url || ""}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x400?text=Invalid+URL";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 w-full max-w-lg">
                    <input
                      type="text"
                      id="image_url"
                      {...register("image_url", {
                        onChange: (e) => {
                          setImagePreview(e.target.value);
                          setImageFile(null);
                        },
                      })}
                      placeholder="Paste image URL here..."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">OR</span>
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-white py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {imageFile && (
                  <p className="text-xs text-green-600 font-medium">
                    ✓ File selected: {imageFile.name} (will be uploaded)
                  </p>
                )}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="is_active"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Active
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register("is_active")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
      )}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
