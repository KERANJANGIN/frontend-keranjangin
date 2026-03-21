"use client";

import { useState } from "react";
import Link from "next/link";

// 1. INTERFACE UNTUK TYPESCRIPT (Menghilangkan error 'any')
interface Pesanan {
    id: string;
    statusTab: string;
    waktuPesanan: string;
    statusUrgensi: 'normal' | 'warning' | 'critical';
    batasWaktu: string;
    iconProduk: string;
    namaProduk: string;
    rincian: string;
    kurir: string;
    badgeKurir: string | null;
    inisial: string;
    pembeli: string;
    total: string;
    tombolAksi: string;
    tipeTombol: 'primary' | 'success' | 'outline';
}

// 2. DATA DUMMY DENGAN TIPE PESANAN[]
const pesananData: Pesanan[] = [
    {
        id: "#ORD-99281",
        statusTab: "Perlu Dikirim",
        waktuPesanan: "20 Mar, 14:10",
        statusUrgensi: "warning",
        batasWaktu: "Kirim sblm: 22 Mar",
        iconProduk: "mouse",
        namaProduk: "Mouse Gaming Logitech G502",
        rincian: "1 Unit x Rp 850.000",
        kurir: "J&T Reg",
        badgeKurir: null,
        inisial: "AD",
        pembeli: "Abdiel Deandra",
        total: "Rp 855.000",
        tombolAksi: "Atur Kirim",
        tipeTombol: "primary",
    },
    {
        id: "#ORD-99275",
        statusTab: "Perlu Dikirim",
        waktuPesanan: "20 Mar, 13:05",
        statusUrgensi: "critical",
        batasWaktu: "Kirim sblm: Hari ini, 16:00",
        iconProduk: "keyboard",
        namaProduk: "Mechanical Keyboard K6",
        rincian: "1 Unit x Rp 1.200.000",
        kurir: "GoSend",
        badgeKurir: "Instant",
        inisial: "VS",
        pembeli: "Vania S.",
        total: "Rp 1.200.000",
        tombolAksi: "Siapkan",
        tipeTombol: "success",
    },
    {
        id: "#ORD-88102",
        statusTab: "Belum Bayar",
        waktuPesanan: "21 Mar, 09:15",
        statusUrgensi: "normal",
        batasWaktu: "Bayar sblm: 22 Mar",
        iconProduk: "desktop_windows",
        namaProduk: "Monitor Stand Riser Kayu Solid",
        rincian: "2 Unit x Rp 150.000",
        kurir: "SiCepat Halu",
        badgeKurir: null,
        inisial: "BS",
        pembeli: "Budi Santoso",
        total: "Rp 315.000",
        tombolAksi: "Ingatkan Pembeli",
        tipeTombol: "outline",
    },
    {
        id: "#ORD-77541",
        statusTab: "Dikirim",
        waktuPesanan: "18 Mar, 10:20",
        statusUrgensi: "normal",
        batasWaktu: "Estimasi Tiba: 21 Mar",
        iconProduk: "watch",
        namaProduk: "Smartwatch Active Pro v2",
        rincian: "1 Unit x Rp 850.000",
        kurir: "JNE YES",
        badgeKurir: "Next Day",
        inisial: "RA",
        pembeli: "Reza Aditya",
        total: "Rp 875.000",
        tombolAksi: "Lacak Pesanan",
        tipeTombol: "primary",
    }
];

const DAFTAR_TAB = ["Semua", "Belum Bayar", "Perlu Dikirim", "Dikirim", "Selesai", "Dibatalkan", "Retur"];

