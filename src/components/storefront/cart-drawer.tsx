'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart-store';
import { formatVND } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Giỏ hàng của bạn
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? 'Giỏ hàng đang trống.'
              : `${items.length} sản phẩm trong giỏ.`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Giỏ hàng trống</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Hãy thêm sản phẩm để tiếp tục.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/san-pham">Khám phá sản phẩm</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.weight}`}
                  className="flex gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || PLACEHOLDER_IMAGE}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId, item.weight)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Xóa"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Quy cách: {item.weight}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.weight,
                              item.quantity - 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-secondary"
                          aria-label="Giảm"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.weight,
                              item.quantity + 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-secondary"
                          aria-label="Tăng"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-5">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-lg font-bold text-foreground">
                  {formatVND(subtotal)}
                </span>
              </div>
              <Separator className="mb-4" />
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" onClick={() => setOpen(false)}>
                  <Link href="/gio-hang">Thanh toán</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}