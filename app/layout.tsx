import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "./cart/cart-context";
import CartLink from "./cart/cart-link";
import WebVitalsReporter from "./components/web-vitals";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nuestra tienda | Catálogo de productos",
  description: "Explora los productos disponibles en nuestra tienda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <header className="border-b border-zinc-200 bg-white px-6 py-4">
            <nav className="mx-auto flex max-w-6xl items-center justify-end gap-4">
              <Link href="/orders" className="font-semibold text-indigo-700 hover:text-indigo-900">
                Mis compras
              </Link>
              <CartLink />
            </nav>
          </header>

          <WebVitalsReporter />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
