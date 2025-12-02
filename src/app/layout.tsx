import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gerenciador de Mercearia",
  description: "Um aplicativo completo para gerenciar as finanças e despesas da sua mercearia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen`}>
        <Sidebar />
        <main className="flex-grow overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}

