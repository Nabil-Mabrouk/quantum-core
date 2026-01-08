import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Optionnel
import "./globals.css"; // <--- CETTE LIGNE EST OBLIGATOIRE !

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantum Core Studio",
  description: "Engineering Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}