import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type OrderItem = {
  id: number;
  quantity: number;
  price: string;
  product?: { name: string } | null;
};

type Order = {
  id: number;
  total: string;
  status: string;
  created_at: string;
  items: OrderItem[];
};

async function getOrders(): Promise<Order[]> {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login?next=%2Forders");

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error("Falta configurar BASE_URL.");

  const response = await fetch(`${baseUrl}/orders`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) redirect("/login?next=%2Forders");
  if (!response.ok) throw new Error("No se pudo cargar el historial de compras.");

  return (await response.json()) as Order[];
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

async function OrderList() {
  const orders = (await getOrders()).sort((a, b) => b.id - a.id);

  if (orders.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8">
        <p className="text-zinc-600">Todavía no tienes compras.</p>
        <Link href="/" className="mt-5 inline-flex font-semibold text-indigo-700">
          Explorar el catálogo
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 space-y-5">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Orden #{order.id}</h2>
              <p className="mt-1 text-sm text-zinc-600">
                {new Intl.DateTimeFormat("es-SV", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "America/El_Salvador",
                }).format(new Date(order.created_at))}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                order.status === "paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.status === "paid" ? "Pagada" : "Pendiente"}
            </span>
          </div>

          <ul className="mt-5 divide-y divide-zinc-100 border-y border-zinc-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-zinc-700">
                  {item.product?.name ?? `Producto #${item.id}`} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(Number(item.price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-right text-lg font-bold">
            Total: {formatPrice(Number(order.total))}
          </p>
        </li>
      ))}
    </ul>
  );
}

function OrdersSkeleton() {
  return (
    <div className="mt-8 space-y-5" aria-label="Cargando compras" aria-busy="true">
      {[1, 2].map((item) => (
        <div key={item} className="h-56 animate-pulse rounded-2xl bg-zinc-200" />
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Historial de compras</h1>
        <p className="mt-2 text-zinc-600">
          Consulta las órdenes asociadas a tu cuenta.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex font-semibold text-indigo-700 hover:text-indigo-900"
        >
          ← Volver al catálogo
        </Link>
        <Suspense fallback={<OrdersSkeleton />}>
          <OrderList />
        </Suspense>
      </div>
    </main>
  );
}
