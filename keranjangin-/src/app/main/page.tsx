"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MainPage() {
  const [user, setUser] = useState<any>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Default TRUE biar sinkron cek session
  const [regLoading, setRegLoading] = useState(false); // Loading khusus register
  const router = useRouter();

  const [formData, setFormData] = useState({
    npm: "", shopName: "", address: "", postalCode: "", bankName: "", accountNumber: ""
  });

  // --- 1. LOGIKA CEK SESSION & STATUS SELLER ---
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace("/"); 
          return;
        }

        setUser(session.user);
        
        const { data: profile } = await supabase
          .from('users')
          .select('isSeller')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setIsSeller(profile.isSeller);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false); // MATIKAN LOADING APAPUN HASILNYA
      }
    };
    checkUser();
  }, [router]);

  // --- 2. LOGIKA LOGOUT ---
  const handleLogout = async () => {
    if (!confirm("Keluar dari ekosistem Keranjangin?")) return;
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/"; 
  };

  // --- 3. LOGIKA ADD TO CART ---
  const addToCart = async (product: any) => {
    if (!user) return alert("Silakan login terlebih dahulu");
    try {
      const { error } = await supabase
        .from('cart')
        .insert([{ 
            user_id: user.id, 
            product_id: product.id, 
            product_name: product.name, 
            price: product.price,
            quantity: 1 
        }]);
      if (error) throw error;
      alert(`🛒 ${product.name} berhasil ditambah ke keranjang!`);
    } catch (error: any) {
      alert("Gagal masuk keranjang: " + error.message);
    }
  };

  // --- 4. LOGIKA REGISTER SELLER ---
  const handleRegisterSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    const npmPattern = /^(20|21|22|23|24|25|26)\d+$/;
    if (!npmPattern.test(formData.npm)) {
      alert("NPM tidak valid! Harus angkatan 20-26.");
      setRegLoading(false);
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
      }).eq('id', user.id);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("Selamat! Kamu resmi jadi Seller 🏪");
      setIsSeller(true);
      setIsModalOpen(false);
    }
    setRegLoading(false);
  };

  // --- GUARD UNTUK LOADING STUCK ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex flex-col items-center justify-center text-white italic tracking-widest uppercase">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        SYNCHRONIZING ECOSYSTEM...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <Image src="/LOGO.jpeg" alt="Logo" width={35} height={35} className="rounded-xl shadow-lg shadow-purple-500/20" />
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/main" className="text-white">Shop</Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">Hot</Link>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg mx-10">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Cari produk mahasiswa..." 
              className="w-full bg-[#0f0f1b] border border-white/5 rounded-full py-2.5 px-6 text-xs focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white"
            />
            <span className="absolute right-4 top-2.5 opacity-40">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {isSeller ? (
            <Link 
              href="/seller_main" 
              className="hidden sm:block text-[9px] font-black uppercase tracking-[0.2em] bg-purple-600 text-white px-5 py-2.5 rounded-full hover:bg-purple-500 transition-all border border-purple-400/30 shadow-lg shadow-purple-500/20"
            >
              🏪 Seller Page
            </Link>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="hidden sm:block text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black px-5 py-2.5 rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95"
            >
              🚀 Jadi Seller
            </button>
          )}

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
              className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all duration-300 group active:scale-90"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px] block font-bold">logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10 space-y-16">
        
        {/* HERO BANNER */}
        <section className="w-full h-48 md:h-80 bg-gradient-to-br from-[#1a1a2e] via-[#424874] to-[#2D31FA] rounded-[40px] flex items-center px-12 md:px-24 relative overflow-hidden border border-white/5 shadow-2xl">
           <div className="z-10 space-y-4">
              <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                Flash <br/> Sale <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">50%</span>
              </h2>
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-purple-200 opacity-60">Exclusively for Students</p>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-5 text-[180px] font-black italic uppercase select-none">LIMIT</div>
        </section>

        {/* CATEGORIES */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 whitespace-nowrap">Explore Category</h2>
            <div className="h-[1px] w-full bg-white/5"></div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {['Electronics', 'Fashion', 'Books', 'Food', 'Stationery', 'Services'].map((cat) => (
              <div key={cat} className="flex-shrink-0 bg-[#1a1a2e] border border-white/5 px-8 py-5 rounded-[20px] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group text-center min-w-[140px]">
                <span className="text-[9px] font-black uppercase italic tracking-widest text-gray-400 group-hover:text-white">{cat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="pb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">New Arrivals</h2>
              <p className="text-[9px] font-bold text-purple-500 uppercase tracking-widest mt-1">Recently Uploaded by Sellers</p>
            </div>
            <button className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors">See All →</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Link href={`/product/${item}`} key={item}>
                <motion.div whileHover={{ y: -8 }} className="bg-[#1a1a2e] rounded-[35px] border border-white/5 overflow-hidden group shadow-2xl">
                  <div className="aspect-square bg-[#0f0f1b] relative overflow-hidden p-2">
                    <div className="w-full h-full rounded-[28px] bg-white/5 flex items-center justify-center text-[10px] font-black italic text-gray-700 uppercase">Product Image</div>
                    <div className="absolute top-4 left-4 bg-purple-600 text-[8px] font-black px-3 py-1.5 rounded-full uppercase italic shadow-lg">Featured</div>
                  </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black italic uppercase leading-tight group-hover:text-purple-400 transition-colors">Item Mahasiswa {item}</h3>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <p className="text-white font-black text-lg">Rp 125k</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      
                      addToCart({
                        id: item, 
                        name: `Item Mahasiswa ${item}`, 
                        price: 125000
                      });
                    }}
                      className="bg-white text-black w-10 h-10 rounded-2xl flex items-center justify-center text-sm hover:bg-purple-600 hover:text-white transition-all shadow-lg active:scale-90"
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20 pb-12 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <Image src="/LOGO.jpeg" alt="Logo" width={45} height={45} className="rounded-xl grayscale hover:grayscale-0 transition-all cursor-pointer shadow-lg" />
              <p className="text-[10px] text-gray-500 uppercase leading-relaxed font-bold tracking-[0.2em]">Platform ekosistem jual beli khusus mahasiswa. Dari mahasiswa, untuk mahasiswa.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Navigation</h4>
                  <ul className="text-[10px] text-gray-500 font-bold space-y-2 uppercase tracking-tighter">
                    <li><Link href="/main" className="hover:text-purple-400">Main</Link></li>
                    <li><Link href="#" className="hover:text-purple-400">Products</Link></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Support</h4>
                  <ul className="text-[10px] text-gray-500 font-bold space-y-2 uppercase tracking-tighter">
                    <li><Link href="#" className="hover:text-purple-400">Terms</Link></li>
                    <li><Link href="#" className="hover:text-purple-400">Help</Link></li>
                  </ul>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-end justify-center">
              <p className="text-[8px] font-black text-gray-700 uppercase tracking-[1em]">©2026 KERANJANGIN</p>
            </div>
          </div>
        </footer>
      </div>

      {/* MODAL SELLER */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1a1a2e] w-full max-w-lg rounded-[40px] border border-white/10 p-10 relative z-10 shadow-2xl">
              <h2 className="text-2xl font-black italic uppercase mb-8 tracking-tighter border-l-4 border-purple-500 pl-4">Buka Toko</h2>
              <form onSubmit={handleRegisterSeller} className="space-y-4">
                <input required placeholder="NPM Aktif (20-26)" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-purple-500 transition-all text-white" onChange={(e) => setFormData({...formData, npm: e.target.value})} />
                <input required placeholder="Nama Toko" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-purple-500 transition-all text-white" onChange={(e) => setFormData({...formData, shopName: e.target.value})} />
                <textarea required placeholder="Alamat Lengkap Toko" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none h-24 resize-none focus:border-purple-500 transition-all text-white" onChange={(e) => setFormData({...formData, address: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Kode Pos" className="bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none text-white" onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
                  <input required placeholder="Bank" className="bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none text-white" onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                </div>
                <input required placeholder="Nomor Rekening" className="w-full bg-[#0f0f1b] border border-white/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none text-white" onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
                <button disabled={regLoading} type="submit" className="w-full bg-purple-600 text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-purple-500 transition-all mt-4 active:scale-95 disabled:opacity-50">
                  {regLoading ? "Menyinkronkan..." : "Konfirmasi & Aktifkan Toko"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}