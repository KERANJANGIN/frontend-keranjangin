import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/products/seller?id=<sellerId>
// Fetch products specifically for a single seller
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get('id');

        if (!sellerId) {
            return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller', sellerId)
            .order('createdAt', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ products: data }, { status: 200 });
    } catch (error: any) {
        console.error('GET /api/products/seller error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
