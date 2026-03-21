"use client";

import { useState } from "react";
import Link from "next/link";

// --- DUMMY DATA KEUANGAN ---
const riwayatTransaksi = [
    {
        id: "TRX-001",
        tanggal: "20 Mar 2026, 14:30",
        aktivitas: "Penjualan",
        referensi: "#ORD-99281",
        nominal: "+ Rp 850.000",
        tipe: "income", // 'income', 'outcome', 'penalty'
        status: "Selesai",
    },
    {
        id: "TRX-002",
        tanggal: "19 Mar 2026, 09:15",
        aktivitas: "Tarik Dana",
        referensi: "WD-77192",
        nominal: "- Rp 5.000.000",
        tipe: "outcome",
        status: "Berhasil",
    },
    {
        id: "TRX-003",
        tanggal: "18 Mar 2026, 16:00",
        aktivitas: "Biaya Pemasaran (Iklan)",
        referensi: "IKL-2024",
        nominal: "- Rp 25.000",
        tipe: "outcome",
        status: "Selesai",
    },
    {
        id: "TRX-004",
        tanggal: "17 Mar 2026, 10:00",
        aktivitas: "Penalti Keterlambatan",
        referensi: "#ORD-88122",
        nominal: "- Rp 15.000",
        tipe: "penalty",
        status: "Dipotong",
    },
    {
        id: "TRX-005",
        tanggal: "15 Mar 2026, 11:20",
        aktivitas: "Penjualan",
        referensi: "#ORD-99105",
        nominal: "+ Rp 1.250.000",
        tipe: "income",
        status: "Selesai",
    }
];

