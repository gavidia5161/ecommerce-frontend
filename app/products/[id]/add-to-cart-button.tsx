"use client";

import { useState } from "react";
import { useCart, type CartProduct } from "../../cart/cart-context";

export default function AddToCartButton({
  product,
}: {
  product: CartProduct;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={product.stock < 1}
      onClick={() => {
        addItem(product);
        setAdded(true);
      }}
      className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
    >
      {product.stock < 1
        ? "Agotado"
        : added
          ? "Agregar otro"
          : "Agregar al carrito"}
    </button>
  );
}
