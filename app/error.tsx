"use client";

import RouteError from "./components/route-error";

export default function AppError({ reset }: { reset: () => void }) {
  return <RouteError reset={reset} title="No se pudo mostrar el contenido." />;
}
