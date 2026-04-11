"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, } from "framer-motion";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("wa"); // Default WhatsApp
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [showQRISModal, setShowQRISModal] = useState(false);

  useEffect(() => {
    const getCheckoutData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");
      const currentUser = session.user;
      setUser(currentUser);

      const { data } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", currentUser.id);

      if (data) {
        setCartItems(data);
        const t = data.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(t);
      }
    };
    getCheckoutData();
  }, [router]);

  const handleProcessOrder = async () => {
    if (!user) return alert("Silakan login terlebih dahulu");
    setIsProcessing(true);

    try {
      // 1. Persist Transaction to Backend
      const txPayload = {
        action: 'newTx',
        buyer: user.id,
        products: cartItems.map(item => ({
          id: item.product_id,
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant
        }))
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(txPayload)
      });

      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Gagal membuat transaksi");
      }

      // 2. Clear Cart in Supabase
      const { error: clearError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);
      
      if (clearError) console.error("Failed to clear cart:", clearError);

      // 3. UI Flow: WhatsApp or QRIS
      if (paymentMethod === "qris") {
        setShowQRISModal(true);
      } else if (paymentMethod === "wa") {
        const itemsList = cartItems.map(it => `- ${it.product_name} (${it.quantity}x)`).join("%0A");
        const message = `Halo Admin Keranjangin! Saya mau pesan:%0A${itemsList}%0ATotal: Rp ${total.toLocaleString('id-ID')}%0AMohon diproses ya!`;
        window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
        router.push("/main");
      } else {
        alert("Fitur Transfer Bank segera hadir!");
      }
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f1b] text-white p-6 md:p-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href="/cart" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-purple-400 transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Cart
          </Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Finalize <span className="text-purple-500">Order</span></h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

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
              onClick={() => {setPaymentMethod("qris")}}
              className={`w-full p-6 rounded-[30px] border transition-all flex items-center gap-4 ${paymentMethod === 'qris' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-[#1a1a2e]'}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-xl shadow-lg">📸</div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-tighter">QRIS / All E-Wallet</p>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Scan & Pay Instantly</p>
              </div>
            </button>

            <button 
              onClick={handleProcessOrder}
              disabled={isProcessing}
              className={`w-full bg-white text-black py-5 rounded-[30px] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95 mt-4 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? "Processing..." : "Confirm & Pay Now"}
            </button>

          </div>
        </div>
      </div>
      {/* MODAL QRIS POP-UP */}
<AnimatePresence>
  {showQRISModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop Gelap kabur */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setShowQRISModal(false)}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      
      {/* Card QRIS */}
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-white w-full max-w-sm rounded-[45px] p-8 relative z-10 shadow-[0_0_50px_rgba(168,85,247,0.4)] text-center overflow-hidden"
      >
        {/* Header QRIS */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-black text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-4">
            Official QRIS
          </div>
          <h3 className="text-black font-black italic uppercase text-lg tracking-tighter">Scan to Payment</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Keranjangin Ecosystem</p>
        </div>

        {/* AREA GAMBAR QR CODE */}
        <div className="aspect-square bg-gray-50 rounded-[35px] border-2 border-dashed border-gray-200 p-4 flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[35px]" />
          {/* GANTI SOURCE GAMBAR DI SINI */}
          <Image 
            src="/qris-dummy.png" 
            alt="QRIS Code" 
            width={250} 
            height={250} 
            className="object-contain"
          />
        </div>

        {/* INFO TOTAL */}
        <div className="mt-8 mb-8 space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total yang harus dibayar</p>
          <p className="text-2xl font-black italic text-black leading-none">Rp {total.toLocaleString('id-ID')}</p>
        </div>

        {/* BUTTONS */}
        <div className="space-y-3">
          <button 
            onClick={() => {
              // Logic simpan bukti bayar atau lanjut
              setShowQRISModal(false);
              alert("Terima kasih! Jangan lupa kirim bukti bayar ke admin ya.");
              router.push("/main");
            }}
            className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-purple-600 transition-all active:scale-95 shadow-lg"
          >
            Sudah Transfer
          </button>
          <button 
            onClick={() => setShowQRISModal(false)}
            className="w-full bg-white text-gray-400 py-2 rounded-xl font-bold uppercase text-[8px] tracking-[0.2em] hover:text-red-500 transition-all"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </main>
  );
}