import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/data';
import { generateId, slugify } from '@/lib/format';
import { syncToSheet } from '@/lib/sheet-sync';
import type { BlogPost } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json({ ok: true, data: posts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const post: BlogPost = {
      id: body.id || generateId('B'),
      title: String(body.title || '').trim(),
      slug: body.slug || slugify(body.title || ''),
      excerpt: body.excerpt || '',
      content: body.content || '',
      image: body.image || '',
      author: body.author || 'Gạo Trần Huy',
      category: body.category || 'Tin tức',
      published: body.published !== false,
      createdAt: new Date().toISOString(),
    };
    if (!post.title) {
      return NextResponse.json(
        { ok: false, message: 'Tiêu đề là bắt buộc.' },
        { status: 400 }
      );
    }
    const result = await syncToSheet('blog', 'add', post);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, data: post });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra khi tạo bài viết.' },
      { status: 500 }
    );
  }
}
