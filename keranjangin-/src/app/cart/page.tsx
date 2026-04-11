"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getCartData = async () => {
      setLoading(true);
      // 1. Cek User yang login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);

      // 2. Ambil data dari table 'cart'
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (cartError) {
        console.error("Error fetching cart:", cartError.message);
        setLoading(false);
        return;
      }

      if (cartData && cartData.length > 0) {
        // 3. Ambil data produk untuk dapat gambarnya
        const productIds = cartData.map(item => item.product_id);
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("id, img_path")
          .in("id", productIds);

        if (!productsError && productsData) {
          // 4. Gabungkan data gambar ke cart items
          const mergedData = cartData.map(item => {
            const product = productsData.find(p => String(p.id) === String(item.product_id));
            return {
              ...item,
              img_path: product?.img_path
            };
          });
          setCartItems(mergedData);
        } else {
          setCartItems(cartData);
        }
      } else {
        setCartItems([]);
      }
      
      setLoading(false);
    };

    getCartData();
  }, [router]);

  // Fungsi Hapus Item
  const removeFromCart = async (id: number) => {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("id", id);

    if (!error) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      alert("Gagal menghapus item");
    }
  };

  // --- FUNGSI UPDATE QUANTITY (TAMBAH / KURANG) ---
  const updateQuantity = async (id: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;

    if (newQty <= 0) {
      // Kalau 0, panggil fungsi hapus yang sudah kamu punya
      removeFromCart(id);
    } else {
      // Kalau masih > 0, update jumlahnya di Supabase
      const { error } = await supabase
        .from("cart")
        .update({ quantity: newQty })
        .eq("id", id);

      if (!error) {
        // Update state lokal biar gak perlu reload page
        setCartItems(cartItems.map(item => 
          item.id === id ? { ...item, quantity: newQty } : item
        ));
      } else {
        alert("Gagal update jumlah: " + error.message);
      }
    }
  };

  // Hitung Total Harga
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center text-white italic tracking-[0.5em] uppercase text-[10px]">
        Loading Your Cart...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-white/5 pb-8">
          <Link href="/main" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-purple-400 transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Shop
          </Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Keranjang <span className="text-purple-500">Belanja</span>
          </h1>
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            {cartItems.length} Items
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT SIDE: LIST ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-[#1a1a2e] border border-dashed border-white/10 rounded-[40px] py-20 text-center"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Keranjang Kosong</p>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="bg-[#1a1a2e] border border-white/5 p-6 rounded-[35px] flex items-center gap-6 group hover:border-purple-500/30 transition-all"
                  >
                    <div className="w-24 h-24 bg-[#0f0f1b] rounded-3xl flex items-center justify-center relative overflow-hidden">
                      {item.img_path ? (
                        <img src={item.img_path} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-black text-gray-800 uppercase italic">No Image</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-black italic uppercase tracking-tight text-white">{item.product_name}</h3>
                          <p className="text-[10px] text-purple-400 font-bold uppercase mt-1 tracking-widest">Student Verified</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end mt-6">
                        <div className="flex items-center gap-4 bg-[#0f0f1b] px-3 py-2 rounded-2xl border border-white/5">
                          <button onClick={() => updateQuantity(item.id, item.quantity, -1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-red-500 transition-colors">
                              —
                          </button>
                            <span className="text-[10px] font-black text-white w-4 text-center">
                              {item.quantity}
                            </span>
                          <button onClick={() => updateQuantity(item.id, item.quantity, 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-purple-500 transition-colors">
                              +
                          </button>
                        </div>
                        <p className="font-black text-lg text-white">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1b] border border-white/10 rounded-[40px] p-8 sticky top-28 shadow-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Order Summary</h2>
              
              <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">Subtotal</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-green-500">FREE</span>
                </div>
              </div>

              <div className="py-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Amount</p>
                <p className="text-3xl font-black italic uppercase tracking-tighter">Rp {totalPrice.toLocaleString('id-ID')}</p>
              </div>
            <Link href="/checkout">
              <button className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95">
                Checkout Now 🚀
              </button>
            </Link>
              
              <p className="text-[8px] text-center text-gray-600 font-bold uppercase tracking-[0.2em] mt-6 leading-relaxed">
                Secure transaction by <br/> Keranjangin Ecosystem
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}