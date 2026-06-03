import Products from './products';

export default function ProductsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Catalog of Products</h1>
      <a href="/create" className="text-blue-500 underline mb-6 inline-block">Create First Product</a>
      <Products />
    </main>
  );
}