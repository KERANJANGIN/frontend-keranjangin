import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./seller.css";
import SellerAuthGuard from "./SellerAuthGuard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seller Center Dashboard",
  description: "Dashboard for sellers",
};

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Gunakan <div> atau <section> saja, JANGAN <html> atau <body>
    <div className={`${inter.variable} bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen`}>
      {/* Link fonts dipindahkan ke bagian atas atau biarkan di root layout */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      
      {/* Layout Konten Seller */}
      <SellerAuthGuard>
        <main>
          {children}
        </main>
      </SellerAuthGuard>
    </div>
  );
}