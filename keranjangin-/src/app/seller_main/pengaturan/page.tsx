"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

const SETTING_TABS = [
    { id: "profil", label: "Profil Toko", icon: "storefront" },
    { id: "pengiriman", label: "Pengiriman", icon: "local_shipping" },
    { id: "pembayaran", label: "Rekening & Pembayaran", icon: "account_balance" },
    { id: "keamanan", label: "Keamanan", icon: "security" },
    { id: "notifikasi", label: "Notifikasi", icon: "notifications" },
];

export default function SettingsPage() {
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

    const [activeTab, setActiveTab] = useState("pengiriman"); // Set default ke Pengiriman untuk preview
    const [storeStatus, setStoreStatus] = useState("aktif");

    // State Profil Toko
    const [logoPreview, setLogoPreview] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuCC1zmp7YYt6oMDsTdv1bNgxpofyoEuLVBqeQp-WLWWxuCGBXro5gXoPacDjyc8StdsGIVlwRoEr5t7Xak65p2AslTeE34eGi8903dOn73Rf-mO7PLaCLN8Z-2vUEE_8c6-eYnPJ_jIjcMdn94sglqgz27H0DkIuLuI7bU-B_8ViI4gAP6iWS2_kVYpMgc96DNl77_JqmMc0sOcmKeKAmcyDz-iNwONuFY0d435TR9QNZyX-SXPbAHql7w_jiLXRpRy3UBmfLpnq7iW");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            const imageUrl = URL.createObjectURL(file);
            setLogoPreview(imageUrl);
        } else {
            alert("Gunakan format PNG atau JPG ya!");
        }
    };

    return (
        <div className="flex h-screen w-full font-display text-slate-100 bg-[#1e1b4b] overflow-hidden">

            {/* SIDEBAR (Locked) */}
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
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/seller_main/keuangan">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                        <span>Keuangan</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-200">
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/seller_main/pengaturan">
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
            <div className="flex-1 flex flex-col ml-64 min-w-0 gradient-bg h-screen" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>

                {/* HEADER */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 bg-transparent border-b border-white/10">
                    <div className="flex items-center flex-1 max-w-2xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="w-full pl-12 pr-4 py-3 border-none rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none text-slate-800" placeholder="Cari pengaturan... (Ctrl + K)" type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative text-white cursor-pointer">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-4 bg-red-500 border-2 border-[#9288f8] rounded-full text-[10px] flex items-center justify-center font-bold text-white">25</span>
                        </button>
                        <div className="h-8 w-px bg-white/20 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block text-white">
                                <p className="text-sm font-bold leading-none">{userData?.shopName || "Memuat..."}</p>
                                <p className="text-[10px] opacity-80 mt-1">{userData?.isSeller ? "Official Partner" : "Pendaftar Baru"}</p>
                            </div>
                            <div className="size-11 rounded-full bg-cover bg-center border-2 border-white/50 shadow-md cursor-pointer" style={{ backgroundImage: `url('${userData?.avatar_url || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}></div>
                        </div>
                    </div>
                </header>

                {/* CONTENT WRAPPER (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-8 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Pengaturan Toko</h2>
                            <p className="text-white/80 mt-1 text-sm">Pusat kontrol operasional, keamanan, dan informasi bisnis Anda.</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl text-sm font-bold shadow-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap">
                            <span className="material-symbols-outlined text-lg">save</span>
                            Simpan Perubahan
                        </button>
                    </div>

                    {/* SPLIT-VIEW LAYOUT */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* KIRI: Navigasi Kategori & Status Toko */}
                        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6 sticky top-0">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden p-2">
                                <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider px-4 py-3">Menu Pengaturan</h3>
                                <div className="space-y-1">
                                    {SETTING_TABS.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === tab.id
                                                ? "bg-white text-primary shadow-md"
                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Toko Panel */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                                <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Status Toko</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${storeStatus === 'aktif' ? 'border-emerald-400 bg-emerald-400' : 'border-white/40'}`}>
                                            {storeStatus === 'aktif' && <div className="size-2 bg-white rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="status" className="hidden" checked={storeStatus === 'aktif'} onChange={() => setStoreStatus('aktif')} />
                                        <span className={`text-sm font-bold transition-colors ${storeStatus === 'aktif' ? 'text-emerald-400' : 'text-white/80 group-hover:text-white'}`}>Toko Aktif</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${storeStatus === 'libur' ? 'border-amber-400 bg-amber-400' : 'border-white/40'}`}>
                                            {storeStatus === 'libur' && <div className="size-2 bg-white rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="status" className="hidden" checked={storeStatus === 'libur'} onChange={() => setStoreStatus('libur')} />
                                        <span className={`text-sm font-bold transition-colors ${storeStatus === 'libur' ? 'text-amber-400' : 'text-white/80 group-hover:text-white'}`}>Toko Libur</span>
                                    </label>
                                </div>
                                {storeStatus === 'libur' && (
                                    <p className="text-[10px] text-amber-200 mt-4 leading-relaxed bg-amber-500/20 p-2 rounded-lg border border-amber-500/30 animate-in fade-in">
                                        Toko Anda sedang dalam Mode Libur. Pembeli tidak dapat membuat pesanan baru saat ini.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* KANAN: Konten Dinamis Berdasarkan Tab */}
                        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-full min-h-[500px]">

                            {/* TAB 1: PROFIL TOKO */}
                            {activeTab === "profil" && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="mb-8 border-b border-slate-100 pb-6">
                                        <h3 className="font-bold text-2xl text-slate-800">Informasi Profil</h3>
                                        <p className="text-sm text-slate-500 mt-1">Kelola identitas utama toko Anda agar mudah dikenali pembeli.</p>
                                    </div>
                                    <div className="space-y-8 max-w-2xl">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Logo Toko</label>
                                            <div className="flex items-center gap-6">
                                                <div className="relative size-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-inner group">
                                                    <img src={logoPreview} alt="Preview Logo" className="w-full h-full object-cover" />
                                                    <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                        <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                                        <span className="text-[9px] font-bold mt-1">Ubah</span>
                                                    </div>
                                                </div>
                                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/png, image/jpeg" className="hidden" />
                                                <div>
                                                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                                                        Pilih Gambar
                                                    </button>
                                                    <p className="text-[11px] text-slate-400 mt-2">Maksimal ukuran 2MB (PNG/JPG).</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-700">Nama Toko <span className="text-red-500">*</span></label>
                                                <input type="text" defaultValue="Indo Tech Store" maxLength={30} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-700">Slogan</label>
                                                <input type="text" defaultValue="Solusi Gadget Tercepat" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-slate-700">Deskripsi Toko</label>
                                            <textarea rows={4} defaultValue="Toko resmi penyedia hardware PC dan aksesoris gaming terbaik di Indonesia." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: PENGIRIMAN */}
                            {activeTab === "pengiriman" && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="mb-8 border-b border-slate-100 pb-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-800">Pengiriman & Logistik</h3>
                                            <p className="text-sm text-slate-500 mt-1">Pastikan koordinat akurat agar kurir mudah melakukan penjemputan (Pickup).</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Alamat Penjemputan */}
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">location_on</span> Alamat Penjemputan Utama
                                                </h4>
                                                <button className="text-sm font-bold text-primary hover:underline">Ubah Alamat</button>
                                            </div>
                                            <div className="bg-white p-4 border border-slate-200 rounded-xl mb-4">
                                                <p className="text-sm font-bold text-slate-800">Indo Tech Store (Gudang 1)</p>
                                                <p className="text-sm text-slate-600 mt-1 leading-relaxed">Jl. Teknik No. 25, RT.02/RW.05, Kec. Beji, Kota Depok, Jawa Barat 16424</p>
                                            </div>

                                            {/* Simulasi Map Pinpoint */}
                                            <div className="w-full h-32 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                                                <span className="material-symbols-outlined text-red-500 text-3xl mb-1 relative z-10 group-hover:-translate-y-1 transition-transform">pin_drop</span>
                                                <p className="text-xs font-bold text-indigo-900 relative z-10">Koordinat Terdeteksi: -6.3644, 106.8286</p>
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                                    <span className="bg-white text-slate-800 px-4 py-2 rounded-lg text-xs font-bold shadow-lg">Sesuaikan Pinpoint di Peta</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Whitelist Jasa Kirim */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4">Pilih Jasa Kirim Aktif</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                {/* Kurir 1 */}
                                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-[10px] font-black text-red-600">J&T</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">J&T Express</p>
                                                            <p className="text-[10px] text-slate-500">Reguler & Hemat</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </div>

                                                {/* Kurir 2 */}
                                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-[10px] font-black text-red-500">SiCepat</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">SiCepat</p>
                                                            <p className="text-[10px] text-slate-500">Reguler, BEST, Halu</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </div>

                                                {/* Kurir 3 (Instant) */}
                                                <div className="flex items-center justify-between p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-8 bg-emerald-100 rounded flex items-center justify-center text-[10px] font-black text-emerald-700">GRAB</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-1">GrabExpress <span className="material-symbols-outlined text-[14px] text-emerald-600">bolt</span></p>
                                                            <p className="text-[10px] text-emerald-700 font-medium">Instant & Same-Day (Max 15:00)</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </div>

                                                {/* Kurir 4 (Non-aktif) */}
                                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl opacity-60 hover:opacity-100 transition-opacity">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-[10px] font-black text-blue-700">JNE</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">JNE</p>
                                                            <p className="text-[10px] text-slate-500">Reguler & YES</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* TAB 3: PEMBAYARAN & REKENING */}
                            {activeTab === "pembayaran" && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="mb-8 border-b border-slate-100 pb-6">
                                        <h3 className="font-bold text-2xl text-slate-800">Rekening & Pencairan</h3>
                                        <p className="text-sm text-slate-500 mt-1">Atur bank tujuan dan jadwal pencairan otomatis dana penjualan Anda.</p>
                                    </div>

                                    <div className="space-y-8 max-w-3xl">
                                        {/* Daftar Rekening */}
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-800">Rekening Tujuan</h4>
                                                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-[14px]">add</span> Tambah Bank</button>
                                            </div>
                                            <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-5 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-10 bg-white border border-slate-200 rounded flex items-center justify-center font-black text-blue-800 italic shadow-sm">BCA</div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 tracking-wider">2506 •••• ••21</h4>
                                                        <p className="text-xs text-slate-600 mt-0.5">A.N ABDIEL DEANDRA E.</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">verified</span> Terverifikasi</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rekening Utama</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pengaturan Pencairan Otomatis */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4">Jadwal Pencairan Dana</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <label className="border border-slate-200 rounded-xl p-4 cursor-pointer flex gap-3 hover:border-primary/50 transition-colors group">
                                                    <input type="radio" name="withdraw_schedule" className="mt-1 accent-primary" defaultChecked />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 group-hover:text-primary">Manual</p>
                                                        <p className="text-xs text-slate-500 mt-1">Tarik saldo kapan saja sesuai kebutuhan Anda secara langsung.</p>
                                                    </div>
                                                </label>
                                                <label className="border border-slate-200 rounded-xl p-4 cursor-pointer flex gap-3 hover:border-primary/50 transition-colors group">
                                                    <input type="radio" name="withdraw_schedule" className="mt-1 accent-primary" />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 group-hover:text-primary">Otomatis</p>
                                                        <p className="text-xs text-slate-500 mt-1">Sistem akan mencairkan seluruh saldo aktif setiap hari Jumat sore.</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Biaya Layanan */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                                            <div className="flex gap-3 items-center">
                                                <span className="material-symbols-outlined text-slate-400">receipt_long</span>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Biaya Layanan Keranjangin</p>
                                                    <p className="text-xs text-slate-500">Merchant Premium: Potongan 2.5% per transaksi sukses.</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100">Lihat Rincian</button>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* TAB 4: KEAMANAN */}
                            {activeTab === "keamanan" && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="mb-8 border-b border-slate-100 pb-6 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-3xl text-emerald-500">shield_lock</span>
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-800">Keamanan Akun</h3>
                                            <p className="text-sm text-slate-500 mt-1">Lindungi saldo dan data toko Anda dari akses yang tidak sah.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8 max-w-2xl">
                                        {/* Kredensial */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                                <div>
                                                    <p className="text-[11px] text-slate-500 uppercase font-bold mb-1">Password Login</p>
                                                    <p className="text-sm font-bold text-slate-800 tracking-widest">••••••••••••</p>
                                                </div>
                                                <button className="text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">Ubah Password</button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="text-[11px] text-slate-500 uppercase font-bold mb-1">PIN Transaksi (6 Digit)</p>
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">Aktif</span>
                                                    </div>
                                                </div>
                                                <button className="text-sm font-bold text-slate-600 hover:text-slate-800 hover:underline">Reset PIN</button>
                                            </div>
                                        </div>

                                        {/* 2FA */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <h4 className="font-bold text-slate-800">Verifikasi 2 Langkah (2FA)</h4>
                                                <div className="group relative cursor-help">
                                                    <span className="material-symbols-outlined text-slate-300 text-[16px] hover:text-primary">help</span>
                                                    <div className="absolute left-0 bottom-6 w-64 bg-slate-800 text-white text-[10px] p-3 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 leading-relaxed">Sistem akan meminta kode OTP setiap kali ada login dari perangkat baru atau saat penarikan dana.</div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-emerald-500 text-2xl">chat</span>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">WhatsApp OTP <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 rounded uppercase font-black">Disarankan</span></p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">Kirim kode lewat WhatsApp ke nomor terdaftar.</p>
                                                        </div>
                                                    </div>
                                                    <input type="radio" name="2fa" className="w-4 h-4 accent-emerald-500" defaultChecked />
                                                </label>
                                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-slate-400 text-2xl">phonelink_lock</span>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">Google Authenticator</p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">Gunakan aplikasi Autentikator di smartphone Anda.</p>
                                                        </div>
                                                    </div>
                                                    <input type="radio" name="2fa" className="w-4 h-4 accent-primary" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Perangkat Login */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4">Sesi Perangkat Login</h4>
                                            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                                                <div className="flex items-center justify-between p-4 bg-white">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-slate-400 text-2xl">laptop_mac</span>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">Chrome / Windows 11</p>
                                                            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Sedang Aktif (Sesi Ini)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-slate-50">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-slate-400 text-2xl">phone_iphone</span>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">Keranjangin App / iOS 17</p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">Aktif 2 jam yang lalu di Jakarta, ID</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-xs font-bold text-red-500 hover:underline">Log Out</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* TAB 5: NOTIFIKASI */}
                            {activeTab === "notifikasi" && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="mb-8 border-b border-slate-100 pb-6">
                                        <h3 className="font-bold text-2xl text-slate-800">Pengaturan Notifikasi</h3>
                                        <p className="text-sm text-slate-500 mt-1">Atur informasi apa saja yang ingin Anda terima agar tidak melewatkan hal penting.</p>
                                    </div>

                                    <div className="space-y-8 max-w-3xl">
                                        {/* Transaksi Matrix */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4">Transaksi & Pesanan</h4>
                                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead className="bg-slate-50 border-b border-slate-200">
                                                        <tr>
                                                            <th className="px-4 py-3 text-xs font-bold text-slate-500">Aktivitas</th>
                                                            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">Aplikasi (Push)</th>
                                                            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">Email</th>
                                                            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">WhatsApp</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        <tr>
                                                            <td className="px-4 py-3 text-sm font-semibold text-slate-700">Pesanan Baru Masuk</td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked /></td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" /></td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-3 text-sm font-semibold text-slate-700">Pembayaran Dikonfirmasi</td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked /></td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" /></td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-3 text-sm font-semibold text-slate-700">Permintaan Retur/Komplain</td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked /></td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked /></td>
                                                            <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked /></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Chat & Interaksi */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4">Chat Pelanggan</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">Pengingat Chat Terabaikan</p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">Dapat notifikasi jika chat pembeli belum dibalas lebih dari 10 menit.</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">Suara Notifikasi Khusus Chat</p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">Bedakan bunyi pesanan masuk dengan bunyi chat baru.</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Laporan Bisnis */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4">Laporan & Info Bisnis</h4>
                                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Rekap Penjualan Mingguan</p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">Kirimkan ringkasan analitik dan omset ke email saya setiap hari Senin.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                </label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}