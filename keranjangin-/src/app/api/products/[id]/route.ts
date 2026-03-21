import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// ────────────────────────────────────────────────────
// Helper to extract ID from params
// ────────────────────────────────────────────────────
type Params = { id: string };

// ────────────────────────────────────────────────────
// GET /API/products/[id]
//  Fetch a single product by its ID
// ────────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Supabase returns PGRST116 when single() finds no rows
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    console.error(`GET /API/products/[id] error:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────
// PUT /API/products/[id]
//  Update a product (partial or full)
// ────────────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Extract valid fields you want to allow updating
    const { name, description, price, stock, category, img_path, product_code, min_quantity, weight, size, sold, product_status } = body;

    const ALLOWED_CATEGORIES = [
        'Fashion', 'Elektronik', 'Home & Living', 'Beauty & Personal Care',
        'Baby & Kids', 'Sports & Outdoor', 'Automotive', 'Books & Stationery',
        'Hobbies & Entertainment', 'Food & Beverages'
    ];
        
    const ALLOWED_STATUSES = ['live', 'not_shown', 'action_needed'];

    if (category !== undefined && !ALLOWED_CATEGORIES.includes(category)) {
        return NextResponse.json({ error: 'Invalid category value' }, { status: 400 });
    }

    if (product_status !== undefined && !ALLOWED_STATUSES.includes(product_status)) {
        return NextResponse.json({ error: 'Invalid product_status value' }, { status: 400 });
    }

    // Build the update object dynamically
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (category !== undefined) updateData.category = category;
    if (img_path !== undefined) updateData.img_path = img_path;
    if (product_code !== undefined) updateData.product_code = product_code;
    if (min_quantity !== undefined) updateData.min_quantity = min_quantity;
    if (weight !== undefined) updateData.weight = weight;
    if (size !== undefined) updateData.size = size;
    if (sold !== undefined) updateData.sold = sold;
    if (product_status !== undefined) updateData.product_status = product_status;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided to update.' },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /API/products/[id] error:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────
// DELETE /API/products/[id]
//  Delete a product
// ────────────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Supabase delete doesn't error if the row didn't exist, it just returns empty.
    // We'll just return success.
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`DELETE /API/products/[id] error:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
