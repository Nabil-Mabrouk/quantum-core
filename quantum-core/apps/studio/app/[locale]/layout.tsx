// apps/studio/app/[locale]/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/components/providers/confirm-provider";
import { Suspense } from 'react';
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Params est une promesse en v15
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <AuthProvider>
          <ConfirmProvider>
            <Suspense fallback={<div className="h-screen w-screen bg-slate-50" />}>
              <AppShell>
                {children}
              </AppShell>
            </Suspense>
            <Toaster position="top-center" richColors closeButton />
          </ConfirmProvider>
        </AuthProvider>
      </body>
    </html>
  );
}