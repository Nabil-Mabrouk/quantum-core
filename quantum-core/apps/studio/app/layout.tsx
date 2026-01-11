import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider"; // <--- Import
import { Toaster } from "sonner"; // <--- Import
import { ConfirmProvider } from "@/components/providers/confirm-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantum Core Studio",
  description: "Engineering Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <ConfirmProvider>
          {children}
          {/* Ajoute le Toaster ici, après les children */}
          <Toaster position="top-center" richColors closeButton />
          </ConfirmProvider>
        </AuthProvider>
      </body>
    </html>
  );
}