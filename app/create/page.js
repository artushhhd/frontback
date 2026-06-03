import CreateProductForm from './createProducts';

export default function CreateProductPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Create New Product
        </h1>
        <CreateProductForm />
      </div>
    </main>
  );
}