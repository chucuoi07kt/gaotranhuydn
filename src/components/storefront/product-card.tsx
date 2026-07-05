'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { formatVND, toWebpUrl } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: toWebpUrl(product.image),
      weight: product.weight || '5kg',
      quantity: 1,
      category: product.category,
    });
  };

  return (
    <Link
      href={`/san-pham/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={toWebpUrl(product.image) || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.featured && (
          <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground shadow-sm">
            Bán chạy
          </Badge>
        )}
        {product.stock && product.stock !== 'Còn hàng' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
              Hết hàng
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-primary">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {product.name}
        </h3>
        {product.traits && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {product.traits}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-base font-bold text-primary">
              {formatVND(product.price)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              / {product.weight || '5kg'}
            </p>
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full"
            onClick={handleQuickAdd}
            aria-label="Thêm vào giỏ"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}