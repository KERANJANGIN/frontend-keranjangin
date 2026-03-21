"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase"; 
import { useRouter } from "next/navigation";

// --- DUMMY DATA ANALYTICS ---
const ringkasanEksekutif = {
    pendapatan: { total: "Rp 450.000.000", trend: "up", percentage: "12.5%" },
    konversi: { total: "4.5%", trend: "up", percentage: "1.2%" },
    pengunjung: { total: "45.290", trend: "down", percentage: "3.0%" },
};

const topProduk = [
    { id: 1, nama: "Mouse Gaming Logitech G502", terjual: "1.2k", pendapatan: "Rp 102.000.000" },
    { id: 2, nama: "Mechanical Keyboard K6 Wireless", terjual: "800", pendapatan: "Rp 96.000.000" },
    { id: 3, nama: "Deskmat XL Black Edition", terjual: "500", pendapatan: "Rp 15.000.000" },
    { id: 4, nama: "Webcam 1080p Pro Stream", terjual: "320", pendapatan: "Rp 24.000.000" },
    { id: 5, nama: "Headstand Premium Wood", terjual: "150", pendapatan: "Rp 7.500.000" },
];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState("01 Mar - 20 Mar");

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
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/">
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
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/marketing">
                        <span className="material-symbols-outlined">campaign</span>
                        <span>Marketing</span>
                    </Link>
                    {/* Menu Analytics Aktif */}
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/seller_main/analytics">
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
                        <h2 className="text-2xl font-black text-white tracking-tight">Bisnis Analitik</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="pl-12 pr-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none w-64 text-slate-800" placeholder="Cari Data... (Ctrl + K)" type="text" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block text-white">
                                <p className="text-sm font-bold leading-none">Indo Tech Store</p>
                                <p className="text-[10px] opacity-80 mt-1">Official Partner</p>
                            </div>
                            <div className="size-11 rounded-full bg-cover bg-center border-2 border-white/50" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC1zmp7YYt6oMDsTdv1bNgxpofyoEuLVBqeQp-WLWWxuCGBXro5gXoPacDjyc8StdsGIVlwRoEr5t7Xak65p2AslTeE34eGi8903dOn73Rf-mO7PLaCLN8Z-2vUEE_8c6-eYnPJ_jIjcMdn94sglqgz27H0DkIuLuI7bU-B_8ViI4gAP6iWS2_kVYpMgc96DNl77_JqmMc0sOcmKeKAmcyDz-iNwONuFY0d435TR9QNZyX-SXPbAHql7w_jiLXRpRy3UBmfLpnq7iW')" }}></div>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE DASHBOARD CONTENT */}
                <main className="flex-1 overflow-y-auto p-8 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                    {/* Section 1: Page Header & Action */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">The Business Brain</h2>
                            <p className="text-white/80 mt-1 text-sm max-w-xl">Ubah data menjadi strategi. Pantau performa toko Anda secara real-time.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Date Picker (Simulasi) */}
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-white/20 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                {dateRange}
                                <span className="material-symbols-outlined text-[18px] ml-2">expand_more</span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary rounded-xl text-sm font-bold shadow-lg hover:bg-slate-50 transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-[18px]">download</span> Export Report
                            </button>
                        </div>
                    </div>

                    {/* Section 2: Ringkasan Eksekutif (Metric Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Card 1: Total Pendapatan */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Total Pendapatan</h3>
                                </div>
                                <div className="group relative cursor-help">
                                    <span className="material-symbols-outlined text-slate-300 text-[18px] hover:text-primary">info</span>
                                    <div className="absolute right-0 top-6 w-48 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">Total nilai pesanan yang berhasil diselesaikan pada periode ini.</div>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">{ringkasanEksekutif.pendapatan.total}</h2>
                            <div className="flex items-center gap-1.5 mt-auto">
                                <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${ringkasanEksekutif.pendapatan.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                        {ringkasanEksekutif.pendapatan.trend === 'up' ? 'trending_up' : 'trending_down'}
                                    </span>
                                    {ringkasanEksekutif.pendapatan.percentage}
                                </span>
                                <span className="text-xs text-slate-400">vs periode sebelumnya</span>
                            </div>
                        </div>

                        {/* Card 2: Tingkat Konversi */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Tingkat Konversi</h3>
                                </div>
                                <div className="group relative cursor-help">
                                    <span className="material-symbols-outlined text-slate-300 text-[18px] hover:text-primary">info</span>
                                    <div className="absolute right-0 top-6 w-56 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">Persentase pengunjung toko yang akhirnya melakukan pembayaran.</div>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">{ringkasanEksekutif.konversi.total}</h2>
                            <div className="flex items-center gap-1.5 mt-auto">
                                <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${ringkasanEksekutif.konversi.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                        {ringkasanEksekutif.konversi.trend === 'up' ? 'trending_up' : 'trending_down'}
                                    </span>
                                    {ringkasanEksekutif.konversi.percentage}
                                </span>
                                <span className="text-xs text-slate-400">vs periode sebelumnya</span>
                            </div>
                        </div>

                        {/* Card 3: Pengunjung Unik */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">group</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Pengunjung Unik</h3>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">{ringkasanEksekutif.pengunjung.total}</h2>
                            <div className="flex items-center gap-1.5 mt-auto">
                                <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${ringkasanEksekutif.pengunjung.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                        {ringkasanEksekutif.pengunjung.trend === 'up' ? 'trending_up' : 'trending_down'}
                                    </span>
                                    {ringkasanEksekutif.pengunjung.percentage}
                                </span>
                                <span className="text-xs text-slate-400">vs periode sebelumnya</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                        {/* MAIN LEFT COLUMN (Tren Penjualan & Sales Funnel) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Tren Penjualan Chart (Visualisasi Simulasi) */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg text-slate-800">Tren Penjualan</h3>
                                    <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary">
                                        <option>Harian</option>
                                        <option>Mingguan</option>
                                    </select>
                                </div>

                                {/* Simulated Chart Area using SVG (Clean UI style) */}
                                <div className="h-64 w-full relative mb-4">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                                        {/* Grid lines */}
                                        <line x1="0" y1="40" x2="800" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="90" x2="800" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="140" x2="800" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="190" x2="800" y2="190" stroke="#e2e8f0" strokeWidth="2" />

                                        {/* Area fill */}
                                        <path d="M0,150 Q100,80 200,120 T400,60 T600,90 T800,30 L800,190 L0,190 Z" fill="rgba(99, 102, 241, 0.1)"></path>
                                        {/* Line stroke */}
                                        <path d="M0,150 Q100,80 200,120 T400,60 T600,90 T800,30" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>

                                        {/* Data points */}
                                        <circle cx="200" cy="120" r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                                        <circle cx="400" cy="60" r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                                        <circle cx="600" cy="90" r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                                        <circle cx="800" cy="30" r="5" fill="#4f46e5" className="animate-pulse" />
                                    </svg>

                                    {/* X-Axis labels */}
                                    <div className="absolute -bottom-2 left-0 w-full flex justify-between px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        <span>01 Mar</span><span>05 Mar</span><span>10 Mar</span><span>15 Mar</span><span>20 Mar</span>
                                    </div>
                                </div>

                                {/* Actionable Insight Card (Terkait Chart) */}
                                <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                                    <span className="material-symbols-outlined text-indigo-500 mt-0.5">tips_and_updates</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-900">Insight Penjualan</h4>
                                        <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                                            Terjadi lonjakan penjualan <strong>+25%</strong> pada tanggal 15 Maret. Data menunjukkan ini berasal dari promosi Payday. Pertimbangkan untuk menyiapkan stok lebih untuk kampanye serupa bulan depan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sales Funnel */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-6">Sales Funnel (Corong Penjualan)</h3>

                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    {/* Funnel Visual */}
                                    <div className="flex-1 w-full space-y-4">
                                        {/* Kunjungan */}
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                <span className="text-slate-600">Kunjungan Produk</span>
                                                <span className="text-slate-800">100% (45,290)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3">
                                                <div className="bg-blue-400 h-3 rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                        {/* Masuk Keranjang */}
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                <span className="text-slate-600">Masuk Keranjang</span>
                                                <span className="text-slate-800">15% (6,793)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3">
                                                <div className="bg-indigo-400 h-3 rounded-full" style={{ width: '35%' }}></div>
                                            </div>
                                        </div>
                                        {/* Pembayaran Selesai */}
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                <span className="text-slate-600">Pembayaran Selesai</span>
                                                <span className="text-slate-800">4.5% (2,038)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3">
                                                <div className="bg-emerald-400 h-3 rounded-full" style={{ width: '15%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Funnel Insight */}
                                    <div className="md:w-1/3 w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-amber-600 mb-2">
                                            <span className="material-symbols-outlined text-[18px]">warning</span>
                                            <h4 className="text-xs font-bold">Identifikasi Drop-off</h4>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                            Banyak pengunjung memasukkan barang ke keranjang, namun <strong>tidak menyelesaikan pembayaran.</strong>
                                        </p>
                                        <button className="text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-700 py-2 px-3 rounded-lg transition-colors text-center">
                                            Aktifkan "Remind Chat"
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (Top Produk) */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg text-slate-800">Top 5 Produk</h3>
                                    <Link href="/produk" className="text-xs font-bold text-primary hover:underline">Lihat Semua</Link>
                                </div>

                                <div className="space-y-5">
                                    {topProduk.map((item, index) => (
                                        <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            {/* Rank Number */}
                                            <div className={`size-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${index === 0 ? 'bg-amber-100 text-amber-600' :
                                                index === 1 ? 'bg-slate-200 text-slate-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-50 text-slate-400 border border-slate-200'
                                                }`}>
                                                {index + 1}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 truncate" title={item.nama}>{item.nama}</h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[11px] text-slate-500 font-medium">{item.terjual} Terjual</span>
                                                    <span className="text-xs font-bold text-emerald-600">{item.pendapatan}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Optimization Suggestion */}
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        <strong>Strategi:</strong> Maksimalkan stok dan alokasikan budget Iklan lebih besar untuk 3 produk teratas Anda guna mendongkrak omset.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}