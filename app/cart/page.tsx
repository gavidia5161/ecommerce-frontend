"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-context";
import StripePaymentForm from "./stripe-payment-form";
import {
  confirmPayment as confirmPaymentAction,
  createOrder as createOrderAction,
  startPayment as startPaymentAction,
} from "./actions";

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CartPage() {
  const { items, removeItem, setQuantity, clearCart } = useCart();
  const [orderError, setOrderError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [startingPayment, setStartingPayment] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  async function handleCreateOrder() {
    setOrderError("");
    setOrderMessage("");
    setCreatingOrder(true);

    try {
      const result = await createOrderAction({
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      if (!result.ok || result.orderId === undefined) {
        setOrderError(result.error ?? "No se pudo crear la orden.");
        return;
      }

      setOrderId(result.orderId);
      clearCart();
      setOrderMessage(`Orden #${result.orderId} creada correctamente.`);
    } catch {
      setOrderError("No se pudo conectar con el servidor.");
    } finally {
      setCreatingOrder(false);
    }
  }

  async function handleStartPayment() {
    if (!orderId) return;

    setPaymentError("");
    setStartingPayment(true);

    try {
      const result = await startPaymentAction(orderId);
      if (!result.ok || !result.clientSecret) {
        setPaymentError(result.error ?? "No se pudo iniciar el pago.");
        return;
      }

      setClientSecret(result.clientSecret);
    } catch {
      setPaymentError("No se pudo conectar con el servidor de pagos.");
    } finally {
      setStartingPayment(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Carrito de compras</h1>
        {orderMessage && items.length === 0 && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-emerald-50 p-4 text-emerald-800"
          >
            {orderMessage}
          </p>
        )}

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8">
           <p className="text-zinc-600">
            {orderId !== null
             ? "Tu orden está creada. Completa el pago para finalizar."
             : "Tu carrito está vacío."}
          </p>

          {orderId !== null && !clientSecret && (
           <div className="mt-6">
            {paymentError && (
             <p role="alert" className="mb-4 text-sm text-red-700">
              {paymentError}
            </p>
            )}

            <button
              type="button"
              onClick={handleStartPayment}
              disabled={startingPayment}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {startingPayment ? "Preparando pago…" : "Continuar al pago"}
            </button>
          </div>
        )}

        {clientSecret && (
          <>
            {paymentError && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {paymentError}
              </p>
            )}

            <StripePaymentForm
              clientSecret={clientSecret}
              onPaid={async () => {
                if (orderId === null) return;

                try {
                  const result = await confirmPaymentAction(orderId);
                  if (!result.ok) {
                    setPaymentError(result.error ?? "No se pudo confirmar el pago con Laravel.");
                    return;
                  }

                  setOrderMessage(`Pago de la orden #${orderId} confirmado correctamente.`);
                  setOrderId(null);
                  setClientSecret("");
                } catch {
                  setPaymentError(
                    "Stripe procesó el pago, pero no se pudo confirmar con Laravel.",
                  );
                }
              }}
            />
          </>
        )}

        <Link
          href="/"
          className="mt-5 inline-flex font-semibold text-indigo-700"
        >
          Volver al catálogo
        </Link>
      </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-5 p-6"
                >
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      {formatPrice(Number(item.price))} por unidad
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Reducir cantidad de ${item.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() => {
                        setOrderMessage("");
                        setQuantity(item.id, item.quantity - 1);
                      }}
                      className="h-9 w-9 rounded-lg border border-zinc-300 disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Aumentar cantidad de ${item.name}`}
                      disabled={item.quantity >= item.stock}
                      onClick={() => {
                        setOrderMessage("");
                        setQuantity(item.id, item.quantity + 1);
                      }}
                      className="h-9 w-9 rounded-lg border border-zinc-300 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setOrderMessage("");
                      removeItem(item.id);
                    }}
                    className="text-sm font-medium text-red-700 hover:text-red-900"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6">
              <span className="text-lg font-semibold">Subtotal</span>
              <span className="text-2xl font-bold">
                {formatPrice(subtotal)}
              </span>
            </div>
              {orderError && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  {orderError}
                </p>
              )}

              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={creatingOrder}
                className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {creatingOrder ? "Creando orden…" : "Crear orden"}
              </button>
              
            <Link
              href="/"
              className="mt-6 inline-flex font-semibold text-indigo-700"
            >
              Seguir comprando
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
