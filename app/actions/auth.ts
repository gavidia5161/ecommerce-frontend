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

function getApiError(result: ApiResult, fallback: string): string {
  if (typeof result.message === "string") return result.message;

  if (result.errors && typeof result.errors === "object") {
    const messages = Object.values(result.errors as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === "string");

    if (messages.length > 0) return messages.join(" ");
  }

  return fallback;
}

function getBaseUrl(): string | null {
  return process.env.BASE_URL ?? null;
}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ ok: boolean; error?: string }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return { ok: false, error: "Falta configurar BASE_URL." };

  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    const result = await readJson(response);

    if (!response.ok) {
      return {
        ok: false,
        error: getApiError(result, "No se pudo crear la cuenta."),
      };
    }

    revalidatePath("/register");
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo conectar con el servidor." };
  }
}

export async function loginAccount(input: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; error?: string }> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return { ok: false, error: "Falta configurar BASE_URL." };

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    const result = await readJson(response);

    if (!response.ok || typeof result.token !== "string") {
      return {
        ok: false,
        error: getApiError(result, "No se pudo iniciar sesión."),
      };
    }

    (await cookies()).set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    revalidatePath("/orders");
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo conectar con el servidor." };
  }
}
