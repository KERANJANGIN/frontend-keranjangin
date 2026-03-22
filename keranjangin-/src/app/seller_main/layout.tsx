import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./seller.css";
import SellerAuthGuard from "./SellerAuthGuard";
import SellerSidebar from "./SellerSidebar";

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
        <div className="flex h-screen w-full font-display text-slate-900 overflow-hidden">
          <SellerSidebar />
          <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>
            {children}
          </div>
        </div>
      </SellerAuthGuard>
    </div>
  );
}