import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';
import { generateId } from '@/lib/format';
import { syncToSheet } from '@/lib/sheet-sync';
import type { Product } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ ok: true, data: products });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product: Product = {
      id: body.id || generateId('P'),
      name: String(body.name || '').trim(),
      category: String(body.category || 'Sản phẩm khác'),
      price: Number(body.price) || 0,
      weight: body.weight || '5kg',
      image: body.image || '',
      description: body.description || '',
      traits: body.traits || '',
      origin: body.origin || '',
      stock: body.stock || 'Còn hàng',
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString(),
    };
    if (!product.name) {
      return NextResponse.json(
        { ok: false, message: 'Tên sản phẩm là bắt buộc.' },
        { status: 400 }
      );
    }
    const result = await syncToSheet('sp', 'add', product);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, data: product });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra khi tạo sản phẩm.' },
      { status: 500 }
    );
  }
}
