import { NextResponse } from 'next/server';
import { slugify } from '@/lib/format';
import { syncToSheet } from '@/lib/sheet-sync';
import type { BlogPost } from '@/lib/types';

export const runtime = 'nodejs';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const post: BlogPost = {
      id,
      title: String(body.title || '').trim(),
      slug: body.slug || slugify(body.title || ''),
      excerpt: body.excerpt || '',
      content: body.content || '',
      image: body.image || '',
      author: body.author || 'Gạo Trần Huy',
      category: body.category || 'Tin tức',
      published: body.published !== false,
      updatedAt: new Date().toISOString(),
    };
    if (!post.title) {
      return NextResponse.json(
        { ok: false, message: 'Tiêu đề là bắt buộc.' },
        { status: 400 }
      );
    }
    const result = await syncToSheet('blog', 'edit', post);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, data: post });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra khi cập nhật bài viết.' },
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
    const result = await syncToSheet('blog', 'delete', { id });
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra khi xóa bài viết.' },
      { status: 500 }
    );
  }
}
