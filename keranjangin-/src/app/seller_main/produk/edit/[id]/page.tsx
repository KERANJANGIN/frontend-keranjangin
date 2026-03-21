"use client";

import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProdukPage() {
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

    const params = useParams();
    const router = useRouter();
    const [produk, setProduk] = useState<any>(null);
    
    // Controlled Form Inputs
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Elektronik");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [productCode, setProductCode] = useState("");
    const [imgPath, setImgPath] = useState("");

    const [weight, setWeight] = useState<string | number>("");
    const [panjang, setPanjang] = useState<string | number>("");
    const [lebar, setLebar] = useState<string | number>("");
    const [tinggi, setTinggi] = useState<string | number>("");
    const [minQuantity, setMinQuantity] = useState(1);
    const [productStatus, setProductStatus] = useState("live");

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (params?.id) {
                try {
                    const res = await fetch('/api/products/' + params.id);
                    if (!res.ok) throw new Error("Produk tidak ditemukan");
                    const { product } = await res.json();
                    
                    setProduk(product);
                    setName(product.name || "");
                    setCategory(product.category || "Elektronik");
                    setDescription(product.description || "");
                    setPrice(product.price || 0);
                    setStock(product.stock || 0);
                    setProductCode(product.product_code || "");
                    setImgPath(product.img_path || "");
                    setWeight(product.weight || "");
                    if (product.size) {
                        setPanjang(product.size.panjang || "");
                        setLebar(product.size.lebar || "");
                        setTinggi(product.size.tinggi || "");
                    }
                    setMinQuantity(product.min_quantity || 1);
                    setProductStatus(product.product_status || "live");
                } catch (error) {
                    alert("Ups! Produk tidak ditemukan atau terjadi kesalahan.");
                    router.push("/seller_main/produk");
                }
            }
        };
        fetchProduct();
    }, [params, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file");
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${userData?.id || 'unknown'}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product_img')
                .upload(filePath, file);

            if (uploadError) {
                 console.error(uploadError);
                 alert("Gagal mengupload gambar. Pastikan bucket 'product_img' public ada di Supabase.");
                 setIsUploading(false);
                 return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product_img')
                .getPublicUrl(filePath);

            setImgPath(publicUrl);
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat upload gambar.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/products/' + params.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    category,
                    description,
                    price: Number(price),
                    stock: Number(stock),
                    img_path: imgPath,
                    weight: Number(weight) || 0,
                    size: {
                        panjang: Number(panjang) || 0,
                        lebar: Number(lebar) || 0,
                        tinggi: Number(tinggi) || 0
                    },
                    min_quantity: Number(minQuantity) || 1,
                    product_status: productStatus
                })
            });
            if (res.ok) {
                alert("Perubahan berhasil disimpan!");
                router.push("/seller_main/produk");
            } else {
                const err = await res.json();
                alert("Gagal menyimpan: " + (err.error || "Unknown Error"));
            }
        } catch (e) {
            console.error(e);
            alert("Terjadi kesalahan jaringan.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!produk) {
        return <div className="min-h-screen bg-[#1e1b4b] flex items-center justify-center text-white font-bold">Memuat Data...</div>;
    }

    return (
        <div className="flex h-screen w-full font-display text-slate-900 overflow-hidden bg-[#1e1b4b]">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                        <img src="/LOGO.jpeg" alt="Keranjangin Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-slate-900">Seller Center</h1>
                        <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Powered by Keranjangin</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main">
                        <span className="material-symbols-outlined">home</span>
                        <span>Home</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" href="/seller_main/pesanan">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span>Pesanan</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/seller_main/produk">
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
            <div className="flex-1 flex flex-col ml-64 min-w-0 gradient-bg h-screen" style={{ background: "linear-gradient(180deg, #9288f8 0%, #1a1a2e 400px, #15161d 100%)" }}>

                {/* Header */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 z-40 bg-transparent border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <Link href="/seller_main/produk" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </Link>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            Edit Produk <span className="text-white/60 text-base font-normal">(ID: {produk.id})</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-2.5 bg-white text-primary rounded-xl text-sm font-bold shadow-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-symbols-outlined text-lg">save</span> 
                            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </header>

                {/* Form Content (Scrollable) */}
                <main className="flex-1 overflow-y-auto p-8 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                    {/* Form Utama */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden group">
                        <h3 className="font-bold text-xl text-slate-800 mb-2 relative z-10">Informasi Dasar</h3>
                        <p className="text-sm text-slate-400 mb-8 relative z-10">Isi data produk Anda dengan lengkap. Pastikan Nama Produk dan SKU sudah sesuai.</p>

                        <div className="mb-8 relative z-10 flex gap-6 items-center">
                            <label className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden shrink-0">
                                {isUploading ? (
                                    <span className="text-xs font-bold text-primary animate-pulse">Uploading...</span>
                                ) : imgPath ? (
                                    <img src={imgPath} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mb-1">add_a_photo</span>
                                        <span className="text-[10px] text-slate-400 font-medium">Ubah Foto</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">Foto Utama Produk</h4>
                                <p className="text-xs text-slate-500 mb-3">Direkomendasikan rasio 1:1, minimal 800x800px. Maksimal 2MB.</p>
                                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors inline-block">
                                    {isUploading ? "Uploading..." : "Pilih Foto Baru"}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                            {/* Field Nama Produk */}
                            <div className="flex flex-col gap-2 group">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">Nama Produk <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>

                            {/* Field SKU */}
                            <div className="flex flex-col gap-2 group">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">SKU <span className="text-slate-400 font-normal text-xs ml-1">(Terkunci)</span></label>
                                <input
                                    type="text"
                                    value={productCode}
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm outline-none cursor-not-allowed"
                                    disabled
                                />
                            </div>

                            {/* Field Kategori */}
                            <div className="flex flex-col gap-2 md:col-span-2 group">
                                <label className="text-sm font-semibold text-slate-700">Kategori Produk <span className="text-red-500">*</span></label>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none appearance-none cursor-pointer transition-all"
                                >
                                    <option value="Fashion" className="font-medium">Fashion</option>
                                    <option value="Elektronik" className="font-medium">Elektronik</option>
                                    <option value="Home & Living" className="font-medium">Home & Living</option>
                                    <option value="Beauty & Personal Care" className="font-medium">Beauty & Personal Care</option>
                                    <option value="Baby & Kids" className="font-medium">Baby & Kids</option>
                                    <option value="Sports & Outdoor" className="font-medium">Sports & Outdoor</option>
                                    <option value="Automotive" className="font-medium">Automotive</option>
                                    <option value="Books & Stationery" className="font-medium">Books & Stationery</option>
                                    <option value="Hobbies & Entertainment" className="font-medium">Hobbies & Entertainment</option>
                                    <option value="Food & Beverages" className="font-medium">Food & Beverages</option>
                                </select>
                            </div>

                            {/* Field Deskripsi */}
                            <div className="flex flex-col gap-2 md:col-span-2 group">
                                <label className="text-sm font-semibold text-slate-700">Deskripsi Produk <span className="text-red-500">*</span></label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Bagian Harga & Stok */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
                        <div className="mb-8">
                            <h3 className="font-bold text-xl text-slate-800">Harga & Inventaris</h3>
                            <p className="text-sm text-slate-400 mt-1">Atur harga jual dan jumlah stok yang tersedia di gudang.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Harga Jual (Rp) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Jumlah Stok <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    className={`w-full px-4 py-3 bg-slate-50 border ${stock === 0 ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-primary/20'} rounded-lg text-slate-800 text-sm focus:border-primary focus:bg-white outline-none transition-all`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Bagian Pengiriman & Status */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
                        <div className="mb-8">
                            <h3 className="font-bold text-xl text-slate-800">Pengiriman & Lainnya</h3>
                            <p className="text-sm text-slate-400 mt-1">Atur berat barang, dimensi kiriman paket, serta ubah limit order dan status dari produk yang aktif.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Berat (Gram) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Dimensi (P x L x T cm)</label>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="P" value={panjang} onChange={(e) => setPanjang(e.target.value)} className="w-1/3 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-center transition-all" />
                                    <input type="number" placeholder="L" value={lebar} onChange={(e) => setLebar(e.target.value)} className="w-1/3 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-center transition-all" />
                                    <input type="number" placeholder="T" value={tinggi} onChange={(e) => setTinggi(e.target.value)} className="w-1/3 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-center transition-all" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Minimum Pembelian</label>
                                <input
                                    type="number"
                                    value={minQuantity}
                                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                                    min="1"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Status Visibilitas</label>
                                <select 
                                    value={productStatus} 
                                    onChange={(e) => setProductStatus(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none appearance-none cursor-pointer transition-all"
                                >
                                    <option value="live">Live (Ditampilkan Publik)</option>
                                    <option value="not_shown">Not Shown (Disembunyikan Publik)</option>
                                    <option value="action_needed" disabled>Perlu Tindakan (Sistem Restricted)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}