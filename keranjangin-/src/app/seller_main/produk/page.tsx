"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DAFTAR_TAB_PRODUK = ["Semua", "Live", "Perlu Tindakan", "Belum Ditampilkan"];
const ITEMS_PER_PAGE = 12;

export default function ProdukPage() {
  const [userData, setUserData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single();
        if (data) setUserData(data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (userData?.id) {
        try {
          const res = await fetch(`/api/products/seller?id=${userData.id}`);
          if (res.ok) {
            const data = await res.json();
            setProducts(data.products || []);
          }
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      }
    };
    fetchProducts();
  }, [userData]);

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setProducts(products.filter(p => p.id !== id));
        } else {
          alert("Gagal menghapus produk");
        }
      } catch (e) {
        alert("Terjadi kesalahan jaringan.");
      }
    }
  };

  const [activeTab, setActiveTab] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filteredData = products.filter((produk) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Live") return produk.product_status === "live";
    if (activeTab === "Perlu Tindakan") return produk.product_status === "action_needed";
    if (activeTab === "Belum Ditampilkan") return produk.product_status === "not_shown";
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getTabCount = (tabName: string) => {
    if (tabName === "Semua") return ` (${products.length})`;
    let val = "live";
    if (tabName === "Perlu Tindakan") val = "action_needed";
    if (tabName === "Belum Ditampilkan") val = "not_shown";
    const count = products.filter(p => p.product_status === val).length;
    return ` (${count})`;
  };

  return (
    <div className="flex h-screen w-full font-display text-slate-100 bg-[#1e1b4b] overflow-hidden">

      {/* Sidebar (Locked) */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
            <img src="/LOGO.jpeg" alt="Keranjangin Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900">Seller Center</h1>
            <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Powered by Keranjangin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main">
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/pesanan">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span>Pesanan</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/seller_main/produk">
            <span className="material-symbols-outlined">package_2</span>
            <span>Produk</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/marketing">
            <span className="material-symbols-outlined">campaign</span>
            <span>Marketing</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/analytics">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/keuangan">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span>Keuangan</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-200">
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/pengaturan">
              <span className="material-symbols-outlined">settings</span>
              <span>Pengaturan</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 shrink-0">
          <div className="rounded-xl bg-primary p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-2">Pusat Edukasi</p>
            <p className="text-sm font-bold mb-3">Tingkatkan omset toko kamu!</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all cursor-pointer">Pelajari Sekarang</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 min-w-0 gradient-bg h-screen" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>

        {/* Topbar / Header */}
        <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 bg-transparent">
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full pl-12 pr-4 py-3 border-none rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none" placeholder="Cari Nama Produk atau SKU (Ctrl + K)" type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative text-white cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-4 bg-red-500 border-2 border-[#9288f8] rounded-full text-[10px] flex items-center justify-center font-bold text-white">25</span>
            </button>
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer">
              <span className="material-symbols-outlined">mail</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <div className="text-right hidden sm:block text-white">
                <p className="text-sm font-bold leading-none">{userData?.shopName || "Memuat..."}</p>
                <p className="text-[10px] opacity-80 mt-1">{userData?.isSeller ? "Official Partner" : "Pendaftar Baru"}</p>
              </div>
              <div
                className="size-11 rounded-full bg-cover bg-center border-2 border-white/50 shadow-md cursor-pointer"
                style={{ backgroundImage: `url('${userData?.avatar_url || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-h-0 p-8 pb-12">

          {/* Bagian Atas (Judul, Tabs & Filter) - Terkunci Tidak Ikut Scroll */}
          <div className="shrink-0 mb-6">

            {/* Judul Halaman Dipindah Kesini */}
            <div className="mb-6">
              <h2 className="text-3xl font-black text-white tracking-tight">Manajemen Produk</h2>
              <p className="text-white/80 mt-1 text-sm">Kelola katalog produk, pantau stok, dan optimalkan performa penjualan Anda.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/20 overflow-x-auto gap-2">
              {DAFTAR_TAB_PRODUK.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-3 whitespace-nowrap cursor-pointer transition-colors ${activeTab === tab
                    ? "font-bold text-white border-b-2 border-primary"
                    : "font-medium text-slate-400 hover:text-white"
                    }`}
                >
                  {tab}{getTabCount(tab)}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-indigo-200">
                <span className="font-bold text-white text-lg">{filteredData.length}</span> Produk Ditemukan
              </div>
              <Link href="/seller_main/produk/tambah" className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-lg">add</span>
                Tambah Produk Baru
              </Link>
            </div>
          </div>

          {/* Wadah Utama Tabel - Memberikan tinggi tetap dan overflow */}
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col flex-1 min-h-0">

            {/* Bagian Scrollable Tabel Body */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent relative">
              <table className="w-full text-left table-auto">

                {/* STICKY HEADER - Mengunci thead agar tidak ter-scroll */}
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20 shadow-sm backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Info Produk</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Performa</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>

                {/* SCROLLABLE BODY */}
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        Tidak ada produk yang ditemukan pada halaman ini.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((produk) => (
                      <tr key={produk.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <input type="checkbox" className="accent-primary shrink-0" />
                            <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center relative">
                              {produk.img_path ? (
                                <img src={produk.img_path} className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{produk.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">SKU: {produk.product_code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-primary whitespace-nowrap">Rp {produk.price.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                          {produk.stock === 0 ? <span className="text-red-500">Habis</span> : produk.stock}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                            {produk.sold || 0} Terjual
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 relative z-0 hover:z-[60]">
                            <Link href={`/seller_main/produk/edit/${produk.id}`} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer block" title="Ubah Produk">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </Link>
                            <button onClick={() => handleDelete(produk.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus Produk">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>

                            {/* Dropdown Menu Lainnya */}
                            <div className="relative group overflow-visible">
                              <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer" title="Lainnya">
                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] overflow-hidden">
                                <div className="py-2 flex flex-col">
                                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-3 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">visibility</span> Lihat Produk
                                  </button>
                                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-3 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">content_copy</span> Duplikat
                                  </button>
                                  <div className="h-px bg-slate-100 my-1 w-full"></div>
                                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-50 flex items-center gap-3 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">archive</span> Arsipkan
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Spacer agar dropdown di baris paling bawah tidak terpotong oleh overflow container */}
              <div className="h-24"></div>
            </div>

            {/* Bagian Bawah Terkunci - Pagination Controls */}
            {filteredData.length > 0 && (
              <div className="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-xl">
                <p className="text-xs font-semibold text-slate-500">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} produk
                </p>

                <div className="flex items-center gap-2">
                  {/* Tombol Previous */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-600">chevron_left</span>
                  </button>

                  {/* Angka Halaman */}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === i + 1
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* Tombol Next */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-600">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}