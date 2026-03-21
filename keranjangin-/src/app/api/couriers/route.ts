import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

// ────────────────────────────────────────────────────
// GET /api/couriers
// List all courier services
// ────────────────────────────────────────────────────
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('couriers')
            .select('*')
            .order('courier_name', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ couriers: data }, { status: 200 });
    } catch (error: any) {
        console.error('GET /api/couriers error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

// ────────────────────────────────────────────────────
// POST /api/couriers
// Add a new courier
// Required body: { courier_name }
// ────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { courier_name } = body;

        if (!courier_name) {
            return NextResponse.json({ error: 'courier_name is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('couriers')
            .insert([{ courier_name }])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { message: 'Courier added', courier: data },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('POST /api/couriers error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
