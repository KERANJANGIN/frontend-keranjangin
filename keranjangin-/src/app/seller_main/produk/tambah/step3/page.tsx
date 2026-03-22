"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function TambahProdukPengiriman() {
    const [userData, setUserData] = useState<any>(null);
    const router = useRouter();

    const [weight, setWeight] = useState("");
    const [lebar, setLebar] = useState("");
    const [panjang, setPanjang] = useState("");
    const [tinggi, setTinggi] = useState("");
    const [productStatus, setProductStatus] = useState("live");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            console.log("Supabase Session:", session);
            if (sessionError) console.error("Session Error:", sessionError);

            if (session?.user) {
                const { data, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();
                
                console.log("Fetched User Data:", data);
                if (userError) console.error("User Fetch Error:", userError);
                
                if (data) setUserData(data);
            } else {
                console.log("No active session found.");
            }
        };
        fetchUser();

        const saved = sessionStorage.getItem("newProductDraft");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.weight !== undefined) setWeight(String(data.weight));
            if (data.product_status) setProductStatus(data.product_status);
            if (data.size) {
                setPanjang(data.size.panjang !== undefined ? String(data.size.panjang) : "");
                setLebar(data.size.lebar !== undefined ? String(data.size.lebar) : "");
                setTinggi(data.size.tinggi !== undefined ? String(data.size.tinggi) : "");
            }
        }
    }, []);

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (weight === "") {
            alert("Harap isi Berat Produk!");
            return;
        }

        if (!userData?.id) {
            alert("Sesi pengguna tidak ditemukan atau data belum dimuat. Silakan muat ulang halaman atau login kembali.");
            return;
        }

        setIsSubmitting(true);
        const saved = JSON.parse(sessionStorage.getItem("newProductDraft") || "{}");
        const payload = {
            name: saved.name || "Unnamed Product",
            description: saved.description || "",
            price: saved.price || 0,
            stock: saved.stock || 0,
            seller: userData.id,
            category: saved.category || "Home & Living",
            img_path: saved.img_path || ("https://ui-avatars.com/api/?background=random&name=" + encodeURIComponent(saved.name || "Product")),
            product_code: saved.product_code || "SKU-000",
            min_quantity: saved.min_quantity || 1,
            weight: Number(weight),
            size: {
                panjang: Number(panjang) || 0,
                lebar: Number(lebar) || 0,
                tinggi: Number(tinggi) || 0
            },
            product_status: productStatus
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                sessionStorage.removeItem("newProductDraft");
                alert("Produk berhasil ditambahkan!");
                router.push("/seller_main/produk");
            } else {
                const err = await res.json();
                alert("Gagal menyimpan produk: " + (err.error || "Unknown Error"));
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#1e1b4b] font-display text-slate-100 overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 fixed inset-y-0 left-0 flex flex-col z-50 border-r border-slate-200" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                        <img src="/LOGO.jpeg" alt="Keranjangin Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">Seller Center</h1>
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
            <main className="flex-1 ml-64 flex flex-col h-screen">

                {/* Header */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-[#9288f8] shadow-md z-40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm font-bold text-white tracking-wide">
                            <Link className="hover:underline" href="/seller_main/produk">My Products</Link>
                            <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
                            <span>Add New Product</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative w-64 hidden md:block">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input className="pl-12 pr-4 py-2 border-none rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none w-full text-slate-800" placeholder="Search..." type="text" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative text-white cursor-pointer">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-3 bg-red-500 border-2 border-[#9288f8] rounded-full text-[9px] flex items-center justify-center font-bold text-white">25</span>
                            </button>
                            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer">
                                <span className="material-symbols-outlined">mail</span>
                            </button>
                            <div className="h-8 w-px bg-white/20 mx-2"></div>
                            <div className="flex items-center gap-3">
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
                    </div>
                </header>

                {/* Layout Wrapper Konten Bawah */}
                <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pt-8 px-8">

                    {/* Kolom Kiri */}
                    <div className="flex-1 flex flex-col h-full min-h-0">

                        {/* Bagian Atas Kolom Kiri (Progress Stepper) - Diam */}
                        <div className="shrink-0 mb-6 pr-2 lg:pr-4">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Step 3: Pengiriman</h2>
                                    <p className="text-indigo-200/70">Atur rincian berat, ukuran, dan opsi pengiriman produk Anda</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">100% Complete</span>
                                </div>
                            </div>
                            <div className="relative w-full bg-white/10 h-3 rounded-full overflow-hidden shadow-inner">
                                {/* Progress bar diset menjadi w-3/4 (75%) */}
                                <div className="bg-indigo-600 h-full w-3/3 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            </div>
                        </div>

                        {/* Bagian Bawah Kolom Kiri (Form) - Scrollable */}
                        <div className="flex-1 overflow-y-auto pr-2 pb-12 lg:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                            {/* Sections Container */}
                            <div className="space-y-6">

                                {/* Bagian 1: Berat & Dimensi Paket */}
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-8">

                                    {/* Berat */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            <span className="text-primary mr-1 text-base">*</span>Berat
                                        </label>
                                        <div className="relative">
                                            <input 
                                                className="w-full pl-4 pr-16 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800" 
                                                placeholder="Mohon masukkan berat produk setelah dikemas" 
                                                type="number"
                                                min="0"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                {/* Garis pemisah vertical kecil sebelum tulisan 'gr' */}
                                                <div className="h-6 w-px bg-slate-300 mr-3"></div>
                                                <span className="text-slate-500 font-medium text-sm">gr</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ukuran Paket */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">Ukuran Paket</label>
                                        <div className="flex items-center gap-4">
                                            {/* Input L */}
                                            <div className="relative flex-1">
                                                <input 
                                                    className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800" 
                                                    placeholder="L" 
                                                    type="number" 
                                                    min="0"
                                                    value={lebar}
                                                    onChange={(e) => setLebar(e.target.value)}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <div className="h-5 w-px bg-slate-300 mr-2"></div>
                                                    <span className="text-slate-500 font-medium text-xs">cm</span>
                                                </div>
                                            </div>
                                            <span className="text-slate-400 font-bold text-sm">X</span>

                                            {/* Input P */}
                                            <div className="relative flex-1">
                                                <input 
                                                    className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800" 
                                                    placeholder="P" 
                                                    type="number" 
                                                    min="0"
                                                    value={panjang}
                                                    onChange={(e) => setPanjang(e.target.value)}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <div className="h-5 w-px bg-slate-300 mr-2"></div>
                                                    <span className="text-slate-500 font-medium text-xs">cm</span>
                                                </div>
                                            </div>
                                            <span className="text-slate-400 font-bold text-sm">X</span>

                                            {/* Input T */}
                                            <div className="relative flex-1">
                                                <input 
                                                    className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800" 
                                                    placeholder="T" 
                                                    type="number" 
                                                    min="0"
                                                    value={tinggi}
                                                    onChange={(e) => setTinggi(e.target.value)}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <div className="h-5 w-px bg-slate-300 mr-2"></div>
                                                    <span className="text-slate-500 font-medium text-xs">cm</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian 2: Default status product */}
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-8">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            <span className="text-primary mr-1 text-base">*</span>Status Produk
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="product_status"
                                                className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800 appearance-none cursor-pointer"
                                                value={productStatus}
                                                onChange={(e) => setProductStatus(e.target.value)}
                                            >
                                                <option value="live" className="font-medium">Live (Langsung Tampil)</option>
                                                <option value="not_shown" className="font-medium">Not Shown (Disembunyikan)</option>
                                                <option value="action_needed" className="font-medium">Action Needed (Perlu Review)</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400">expand_more</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-2">
                                            Pilih <span className="font-bold">Live</span> agar produk langsung bisa dibeli oleh pelanggan.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-8">

                                    {/* Bagian 3: Produk Berbahaya, Asuransi, Pre-order */}
                                    {/* Produk Berbahaya */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            <span className="text-primary mr-1 text-base">*</span>Produk Berbahaya
                                        </label>
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                {/* accent-primary digunakan agar radio button ikut warna ungu */}
                                                <input type="radio" name="berbahaya" className="w-4 h-4 accent-primary cursor-pointer" defaultChecked />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Tidak</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="radio" name="berbahaya" className="w-4 h-4 accent-primary cursor-pointer" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Mengandung baterai/magnet/cairan/bahan mudah terbakar</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Pre-Order */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">Pre-Order</label>
                                        <div className="flex items-center gap-6 mb-2">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="radio" name="preorder" className="w-4 h-4 accent-primary cursor-pointer" defaultChecked />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Tidak</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="radio" name="preorder" className="w-4 h-4 accent-primary cursor-pointer" />
                                                <span className="text-sm text-slate-700 font-medium group-hover:text-primary transition-colors">Ya</span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-2">
                                            Kirimkan produk sesuai batas pengemasan (tidak termasuk akhir pekan, libur nasional, dan non-operasional jasa kirim)
                                        </p>
                                    </div>

                                    {/* Asuransi Pengiriman */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">Asuransi Pengiriman</label>
                                        <div className="border border-slate-200 rounded-lg p-5 flex items-center justify-between bg-slate-50 mb-3">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">Enroll Insurance</h4>
                                                <p className="text-xs text-slate-500 mt-1.5">100% penggantian untuk barang hilang/rusak saat proses pengiriman</p>
                                            </div>

                                            {/* Toggle Switch buatan Tailwind */}
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                            </label>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            Dengan mendaftar, Penjual setuju untuk membayar premi sebesar 0.5% untuk pesanan yang diasuransikan
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="mt-10 flex items-center justify-between pb-8">
                                <Link href="/seller_main/produk/tambah/detail" className="px-8 py-2.5 rounded-lg border border-slate-400/50 text-slate-200 font-bold hover:bg-white/10 transition-colors cursor-pointer">
                                    Kembali
                                </Link>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting}
                                    className={`px-10 py-2.5 rounded-lg text-white font-bold shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center border-none ${isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary shadow-primary/20 hover:bg-primary/90'}`}
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Selesai'}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Kolom Kanan (Preview) - Diam */}
                    <aside className="w-full lg:w-[350px] xl:w-[380px] shrink-0 pb-8">
                        <div className="bg-[#b3b0ec]/90 rounded-2xl p-6 shadow-xl border border-white/20 h-fit">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Preview</h2>
                            <p className="text-xs text-slate-700/70 mb-6">Rincian Produk</p>

                            {/* Image Box Placeholder */}
                            <div className="bg-[#9c97eb] rounded-xl border-2 border-dashed border-[#7e78d9] aspect-square flex items-center justify-center mb-6 shadow-inner">
                                <span className="material-symbols-outlined text-6xl text-white/50">add_photo_alternate</span>
                            </div>

                            {/* Product Info */}
                            <p className="text-sm font-bold text-slate-900 mb-2 px-1">Nama Produk</p>

                            {/* User / Store Info Box */}
                            <div className="bg-[#c2c0f0] rounded-lg p-2.5 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full bg-slate-300 bg-cover bg-center border border-white/50"
                                        style={{ backgroundImage: `url('${userData?.avatar_url || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}
                                    ></div>
                                    <span className="text-sm font-bold text-slate-800">{userData?.shopName || "Toko"}</span>
                                </div>
                                <button className="text-[11px] bg-white/90 text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 font-bold shadow-sm hover:bg-white transition-colors cursor-pointer border border-slate-200/50">
                                    Kunjungi
                                </button>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}