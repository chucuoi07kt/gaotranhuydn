'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('Vui lòng nhập mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.message || 'Sai mật khẩu.');
        return;
      }
      toast.success('Đăng nhập thành công.');
      router.push('/admin/products');
      router.refresh();
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-3">
        <Label htmlFor="password" className="flex items-center gap-1.5">
          <Lock className="h-4 w-4" />
          Mật khẩu
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(e);
          }}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="mt-4 w-full gap-2"
        disabled={loading}
      >
        <LogIn className="h-4 w-4" />
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Mật khẩu được cấu hình trong file .env.local (ADMIN_PASSWORD)
      </p>
    </form>
  );
}