"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type SetStateAction,
} from "react";

export type CartProduct = {
  id: number;
  name: string;
  price: string;
  stock: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "ecommerce-cart-v1";
const EMPTY_CART: CartItem[] = [];
const cartListeners = new Set<() => void>();
let cartSnapshot: CartItem[] | null = null;

function readSavedCart(): CartItem[] {
  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return EMPTY_CART;

    const parsed: unknown = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) return EMPTY_CART;

    return parsed.filter((item: unknown): item is CartItem => {
      if (item === null || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return (
        Number.isInteger(candidate.id) &&
        typeof candidate.name === "string" &&
        typeof candidate.price === "string" &&
        Number.isInteger(candidate.stock) &&
        Number.isInteger(candidate.quantity) &&
        Number(candidate.quantity) > 0 &&
        Number(candidate.quantity) <= Number(candidate.stock)
      );
    });
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return EMPTY_CART;
  }
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  if (cartSnapshot === null) cartSnapshot = readSavedCart();
  return cartSnapshot;
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
    cartSnapshot = null;
    cartListeners.forEach((callback) => callback());
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function updateCart(updater: SetStateAction<CartItem[]>) {
  const current = getCartSnapshot();
  const next = typeof updater === "function" ? updater(current) : updater;
  cartSnapshot = next;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The cart stays usable for this visit if browser storage is unavailable.
  }

  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART,
  );

  function addItem(product: CartProduct) {
    if (product.stock < 1) return;

    updateCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function removeItem(productId: number) {
    updateCart((current) => current.filter((item) => item.id !== productId));
  }

  function setQuantity(productId: number, quantity: number) {
    updateCart((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stock)),
            }
          : item,
      ),
    );
  }

  function clearCart() {
    updateCart([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
