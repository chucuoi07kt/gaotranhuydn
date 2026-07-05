import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { toWebpUrl, formatDate } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { BlogPost } from '@/lib/types';

export function HomeLatestNews({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="container-page py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Tin tức mới nhất
          </p>
          <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
            Bài viết & Hướng dẫn
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chia sẻ cách chọn gạo, bảo quản gạo và mẹo vặt hàng ngày.
          </p>
        </div>
        <Link
          href="/bai-viet"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => {
          const date = post.createdAt || post.updatedAt;
          return (
            <Link
              key={post.id}
              href={`/bai-viet/${post.slug || post.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
            >
              <div className="relative aspect-video overflow-hidden bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={toWebpUrl(post.image) || PLACEHOLDER_IMAGE}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {post.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                    {post.category}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <time dateTime={date ? new Date(date).toISOString() : undefined}>
                    {date ? formatDate(date) : 'Gạo Trần Huy'}
                  </time>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/bai-viet"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Xem tất cả bài viết
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}