export default function KelolaPesanan() {
    const [activeTab, setActiveTab] = useState<string>("Perlu Dikirim");

    // FILTER DATA (Dikasih tipe Pesanan)
    const dataYangDitampilkan = pesananData.filter((order: Pesanan) => {
        if (activeTab === "Semua") return true;
        return order.statusTab === activeTab;
    });

    // FIX LINE 92: Menghitung jumlah per tab dengan tipe data yang jelas
    const getTabCount = (tabName: string) => {
        if (tabName === "Semua") return "";
        const count = pesananData.filter((order: Pesanan) => order.statusTab === tabName).length;
        return count > 0 ? ` (${count})` : "";
    };

    return (
        <div className="flex h-screen w-full font-display text-slate-900 overflow-hidden bg-[#1e1b4b]">
            
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-50">
                <div className="p-6 flex items-center gap-3 border-b border-slate-50">
                    <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                        <img src="/LOGO.jpeg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900 leading-tight">Seller Center</h1>
                        <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">Keranjangin</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    <Link href="/seller_main" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined">home</span> Home
                    </Link>
                    <Link href="/seller_main/pesanan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold">
                        <span className="material-symbols-outlined">shopping_bag</span> Pesanan
                    </Link>
                    <Link href="/seller_main/produk" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined">package_2</span> Produk
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

            {/* Main Area */}
            <main className="flex-1 ml-64 flex flex-col h-screen min-w-0" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>
                
                {/* Header */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 bg-transparent">
                    <div className="flex items-center flex-1 max-w-2xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="w-full pl-12 pr-4 py-3 rounded-full text-sm bg-white shadow-md focus:outline-none" placeholder="Cari Pembeli atau SKU..." type="text" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="shrink-0 px-8 pt-4 pb-4">
                        <h2 className="text-3xl font-black text-white tracking-tight">Kelola Pesanan</h2>
                        
                        {/* Status Tabs */}
                        <div className="flex border-b border-white/10 overflow-x-auto gap-2 mt-6 no-scrollbar">
                            {DAFTAR_TAB.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-3 text-sm whitespace-nowrap transition-all cursor-pointer ${activeTab === tab 
                                        ? "font-bold text-white border-b-2 border-white" 
                                        : "text-white/50 hover:text-white"}`}
                                >
                                    {tab}{getTabCount(tab)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto px-8 pb-12">
                        <div className="space-y-4">
                            {dataYangDitampilkan.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
                                    <span className="material-symbols-outlined text-5xl text-white/20 mb-4">inventory_2</span>
                                    <h3 className="text-lg font-bold text-white">Kosong</h3>
                                    <p className="text-white/40 text-sm">Tidak ada pesanan di kategori ini.</p>
                                </div>
                            ) : (
                                dataYangDitampilkan.map((order: Pesanan, index: number) => (
                                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-300 transition-all">
                                        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-800">{order.id}</span>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase
                                                ${order.statusUrgensi === 'critical' ? 'bg-red-100 text-red-600' : 
                                                  order.statusUrgensi === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {order.batasWaktu}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col md:flex-row gap-6">
                                            <div className="flex flex-1 gap-4">
                                                <div className="size-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                                                    <span className="material-symbols-outlined text-slate-300 text-2xl">{order.iconProduk}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{order.namaProduk}</h4>
                                                    <p className="text-xs text-slate-400 font-medium">{order.rincian}</p>
                                                    <p className="text-[11px] font-bold text-blue-600 mt-2">{order.kurir} {order.badgeKurir ? `(${order.badgeKurir})` : ''}</p>
                                                </div>
                                            </div>

                                            <div className="md:w-56 flex flex-col justify-center items-end border-l border-slate-50 pl-6 shrink-0">
                                                <p className="text-lg font-black text-slate-900 leading-none">{order.total}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-slate-600">{order.pembeli}</span>
                                                    <div className="size-6 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold">{order.inisial}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
                                            <button className={`px-6 py-2 rounded-xl text-xs font-black transition-all active:scale-95
                                                ${order.tipeTombol === 'success' ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                                                  order.tipeTombol === 'outline' ? 'border border-slate-200 text-slate-600 bg-white' : 'bg-blue-600 text-white shadow-blue-100'} shadow-lg cursor-pointer`}>
                                                {order.tombolAksi}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}