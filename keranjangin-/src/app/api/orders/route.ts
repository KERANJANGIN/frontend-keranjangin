import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller');

    if (!sellerId) {
      return NextResponse.json({ error: 'seller is required' }, { status: 400 });
    }

    // 1. Fetch transactions to sync from
    // We fetch all transactions that are NOT 'waiting_payment' because orders start after payment or commitment
    // However, the user said "if status is paid... confirm", implying we might see them before
    // Let's fetch all for now to be safe and thorough
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*');

    if (txError) throw txError;

    // 2. Fetch products for this seller to know which items belong to them
    const { data: sellerProducts, error: prodError } = await supabase
      .from('products')
      .select('id, name, img_path, price')
      .eq('seller', sellerId);

    if (prodError) throw prodError;
    const sellerProductIds = new Set(sellerProducts.map(p => p.id));

    // 3. Sync synchronization logic
    // For each transaction, if it contains seller's products, ensure they are in the 'orders' table
    for (const tx of transactions || []) {
      const productsInTx = tx.products || [];
      for (const p of productsInTx) {
        // p might be an object { id, quantity, price, courier, ... }
        // or just an ID depending on how the frontend sends it. 
        // Based on api/transactions/route.ts, it expects { price, ... }
        const pId = p.id;
        
        if (sellerProductIds.has(pId)) {
          // Check if already in orders
          const { data: existingOrder } = await supabase
            .from('orders')
            .select('id')
            .eq('transaction', tx.id)
            .eq('item', pId)
            .maybeSingle();

          if (!existingOrder) {
            // Insert into orders
            await supabase.from('orders').insert({
              transaction: tx.id,
              item: pId,
              price: p.price || 0,
              quantity: p.quantity || 1,
              courier: p.courier || 1, // Default to first courier if missing
              order_status: 'action_needed'
            });
          }
        }
      }
    }

    // 4. Fetch final orders list for this seller
    // We join with products to get product info, and transactions to get buyer and status
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        item:products(*),
        transaction:transactions(*)
      `)
      .in('item', Array.from(sellerProductIds));

    if (ordersError) throw ordersError;

    // Join buyer info from the users table (since transaction only has buyer ID)
    const ordersWithBuyer = await Promise.all((orders || []).map(async (order: any) => {
      if (order.transaction && order.transaction.buyer) {
        const { data: buyerData } = await supabase
          .from('users')
          .select('full_name, email, avatarUrl')
          .eq('id', order.transaction.buyer)
          .maybeSingle();
        return { ...order, buyer: buyerData };
      }
      return order;
    }));

    return NextResponse.json(ordersWithBuyer);
  } catch (error: any) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transaction, item, price, quantity, courier, order_status } = body;

    const { data, error } = await supabase
      .from('orders')
      .insert({ transaction, item, price, quantity, courier, order_status })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
