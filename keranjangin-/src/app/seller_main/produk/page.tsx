"use client";

import { useState } from "react";
import Link from "next/link";

// 1. DEFINE INTERFACE (Biar TypeScript seneng)
interface Produk {
  id: number;
  statusTab: string;
  gambar: string;
  nama: string;
  sku: string;
  harga: string;
  stok: number;
  terjual: number;
  trend: string;
}

// DATA DUMMY PRODUK
const produkData: Produk[] = Array.from({ length: 32 }).map((_, i) => ({
  id: i + 1,
  statusTab: i % 5 === 0 ? "Perlu Tindakan" : i % 7 === 0 ? "Belum Ditampilkan" : "Live",
  gambar: `http://googleusercontent.com/profile/picture/${(i % 5) + 2}`,
  nama: `Produk Dummy ${i + 1} - Varian ${i % 3 === 0 ? 'Pro' : 'Basic'}`,
  sku: `SKU-${1000 + i}`,
  harga: `Rp ${(Math.floor(Math.random() * 50) + 1) * 50}.000`,
  stok: i % 5 === 0 ? 0 : Math.floor(Math.random() * 100) + 1,
  terjual: Math.floor(Math.random() * 1000),
  trend: i % 3 === 0 ? "down" : i % 2 === 0 ? "flat" : "up",
}));

const DAFTAR_TAB_PRODUK = ["Semua", "Live", "Perlu Tindakan", "Belum Ditampilkan"];
const ITEMS_PER_PAGE = 12;

export default function ProdukPage() {
  const [activeTab, setActiveTab] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 2. FIX: Tambahkan tipe string pada parameter 'tab'
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filteredData = produkData.filter((produk) => {
    if (activeTab === "Semua") return true;
    return produk.statusTab === activeTab;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 3. FIX: Tambahkan tipe string pada 'tabName'
  const getTabCount = (tabName: string) => {
    if (tabName === "Semua") return ` (${produkData.length})`;
    const count = produkData.filter(produk => produk.statusTab === tabName).length;
    return ` (${count})`;
  };

  return (
    <div className="flex h-screen w-full font-display text-slate-100 bg-[#1e1b4b] overflow-hidden">
      {/* Sidebar (Locked) */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
            {/* Pakai path absolut /image/logo.png karena di folder public */}
            <img src="/LOGO.jpeg" alt="Keranjangin Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900">Seller Center</h1>
            <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">Powered by Keranjangin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors" href="/seller_main">
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/pesanan">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span>Pesanan</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold" href="/seller_main/produk">
            <span className="material-symbols-outlined">package_2</span>
            <span>Produk</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/marketing">
            <span className="material-symbols-outlined">campaign</span>
            <span>Marketing</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/analytics">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/keuangan">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span>Keuangan</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/pengaturan">
              <span className="material-symbols-outlined">settings</span>
              <span>Pengaturan</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 min-w-0 h-screen" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>
        
        {/* Topbar */}
        <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40">
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full pl-12 pr-4 py-3 rounded-full text-sm text-slate-900 bg-white shadow-md focus:outline-none" placeholder="Cari Nama Produk..." type="text" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 p-8 pb-12">
          <div className="shrink-0 mb-6">
            <h2 className="text-3xl font-black text-white tracking-tight">Manajemen Produk</h2>
            <div className="flex border-b border-white/20 mt-6 overflow-x-auto gap-2">
              {DAFTAR_TAB_PRODUK.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-3 whitespace-nowrap cursor-pointer transition-colors ${activeTab === tab ? "font-bold text-white border-b-2 border-white" : "text-slate-400 hover:text-white"}`}
                >
                  {tab}{getTabCount(tab)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto relative">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 z-20 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Info Produk</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Harga</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stok</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Performa</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((produk: Produk) => ( // 4. FIX: Tambahkan tipe : Produk
                    <tr key={produk.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-300">image</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{produk.nama}</p>
                            <p className="text-xs text-slate-400">SKU: {produk.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">{produk.harga}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{produk.stok || <span className="text-red-500">Habis</span>}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{produk.terjual} Terjual</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 p-2"><span className="material-symbols-outlined">edit</span></button>
                        <button className="text-slate-400 hover:text-red-500 p-2"><span className="material-symbols-outlined">delete</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
               <p className="text-xs text-slate-500">Hal {currentPage} dari {totalPages}</p>
               <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-2 border rounded disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-2 border rounded disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}