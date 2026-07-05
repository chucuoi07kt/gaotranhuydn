import { AdminShell } from '@/components/admin/admin-shell';
import { BlogManager } from '@/components/admin/blog-manager';
import { getBlogPosts } from '@/lib/data';

export const revalidate = 0;

export const metadata = { title: 'Bài viết – Admin Gạo Trần Huy' };

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return (
    <AdminShell>
      <BlogManager initialPosts={posts} />
    </AdminShell>
  );
}
