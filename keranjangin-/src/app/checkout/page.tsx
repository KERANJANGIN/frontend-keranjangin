"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("wa"); // Default WhatsApp
  const [showQRIS, setShowQRIS] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCheckoutData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      const { data } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

      if (data) {
        setCartItems(data);
        const t = data.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(t);
      }
    };
    getCheckoutData();
  }, [router]);

  const handleProcessOrder = () => {
    if (paymentMethod === "wa") {
      // Generate teks untuk WhatsApp
      const itemsList = cartItems.map(it => `- ${it.product_name} (${it.quantity}x)`).join("%0A");
      const message = `Halo Admin Keranjangin! Saya mau pesan:%0A${itemsList}%0ATotal: Rp ${total.toLocaleString('id-ID')}%0AMohon diproses ya!`;
      window.open(`https://wa.me/628123456789?text=${message}`, "_blank");
    } else {
      alert("Fitur Transfer Bank segera hadir!");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white p-6 md:p-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-10">Finalize <span className="text-purple-500">Order</span></h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* KIRI: RINGKASAN */}
          <div className="space-y-6">
            <div className="bg-[#1a1a2e] border border-white/5 p-6 rounded-[30px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Items to Buy</p>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs font-bold uppercase italic">{item.product_name}</span>
                  <span className="text-xs text-purple-400">x{item.quantity}</span>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-purple-500/30">
                <p className="text-[10px] font-black uppercase text-gray-500">Total Bill</p>
                <p className="text-2xl font-black italic">Rp {total.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* KANAN: METODE BAYAR */}
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pilih Metode Pembayaran</p>
            
            <button 
              onClick={() => setPaymentMethod("wa")}
              className={`w-full p-6 rounded-[30px] border transition-all flex items-center gap-4 ${paymentMethod === 'wa' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-[#1a1a2e]'}`}
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl">📱</div>
              <div className="text-left">
                <p className="text-xs font-black uppercase">WhatsApp Direct</p>
                <p className="text-[9px] text-gray-500 uppercase">Fast response & COD</p>
              </div>
            </button>

            <button 
              onClick={() => setPaymentMethod("bank")}
              className={`w-full p-6 rounded-[30px] border transition-all flex items-center gap-4 ${paymentMethod === 'bank' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-[#1a1a2e]'}`}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl">💳</div>
              <div className="text-left">
                <p className="text-xs font-black uppercase">Transfer Bank / E-Wallet</p>
                <p className="text-[9px] text-gray-500 uppercase">Automatic Verification</p>
              </div>
            </button>

            <button 
              onClick={() => {
              setPaymentMethod("qris");
              setShowQRIS(true); // Langsung munculin gambar QR-nya
             }}
              className={`w-full p-6 rounded-[30px] border transition-all flex items-center gap-4 ${paymentMethod === 'qris' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-[#1a1a2e]'}`}
            >
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-xl">📸</div>
              <div className="text-left">
                <p className="text-xs font-black uppercase">QRIS / All E-Wallet</p>
                <p className="text-[9px] text-gray-500 uppercase">Scan & Pay Instantly</p>
              </div>
            </button>

            <button 
              onClick={handleProcessOrder}
              className="w-full bg-white text-black py-5 rounded-[30px] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95 mt-4"
            >
              Confirm & Pay Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}