"use client";

import RouteError from "../components/route-error";

export default function OrdersError({ reset }: { reset: () => void }) {
  return <RouteError reset={reset} title="No se pudo cargar tu historial de compras." />;
}
