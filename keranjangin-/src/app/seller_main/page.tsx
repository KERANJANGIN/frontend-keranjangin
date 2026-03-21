"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    waitingPayment: 0,
    paid: 0,
    returned: 0,
    canceled: 0,
    totalSales: 0,
    totalOrders: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch matched user details from public.users table based on session id
        const { data } = await supabase
          .from("users")
          .select("id, email, full_name, npm, isSeller, shopName, shopAddress, postalCode, bankName, accountNumber, avatar_url, created_at")
          .eq("id", session.user.id)
          .single();
          
        if (data) {
          setUserData(data);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userData?.id) {
        const { data, error } = await supabase.from('transactions').select('*');
        if (data) {
           let waiting = 0;
           let paid = 0;
           let returned = 0;
           let canceled = 0;
           let sales = 0;
           let orders = 0;

           data.forEach((tx: any) => {
              if (!tx.products || !Array.isArray(tx.products)) return;
              const sellerProducts = tx.products.filter((p: any) => p.seller === userData.id);
              if (sellerProducts.length > 0) {
                 orders += 1;
                 if (tx.status === 'waiting_payment') waiting += 1;
                 else if (tx.status === 'paid') paid += 1;
                 else if (tx.status === 'returned') returned += 1;
                 else if (tx.status === 'canceled') canceled += 1;

                 sellerProducts.forEach((p: any) => {
                    const qty = p.stock || p.quantity || 1;
                    sales += p.price * qty;
                 });
              }
           });

           setStats({
              waitingPayment: waiting,
              paid,
              returned,
              canceled,
              totalSales: sales,
              totalOrders: orders
           });
        }
      }
    };
    fetchTransactions();
  }, [userData]);

  return (
    // 1. Root container dikunci tingginya (h-screen) dan overflow-hidden
    <div className="flex h-screen w-full font-display text-slate-900 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
            <img src="/LOGO.jpeg" alt="Keranjangin Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Seller Center</h1>
            <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Powered by Keranjangin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/seller_main">
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/pesanan">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span>Pesanan</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/produk">
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
        <div className="p-4 shrink-0">
          <div className="rounded-xl bg-primary p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-2">Pusat Edukasi</p>
            <p className="text-sm font-bold mb-3">Tingkatkan omset toko kamu!</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all cursor-pointer">Pelajari Sekarang</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>

        {/* Topbar / Header */}
        <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 bg-transparent">
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full pl-12 pr-4 py-3 border-none rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none" placeholder="Search (Ctrl + K)" type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative text-white cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-4 bg-red-500 border-2 border-[#9288f8] rounded-full text-[10px] flex items-center justify-center font-bold">25</span>
            </button>
            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer">
              <span className="material-symbols-outlined">mail</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <div className="text-right hidden sm:block text-white">
                <p className="text-sm font-bold leading-none">{userData?.shopName || "Memuat..."}</p>
                <p className="text-[10px] opacity-80 mt-1">{userData?.isSeller ? "Official Partner" : "Pendaftar Baru"}</p>
              </div>
              <div className="size-11 rounded-full bg-cover bg-center border-2 border-white/50 shadow-md cursor-pointer" style={{ backgroundImage: `url('${userData?.avatar_url || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

          <div className="mb-4">
            <h2 className="text-3xl font-black text-white tracking-tight">Dashboard Utama</h2>
            <p className="text-white/80 mt-1">Halo {userData?.full_name || "Seller"}, yuk cek update toko kamu hari ini.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Section */}
            <div className="lg:col-span-3 space-y-8">
              {/* Yang Perlu Dilakukan */}
              <section className="bg-white rounded-2xl p-8 border border-white/20" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)" }}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl text-slate-800">Yang Perlu Dilakukan</h3>
                  <Link className="text-xs font-bold text-primary hover:underline" href="#">Lihat Semua</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl border-l-4 border-primary bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-primary">pending_actions</span>
                      <span className="text-2xl font-black text-slate-800">{stats.waitingPayment}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pesanan Perlu Diproses</p>
                    <p className="text-[10px] text-slate-400 mt-1">Perlu segera dikirim</p>
                  </div>
                  <div className="p-6 rounded-2xl border-l-4 border-emerald-500 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-emerald-500">local_shipping</span>
                      <span className="text-2xl font-black text-slate-800">{stats.paid}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Telah Diproses</p>
                    <p className="text-[10px] text-slate-400 mt-1">Dalam pengiriman</p>
                  </div>
                  <div className="p-6 rounded-2xl border-l-4 border-amber-500 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-amber-500">assignment_return</span>
                      <span className="text-2xl font-black text-slate-800">{stats.returned}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pengembalian</p>
                    <p className="text-[10px] text-slate-400 mt-1">Menunggu review</p>
                  </div>
                  <div className="p-6 rounded-2xl border-l-4 border-red-500 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-red-500">cancel</span>
                      <span className="text-2xl font-black text-slate-800">{stats.canceled}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pembatalan</p>
                    <p className="text-[10px] text-slate-400 mt-1">24 Jam terakhir</p>
                  </div>
                </div>
              </section>

              {/* Performa Toko */}
              <section className="bg-white rounded-2xl p-8 border border-white/20" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)" }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-xl text-slate-800">Performa Toko</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Waktu update terakhir: GMT+7 11:00 (Perubahan data dibanding data kemarin)</p>
                  </div>
                  <select className="text-xs border border-slate-200 rounded-lg py-1 px-3 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1">Penjualan <span className="material-symbols-outlined text-[14px]">info</span></p>
                    <h4 className="text-2xl font-black text-slate-800">Rp{stats.totalSales.toLocaleString('id-ID')}</h4>
                    <p className="text-[11px] text-emerald-500 font-bold flex items-center mt-1">
                      {/* <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +12.5% vs minggu lalu */}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1">Pengunjung <span className="material-symbols-outlined text-[14px]">info</span></p>
                    <h4 className="text-2xl font-black text-slate-800">45.290</h4>
                    <p className="text-[11px] text-emerald-500 font-bold flex items-center mt-1">
                      {/* <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +5.2% vs minggu lalu */}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1">Pesanan <span className="material-symbols-outlined text-[14px]">info</span></p>
                    <h4 className="text-2xl font-black text-slate-800">{stats.totalOrders.toLocaleString('id-ID')}</h4>
                    <p className="text-[11px] text-red-500 font-bold flex items-center mt-1">
                      {/* <span className="material-symbols-outlined text-[14px] mr-1">trending_down</span> -2.1% vs minggu lalu */}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1">Produk Diklik <span className="material-symbols-outlined text-[14px]">info</span></p>
                    <h4 className="text-2xl font-black text-slate-800">89.210</h4>
                    <p className="text-[11px] text-emerald-500 font-bold flex items-center mt-1">
                      {/* <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +18.4% vs minggu lalu */}
                    </p>
                  </div>
                </div>

                {/* Clean Chart Area */}
                <div className="h-64 w-full relative mb-6">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <path d="M0,150 Q100,80 200,120 T400,100 T600,60 T800,90 L800,200 L0,200 Z" fill="rgba(62, 58, 122, 0.05)"></path>
                    <path d="M0,150 Q100,80 200,120 T400,100 T600,60 T800,90" fill="none" stroke="#3e3a7a" strokeWidth="3"></path>
                    <path d="M0,180 Q100,140 200,160 T400,130 T600,110 T800,140" fill="none" stroke="#9288f8" strokeDasharray="4" strokeWidth="2"></path>
                  </svg>
                  <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
                <div className="flex gap-6 justify-center">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-primary"></span>
                    <span className="text-xs font-semibold text-slate-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full" style={{ backgroundColor: "#9288f8" }}></span>
                    <span className="text-xs font-semibold text-slate-600">Visitors</span>
                  </div>
                </div>
              </section>

              {/* Bottom Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all cursor-pointer group" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)" }}>
                  <div className="flex items-center gap-5 mb-4">
                    <div className="size-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                      <span className="material-symbols-outlined text-4xl">handshake</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-slate-800">Affiliate Solution</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">Mitra Strategis</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">Dapatkan promosi eksklusif dari ratusan affiliate terkemuka untuk produk unggulanmu.</p>
                  <span className="text-sm font-bold text-primary flex items-center group-hover:translate-x-1 transition-all">Daftar Sekarang <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span></span>
                </div>
                <div className="bg-white rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all cursor-pointer group" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)" }}>
                  <div className="flex items-center gap-5 mb-4">
                    <div className="size-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                      <span className="material-symbols-outlined text-4xl">live_tv</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-slate-800">Livestream Dashboard</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">Interaksi Real-time</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">Interaksi langsung dengan pembeli dan tingkatkan konversi penjualan hingga 2x lipat!</p>
                  <span className="text-sm font-bold text-primary flex items-center group-hover:translate-x-1 transition-all">Buka Live <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span></span>
                </div>
              </div>
            </div>

            {/* Right Sidebar Widgets */}
            <div className="lg:col-span-1 space-y-8">
              {/* Ads Card */}
              <section className="rounded-2xl p-8 overflow-hidden relative shadow-2xl" style={{ background: "#3e3a7a" }}>
                <div className="relative z-10 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <span className="material-symbols-outlined">shopping_cart</span>
                    </div>
                    <h3 className="font-bold text-lg">Iklan Keranjangin</h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-8">Promosikan produkmu tepat di hadapan pembeli yang paling relevan.</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm px-1 border-b border-white/20 pb-3">
                      <span className="text-white/60">Saldo Iklan</span>
                      <span className="font-black text-xl">Rp5.200.000</span>
                    </div>
                    <button className="w-full py-3.5 bg-white text-primary rounded-xl font-bold text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95 cursor-pointer">Top Up Saldo</button>
                  </div>
                </div>
                <div className="absolute -bottom-12 -right-12 size-48 bg-white/5 rounded-full"></div>
              </section>

              {/* Tips Card */}
              <section className="bg-white rounded-2xl p-8 border border-white/20" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)" }}>
                <h3 className="font-bold text-slate-800 mb-6">Tips Hari Ini</h3>
                <div className="space-y-6">
                  <div className="flex gap-4 group cursor-pointer">
                    <div className="size-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined text-xl">lightbulb</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">Gunakan fitur <span className="font-bold text-slate-800">"Diskon Toko"</span> untuk menarik 30% lebih banyak pengunjung.</p>
                  </div>
                  <div className="flex gap-4 group cursor-pointer">
                    <div className="size-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined text-xl">photo_camera</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">Update <span className="font-bold text-slate-800">foto produk utama</span> kamu dengan resolusi 1:1.</p>
                  </div>
                </div>
              </section>

              {/* Chat Center */}
              <section className="bg-white rounded-2xl p-8 border border-white/20" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)" }}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-800">Chat Customer</h3>
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">1 New</span>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="size-11 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm ring-2 ring-primary/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWqm7q1svbssF3Pg_P-4VMEXsLujlpT-Bvn00Hm-v6IfN-ZOPWanfgHtMaslMK3MRTNRPwi2VEfo4ASuO_0l8i3NfvdLYm4J-VeEoF0GhgaZW2OOV9d1fUqwqzVDRrQKc-Lr7j2jdp6UFo5IYJU6tmnTQ7cCS-lMtBI9ff6N8lUy3F3FTHMmAVLPUsO6KfnXTjbK8iJiekV1Sh67DaW4C_3z1CdtLfvFP63ctcPoVHmrKLFoHlmmtHiisVSRBtxAYIAZkvDFdoDzAX')" }}></div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 leading-none mb-1">Andi Saputra</p>
                      <p className="text-[11px] text-slate-500 truncate font-medium mt-1">Barangnya ready gan?</p>
                    </div>
                    <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <div className="size-11 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkfkDSWgAbUGIcnd_Z8SBAXnqx6jSWo11ZhThzVpwMxH3wlm88EI9RTw1hWXogiarHimPYBfewoSz6p-XsRhu7sGysL5-ezqf0OpeFolxvcMIhF-PXefO9rw_LA7PqFJZAovWCq0x8WboHZfzO6t0BNdq1IE48rZIpbY6RcqnLDsxOu215Ipw3l4GYbC7QVsxHVcjcXSlt7a3z9oa-4sZtwLT3m9ZGKtcU8lsvid54Y-9Jx5kZ8l_0jIPOQRAioDa8326GzDHf40nm')" }}></div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 leading-none mb-1">Siska Amelia</p>
                      <p className="text-[11px] text-slate-500 truncate font-medium mt-1">Terima kasih, sudah sampai.</p>
                    </div>
                  </div>
                  <button className="w-full text-xs font-bold text-primary py-4 hover:bg-primary hover:text-white border border-primary/10 rounded-2xl transition-all mt-4 cursor-pointer">Buka Chat Center</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}