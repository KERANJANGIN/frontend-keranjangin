import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ────────────────────────────────────────────────────
// POST /API/users
//  Body { action: "register" } → Register a new user
//  Body { action: "login"    } → Login an existing user
// ────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ──────────────────────────────────────────────────
    // REGISTER
    // Required body: { action, email, password, username }
    // ──────────────────────────────────────────────────
    if (action === 'register') {
      const { email, password, username } = body;

      if (!email || !password || !username) {
        return NextResponse.json(
          { error: 'email, password, username are all required' },
          { status: 400 }
        );
      }

      // 1. Create auth user (Supabase stores the password internally in auth.users)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      // 2. Insert profile row into public.users
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert([{ email, username, cart: [] }])
        .select()
        .single();

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }

      return NextResponse.json(
        {
          message: 'Registration successful. Please check your email to confirm your account.',
          user: userProfile,
          session: authData.session,
        },
        { status: 201 }
      );
    }

    // ──────────────────────────────────────────────────
    // LOGIN
    // Required body: { action, email, password }
    // ──────────────────────────────────────────────────
    if (action === 'login') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { error: 'email and password are required' },
          { status: 400 }
        );
      }

      // 1. Authenticate via Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 401 });
      }

      // 2. Fetch the user profile from public.users
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }

      return NextResponse.json(
        {
          message: 'Login successful',
          user: userProfile,
          session: authData.session, // contains access_token & refresh_token
        },
        { status: 200 }
      );
    }

    // ──────────────────────────────────────────────────
    // INVALID ACTION
    // ──────────────────────────────────────────────────
    return NextResponse.json(
      { error: 'Invalid action. Use "login" or "register".' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
