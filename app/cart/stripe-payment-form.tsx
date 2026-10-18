"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

function PaymentForm({
  onPaid,
}: {
  onPaid: () => void | Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) return;

    setError("");
    setSubmitting(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/cart`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message ?? "Stripe no pudo procesar el pago.");
      } else if (result.paymentIntent?.status === "succeeded") {
        await onPaid();
      } else {
        setError("El pago todavía no aparece como confirmado.");
      }
    } catch {
      setError("No se pudo completar el pago. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <PaymentElement />

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? "Procesando pago…" : "Pagar"}
      </button>
    </form>
  );
}

export default function StripePaymentForm({
  clientSecret,
  onPaid,
}: {
  clientSecret: string;
  onPaid: () => void | Promise<void>;
}) {
  // Carga Stripe únicamente cuando este formulario de pago se muestra.
  // Así el catálogo no ejecuta Stripe solo por precargar la ruta del carrito.
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [],
  );

  if (!stripePromise) {
    return (
      <p role="alert" className="mt-4 text-sm text-red-700">
        Falta configurar la clave publicable de Stripe en .env.local.
      </p>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-xl font-semibold">Pago seguro</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm onPaid={onPaid} />
      </Elements>
    </div>
  );
}
