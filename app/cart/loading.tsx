export default function CheckoutLoading() {
  return (
    <main
      className="min-h-screen bg-zinc-50 px-6 py-12"
      aria-busy="true"
      aria-label="Cargando carrito"
    >
      <div className="mx-auto max-w-4xl">
        <div className="h-10 w-64 animate-pulse rounded bg-zinc-200" />
        <div className="mt-8 h-56 animate-pulse rounded-2xl bg-zinc-200" />
        <div className="mt-6 h-20 animate-pulse rounded-2xl bg-zinc-200" />
      </div>
    </main>
  );
}
