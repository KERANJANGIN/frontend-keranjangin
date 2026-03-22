"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SellerSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Home", href: "/seller_main", icon: "home" },
        { name: "Pesanan", href: "/seller_main/pesanan", icon: "shopping_bag" },
        { name: "Produk", href: "/seller_main/produk", icon: "package_2" },
        { name: "Marketing", href: "/seller_main/marketing", icon: "campaign" },
        { name: "Analytics", href: "/seller_main/analytics", icon: "analytics" },
        { name: "Keuangan", href: "/seller_main/keuangan", icon: "account_balance_wallet" },
    ];

    const isActive = (href: string) => {
        if (href === "/seller_main") {
            return pathname === "/seller_main" || pathname === "/seller_main/";
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                    <img src="/LOGO.jpeg" alt="Keranjangin Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight">Seller Center</h1>
                    <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Powered by Keranjangin</p>
                </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive(item.href)
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span>{item.name}</span>
                    </Link>
                ))}
                
                <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                        href="/seller_main/pengaturan"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive("/seller_main/pengaturan")
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                        }`}
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span>Pengaturan</span>
                    </Link>
                    
                    {/* BACK TO BUYER BUTTON */}
                    <Link 
                        href="/main" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-bold mt-2"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Kembali ke Buyer</span>
                    </Link>
                </div>
            </nav>
            <div className="p-4 shrink-0">
                <div className="rounded-xl bg-primary p-4 text-white">
                    <p className="text-xs font-medium opacity-80 mb-2">Pusat Edukasi</p>
                    <p className="text-sm font-bold mb-3">Tingkatkan omset toko kamu!</p>
                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all cursor-pointer">
                        Pelajari Sekarang
                    </button>
                </div>
            </div>
        </aside>
    );
}
