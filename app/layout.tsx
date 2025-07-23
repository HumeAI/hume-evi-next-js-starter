import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Stella - Next.js Starter",
  description: "A Next.js starter using Hume AI's Empathic Voice Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex flex-col min-h-screen"
        )}
      >
        <Nav />
        <div className="flex min-h-screen pt-14">
          <Sidebar />
          <main className="flex-1 pl-64">
            <div className="h-full max-w-5xl mx-auto p-4">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="top-center" richColors={true} />
      </body>
    </html>
  );
}
