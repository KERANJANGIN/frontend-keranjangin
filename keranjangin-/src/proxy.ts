import { NextResponse } from "next/server"
import { auth } from "@/auth"

// Next.js 16+ requires the file to be proxy.ts and the function to be exported as `proxy`
export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname === "/";

    // If the user is logged in and tries to access the login page ("/"), redirect to "/main"
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/main", req.url));
    }

    // Temporarily disabled: Conflicts with Supabase client-side login
    // if (!isLoggedIn && req.nextUrl.pathname.startsWith("/main")) {
    //     return NextResponse.redirect(new URL("/", req.url));
    // }

    return NextResponse.next();
});

export default proxy;

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
