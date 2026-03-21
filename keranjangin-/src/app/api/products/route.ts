import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

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
        const name = searchParams.get('name');


        let query = supabase.from('products').select('*');

        if (category) query = query.eq('category', category);
        if (seller) query = query.eq('seller', seller);
        if (name) query = query.ilike('name', `%${name}%`);

        const { data, error } = await query.order('createdAt', { ascending: false });

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
//  Required body: { name, description, price, stock, seller, img_path, product_code, weight }
//  Optional body: { category, min_quantity, size }
// ────────────────────────────────────────────────────

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, stock, seller, category, img_path, product_code, min_quantity, weight, size, sold, product_status } = body;

        // ── Validation ────────────────────────────────
        if (!name || !description || price == null || stock == null || !seller || !img_path || !product_code || weight == null) {
            return NextResponse.json(
                { error: 'name, description, price, stock, seller, img_path, product_code, and weight are required' },
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

        if (typeof weight !== 'number' || weight < 0) {
            return NextResponse.json(
                { error: 'weight must be a non-negative number' },
                { status: 400 }
            );
        }
        
        const ALLOWED_CATEGORIES = [
            'Fashion', 'Elektronik', 'Home & Living', 'Beauty & Personal Care',
            'Baby & Kids', 'Sports & Outdoor', 'Automotive', 'Books & Stationery',
            'Hobbies & Entertainment', 'Food & Beverages'
        ];
        
        const ALLOWED_STATUSES = ['live', 'not_shown', 'action_needed'];

        if (category && !ALLOWED_CATEGORIES.includes(category)) {
            return NextResponse.json({ error: 'Invalid category value' }, { status: 400 });
        }

        if (product_status && !ALLOWED_STATUSES.includes(product_status)) {
            return NextResponse.json({ error: 'Invalid product_status value' }, { status: 400 });
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
                    category: category ?? 'Home & Living',
                    img_path,
                    product_code,
                    min_quantity: min_quantity ?? 1,
                    weight,
                    size: size ?? null,
                    sold: sold ?? 0,
                    product_status: product_status ?? 'live',
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
