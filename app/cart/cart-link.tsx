"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartLink() {
  const { items } = useCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/cart"
      prefetch={false}
      className="rounded-xl bg-indigo-50 px-4 py-2 font-semibold text-indigo-800 hover:bg-indigo-100"
    >
      Carrito ({count})
    </Link>
  );
}
