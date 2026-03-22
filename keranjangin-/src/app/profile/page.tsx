"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // Sesuaikan jika folder lib sejajar gunakan "./lib/supabase"
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Logic Proteksi & Ambil Data User
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/"); // Belum login? Tendang ke halaman login
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const quickButtons = ["Voucher Belanja", "Voucher Ongkir", "Bonus", "Cek Limit"];
  
  const transactionStatus = [
    { icon: "💵", label: "Bayar" },
    { icon: "📦", label: "Diproses" },
    { icon: "🚚", label: "Dikirim" },
    { icon: "✅", label: "Diterima" },
    { icon: "⭐", label: "Ulasan" },
  ];

  // Loading Screen biar estetik
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white font-sans pb-10">
      
      {/* HEADER SECTION */}
      <div className="bg-[#121225] p-10 md:p-16 border-b border-white/5 relative">
        {/* BACK BUTTON */}
        <Link 
          href="/main" 
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest z-20"
        >
          ⬅️ BERANDA
        </Link>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 mt-6 md:mt-0">
          {/* Avatar User */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-500/30 overflow-hidden shadow-2xl bg-gray-800 flex-shrink-0">
            <Image src="/LOGO.jpeg" alt="Profile" width={128} height={128} className="object-cover" />
          </div>
          
          <div className="text-center md:text-left">
            {/* AMBIL NAMA DARI SUPABASE */}
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
              {user?.user_metadata?.full_name || "USERNAME"} 
              <span className="text-gray-600 text-xl cursor-pointer hover:text-white transition-colors">✏️</span>
            </h1>
            <p className="text-gray-500 text-[10px] md:text-xs mt-1 font-bold tracking-[0.2em] uppercase opacity-60">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-10 -mt-10 relative z-10">
        
        {/* CARD VOUCHER & SALDO */}
        <section className="bg-gradient-to-br from-[#3b3b6d] to-[#1a1a2e] p-6 md:p-12 rounded-[40px] shadow-2xl border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Saldo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[20px] p-6 flex justify-between items-center text-gray-800 shadow-xl cursor-pointer"
            >
                <p className="font-bold text-sm tracking-tight uppercase">SALDO ANDA</p>
                <div className="flex items-center gap-4">
                    <span className="text-xl md:text-2xl font-black italic">RP. 0,00</span>
                    <span className="text-2xl text-purple-600 font-bold">➡️</span>
                </div>
            </motion.div>

            {/* Card Voucher */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[20px] p-6 flex justify-between items-center text-gray-800 shadow-xl cursor-pointer"
            >
                <p className="font-bold text-sm tracking-tight uppercase">Klaim Voucher Anda</p>
                <span className="text-2xl text-purple-600 font-bold">➡️</span>
            </motion.div>
          </div>

          {/* Quick Buttons List */}
          <div className="flex flex-wrap gap-2 mt-10 justify-center">
            {quickButtons.map((btn, i) => (
              <button 
                key={i} 
                className="bg-white text-gray-800 text-[9px] md:text-[11px] font-black px-6 py-3 rounded-full uppercase shadow-md hover:bg-gray-100 active:scale-95 transition-all border-b-4 border-gray-200"
              >
                {btn}
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white text-[9px] md:text-[11px] font-black px-6 py-3 rounded-full uppercase shadow-md hover:bg-red-700 active:scale-95 transition-all border-b-4 border-red-800"
            >
              LOGOUT
            </button>
          </div>
        </section>

        {/* CARD TRANSAKSI */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1b] p-8 md:p-12 rounded-[40px] shadow-2xl border border-white/5">
          <h2 className="text-2xl font-black italic mb-10 tracking-tighter border-l-4 border-purple-500 pl-4 uppercase">TRANSAKSI</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {transactionStatus.map((status, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className={`p-6 rounded-[30px] border flex flex-col items-center gap-4 transition-all ${
                  i === 2 
                  ? 'bg-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/10' 
                  : 'bg-white/5 border-white/5'
                }`}
              >
                <span className="text-4xl md:text-5xl">{status.icon}</span>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">{status.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-white/5 py-12 px-6 bg-[#0a0a14]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            <div className="flex items-center gap-4">
               <Image src="/LOGO.jpeg" alt="Logo" width={35} height={35} className="rounded-lg opacity-40 grayscale" />
               <div className="text-left">
                  <p className="text-gray-300">KERANJANGIN PLATFORM</p>
                  <p className="text-[8px] opacity-50 lowercase tracking-normal">e-commerce solution for everyone</p>
               </div>
            </div>
            
            <div className="flex gap-8">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Term & Condition</span>
            </div>
         </div>
      </footer>
    </main>
  );
}