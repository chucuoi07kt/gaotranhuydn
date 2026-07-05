import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/data';

export const runtime = 'nodejs';
export const revalidate = 300;

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json({ ok: true, data: posts });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Không thể tải bài viết.' },
      { status: 500 }
    );
  }
}
