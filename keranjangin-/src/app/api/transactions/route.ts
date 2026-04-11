import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

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

      if (!buyer || !products || !Array.isArray(products)) {
        return NextResponse.json(
          { error: 'buyer and products array are required' },
          { status: 400 }
        );
      }

      let totalPrice: number = products
        .map((product: any) => (product.price || 0) * (product.quantity || 1))
        .reduce((acc: number, cost: number) => acc + cost, 0);

      // 1. Insert Transaction
      const { data: tx, error: txError } = await supabase
        .from('transactions')
        .insert({ buyer, products, totalPrice, qrisData: null })
        .select()
        .single();
      
      if (txError) {
        return NextResponse.json({ error: txError.message }, { status: 500 });
      }

      // 2. Insert individual Orders for each product
      // We do this so sellers can see their specific items in the seller dashboard
      const orderInserts = products.map((p: any) => ({
        transaction: tx.id,
        item: Number(p.id), // Products use bigint IDs
        price: p.price || 0,
        quantity: p.quantity || 1,
        courier: p.courier || 1, // Default courier
        order_status: 'action_needed'
      }));

      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderInserts);

      if (orderError) {
        console.error("Order insertion failed:", orderError.message);
        // Note: Transaction is already created, we might want to log this or handle partial failure
      }
      
      return NextResponse.json(
        { message: 'success', tx },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────
// PUT /api/transactions
// Body: { txId, status }
// ────────────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const { txId, status } = await request.json();

    if (!txId || !status) {
      return NextResponse.json({ error: 'txId and status required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', txId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Transaction updated', transaction: data });
  } catch (error: any) {
    console.error('PUT /api/transactions error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

