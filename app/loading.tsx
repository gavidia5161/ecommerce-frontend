export default function CatalogLoading() {
  return (
    <main
      className="min-h-screen bg-zinc-50 px-6 py-12"
      aria-busy="true"
      aria-label="Cargando catálogo"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 h-12 w-72 animate-pulse rounded bg-zinc-200" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-zinc-200"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
