import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

// ────────────────────────────────────────────────────
// GET /api/cart
// Fetch all cart items for a specific user
// Query param: ?user_id=<uuid>
// ────────────────────────────────────────────────────
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');

        if (!user_id) {
            return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ cart: data }, { status: 200 });
    } catch (error: any) {
        console.error('GET /api/cart error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

// ────────────────────────────────────────────────────
// POST /api/cart
// Add a new item to the cart
// Required body: { user_id, product_id, product_name, price, quantity, image_url }
// ────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user_id, product_id, product_name, price, quantity, image_url } = body;

        if (!user_id || !product_id || !product_name || price == null) {
            return NextResponse.json(
                { error: 'user_id, product_id, product_name, and price are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('cart')
            .insert([
                {
                    user_id,
                    product_id,
                    product_name,
                    price,
                    quantity: quantity ?? 1,
                    image_url,
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { message: 'Item added to cart', item: data },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('POST /api/cart error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
