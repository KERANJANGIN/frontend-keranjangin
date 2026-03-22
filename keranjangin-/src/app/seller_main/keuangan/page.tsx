"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
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

    const [filterBulan, setFilterBulan] = useState("Maret 2026");
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawStep, setWithdrawStep] = useState(1); // 1: Input Nominal, 2: PIN

    return (
        <>
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
                            <p className="text-sm font-bold leading-none">{userData?.shopName || "Memuat..."}</p>
                            <p className="text-[10px] opacity-80 mt-1">{userData?.isSeller ? "Official Partner" : "Pendaftar Baru"}</p>
                        </div>
                        <div className="size-11 rounded-full bg-cover bg-center border-2 border-white/50" style={{ backgroundImage: `url('${userData?.avatar_url || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}></div>
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
            </>
    );
}