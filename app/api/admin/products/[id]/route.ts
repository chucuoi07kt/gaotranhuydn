import { NextResponse } from 'next/server';
import { syncToSheet } from '@/lib/sheet-sync';
import type { Product } from '@/lib/types';

export const runtime = 'nodejs';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product: Product = {
      id,
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
      updatedAt: new Date().toISOString(),
    };
    if (!product.name) {
      return NextResponse.json(
        { ok: false, message: 'Tên sản phẩm là bắt buộc.' },
        { status: 400 }
      );
    }
    const result = await syncToSheet('sp', 'edit', product);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, data: product });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra khi cập nhật sản phẩm.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await syncToSheet('sp', 'delete', { id });
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra khi xóa sản phẩm.' },
      { status: 500 }
    );
  }
}
