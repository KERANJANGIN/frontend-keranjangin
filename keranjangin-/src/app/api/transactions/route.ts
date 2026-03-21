import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ────────────────────────────────────────────────────
// POST /API/users
//  Body { action: "newTx" } → create a new transaction
// ────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ──────────────────────────────────────────────────
    // newTx:
    // Required body: { action, buyer, products  }
    // ──────────────────────────────────────────────────
    if (action === 'newTx') {
      const { buyer, products } = body;

      if (!buyer || !products) {
        return NextResponse.json(
          { error: 'buyer, and products are all required' },
          { status: 400 }
        );
      }

      let totalPrice: number = products
        .map(product => product.price)
        .reduce((acc, price) => acc + price, 0);

      // qris/payment api implementation coming soon

      const { data: tx, error, status } = await supabase
        .from('transactions')
        .insert({ buyer, products, totalPrice, qrisData })
        .select();
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: status }
        )
      }
      
      return NextResponse.json(
        {
          message: 'success',
          tx,
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

