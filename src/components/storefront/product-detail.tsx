'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, MapPin, MessageCircle, Phone, ShoppingCart, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart-store';
import { formatVND, toWebpUrl } from '@/lib/format';
import { PLACEHOLDER_IMAGE, STORE_INFO, WEIGHT_OPTIONS } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { toast } from 'sonner';

export function ProductDetail({ product }: { product: Product }) {
  const [weight, setWeight] = useState(product.weight || '5kg');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const basePrice = product.price;
  const weightOption = WEIGHT_OPTIONS.find((w) => w.value === weight);
  const unitPrice = weightOption
    ? Math.round((basePrice * weightOption.multiplier) / 1)
    : basePrice;
  const total = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: unitPrice,
      image: toWebpUrl(product.image),
      weight,
      quantity,
      category: product.category,
    });
    toast.success('Đã thêm vào giỏ hàng');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setOpen(false);
    window.location.href = '/gio-hang';
  };

  const zaloMsg = encodeURIComponent(
    `Chào Gạo Trần Huy, tôi muốn đặt: ${product.name} (${weight} x ${quantity}). Giá: ${formatVND(total)}`
  );

  return (
    <section className="container-page py-6 md:py-10">
      <Link
        href="/san-pham"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại sản phẩm
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={toWebpUrl(product.image) || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
          {product.featured && (
            <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
              Bán chạy
            </Badge>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {product.name}
          </h1>
          {product.traits && (
            <p className="mt-2 text-sm text-muted-foreground">
              {product.traits}
            </p>
          )}

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatVND(unitPrice)}
            </span>
            <span className="text-sm text-muted-foreground">/ {weight}</span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Quy cách (khối lượng)
              </p>
              <div className="flex flex-wrap gap-2">
                {WEIGHT_OPTIONS.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setWeight(w.value)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      weight === w.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/40'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
                {product.weight &&
                  !WEIGHT_OPTIONS.find((w) => w.value === product.weight) && (
                    <button
                      onClick={() => setWeight(product.weight!)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        weight === product.weight
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:border-primary/40'
                      }`}
                    >
                      {product.weight}
                    </button>
                  )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Số lượng</p>
              <div className="inline-flex items-center rounded-lg border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-secondary"
                  aria-label="Giảm"
                >
                  –
                </button>
                <span className="w-12 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:bg-secondary"
                  aria-label="Tăng"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/60 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-lg font-bold text-primary">
                  {formatVND(total)}
                </span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                size="lg"
                className="gap-2 bg-[#0068FF] hover:bg-[#0057d9]"
                asChild
              >
                <a
                  href={`${STORE_INFO.zalo}?${zaloMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Mua ngay qua Zalo
                </a>
              </Button>
              <Button
                size="lg"
                variant="default"
                className="gap-2"
                onClick={handleBuyNow}
              >
                <ShoppingCart className="h-4 w-4" />
                Đặt giao tận nhà
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Thêm vào giỏ hàng
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                <span className="font-medium text-foreground">Giao hỏa tốc: </span>
                <span className="text-muted-foreground">
                  Nội thành Đà Nẵng – nhận trong 1-2 tiếng.
                </span>
              </p>
            </div>
            {product.origin && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  <span className="font-medium text-foreground">Nguồn gốc: </span>
                  <span className="text-muted-foreground">{product.origin}</span>
                </p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                <span className="font-medium text-foreground">Cam kết: </span>
                <span className="text-muted-foreground">
                  Gạo sạch, không pha tạp, đổi trả trong ngày nếu lỗi.
                </span>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="text-muted-foreground hover:text-primary"
              >
                Hotline: <span className="font-medium text-foreground">{STORE_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {product.description && (
        <div className="mt-10 rounded-xl border bg-card p-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Mô tả sản phẩm</h2>
          <div className="prose-content text-sm leading-relaxed text-muted-foreground">
            <p>{product.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}