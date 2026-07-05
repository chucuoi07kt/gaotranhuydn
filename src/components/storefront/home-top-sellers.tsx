import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './product-card';
import type { Product } from '@/lib/types';

export function HomeTopSellers({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const list = featured.length > 0 ? featured : products.slice(0, 8);

  if (list.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-12 md:py-16">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Bán chạy nhất
            </p>
            <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
              Gạo ST25, Lài Miên & đặc sản
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Các sản phẩm được khách hàng Đà Nẵng tin dùng.
            </p>
          </div>
          <Link
            href="/san-pham"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}