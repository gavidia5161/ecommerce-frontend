export default function OrdersLoading() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12" aria-busy="true">
      <div className="mx-auto max-w-4xl">
        <div className="h-10 w-72 animate-pulse rounded bg-zinc-200" />
        <div className="mt-8 space-y-5">
          {[1, 2].map((item) => (
            <div key={item} className="h-56 animate-pulse rounded-2xl bg-zinc-200" />
          ))}
        </div>
      </div>
    </main>
  );
}
