"use client"; // Wajib ditambahkan di Next.js App Router jika menggunakan useState

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

// Tab names for filtering
const DAFTAR_TAB = ["Semua", "Belum Bayar", "Perlu Dikirim", "Dikirim", "Selesai", "Dibatalkan", "Retur"];

export default function KelolaPesanan() {
    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single();
                if (user) {
                    setUserData(user);
                    
                    // Fetch real orders for this seller
                    const response = await fetch(`/api/orders?seller=${user.id}`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setOrders(data);
                    }
                }
            }
            setIsLoading(false);
        };
        fetchUserAndOrders();
    }, []);

    const [activeTab, setActiveTab] = useState("Perlu Dikirim");

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_status: newStatus })
            });

            if (response.ok) {
                // Update local state
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
            } else {
                alert("Gagal memperbarui status order.");
            }
        } catch (error) {
            console.error("Update status error:", error);
        }
    };

    const handleConfirmPayment = async (order: any) => {
        try {
            // 1. Update Transaction to 'paid'
            const txRes = await fetch('/api/transactions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txId: order.transaction.id, status: 'paid' })
            });

            if (!txRes.ok) throw new Error("Gagal konfirmasi transaksi");

            // 2. Update Order to 'confirmed'
            const ordRes = await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_status: 'confirmed' })
            });

            if (ordRes.ok) {
                // Update local state
                setOrders(prev => prev.map(o => 
                    o.id === order.id ? { 
                        ...o, 
                        order_status: 'confirmed', 
                        transaction: { ...o.transaction, status: 'paid' } 
                    } : o
                ));
            } else {
                throw new Error("Gagal konfirmasi order");
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    // Mapping function to categorize orders into tabs
    const getStatusTab = (order: any) => {
        const txStatus = order.transaction?.status;
        const ordStatus = order.order_status;

        if (txStatus === 'waiting_payment') return "Belum Bayar";
        if (ordStatus === 'action_needed' && txStatus === 'paid') return "Perlu Dikirim";
        if (ordStatus === 'confirmed') return "Dikirim";
        if (ordStatus === 'canceled') return "Dibatalkan";
        // Default mappings based on your actual logic or fallback
        return "Semua";
    };

    const dataYangDitampilkan = orders.filter((order) => {
        if (activeTab === "Semua") return true;
        return getStatusTab(order) === activeTab;
    });

    const getTabCount = (tabName: string) => {
        if (tabName === "Semua") return "";
        const count = orders.filter(order => getStatusTab(order) === tabName).length;
        return count > 0 ? ` (${count})` : "";
    };

    return (
        <>
            {/* Topbar / Header */}
            <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 bg-transparent">
                <div className="flex items-center flex-1 max-w-2xl">
                    <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input className="w-full pl-12 pr-4 py-3 border-none rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none" placeholder="Cari Nama Pembeli, No. Resi, atau SKU (Ctrl+K)" type="text" />
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

                {/* Content Wrapper */}
                <div className="flex-1 flex flex-col min-h-0">

                    {/* BAGIAN ATAS (Locked / Tidak Ikut Scroll) */}
                    <div className="shrink-0 px-8 pt-8 pb-4 z-10">
                        {/* Page Header */}
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <Link href="/seller_main" className="flex items-center text-white/70 hover:text-white text-sm font-medium mb-2 transition-colors">
                                    <span className="material-symbols-outlined text-base mr-1">arrow_back</span> Kembali
                                </Link>
                                <h2 className="text-3xl font-black text-white tracking-tight">Kelola Pesanan</h2>
                                <p className="text-white/80 mt-1 text-sm">Pantau dan proses pesanan masuk agar pelanggan puas sesuai SLA.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all border border-white/20 cursor-pointer">
                                <span className="material-symbols-outlined text-lg">download</span> Export Data
                            </button>
                        </div>

                        {/* Dynamic Status Tabs Terhubung ke State */}
                        <div className="flex border-b border-white/20 overflow-x-auto gap-2 mb-4">
                            {DAFTAR_TAB.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-3 text-sm whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab
                                        ? "font-bold text-white border-b-2 border-white"
                                        : "font-medium text-white/60 hover:text-white"
                                        }`}
                                >
                                    {tab}{getTabCount(tab)}
                                </button>
                            ))}
                        </div>

                        {/* Bulk Action Bar */}
                        <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-md border border-slate-200">
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer accent-primary" />
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Pilih Semua</span>
                                </label>
                                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                                <span className="text-xs font-medium text-slate-500">2 pesanan dipilih</span>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                                    <span className="material-symbols-outlined text-lg">print</span> Cetak Label Massal
                                </button>
                                <button className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                                    <span className="material-symbols-outlined text-lg">local_shipping</span> Atur Pengiriman
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN BAWAH (Daftar Card Pesanan - Scrollable) */}
                    <div className="flex-1 overflow-y-auto px-8 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                        <div className="space-y-4">

                            {/* Jika data kosong berdasarkan tab yang dipilih */}
                            {dataYangDitampilkan.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center mt-8 text-white">
                                    <span className="material-symbols-outlined text-6xl text-white/30 mb-4">inbox</span>
                                    <h3 className="text-xl font-bold mb-2">Belum ada pesanan nih!</h3>
                                    <p className="text-sm text-white/60 max-w-sm">
                                        Yuk promosikan produkmu di fitur Marketing untuk mendapatkan pesanan baru.
                                    </p>
                                </div>
                            ) : (
                                /* 4. MAPPING DATA YANG SUDAH DI-FILTER */
                                dataYangDitampilkan.map((order, index) => (
                                    <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        {/* Header Card */}
                                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary cursor-pointer accent-primary" />
                                                <span className="text-sm font-bold text-slate-800">ID: #ORD-{order.id}</span>
                                                <span className="text-xs font-medium text-slate-500">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-1.5 text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span className="text-xs font-bold">{order.transaction?.status === 'waiting_payment' ? 'Menunggu Pembayaran' : 'Proses'}</span>
                                            </div>
                                        </div>

                                        {/* Body Card */}
                                        <div className="p-6 flex flex-col md:flex-row gap-6">
                                            {/* Product Info */}
                                            <div className="flex flex-1 gap-4">
                                                <div className="size-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {order.item?.img_path ? (
                                                        <img src={order.item.img_path} className="w-full h-full object-cover" alt={order.item.name} />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-slate-400 text-3xl">package</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-base mb-1">{order.item?.name || "Produk Tidak Ditemukan"}</h4>
                                                    <p className="text-sm text-slate-500 font-medium">{order.quantity} Unit x Rp {order.price.toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                            {/* Courier Info */}
                                            <div className="md:w-64 border-l border-slate-100 pl-6 flex flex-col justify-center">
                                                <p className="text-xs text-slate-500 font-medium mb-1">Kurir Pengiriman:</p>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <p className="font-bold text-slate-800">Reguler (ID: {order.courier})</p>
                                                </div>
                                                <button className="text-xs font-bold text-primary hover:underline self-start flex items-center gap-1 cursor-pointer">
                                                    <span className="material-symbols-outlined text-sm">location_on</span> Lacak Resi
                                                </button>
                                            </div>
                                        </div>

                                        {/* Footer Card */}
                                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                                        {order.buyer?.avatarUrl ? (
                                                            <img src={order.buyer.avatarUrl} className="w-full h-full object-cover" alt="Buyer" />
                                                        ) : (
                                                            order.buyer?.full_name?.substring(0, 1) || "?"
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Pembeli: <span className="font-bold text-slate-800">{order.buyer?.full_name || "Pembeli Umum"}</span>
                                                    </span>
                                                </div>
                                                <div className="text-sm font-medium text-slate-700">
                                                    Total: <span className="font-black text-primary text-base">Rp {(order.price * order.quantity).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                {order.transaction?.status === 'paid' && order.order_status === 'action_needed' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(order.id, 'canceled')}
                                                            className="px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                                                        >
                                                            Batalkan
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                                            className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">check_circle</span> Konfirmasi
                                                        </button>
                                                    </>
                                                )}
                                                {order.order_status === 'confirmed' && (
                                                    <button className="px-6 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
                                                        <span className="material-symbols-outlined text-sm">local_shipping</span> Atur Kirim
                                                    </button>
                                                )}
                                                {order.order_status === 'canceled' && (
                                                    <span className="text-red-500 font-bold text-sm italic">Dibatalkan</span>
                                                )}
                                                {order.transaction?.status === 'waiting_payment' && (
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-slate-400 font-bold text-sm italic">Menunggu Pembayaran...</span>
                                                        <button 
                                                            onClick={() => handleConfirmPayment(order)}
                                                            className="px-6 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">payments</span> Konfirmasi Pembayaran
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Micro-copy Info Alert (Hanya muncul jika ada pesanan di tab tsb) */}
                            {dataYangDitampilkan.length > 0 && (
                                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-500">info</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-800">Informasi SLA Pengiriman</h4>
                                        <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                                            Harap perhatikan indikator batas waktu. Warna <span className="font-bold text-orange-600">oranye</span> menandakan waktu pengiriman kurang dari 24 jam. Warna <span className="font-bold text-red-600">merah</span> menandakan waktu kurang dari 6 jam untuk menghindari penalti otomatis.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </>
    );
}