import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"]
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Threshold — Scents from other worlds",
  description: "A small perfumery. Each bottle is a door; step through."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-ink font-body text-paper antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
