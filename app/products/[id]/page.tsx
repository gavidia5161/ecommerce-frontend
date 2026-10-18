import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import AddToCartButton from "./add-to-cart-button";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
};

async function getProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error("Falta configurar BASE_URL en .env.local");

  const response = await fetch(`${baseUrl}/products/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("No se pudo cargar el producto");
  return response.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return { title: "Producto no encontrado | Nuestra tienda" };

  return {
    title: `${product.name} | Nuestra tienda`,
    description: product.description.slice(0, 160),
  };
}

async function ProductContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 font-medium text-indigo-700 hover:text-indigo-900">
          <span aria-hidden="true">←</span> Volver al catálogo
        </Link>
        <article className="mt-8 grid overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:grid-cols-2">
          <div className="flex min-h-80 items-center justify-center bg-indigo-50 md:min-h-[32rem]">
            <Image
              src="/product-placeholder.svg"
              alt=""
              width={320}
              height={240}
              priority
              className="h-64 w-80 object-contain"
            />
          </div>
          <div className="flex flex-col p-8 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Producto #{product.id}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
            <p className="mt-6 leading-7 text-zinc-600">{product.description}</p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
              <span className="text-3xl font-bold">${Number(product.price).toFixed(2)}</span>
              <span className={`rounded-full px-4 py-2 text-sm font-medium ${product.stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
              </span>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
              }}
            />
            <p className="mt-auto pt-10 text-sm text-zinc-500">Información actualizada desde la API de la tienda.</p>
          </div>
        </article>
      </div>
    </main>
  );
}

function ProductSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto h-[32rem] max-w-5xl animate-pulse rounded-3xl bg-zinc-200" />
    </main>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
