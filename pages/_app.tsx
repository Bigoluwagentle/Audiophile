import "@/styles/globals.css";
import { Manrope } from "next/font/google";
import { CartProvider } from "../lib/CartContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { AppProps } from "next/app";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <main className={manrope.className}>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </main>
    </ConvexProvider>
  );
}
