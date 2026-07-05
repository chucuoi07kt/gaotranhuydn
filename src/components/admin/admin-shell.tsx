'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutGrid, LogOut, Menu, Package, PenTool, Wheat, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STORE_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const NAV = [
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/blog', label: 'Bài viết', icon: PenTool },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    toast.success('Đã đăng xuất.');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-1.5 hover:bg-secondary md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/admin/products" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Wheat className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-foreground">
                  {STORE_INFO.name}
                </p>
                <p className="text-[11px] text-muted-foreground">CMS Quản trị</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                <LayoutGrid className="h-4 w-4" />
                Xem site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 top-14 z-20 w-60 border-r bg-background transition-transform md:static md:top-0 md:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="flex flex-col gap-1 p-3">
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:bg-secondary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open && (
          <div
            className="fixed inset-0 top-14 z-10 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}