export default function KeuanganPage() {
    const [filterBulan, setFilterBulan] = useState("Maret 2026");
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawStep, setWithdrawStep] = useState(1); // 1: Input Nominal, 2: PIN

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
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/marketing">
                        <span className="material-symbols-outlined">campaign</span>
                        <span>Marketing</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/analytics">
                        <span className="material-symbols-outlined">analytics</span>
                        <span>Analytics</span>
                    </Link>
                    {/* Menu Keuangan Aktif */}
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/seller_main/keuangan">
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
                        <h2 className="text-2xl font-black text-white tracking-tight">Keuangan & Saldo</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="pl-12 pr-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none w-64 text-slate-800" placeholder="Cari Transaksi..." type="text" />
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
                            <h2 className="text-3xl font-black text-white tracking-tight">The Trust Center</h2>
                            <p className="text-white/80 mt-1 text-sm max-w-xl">Kelola arus kas, tarik dana penjualan, dan pantau riwayat transaksi Anda secara transparan.</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20 backdrop-blur-sm cursor-pointer">
                            <span className="material-symbols-outlined text-lg">history</span> Riwayat Tarik
                        </button>
                    </div>

                    {/* Section 2: Saldo & Rekening */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                        {/* Kartu Saldo Utama (Active & Pending) */}
                        <div className="lg:col-span-2 flex flex-col md:flex-row gap-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">

                            {/* Saldo Aktif */}
                            <div className="flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                        </div>
                                        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Saldo Aktif</h3>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-800 mb-1">Rp 15.250.000</h2>
                                    <p className="text-xs text-emerald-600 font-semibold mb-6">Dana tersedia dan bisa ditarik kapan saja.</p>
                                </div>
                                <button
                                    onClick={() => setShowWithdrawModal(true)}
                                    className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">account_balance</span> Tarik Dana Sekarang
                                </button>
                            </div>

                            {/* Saldo Tertunda */}
                            <div className="flex-1 flex flex-col justify-center pt-4 md:pt-0 md:pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="size-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Saldo Tertunda</h3>
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 mb-2">Rp 2.100.000</h2>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                    <p className="text-[11px] text-slate-600 leading-relaxed">
                                        Dana dari pesanan yang sedang dalam proses pengiriman atau menunggu konfirmasi penerimaan oleh pembeli.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Manajemen Rekening Pencairan */}
                        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Rekening Pencairan</h3>
                                <button className="text-xs font-bold text-primary hover:underline cursor-pointer">+ Tambah</button>
                            </div>

                            <div className="border border-primary/20 bg-primary/5 rounded-xl p-4 relative overflow-hidden group hover:border-primary/40 transition-colors cursor-pointer">
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                    <span className="material-symbols-outlined text-[10px]">check_circle</span> Utama
                                </div>
                                <div className="flex items-center gap-4 mb-3 mt-1">
                                    <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center">
                                        {/* Placeholder Logo Bank */}
                                        <span className="font-black text-blue-800 text-sm italic tracking-tighter">BCA</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg leading-none tracking-widest">**** 1234</h4>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase">Atas Nama</p>
                                        <p className="text-sm font-bold text-slate-700">Abdiel Deandra</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Terverifikasi</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-6">
                                <p className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                                    <span className="material-symbols-outlined text-[16px] text-slate-400">shield_lock</span>
                                    Data rekening Anda dilindungi dengan enkripsi end-to-end standar perbankan.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Riwayat Transaksi */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative pb-16 md:pb-0 z-0">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800">Riwayat Transaksi</h3>
                            <div className="flex gap-3">
                                <select className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-primary cursor-pointer">
                                    <option>Semua Tipe</option>
                                    <option>Pemasukan</option>
                                    <option>Pengeluaran</option>
                                </select>
                                <select
                                    value={filterBulan}
                                    onChange={(e) => setFilterBulan(e.target.value)}
                                    className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-primary cursor-pointer"
                                >
                                    <option>Maret 2026</option>
                                    <option>Februari 2026</option>
                                </select>
                                <button className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[16px]">download</span> CSV
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-slate-200">
                                    <tr>
                                        <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aktivitas</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">No. Referensi</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Nominal</th>
                                        <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {riwayatTransaksi.map((trx, index) => (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{trx.tanggal}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800">{trx.aktivitas}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600 font-mono">{trx.referensi}</td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                {/* Mewarnai Nominal Berdasarkan Tipe Transaksi (Penting untuk UX Keuangan) */}
                                                <p className={`text-sm font-black ${trx.tipe === 'income' ? 'text-emerald-600' :
                                                        trx.tipe === 'penalty' ? 'text-red-500' : 'text-slate-800'
                                                    }`}>
                                                    {trx.nominal}
                                                </p>
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <button className="text-[11px] font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODAL TARIK DANA (Simulasi) --- */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-black text-lg text-slate-800">Tarik Dana Penjualan</h3>
                            <button onClick={() => { setShowWithdrawModal(false); setWithdrawStep(1); }} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body Step 1: Input Nominal */}
                        {withdrawStep === 1 && (
                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tujuan Pencairan</p>
                                    <div className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-white border border-slate-200 rounded flex items-center justify-center"><span className="text-[9px] font-black text-blue-800 italic">BCA</span></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 leading-tight">**** 1234</p>
                                                <p className="text-[10px] text-slate-500">Abdiel Deandra</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nominal Penarikan</p>
                                        <p className="text-[10px] text-primary font-bold cursor-pointer hover:underline">Tarik Semua</p>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">Rp</span>
                                        <input type="number" placeholder="0" className="w-full pl-12 pr-4 py-4 text-2xl font-black text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2">Saldo Aktif: <span className="font-bold text-slate-700">Rp 15.250.000</span></p>
                                </div>

                                {/* Transparency in Fees Box */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                                    <div className="flex justify-between items-center text-xs mb-1">
                                        <span className="text-slate-600">Nominal Ditarik</span>
                                        <span className="font-bold text-slate-800">Rp 1.000.000</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs mb-2 pb-2 border-b border-blue-200/50">
                                        <span className="text-slate-600 flex items-center gap-1">Biaya Admin Bank <span className="material-symbols-outlined text-[12px] text-slate-400">info</span></span>
                                        <span className="font-bold text-slate-800">- Rp 6.500</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-blue-900">Total Diterima</span>
                                        <span className="font-black text-emerald-600">Rp 993.500</span>
                                    </div>
                                </div>

                                <button onClick={() => setWithdrawStep(2)} className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer">
                                    Lanjut Penarikan
                                </button>
                            </div>
                        )}

                        {/* Modal Body Step 2: PIN Verification (Scrambled Numpad Simulation) */}
                        {withdrawStep === 2 && (
                            <div className="p-6 flex flex-col items-center">
                                <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mb-4">
                                    <span className="material-symbols-outlined text-3xl">lock</span>
                                </div>
                                <h4 className="text-lg font-black text-slate-800 mb-1">Masukkan PIN Saldo</h4>
                                <p className="text-xs text-slate-500 mb-6 text-center">Demi keamanan, masukkan 6 digit PIN Anda untuk memproses penarikan ini.</p>

                                {/* Visual PIN Dots */}
                                <div className="flex gap-3 mb-8">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className={`size-4 rounded-full border-2 ${i <= 3 ? 'bg-slate-800 border-slate-800' : 'border-slate-300'}`}></div>
                                    ))}
                                </div>

                                {/* Scrambled Numpad UI */}
                                <div className="grid grid-cols-3 gap-3 w-full max-w-[240px] mb-6">
                                    {[7, 2, 9, 4, 1, 8, 3, 6, 5].map(num => (
                                        <button key={num} className="py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xl font-bold text-slate-700 transition-colors cursor-pointer">
                                            {num}
                                        </button>
                                    ))}
                                    <button className="py-3 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-50 rounded-xl"><span className="font-bold text-xs uppercase">Lupa</span></button>
                                    <button className="py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xl font-bold text-slate-700 transition-colors cursor-pointer">0</button>
                                    <button className="py-3 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-50 rounded-xl"><span className="material-symbols-outlined">backspace</span></button>
                                </div>

                                <div className="flex gap-3 w-full mt-2">
                                    <button onClick={() => setWithdrawStep(1)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                                        Kembali
                                    </button>
                                    <button onClick={() => { setShowWithdrawModal(false); setWithdrawStep(1); alert("Dana berhasil diproses ke Bank!"); }} className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer">
                                        Konfirmasi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}