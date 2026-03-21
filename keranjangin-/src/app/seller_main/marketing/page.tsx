"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

// --- DUMMY DATA MARKETING ---
const ringkasanPerforma = {
    promoAktif: 5,
    estimasiOmset: "Rp 12.500.000",
    produkTerjual: 450,
};

const daftarPromo = [
    {
        id: "PRM-001",
        nama: "Diskon Gajian Akhir Bulan",
        jenis: "Voucher",
        status: "BERJALAN",
        info: "Sisa Kuota: 45/100",
    },
    {
        id: "PRM-002",
        nama: "Flash Sale Spesial Senin",
        jenis: "Flash Sale",
        status: "MENDATANG",
        info: "Stok Terkunci: 200 Item",
    },
    {
        id: "PRM-003",
        nama: "Boost Traffic: Mouse RGB",
        jenis: "Iklan",
        status: "BERJALAN",
        info: "Budget Harian: Aman",
    },
    {
        id: "PRM-004",
        nama: "Cuci Gudang Headphone",
        jenis: "Voucher",
        status: "BERAKHIR",
        info: "Terpakai: 100/100",
    }
];

export default function MarketingPage() {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase.from("users").select("id, email, full_name, npm, isSeller, shopName, shopAddress, postalCode, bankName, accountNumber, avatar_url, created_at").eq("id", session.user.id).single();
                if (data) setUserData(data);
            }
        };
        fetchUser();
    }, []);

    // State untuk menutup notifikasi budget iklan
    const [showAlert, setShowAlert] = useState(true);

    return (
        <div className="flex h-screen w-full font-display text-slate-900 overflow-hidden bg-[#1e1b4b]">

            {/* SIDEBAR (Locked) */}
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
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main">
                        <span className="material-symbols-outlined">home</span>
                        <span>Home</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/pesanan">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span>Pesanan</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/produk">
                        <span className="material-symbols-outlined">package_2</span>
                        <span>Produk</span>
                    </Link>
                    {/* Menu Marketing Aktif */}
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/seller_main/marketing">
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
                    <div className="pt-4 mt-4 border-t border-slate-100">
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

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col ml-64 min-w-0 h-screen" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>

                {/* HEADER */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 bg-transparent border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-white tracking-tight">Marketing Center</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="pl-12 pr-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none w-64 text-slate-800" placeholder="Cari Promo... (Ctrl + K)" type="text" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block text-white">
                                <p className="text-sm font-bold leading-none">{userData?.shopName || "Memuat..."}</p>
                                <p className="text-[10px] opacity-80 mt-1">{userData?.isSeller ? "Official Partner" : "Pendaftar Baru"}</p>
                            </div>
                            <div className="size-11 rounded-full bg-cover bg-center border-2 border-white/50" style={{ backgroundImage: `url('${userData?.avatar_url || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}></div>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE DASHBOARD CONTENT */}
                <main className="flex-1 overflow-y-auto p-8 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                    {/* Alert Handling: Saldo Iklan Menipis */}
                    {showAlert && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-amber-100 text-amber-600 flex items-center justify-center rounded-lg shrink-0">
                                    <span className="material-symbols-outlined text-xl animate-pulse">warning</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-amber-800">Saldo Iklan Menipis!</h4>
                                    <p className="text-xs text-amber-700 mt-0.5">Saldo iklan Anda kurang dari Rp 50.000. Top up sekarang agar performa iklan tidak terhenti.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer">Top Up Instan</button>
                                <button onClick={() => setShowAlert(false)} className="text-amber-500 hover:text-amber-700 transition-colors cursor-pointer p-1">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 1: Page Header & Action */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">The Growth Engine</h2>
                            <p className="text-white/80 mt-1 text-sm max-w-xl">Pilih strategi pemasaran yang tepat untuk meningkatkan trafik dan konversi toko Anda secara eksponensial.</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20 backdrop-blur-sm cursor-pointer">
                            <span className="material-symbols-outlined text-lg">school</span> Panduan Iklan
                        </button>
                    </div>

                    {/* Section 2: Ringkasan Performa Promo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center gap-5 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="size-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 z-10">
                                <span className="material-symbols-outlined text-3xl">local_activity</span>
                            </div>
                            <div className="z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Promo Aktif</p>
                                <h3 className="text-3xl font-black text-slate-800">{ringkasanPerforma.promoAktif}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center gap-5 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 size-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 z-10">
                                <span className="material-symbols-outlined text-3xl">payments</span>
                            </div>
                            <div className="z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimasi Omset Promo</p>
                                <h3 className="text-2xl font-black text-slate-800">{ringkasanPerforma.estimasiOmset}</h3>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center gap-5 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 size-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="size-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 z-10">
                                <span className="material-symbols-outlined text-3xl">shopping_cart_checkout</span>
                            </div>
                            <div className="z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Produk Terjual (Promo)</p>
                                <h3 className="text-3xl font-black text-slate-800">{ringkasanPerforma.produkTerjual} <span className="text-sm font-bold text-slate-400">Item</span></h3>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Pilih Tool Pemasaran */}
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Pilih Tool Pemasaran</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                        {/* Card Voucher */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                            <div className="size-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">confirmation_number</span>
                            </div>
                            <h4 className="font-bold text-lg text-slate-800">Voucher Toko</h4>
                            <p className="text-sm text-slate-500 mt-2 mb-6 flex-1 leading-relaxed">Buat diskon % atau nominal Rp untuk tingkatkan konversi & loyalitas pelanggan.</p>
                            <button className="w-full py-3 bg-slate-100 hover:bg-primary hover:text-white text-primary text-sm font-bold rounded-xl transition-colors cursor-pointer">
                                Buat Voucher
                            </button>
                        </div>

                        {/* Card Flash Sale */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                            <div className="size-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">bolt</span>
                            </div>
                            <h4 className="font-bold text-lg text-slate-800">Flash Sale</h4>
                            <p className="text-sm text-slate-500 mt-2 mb-6 flex-1 leading-relaxed">Bangun urgensi (FOMO) dengan diskon besar dalam waktu dan stok yang sangat terbatas.</p>
                            <button className="w-full py-3 bg-slate-100 hover:bg-primary hover:text-white text-primary text-sm font-bold rounded-xl transition-colors cursor-pointer">
                                Atur Jadwal
                            </button>
                        </div>

                        {/* Card Iklan (Dilengkapi Gamification Badge) */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-primary/30 shadow-md flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 relative">
                            {/* Saran Ahli Badge */}
                            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border-2 border-white">
                                <span className="material-symbols-outlined text-[12px]">stars</span> SARAN AHLI
                            </div>
                            <div className="size-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">ads_click</span>
                            </div>
                            <h4 className="font-bold text-lg text-slate-800">Iklan Search</h4>
                            <p className="text-sm text-slate-500 mt-2 mb-6 flex-1 leading-relaxed">Naikkan trafik kunjungan dengan menempatkan produk Anda di halaman teratas pencarian.</p>
                            <button className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer">
                                Kelola Iklan
                            </button>
                        </div>

                        {/* Card Livestream */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                            <div className="size-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">live_tv</span>
                            </div>
                            <h4 className="font-bold text-lg text-slate-800">Live Streaming</h4>
                            <p className="text-sm text-slate-500 mt-2 mb-6 flex-1 leading-relaxed">Interaksi langsung, bagikan voucher eksklusif live, dan konversi penonton jadi pembeli.</p>
                            <button className="w-full py-3 bg-slate-100 hover:bg-primary hover:text-white text-primary text-sm font-bold rounded-xl transition-colors cursor-pointer">
                                Mulai Live
                            </button>
                        </div>

                    </div>

                    {/* Section 4: Daftar Promo Berjalan (Table) */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative pb-16 md:pb-0 z-0">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800">Daftar Promo Aktif & Mendatang</h3>
                            <button className="text-sm font-bold text-primary hover:underline cursor-pointer">Lihat Semua</button>
                        </div>

                        <div className="overflow-x-auto overflow-y-visible min-h-[250px]">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-slate-200">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Promo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Jenis Promo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Informasi Tambahan</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {daftarPromo.map((promo, index) => (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-8 py-4">
                                                <p className="text-sm font-bold text-slate-800">{promo.nama}</p>
                                                <p className="text-xs text-slate-400 mt-1 font-mono">ID: {promo.id}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{promo.jenis}</td>

                                            <td className="px-6 py-4">
                                                {/* Status Badges Dynamic */}
                                                {promo.status === "BERJALAN" && (
                                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide flex items-center gap-1.5 w-fit">
                                                        <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {promo.status}
                                                    </span>
                                                )}
                                                {promo.status === "MENDATANG" && (
                                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide flex items-center gap-1.5 w-fit">
                                                        <span className="material-symbols-outlined text-[12px]">schedule</span> {promo.status}
                                                    </span>
                                                )}
                                                {promo.status === "BERAKHIR" && (
                                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide w-fit block">
                                                        {promo.status}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">{promo.info}</td>

                                            <td className="px-8 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="px-4 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer">
                                                        {promo.jenis === 'Iklan' ? 'Optimasi' : promo.status === 'MENDATANG' ? 'Edit' : 'Detail'}
                                                    </button>
                                                    {/* Tombol Stop/Hapus (Hanya muncul jika belum berakhir) */}
                                                    {promo.status !== "BERAKHIR" && (
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg transition-colors border border-slate-200 hover:border-red-200 cursor-pointer" title="Hentikan Promo">
                                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}