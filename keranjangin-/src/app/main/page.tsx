"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MainPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/");
      else setUser(user);
    };
    checkUser();
  }, [router]);

  if (!user) return <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center text-white italic">Memuat Keranjangin...</div>;

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white font-sans overflow-x-hidden">
      
      {/* NAVBAR RESPONSIVE */}
      <nav className="sticky top-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
          
          <div className="bg-white p-1.5 rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <Image src="/LOGO.jpeg" alt="Logo" width={24} height={24} className="rounded-sm" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative group">
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
              <span className="hidden sm:inline-block border-r border-gray-600 pr-2 text-[10px] font-bold uppercase">Categories</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search With CTRL + K" 
              className="w-full bg-[#252545] border border-white/5 rounded-full py-2 pl-10 sm:pl-32 pr-4 text-xs md:text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[9px] text-gray-500 uppercase leading-none mb-1">Saldo Anda</span>
                <span className="text-xs font-bold text-white tracking-tight">RP 2.000.000</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-gray-300">
              
              {/* ANIMASI KERANJANG HOVER */}
              <Link href="/cart">
                <motion.button 
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 hover:text-purple-400 transition-colors cursor-pointer group"
                >
                  <span className="text-xl md:text-2xl block">🛒</span>
                  {/* Efek Glow */}
                  <span className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {/* Badge */}
                  <span className="absolute top-1 right-1 bg-red-500 text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#1a1a2e]">
                    3
                  </span>
                </motion.button>
              </Link>

              <button className="hover:text-purple-400 transition-colors p-2 text-xl">🔔</button>
              
              {/* PROFILE CIRCLE */}
              <Link href="/profile">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-purple-500/50 overflow-hidden bg-gray-700 cursor-pointer shadow-lg shadow-purple-500/10"
                >
                  <Image src="/LOGO.jpeg" alt="User" width={36} height={36} />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-8 md:space-y-12">
        
        {/* BANNER / COUPON */}
        <section className="w-full aspect-[21/9] md:aspect-auto md:h-64 bg-[#d1d5db] rounded-2xl flex items-center justify-center text-gray-400 text-xl md:text-3xl font-black uppercase tracking-[0.2em] relative overflow-hidden shadow-xl">
           <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-blue-600/10"></div>
           <span className="relative z-10 drop-shadow-md italic">coupon</span>
        </section>

        {/* KATEGORI - Swipeable on Mobile */}
        <section>
          <div className="flex justify-between items-end mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold italic tracking-tight border-l-4 border-purple-500 pl-3 uppercase">Kategori</h2>
            <button className="text-[10px] text-purple-400 font-bold uppercase tracking-widest hover:underline">See All</button>
          </div>
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="min-w-[140px] md:min-w-0 h-28 md:h-32 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center text-[10px] text-gray-500 font-black uppercase flex-shrink-0 cursor-pointer shadow-lg"
              >
                Category {i}
              </motion.div>
            ))}
          </div>
        </section>

        {/* BEST SELLER */}
        <section>
          <div className="flex justify-between items-end mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold italic tracking-tight border-l-4 border-purple-500 pl-3 uppercase">Best Seller</h2>
            <button className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">All Best Seller</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div whileHover={{ y: -8 }} key={i} className="group cursor-pointer">
                <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 group-hover:border-purple-500/50 transition-all overflow-hidden flex items-center justify-center text-gray-700 font-bold text-xs shadow-2xl relative">
                  Product {i}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="mt-3 px-1">
                   <h3 className="text-[10px] md:text-xs font-bold truncate uppercase tracking-tighter text-gray-200">Nama Produk Keren {i}</h3>
                   <p className="text-[#8b5cf6] text-[10px] md:text-xs font-black mt-1 uppercase italic">Rp 150.000</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FEATURED BRAND */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#252545] p-6 md:p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-bold tracking-tight italic uppercase">Featured Brand</h2>
              <button className="text-[10px] bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full uppercase font-bold border border-purple-500/50 hover:bg-purple-600 transition-colors">Explore</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 md:h-28 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase hover:text-white transition-all cursor-pointer hover:bg-white/10">Brand {i}</div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/10 blur-[80px] rounded-full"></div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="mt-24 bg-[#0a0a14] py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
               <Image src="/LOGO.jpeg" alt="Logo" width={40} height={40} className="rounded-xl shadow-lg" />
               <span className="font-black tracking-tighter text-2xl uppercase italic">KERANJANGIN</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[220px] uppercase font-bold tracking-widest opacity-60">
              Platform e-commerce masa depan yang menyediakan kebutuhan anda dengan mudah dan nyaman.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Payments</h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 opacity-30 grayscale">
               {[1,2,3,4].map(i => <div key={i} className="w-12 h-8 bg-white/20 rounded-lg"></div>)}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Help Center</h4>
            <ul className="text-[10px] text-gray-500 space-y-3 uppercase font-bold tracking-widest">
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Customer Service</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Bantuan 24 Jam</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Syarat & Ketentuan</li>
            </ul>
          </div>

          <div className="text-[10px] text-gray-500 flex flex-col items-center md:items-end justify-between font-bold uppercase tracking-[0.2em]">
             <div className="flex gap-6 mb-8 md:mb-0">
               <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
               <span className="hover:text-white cursor-pointer transition-colors">Contact Us</span>
             </div>
             <div className="text-right">
                <p className="opacity-40">© 2026 Keranjangin Platform</p>
                <p className="text-[8px] text-purple-500/50 mt-1">Version 2.0.4 - Stable</p>
             </div>
          </div>
        </div>
      </footer>
    </main>
  );
}