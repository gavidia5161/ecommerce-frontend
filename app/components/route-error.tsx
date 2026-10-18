"use client";

export default function RouteError({
  reset,
  title = "No pudimos cargar esta página.",
}: {
  reset: () => void;
  title?: string;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900">
      <section className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p role="alert" className="mt-3 text-zinc-600">
          {title} Revisa tu conexión e inténtalo de nuevo.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </section>
    </main>
  );
}
