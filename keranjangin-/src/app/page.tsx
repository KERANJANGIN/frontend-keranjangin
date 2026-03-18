"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase"; // Path disesuaikan naik 1 tingkat
import { useRouter } from "next/navigation"; // 1. Tambah import router

export default function Home() {
  const router = useRouter(); // 2. Inisialisasi router
  const brandName = "KERANJANGIN";
  const letters = Array.from(brandName);
  const [showCard, setShowCard] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- DATABASE STATES ---
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 3800);
    return () => clearTimeout(timer);
  }, []);

  // --- DATABASE LOGIC ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Password tidak sama!");
    
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, 
      },
    });

    if (error) alert(error.message);
    else alert("Registrasi Berhasil! Silakan cek email kamu untuk verifikasi.");
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      // 3. Logic Redirect setelah sukses
      alert("Login Berhasil! Selamat datang di Keranjangin.");
      router.push("/main"); 
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#8b5cf6] flex flex-col lg:flex-row items-center justify-center p-6 lg:p-20 overflow-x-hidden font-sans gap-8 lg:gap-12">
      
      <div className="fixed inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] -z-20" />

      {/* SECTION LOGO & BRAND */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-[120px] w-full lg:w-1/2">
        <motion.div 
          animate={showCard ? { x: typeof window !== 'undefined' && window.innerWidth > 1024 ? -60 : 0 } : { x: 0 }}
          className="relative flex flex-col lg:flex-row items-center justify-center"
        >
          <motion.div
            initial={{ y: -800, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              x: typeof window !== 'undefined' && window.innerWidth > 1024 ? [0, 0, -140] : 0 
            }}
            transition={{ 
              y: { duration: 1.2, type: "spring", bounce: 0.3 },
              x: { delay: 1.0, duration: 0.8, ease: "easeInOut" } 
            }}
            className="z-50 flex-shrink-0 mb-4 lg:mb-0"
          >
            <div className="bg-white p-4 rounded-[35px] shadow-2xl border-4 border-white/20 w-[90px] h-[90px] md:w-[110px] md:h-[110px] flex items-center justify-center">
              <Image 
                src="/LOGO.jpeg" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="object-contain rounded-2xl" 
                priority
              />
            </div>
          </motion.div>

          <div className="lg:absolute lg:left-[-20px] flex flex-row items-center justify-center whitespace-nowrap">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + (index * 0.08), duration: 0.4 }}
                className="text-4xl md:text-6xl font-black text-white tracking-tighter filter drop-shadow-xl"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECTION KANAN: CARD */}
      <div className="w-full max-w-[450px] min-h-[550px] lg:h-[650px] relative [perspective:1000px] z-30 mb-10 lg:mb-0">
        {showCard && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              rotateY: isFlipped ? 180 : 0 
            }}
            transition={{ 
              rotateY: { duration: 0.6, ease: "easeInOut" },
              default: { type: "spring", stiffness: 80, damping: 15 }
            }}
            className="w-full h-full [transform-style:preserve-3d] relative"
          >
            {/* FRONT (LOGIN) */}
            <form 
              onSubmit={handleLogin}
              className="absolute inset-0 bg-white rounded-[40px] p-8 md:p-10 shadow-2xl [backface-visibility:hidden] flex flex-col justify-between"
            >
              <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2 font-sans italic">Welcome Back!</h2>
                <p className="text-gray-400 text-sm mb-8 italic">Login to your account</p>
                <div className="space-y-4">
                  <InputField label="Email Address" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#8b5cf6] text-white font-bold py-4 rounded-2xl mt-4 hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-6 font-medium">
                New here? <button type="button" onClick={() => setIsFlipped(true)} className="text-purple-600 font-bold hover:underline">Create Account</button>
              </p>
            </form>

            {/* BACK (SIGN UP) */}
            <form 
              onSubmit={handleRegister}
              className="absolute inset-0 bg-white rounded-[40px] p-8 md:p-10 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between"
            >
              <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2 italic">Sign Up</h2>
                <p className="text-gray-400 text-sm mb-6">Create your account</p>
                <div className="space-y-3">
                  <InputField label="Full Name" type="text" placeholder="Your Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  <InputField label="Email Address" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <InputField label="Password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <InputField label="Confirm Password" type="password" placeholder="Confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#8b5cf6] text-white font-bold py-4 rounded-2xl mt-4 shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => setIsFlipped(false)} className="text-purple-600 font-bold text-sm mt-4 hover:underline">Back to Login</button>
            </form>
          </motion.div>
        )}
      </div>

    </main>
  );
}

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function InputField({ label, type, placeholder, value, onChange, required }: InputProps) {
  return (
    <div className="text-left">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        required={required}
        className="w-full mt-1 p-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-800 focus:bg-white focus:border-purple-400 outline-none transition-all placeholder:text-gray-300"
      />
    </div>
  );
}