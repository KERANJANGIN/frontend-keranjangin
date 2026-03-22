"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function SellerAuthGuard({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/");
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Optional: Listen for auth state changes (e.g., session expires)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" || !session) {
                router.push("/");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1e1b4b] flex flex-col items-center justify-center text-white gap-4 font-display italic">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                <p className="text-sm font-bold tracking-widest animate-pulse uppercase">Authenticating...</p>
            </div>
        );
    }

    return <>{children}</>;
}
