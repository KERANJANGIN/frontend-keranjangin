import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// ────────────────────────────────────────────────────
// PUT /api/couriers/[id]
// Update courier info
// ────────────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { courier_name } = body;

    if (!courier_name) {
      return NextResponse.json({ error: 'courier_name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('couriers')
      .update({ courier_name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Courier updated', courier: data }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/couriers/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────
// DELETE /api/couriers/[id]
// Remove courier service
// ────────────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('couriers')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Courier removed' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/couriers/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
