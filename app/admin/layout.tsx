import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export const metadata = {
  title: 'Admin – Gạo Trần Huy',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect('/admin/login');
  }
  return <>{children}</>;
}
