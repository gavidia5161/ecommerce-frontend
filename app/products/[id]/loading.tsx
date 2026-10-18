export default function ProductLoading() {
  return (
    <main
      className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900"
      aria-busy="true"
      aria-label="Cargando producto"
    >
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-5 w-40 rounded bg-zinc-200" />
        <div className="mt-8 grid overflow-hidden rounded-3xl border border-zinc-200 bg-white md:grid-cols-2">
          <div className="min-h-80 bg-zinc-200 md:min-h-[32rem]" />
          <div className="flex flex-col gap-6 p-8 md:p-12">
            <div className="h-4 w-28 rounded bg-zinc-200" />
            <div className="h-10 w-3/4 rounded bg-zinc-200" />
            <div className="space-y-3">
              <div className="h-4 rounded bg-zinc-200" />
              <div className="h-4 rounded bg-zinc-200" />
              <div className="h-4 w-2/3 rounded bg-zinc-200" />
            </div>
            <div className="mt-4 h-10 w-1/2 rounded bg-zinc-200" />
          </div>
        </div>
      </div>
    </main>
  );
}