import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

export const runtime = 'nodejs';
export const revalidate = 300;

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ ok: true, data: products });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Không thể tải sản phẩm.' },
      { status: 500 }
    );
  }
}
