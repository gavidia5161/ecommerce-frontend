import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
};

async function getProducts(): Promise<Product[]> {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error("Falta configurar BASE_URL en .env.local");
  }

  const response = await fetch(`${baseUrl}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos");
  }

  return response.json();
}

function ProductsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-2xl bg-zinc-200"
        />
      ))}
    </div>
  );
}

async function ProductList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const products = await getProducts();
  const { page } = await searchParams;
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const parsedPage = Number(page ?? "1");
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, pageCount)
      : 1;
  const visibleProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
    {visibleProducts.length === 0 ? (
      <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-600">
        No hay productos disponibles por el momento.
      </p>
    ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts.map((product) => (
        <article
          key={product.id}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <Link href={`/products/${product.id}`} className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">
            <div className="mb-5 flex h-36 items-center justify-center rounded-xl bg-zinc-100">
              <Image
                src="/product-placeholder.svg"
                alt=""
                width={192}
                height={144}
                className="h-32 w-40 object-contain"
              />
            </div>

            <h2 className="text-xl font-semibold">{product.name}</h2>

            <p className="mt-2 min-h-12 text-sm text-zinc-600">
              {product.description}
            </p>
          </Link>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-2xl font-bold">
              ${Number(product.price).toFixed(2)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                product.stock > 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock > 0 ? "Disponible" : "Agotado"}
            </span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="mt-5 inline-flex font-semibold text-indigo-700 hover:text-indigo-900"
          >
            Ver producto <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </article>
      ))}
    </div>
    )}
    {pageCount > 1 && (
      <nav aria-label="Páginas del catálogo" className="mt-8 flex items-center justify-center gap-5">
        {currentPage > 1 ? (
          <Link href={`/?page=${currentPage - 1}`} className="font-semibold text-indigo-700">
            ← Anterior
          </Link>
        ) : <span className="text-zinc-400">← Anterior</span>}
        <span className="text-sm text-zinc-600">Página {currentPage} de {pageCount}</span>
        {currentPage < pageCount ? (
          <Link href={`/?page=${currentPage + 1}`} className="font-semibold text-indigo-700">
            Siguiente →
          </Link>
        ) : <span className="text-zinc-400">Siguiente →</span>}
      </nav>
    )}
    </>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <header className="mx-auto mb-10 max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Nuestra tienda
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Catálogo de productos
        </h1>
        <p className="mt-3 text-zinc-600">
          Productos cargados desde nuestra API de Laravel.
        </p>
      </header>

      <section className="mx-auto max-w-6xl">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductList searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
