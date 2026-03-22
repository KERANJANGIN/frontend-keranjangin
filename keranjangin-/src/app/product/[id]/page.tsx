"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // Sesuaikan path alias kamu
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";


export default function ProductDetail() {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("Standard");
  const variants = ["Standard", "Premium", "Bundle Pack"]; // Contoh varian
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      // 1. Cek Session User
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      setUser(session.user);

      // 2. Simulasi Ambil Data Produk (Nanti ganti ke fetch Supabase)
      // Misal: const { data } = await supabase.from('products').select('*').eq('id', id).single();
      setProduct({
        id: id,
        name: `Item Mahasiswa ${id}`,
        price: "125.000",
        description: "Produk eksklusif hasil karya mahasiswa. Kualitas terjamin dan harga sangat bersahabat untuk kantong anak kos. Grab it fast!",
        category: "Electronics",
        tag: "Student Made, Limited"
      });
      setLoading(false);
    };
    initPage();
  }, [id, router]);

  const handleLogout = async () => {
    if (!confirm("Keluar dari ekosistem Keranjangin?")) return;
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/";
  };

  const handleAddToCart = async () => {
  if (!user) return alert("Waduh, login dulu ya!");

  try {
    // 1. Kirim data ke tabel 'cart' di Supabase
    const { error } = await supabase
      .from('cart')
      .insert([
        {
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          price: 125000, // Kamu bisa ganti jadi parseInt(product.price.replace('.', '')) jika dinamis
          quantity: quantity,
          variant: selectedVariant,
        },
      ]);

    if (error) throw error;

    // 2. Notifikasi sukses
    alert(`✅ ${quantity}x ${product.name} (${selectedVariant}) masuk keranjang!`);
    
    // 3. Tutup Modal
    setIsPurchaseModalOpen(false);
    
    // 4. Reset quantity balik ke 1 buat pembelian berikutnya
    setQuantity(1);

  } catch (error: any) {
    alert("Gagal masuk keranjang: " + error.message);
  }
};

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center text-white italic animate-pulse">
      LOADING PRODUCT...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white font-sans overflow-x-hidden">
      
      {/* NAVBAR (SAMA DENGAN MAIN PAGE) */}
      <nav className="sticky top-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <Link href="/main">
            <Image src="/LOGO.jpeg" alt="Logo" width={35} height={35} className="rounded-xl shadow-lg shadow-purple-500/20" />
          </Link>
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/main" className="hover:text-white transition-colors">Shop</Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">Hot</Link>
          </div>
        </div>

        {/* SEARCH BAR ACCESSIBLE */}
        <div className="hidden md:flex flex-1 max-w-lg mx-10">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Cari produk lain..." 
              className="w-full bg-[#0f0f1b] border border-white/5 rounded-full py-2.5 px-6 text-xs focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white"
            />
            <span className="absolute right-4 top-2.5 opacity-40">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/cart" className="text-xl hover:scale-110 transition-transform relative px-2">
            🛒
          </Link>

          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 overflow-hidden group-hover:scale-105 transition-all shadow-lg shadow-purple-500/30">
                  <Image src="/LOGO.jpeg" alt="User" width={32} height={32} />
              </div>
            </Link>

            <button 
              onClick={handleLogout}
              className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all duration-300 active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px] block font-bold text-sm">logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* PRODUCT CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/main" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-purple-400 transition-colors mb-10 block">
          ← Kembali ke Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-6">
          
          {/* LEFT: IMAGE PREVIEW */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="aspect-square bg-[#1a1a2e] border border-white/5 rounded-[40px] flex items-center justify-center relative overflow-hidden group shadow-2xl"
            >
               <div className="text-gray-700 font-black italic uppercase text-3xl opacity-20 group-hover:opacity-40 transition-opacity">
                 {product.name}
               </div>
               <div className="absolute top-6 left-6 bg-purple-600 text-[9px] font-black px-4 py-2 rounded-full uppercase italic shadow-lg">Featured Item</div>
            </motion.div>
            
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-24 h-24 bg-[#1a1a2e] border border-white/5 rounded-2xl hover:border-purple-500 transition-all cursor-pointer opacity-40 hover:opacity-100" />
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <span className="text-purple-500 font-black uppercase tracking-[0.4em] text-[10px]">{product.category}</span>
                <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mt-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-black text-white mt-4 italic">Rp {product.price}</p>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-medium max-w-md italic">
                "{product.description}"
              </p>

              <div className="pt-6 flex gap-4">
                <button onClick={() => setIsPurchaseModalOpen(true)}className="flex-1 bg-white text-black py-5 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-purple-600 hover:text-white transition-all active:scale-95">
                    Beli Sekarang
                </button>
                <button onClick={() => setIsPurchaseModalOpen(true)}className="w-20 bg-[#1a1a2e] border border-white/5 rounded-[24px] flex items-center justify-center hover:bg-white/5 transition-all active:scale-95">
                    🛒
                </button>
            </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    🏪
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Penjual: Mahasiswa Aktif</p>
                    <Link href="#" className="text-[9px] font-bold text-purple-400 uppercase hover:underline">Lihat Toko →</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* MODAL PURCHASE & VARIANT */}
<AnimatePresence>
  {isPurchaseModalOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop Gelap */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setIsPurchaseModalOpen(false)}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      
      {/* Card Pop-up */}
      <motion.div 
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        className="bg-[#1a1a2e] w-full max-w-md rounded-[40px] border border-white/10 p-8 relative z-10 shadow-2xl overflow-hidden"
      >
        {/* Dekorasi Cahaya di Belakang */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-[80px] rounded-full" />

        <h2 className="text-xl font-black italic uppercase mb-6 tracking-tighter border-l-4 border-purple-500 pl-4">Konfirmasi Pesanan</h2>

        <div className="space-y-8">
          {/* PILIH VARIAN */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pilih Varian Produk</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    selectedVariant === v 
                    ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* PILIH KUANTITAS */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Jumlah Barang</p>
            <div className="flex items-center gap-6 bg-[#0f0f1b] w-fit px-6 py-3 rounded-2xl border border-white/5">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-xl font-bold hover:text-purple-500 transition-colors"
              >-</button>
              <span className="text-sm font-black w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-xl font-bold hover:text-purple-500 transition-colors"
              >+</button>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* RINGKASAN HARGA */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Estimasi</p>
              <p className="text-xl font-black italic text-white">Rp {(125000 * quantity).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest italic">{selectedVariant}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleAddToCart}
              className="bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-white/10 transition-all"
            >
              Simpan Keranjang
            </button>
            <button 
              className="bg-purple-600 text-white py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-lg shadow-purple-500/20 hover:bg-purple-500 transition-all"
            >
              Checkout Sekarang
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </main>
  );
}