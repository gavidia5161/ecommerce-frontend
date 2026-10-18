import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-900">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Producto no encontrado</p>
        <h1 className="mt-3 text-3xl font-bold">No encontramos ese producto</h1>
        <p className="mt-3 text-zinc-600">Puede que haya sido retirado o que el enlace no sea válido.</p>
        <Link href="/" className="mt-7 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">Volver al catálogo</Link>
      </div>
    </main>
  );
}