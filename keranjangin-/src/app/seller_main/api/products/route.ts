import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// ────────────────────────────────────────────────────
// GET /API/products
//  Query params (all optional):
//   ?category=<text>   → filter by category
//   ?seller=<int8>     → filter by seller id
// ────────────────────────────────────────────────────

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const seller = searchParams.get('seller');

        let query = supabase.from('products').select('*');

        if (category) query = query.eq('category', category);
        if (seller) query = query.eq('seller', Number(seller));

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ products: data }, { status: 200 });
    } catch (error: any) {
        console.error('GET /API/products error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

// ────────────────────────────────────────────────────
// POST /API/products
//  Required body: { name, description, price, stock, seller }
//  Optional body: { category }
// ────────────────────────────────────────────────────

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, stock, seller, category } = body;

        // ── Validation ────────────────────────────────
        if (!name || !description || price == null || stock == null || !seller) {
            return NextResponse.json(
                { error: 'name, description, price, stock, and seller are required' },
                { status: 400 }
            );
        }

        if (typeof price !== 'number' || price < 0) {
            return NextResponse.json(
                { error: 'price must be a non-negative number' },
                { status: 400 }
            );
        }

        if (typeof stock !== 'number' || stock < 0) {
            return NextResponse.json(
                { error: 'stock must be a non-negative number' },
                { status: 400 }
            );
        }

        // ── Insert ────────────────────────────────────
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    name,
                    description,
                    price,
                    stock,
                    seller,
                    category: category ?? null,
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { message: 'Product created successfully', product: data },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('POST /API/products error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
