"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function TambahProduk() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [productCode, setProductCode] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single();
        if (data) setUserData(data);
      }
    };
    fetchUser();

    const saved = sessionStorage.getItem("newProductDraft");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name) setName(data.name);
      if (data.category) setCategory(data.category);
      if (data.product_code) setProductCode(data.product_code);
      if (data.img_path) setImgPath(data.img_path);
    }
  }, []);

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
             alert("Gagal mengupload gambar. Pastikan Anda telah membuat bucket storage bernama 'product_img' dan mengatur permission-nya menjadi public di dashboard Supabase Anda.");
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

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name.trim() || !productCode.trim()) {
      alert("Harap isi Nama Produk dan Product Code");
      return;
    }
    const saved = JSON.parse(sessionStorage.getItem("newProductDraft") || "{}");
    const updated = { ...saved, name, category, product_code: productCode, img_path: imgPath };
    sessionStorage.setItem("newProductDraft", JSON.stringify(updated));
    router.push("/seller_main/produk/tambah/detail");
  };

  return (
    <div className="flex h-screen w-full bg-[#1e1b4b] font-display text-slate-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 flex flex-col z-50 border-r border-slate-200" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
            <img src="/image/logo.png" alt="Keranjangin Logo" className="w-full h-full object-contain" />
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
                  style={{ backgroundImage: `url('${userData?.avatarUrl || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Layout Wrapper Konten Bawah */}
        <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pt-8 px-8">

          {/* 1. Kolom Kiri - Diubah menjadi Flex Container agar bisa membagi area atas & bawah */}
          <div className="flex-1 flex flex-col h-full min-h-0">

            {/* Bagian Atas Kolom Kiri (Progress Stepper) - Dibuat SHRINK-0 agar tetap diam */}
            <div className="shrink-0 mb-6 pr-2 lg:pr-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Step 1: Informasi Dasar</h2>
                  <p className="text-indigo-200/70">Lengkapi detail informasi produk Anda</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">33% Complete</span>
                </div>
              </div>
              <div className="relative w-full bg-white/10 h-3 rounded-full overflow-hidden shadow-inner">
                <div className="bg-indigo-600 h-full w-1/3 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
              </div>
            </div>

            {/* Bagian Bawah Kolom Kiri (Form) - Perintah overflow-y-auto dipindah ke sini */}
            <div className="flex-1 overflow-y-auto pr-2 pb-12 lg:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

              {/* Sections Container */}
              <div className="space-y-6">
                {/* Section 1: Photos */}
                <section className="p-8 rounded-xl border border-slate-200 shadow-sm bg-white">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-primary">image</span>
                    <h3 className="text-lg font-bold text-slate-900">Product Photos</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">Square Format (1:1 Ratio)</p>
                      <div className="flex gap-4">
                        <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden">
                          {isUploading ? (
                              <span className="text-[10px] font-bold text-primary animate-pulse">Uploading...</span>
                          ) : imgPath ? (
                              <img src={imgPath} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                              <>
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">add_a_photo</span>
                                <span className="text-[10px] text-slate-400 mt-1 font-medium">Upload</span>
                              </>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                        <div className="w-24 h-24 border border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center cursor-not-allowed hidden md:flex">
                          <span className="material-symbols-outlined text-slate-300">image</span>
                        </div>
                        <div className="w-24 h-24 border border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center cursor-not-allowed hidden lg:flex">
                          <span className="material-symbols-outlined text-slate-300">image</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-3">Min 800x800px. Recommended for search result display.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">Portrait Format (3:4 Ratio)</p>
                      <div className="flex gap-4">
                        <div className="w-24 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">add_a_photo</span>
                        </div>
                        <div className="w-24 h-32 border border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center cursor-not-allowed">
                          <span className="material-symbols-outlined text-slate-300">image</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-3">Min 900x1200px. Best for fashion or lifestyle listings.</p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Product Name */}
                <section className="p-8 rounded-xl border border-slate-200 shadow-sm bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-slate-900" htmlFor="product_name">Product Name</label>
                    <span className="text-xs text-slate-400">{name.length}/255</span>
                  </div>
                  <input 
                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-slate-400" 
                    id="product_name" 
                    placeholder="Enter product name (e.g. Wireless Noise Canceling Headphones)" 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={255}
                  />
                </section>

                {/* Section 3: Category */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      <span className="text-primary mr-1 text-base">*</span>Category Produk
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800 appearance-none cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">expand_more</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">
                      Pilih kategori yang paling sesuai agar mempermudah pencarian.
                    </p>
                  </div>
                </div>

                {/* Section 4: Product Code */}
                <section className="p-8 rounded-xl border border-slate-200 shadow-sm bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <label className="block text-sm font-bold text-slate-900" htmlFor="gtin">Product Code (GTIN / SKU)</label>
                    <span className="material-symbols-outlined text-slate-400 text-base cursor-help" title="Global Trade Item Number">info</span>
                  </div>
                  <div className="max-w-md">
                    <input 
                      className="w-full border border-slate-200 rounded-lg py-3 px-4 text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-slate-400" 
                      id="gtin" 
                      placeholder="EAN / UPC / ISBN / SKU" 
                      type="text" 
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                    />
                  </div>
                </section>
              </div>

              {/* Footer Buttons */}
              <div className="mt-10 flex items-center justify-between pb-8">
                <Link href="/seller_main/produk" className="px-8 py-2.5 rounded-lg border border-slate-400/50 text-slate-200 font-bold hover:bg-white/10 transition-colors cursor-pointer">
                  Kembali
                </Link>
                <button onClick={handleNext} className="px-10 py-2.5 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center border-none">
                  Selanjutnya
                </button>
              </div>

            </div>
          </div>

          {/* 2. Kolom Kanan (Preview) - Tetap diam di tempat */}
          <aside className="w-full lg:w-[350px] xl:w-[380px] shrink-0 pb-8">
            <div className="bg-[#b3b0ec]/90 rounded-2xl p-6 shadow-xl border border-white/20 h-fit">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Preview</h2>
              <p className="text-xs text-slate-700/70 mb-6">Rincian Produk</p>

              {/* Image Box Placeholder */}
              <div className="bg-[#9c97eb] rounded-xl border-2 border-dashed border-[#7e78d9] aspect-square flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                {imgPath ? (
                     <img src={imgPath} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                     <span className="material-symbols-outlined text-6xl text-white/50">add_photo_alternate</span>
                )}
              </div>

              {/* Product Info */}
              <p className="text-sm font-bold text-slate-900 mb-2 px-1 line-clamp-2">{name || "Nama Produk"}</p>

              {/* User / Store Info Box */}
              <div className="bg-[#c2c0f0] rounded-lg p-2.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full bg-slate-300 bg-cover bg-center border border-white/50"
                    style={{ backgroundImage: `url('${userData?.avatarUrl || "https://ui-avatars.com/api/?background=random&name=" + (userData?.shopName || "Toko")}')` }}
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