"use client";

import { FormEvent, useState } from "react";
import { loginAccount } from "../actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await loginAccount({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      if (!result.ok) {
        setError(result.error ?? "No se pudo iniciar sesión.");
        return;
      }

      const requestedPath = new URLSearchParams(window.location.search).get("next");
      const destination =
        requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
          ? requestedPath
          : "/";
      router.push(destination);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 text-zinc-600">Ingresa a tu cuenta de la tienda.</p>

        <label className="mt-6 block text-sm font-medium" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3"
        />

        <label className="mt-5 block text-sm font-medium" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3"
        />

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}
