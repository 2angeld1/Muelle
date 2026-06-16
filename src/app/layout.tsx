import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NexoExport — Gestión Inteligente de Exportaciones",
  description:
    "Plataforma para centralizar, automatizar y optimizar los procesos de exportación. Gestión de clientes, documentación, contenedores y reportes.",
};

import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-white border border-slate-200/60 dark:border-slate-700/60 shadow-lg',
              duration: 4000,
            }} 
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
