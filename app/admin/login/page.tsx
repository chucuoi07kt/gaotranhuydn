import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { Wheat } from 'lucide-react';

export const metadata = { title: 'Đăng nhập Admin – Gạo Trần Huy' };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Wheat className="h-7 w-7" />
          </div>
          <h1 className="mt-3 text-xl font-bold text-foreground">
            Gạo Trần Huy – Quản trị
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Đăng nhập để quản lý sản phẩm và bài viết
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
