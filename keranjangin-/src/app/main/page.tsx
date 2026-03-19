"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MainPage() {
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    npm: "", shopName: "", address: "", postalCode: "", bankName: "", accountNumber: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/");
      else setUser(user);
    };
    checkUser();
  }, [router]);

  const handleRegisterSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const npmPattern = /^(20|21|22|23|24|25|26)\d+$/;
    if (!npmPattern.test(formData.npm)) {
      alert("NPM tidak valid! Harus angkatan 20-26.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('users').update({
        isSeller: true,          
        npm: formData.npm,
        shopName: formData.shopName,        
        shopAddress: formData.address,      
        postalCode: formData.postalCode,    
        bankName: formData.bankName,        
        accountNumber: formData.accountNumber 
      }).eq('email', user.email);

    if (error) alert("Gagal: " + error.message);
    else {
      alert("Selamat! Kamu resmi jadi Seller 🏪");
      setIsModalOpen(false);
    }
    setLoading(false);
  };

  if (!user) return <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center text-white italic">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/LOGO.jpeg" alt="Logo" width={35} height={35} className="rounded-full shadow-lg" />
          <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
            🚀 Jadi Seller
          </button>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/cart" className="text-xl">🛒</Link>
          <Link href="/profile" className="w-8 h-8 rounded-full border-2 border-purple-500 overflow-hidden">
             <Image src="/LOGO.jpeg" alt="User" width={32} height={32} />
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-16">
        
        {/* HERO BANNER */}
        <section className="w-full h-44 md:h-72 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-[40px] flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/10">
           <div className="text-center z-10 px-6">
              <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">Flash Sale 50%</h2>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mt-3 text-purple-300">Marketplace Mahasiswa Terbesar</p>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-10 text-[150px] font-black italic uppercase select-none">SALE</div>
        </section>

        {/* CATEGORIES */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Top Categories</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {['Electronics', 'Fashion', 'Books', 'Food', 'Stationery', 'Services'].map((cat) => (
              <div key={cat} className="flex-shrink-0 bg-[#1a1a2e] border border-white/5 px-8 py-4 rounded-2xl hover:border-purple-500 transition-colors cursor-pointer">
                <span className="text-[10px] font-black uppercase italic tracking-widest">{cat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED BRANDS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1,2,3,4].map((b) => (
             <div key={b} className="h-20 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
                <p className="text-[10px] font-black italic opacity-40 uppercase">Featured Brand</p>
             </div>
           ))}
        </section>

        {/* PRODUCT GRID */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-xl font-black italic border-l-4 border-purple-500 pl-4 uppercase tracking-tight">New Arrivals</h2>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">See All Items</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <motion.div key={item} whileHover={{ y: -5 }} className="bg-[#1a1a2e] rounded-[30px] border border-white/5 overflow-hidden group shadow-xl">
                <div className="aspect-square bg-[#0f0f1b] relative overflow-hidden">
                   <div className="absolute top-3 left-3 z-10 bg-red-600 text-[8px] font-black px-2 py-1 rounded-full uppercase italic">Hot</div>
                   <div className="w-full h-full flex items-center justify-center text-gray-800 font-black italic text-xs">NO IMAGE</div>
                </div>
                <div className="p-5">
                  <h3 className="text-[9px] font-bold uppercase text-purple-500 tracking-widest">Mahasiswa Pro</h3>
                  <p className="text-sm font-black italic uppercase mt-1 leading-tight">Product Name {item}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-white font-black text-xs">Rp 125.000</p>
                    <button className="bg-white text-black p-2 rounded-full text-xs hover:bg-purple-500 hover:text-white transition-colors">🛒</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20 pb-10 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            <div className="space-y-4">
              <Image src="/LOGO.jpeg" alt="Logo" width={40} height={40} className="rounded-full mx-auto md:mx-0 grayscale" />
              <p className="text-[10px] text-gray-500 uppercase leading-relaxed font-bold tracking-widest">Platform jual beli mahasiswa terbaik. Belanja aman, jualan nyaman.</p>
            </div>
            <div className="flex flex-col gap-2">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Navigation</h4>
               <Link href="#" className="text-[10px] text-gray-500 hover:text-white uppercase font-bold">Home</Link>
               <Link href="#" className="text-[10px] text-gray-500 hover:text-white uppercase font-bold">Search</Link>
               <Link href="#" className="text-[10px] text-gray-500 hover:text-white uppercase font-bold">Categories</Link>
            </div>
            <div className="flex flex-col gap-2">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Help Center</h4>
               <Link href="#" className="text-[10px] text-gray-500 hover:text-white uppercase font-bold">Support</Link>
               <Link href="#" className="text-[10px] text-gray-500 hover:text-white uppercase font-bold">Terms</Link>
            </div>
          </div>
          <p className="mt-20 text-center text-[8px] font-black text-gray-600 uppercase tracking-[0.8em]">© 2026 Keranjangin Ecosystem - All Rights Reserved</p>
        </footer>
      </div>

      {/* MODAL SELLER */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1a1a2e] w-full max-w-lg rounded-[40px] border border-white/10 p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">Buka Toko</h2>
              <form onSubmit={handleRegisterSeller} className="space-y-4">
                <input required placeholder="NPM (Angkatan 20-26)" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-purple-500" onChange={(e) => setFormData({...formData, npm: e.target.value})} />
                <input required placeholder="Nama Toko" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-purple-500" onChange={(e) => setFormData({...formData, shopName: e.target.value})} />
                <textarea required placeholder="Alamat Toko" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-purple-500 h-20 resize-none" onChange={(e) => setFormData({...formData, address: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Kode Pos" className="bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-purple-500" onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
                  <input required placeholder="Nama Bank" className="bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-purple-500" onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                </div>
                <input required placeholder="Nomor Rekening" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-purple-500" onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
                <button disabled={loading} type="submit" className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-purple-500 transition-all">
                  {loading ? "Sinkronisasi..." : "Konfirmasi & Buka Toko"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}