"use client";

import RouteError from "../components/route-error";

export default function CartError({ reset }: { reset: () => void }) {
  return <RouteError reset={reset} title="No se pudo cargar el carrito o el pago." />;
}
