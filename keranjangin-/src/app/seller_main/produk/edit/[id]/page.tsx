"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// 1. DEFINISIKAN INTERFACE (Wajib untuk TS)
interface Produk {
    id: number;
    nama: string;
    sku: string;
    harga: number;
    stok: number;
    kategori: string;
    deskripsi: string;
}

// 2. DATA DUMMY (Pastikan tipe datanya sesuai Interface)
const produkDatabase: Produk[] = [
    { id: 1, nama: "Smartphone Pro Max 256GB - Phantom Black", sku: "SP-BLK-256", harga: 12500000, stok: 45, kategori: "Elektronik", deskripsi: "Smartphone flagship terbaru dengan kamera 108MP." },
    { id: 2, nama: "Wireless ANC Headphones X-5000", sku: "WH-X5-SLV", harga: 2199000, stok: 12, kategori: "Elektronik", deskripsi: "Headphone dengan fitur Noise Cancellation terbaik." },
    { id: 3, nama: "Mechanical Keyboard K6 Wireless RGB", sku: "MK-K6-RGB", harga: 1450000, stok: 0, kategori: "Elektronik", deskripsi: "Keyboard mechanical compact dengan switch hotswap." },
    { id: 4, nama: "Smartwatch Active Pro v2", sku: "SW-ACT2-NAVY", harga: 850000, stok: 156, kategori: "Elektronik", deskripsi: "Jam tangan pintar untuk memantau kesehatan Anda." }
];

export default function EditProdukPage() {
    const params = useParams();
    const router = useRouter();
    
    // 3. FIX: Berikan tipe data <Produk | null> pada useState
    const [produk, setProduk] = useState<Produk | null>(null);

    useEffect(() => {
        // params.id bisa berupa string atau string[], kita pastikan ambil string-nya
        const idParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;
        
        if (idParam) {
            const produkDitemukan = produkDatabase.find(p => p.id === parseInt(idParam));
            if (produkDitemukan) {
                setProduk(produkDitemukan);
            } else {
                alert("Ups! Produk tidak ditemukan.");
                router.push("/produk");
            }
        }
    }, [params, router]);

    // Handler untuk tombol simpan (biar nggak cuma hiasan)
    const handleSave = () => {
        alert("Perubahan Berhasil Disimpan! (Simulasi)");
        router.push("/produk");
    };

    if (!produk) {
        return (
            <div className="min-h-screen bg-[#1e1b4b] flex flex-col items-center justify-center text-white font-bold gap-4">
                <div className="animate-spin size-8 border-4 border-white/20 border-t-white rounded-full"></div>
                Memuat Data Produk...
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full font-display text-slate-900 overflow-hidden bg-[#1e1b4b]">

            {/* Sidebar (Sama seperti ProdukPage agar konsisten) */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-50">
                <div className="p-6 flex items-center gap-3 border-b border-slate-50">
                    <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                        <img src="/image/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900">Seller Center</h1>
                        <p className="text-[10px] uppercase text-blue-600 font-bold">Keranjangin</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50" href="/">
                        <span className="material-symbols-outlined">home</span> Home
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold" href="/produk">
                        <span className="material-symbols-outlined">package_2</span> Produk
                    </Link>
                    {/* Tambahkan menu lain di sini */}
                </nav>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col ml-64 min-w-0 h-screen" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>

                {/* Header */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <Link href="/produk" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            Edit Produk <span className="text-white/50 font-normal">#{produk.id}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-white text-blue-900 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </header>

                {/* Form (Scrollable) */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Card 1: Informasi Dasar */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">info</span> Informasi Dasar
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">Nama Produk</label>
                                    <input
                                        type="text"
                                        defaultValue={produk.nama}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700">SKU (Stock Keeping Unit)</label>
                                        <input
                                            type="text"
                                            value={produk.sku}
                                            disabled
                                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700">Kategori</label>
                                        <select defaultValue={produk.kategori} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                                            <option value="Elektronik">Elektronik</option>
                                            <option value="Fashion">Fashion</option>
                                            <option value="Kesehatan">Kesehatan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">Deskripsi</label>
                                    <textarea
                                        defaultValue={produk.deskripsi}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Harga & Stok */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">payments</span> Harga & Stok
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">Harga Jual (Rp)</label>
                                    <input
                                        type="number"
                                        defaultValue={produk.harga}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-blue-600 outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">Stok Tersedia</label>
                                    <input
                                        type="number"
                                        defaultValue={produk.stok}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}