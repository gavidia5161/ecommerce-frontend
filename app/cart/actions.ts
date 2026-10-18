"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type ApiResult = Record<string, unknown>;

async function readJson(response: Response): Promise<ApiResult> {
  try {
    return (await response.json()) as ApiResult;
  } catch {
    return {};
  }
}

async function requestApi(path: string, body: unknown) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { ok: false as const, error: "Inicia sesión para continuar." };
  }

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    return { ok: false as const, error: "Falta configurar BASE_URL." };
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const result = await readJson(response);

    if (!response.ok) {
      return {
        ok: false as const,
        error:
          typeof result.message === "string"
            ? result.message
            : "La API no pudo completar la solicitud.",
      };
    }

    return { ok: true as const, result };
  } catch {
    return {
      ok: false as const,
      error: "No se pudo conectar con la API de la tienda.",
    };
  }
}

export async function createOrder(input: {
  items: Array<{ product_id: number; quantity: number }>;
}): Promise<{ ok: boolean; orderId?: number; error?: string }> {
  const response = await requestApi("/orders", input);
  if (!response.ok) return response;

  const order = response.result.order;
  if (!order || typeof order !== "object" || !("id" in order)) {
    return { ok: false, error: "La API no devolvió el número de la orden." };
  }

  revalidatePath("/");
  revalidatePath("/orders");
  revalidatePath("/cart");
  return { ok: true, orderId: Number(order.id) };
}

export async function startPayment(orderId: number): Promise<{
  ok: boolean;
  clientSecret?: string;
  error?: string;
}> {
  const response = await requestApi("/payments", { order_id: orderId });
  if (!response.ok) return response;

  if (typeof response.result.client_secret !== "string") {
    return { ok: false, error: "Laravel no devolvió el client_secret de Stripe." };
  }

  return { ok: true, clientSecret: response.result.client_secret };
}

export async function confirmPayment(orderId: number): Promise<{
  ok: boolean;
  message?: string;
  error?: string;
}> {
  const response = await requestApi(
    `/payments/${encodeURIComponent(String(orderId))}/confirm`,
    {},
  );
  if (!response.ok) return response;

  revalidatePath("/orders");
  revalidatePath("/cart");
  return {
    ok: true,
    message:
      typeof response.result.message === "string"
        ? response.result.message
        : "Pago confirmado correctamente.",
  };
}
