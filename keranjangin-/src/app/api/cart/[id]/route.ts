import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// ────────────────────────────────────────────────────
// PUT /api/cart/[id]
// Update cart item (e.g. quantity)
// ────────────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity == null || quantity < 1) {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Cart updated', item: data }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/cart/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────
// DELETE /api/cart/[id]
// Remove item from cart
// ────────────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/cart/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
