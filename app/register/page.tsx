"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { registerAccount } from "../actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await registerAccount({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      if (!result.ok) {
        setError(result.error ?? "No se pudo crear la cuenta.");
        return;
      }

      setSuccess(true);
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
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-zinc-600">
          Regístrate para comprar en nuestra tienda.
        </p>

        {success && (
          <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-4 text-emerald-800">
            Registro exitoso.{" "}
            <Link href="/login" className="font-semibold underline">
              Inicia sesión
            </Link>
          </p>
        )}
        
        <label className="mt-6 block text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={255}
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3"
        />

        <label className="mt-5 block text-sm font-medium" htmlFor="email">
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
          autoComplete="new-password"
          minLength={8}
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
          {loading ? "Creando cuenta…" : "Registrarme"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-indigo-700">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
