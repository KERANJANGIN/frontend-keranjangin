import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

// ────────────────────────────────────────────────────
// GET /api/orders
// Fetch all orders
// Query params: ?transaction=<int8>
// ────────────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const transaction = searchParams.get('transaction');

        let query = supabase.from('orders').select('*');

        if (transaction) {
            query = query.eq('transaction', transaction);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ orders: data }, { status: 200 });
    } catch (error: any) {
        console.error('GET /api/orders error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

// ────────────────────────────────────────────────────
// POST /api/orders
// Create a new order item
// Required body: { transaction, item, price, quantity, courier }
// ────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transaction, item, price, quantity, courier } = body;

        if (!transaction || !item || price == null || !courier) {
            return NextResponse.json(
                { error: 'transaction, item, price, and courier are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    transaction,
                    item,
                    price,
                    quantity: quantity ?? 1,
                    courier,
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { message: 'Order item created', order: data },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('POST /api/orders error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
