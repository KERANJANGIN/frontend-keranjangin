"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  // Data dummy untuk simulasi isi keranjang (Nanti bisa ditarik dari Database)
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: "Nama Produk Kece 1", 
      price: 150000, 
      qty: 1, 
      checked: true,
      image: "/LOGO.jpeg" // Sementara pakai logo dulu
    },
    { 
      id: 2, 
      name: "Nama Produk Kece 2", 
      price: 200000, 
      qty: 2, 
      checked: false,
      image: "/LOGO.jpeg"
    },
    { 
      id: 3, 
      name: "Produk Limited Edition", 
      price: 550000, 
      qty: 1, 
      checked: true,
      image: "/LOGO.jpeg"
    },
  ]);

  // Fungsi tambah/kurang jumlah barang
  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  // Fungsi toggle checkbox per item
  const toggleCheck = (id: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Fungsi Select All
  const toggleSelectAll = (isChecked: boolean) => {
    setCartItems(prev => prev.map(item => ({ ...item, checked: isChecked })));
  };

  // Fungsi Hapus Item yang diceklis
  const deleteChecked = () => {
    setCartItems(prev => prev.filter(item => !item.checked));
  };

  // Hitung Total Harga yang diceklis saja
  const totalPrice = cartItems
    .filter(item => item.checked)
    .reduce((acc, item) => acc + (item.price * item.qty), 0);

  const totalItemsChecked = cartItems.filter(i => i.checked).length;

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white font-sans pb-32 overflow-x-hidden">
      
      {/* NAVBAR ATAS (Sticky) */}
      <nav className="sticky top-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/main" className="text-sm font-black flex items-center gap-2 text-gray-400 hover:text-white transition-all active:scale-90">
            ⬅️ <span className="hidden sm:inline">KEMBALI</span>
          </Link>
          <h1 className="text-lg font-black italic tracking-tighter uppercase">Keranjang Saya</h1>
          <div className="w-8"></div> {/* Spacer balance */}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        
        {/* BARIS PILIH SEMUA (Sesuai Referensi) */}
        <div className="bg-[#1a1a2e] p-5 rounded-[25px] border border-white/5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-purple-500 rounded-md cursor-pointer" 
              checked={cartItems.length > 0 && cartItems.every(i => i.checked)}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Pilih Semua</span>
          </div>
          <button 
            onClick={deleteChecked}
            className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Hapus
          </button>
        </div>

        {/* DAFTAR PRODUK */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-[#1a1a2e] p-4 rounded-[30px] border border-white/5 flex items-center gap-4 shadow-2xl relative overflow-hidden"
                >
                  {/* Background Glow Effect */}
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/5 blur-2xl rounded-full"></div>

                  {/* Checkbox Item */}
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-purple-500 rounded-md cursor-pointer flex-shrink-0"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                  />

                  {/* Foto Produk */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[20px] flex-shrink-0 overflow-hidden border border-white/10 p-2">
                     <Image 
                        src={item.image} 
                        alt={item.name} 
                        width={100} 
                        height={100} 
                        className="w-full h-full object-contain rounded-lg grayscale hover:grayscale-0 transition-all"
                     />
                  </div>

                  {/* Info & Counter */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20 md:h-24 py-1">
                    <div>
                      <h3 className="text-[11px] md:text-sm font-black truncate uppercase tracking-tight text-gray-100 italic">
                        {item.name}
                      </h3>
                      <p className="text-[#8b5cf6] text-xs md:text-sm font-black mt-0.5">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    
                    {/* Counter Row */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-4 bg-[#0f0f1b] px-3 py-1.5 rounded-full border border-white/5">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="text-gray-400 hover:text-white text-lg font-bold w-4 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-black min-w-[15px] text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          className="text-purple-400 hover:text-purple-300 text-lg font-bold w-4 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Trash Icon for individual delete */}
                      <button className="text-gray-600 hover:text-red-500 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <p className="text-gray-500 font-black italic text-sm uppercase tracking-widest">Keranjang Kosong...</p>
                <Link href="/main" className="inline-block bg-purple-600 px-8 py-3 rounded-full font-black text-[10px] uppercase">Mulai Belanja</Link>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER SUMMARY (Floating Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/95 backdrop-blur-2xl border-t border-white/10 p-6 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Estimasi Total</span>
            <span className="text-lg md:text-2xl font-black text-white italic tracking-tighter">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
          
          <button 
            disabled={totalItemsChecked === 0}
            className={`flex-1 md:flex-none md:px-12 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              totalItemsChecked > 0 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Checkout ({totalItemsChecked})
          </button>
        </div>
      </div>

      {/* Efek Cahaya Dekoratif Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>
    </main>
  );
}