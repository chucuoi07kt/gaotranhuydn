'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Phone, ShoppingCart, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart-store';
import { STORE_INFO, CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Trang chủ' },
  { href: '/san-pham', label: 'Sản phẩm' },
  { href: '/bai-viet', label: 'Bài viết' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const setOpenCart = useCartStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="bg-primary text-primary-foreground">
        <div className="container-page flex h-10 items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="h-4 w-4" />
            Giao hỏa tốc nội thành Đà Nẵng – Nhận trong 1-2 tiếng
          </span>
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="hidden items-center gap-1.5 font-medium hover:underline sm:flex"
          >
            <Phone className="h-4 w-4" />
            {STORE_INFO.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <span className="text-lg font-bold">G</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-foreground">
              {STORE_INFO.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {STORE_INFO.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-[0.95rem] font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setOpenCart(true)}
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Mở menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetTitle className="mb-2 text-lg font-bold">
                {STORE_INFO.name}
              </SheetTitle>
              <nav className="mt-4 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 border-t pt-4">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Danh mục
                </p>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c}
                      href={`/san-pham?category=${encodeURIComponent(c)}`}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-secondary"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <Phone className="h-4 w-4" />
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}