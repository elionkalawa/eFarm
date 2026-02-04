import ProductForm from "@/components/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="mx-auto max-w-3xl  py-4 px-4 sm:px-6 lg:px-8 bg-gray-100/90 rounded-2xl">
      <div className="md:flex md:items-center md:justify-between py-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            New Products
          </h2>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
