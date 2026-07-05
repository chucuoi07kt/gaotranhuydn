import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getBlogPosts, getBlogBySlug } from '@/lib/data';
import { toWebpUrl } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: 'Bài viết – Gạo Trần Huy' };
  return {
    title: `${post.title} – Gạo Trần Huy`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();
  const all = await getBlogPosts();
  const related = all.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="container-page py-8 md:py-12">
      <Link
        href="/bai-viet"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại bài viết
      </Link>

      <div className="mx-auto max-w-3xl">
        {post.category && (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {post.category}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold leading-tight text-foreground md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {post.author || 'Gạo Trần Huy'}
        </p>

        {post.image && (
          <div className="mt-6 overflow-hidden rounded-xl border bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={toWebpUrl(post.image) || PLACEHOLDER_IMAGE}
              alt={post.title}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div
            className="prose-content mt-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 text-lg font-bold text-foreground">Bài viết khác</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/bai-viet/${p.slug || p.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/30"
              >
                <div className="aspect-video overflow-hidden bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={toWebpUrl(p.image) || PLACEHOLDER_IMAGE}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="line-clamp-2 p-3 text-sm font-medium text-foreground">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
