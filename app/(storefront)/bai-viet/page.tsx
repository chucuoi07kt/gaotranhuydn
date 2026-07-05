import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';
import { toWebpUrl } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

export const revalidate = 300;

export const metadata = {
  title: 'Bài viết – Gạo Trần Huy',
  description: 'Tin tức, hướng dẫn chọn gạo, bảo quản gạo từ Gạo Trần Huy.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="container-page py-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Bài viết
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
            Tin tức & Hướng dẫn
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Chia sẻ cách chọn gạo, bảo quản gạo và mẹo vặt hàng ngày.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {posts.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="font-medium text-foreground">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/bai-viet/${post.slug || post.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={toWebpUrl(post.image) || PLACEHOLDER_IMAGE}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {post.category && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {post.category}
                    </p>
                  )}
                  <h2 className="line-clamp-2 text-base font-semibold text-foreground">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-auto pt-3 text-xs text-muted-foreground">
                    {post.author || 'Gạo Trần Huy'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
