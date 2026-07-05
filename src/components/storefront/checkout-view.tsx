'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Truck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart-store';
import { formatVND } from '@/lib/format';
import { SHIPPING_OPTIONS, PLACEHOLDER_IMAGE, STORE_INFO } from '@/lib/constants';
import { toast } from 'sonner';
import { toWebpUrl } from '@/lib/format';

const DA_NANG_DISTRICTS = [
  'Hòa Cường',
  'Hải Châu',
  'Thanh Khê',
  'Cẩm Lệ',
  'Sơn Trà',
  'Ngũ Hành Sơn',
  'Liên Chiểu',
  'Hòa Vang',
  'Khác',
];

export function CheckoutView() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());
  const [hydrated, setHydrated] = useState(false);
  const [shippingId, setShippingId] = useState('express');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    district: 'Hòa Cường',
    note: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setHydrated(true), []);

  const shipping =
    SHIPPING_OPTIONS.find((s) => s.id === shippingId) || SHIPPING_OPTIONS[0];
  const total = subtotal + shipping.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      toast.error('Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ.');
      return;
    }
    if (items.length === 0) {
      toast.error('Giỏ hàng trống.');
      return;
    }
    setSubmitting(true);
    const loadingToast = toast.loading('Đang gửi đơn hàng...');
    try {
      const payload = {
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          address: `${form.address}, ${form.district}, Đà Nẵng`,
          note: form.note,
        },
        shipping: {
          id: shipping.id,
          label: shipping.label,
          price: shipping.price,
        },
        items: items.map((i) => ({
          ...i,
          image: i.image ? i.image.replace('/upload/', '/upload/f_webp/') : i.image,
        })),
        total,
        createdAt: new Date().toISOString(),
      };
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (!res.ok || !data.ok) {
        toast.error(data.message || 'Gửi đơn hàng thất bại. Vui lòng gọi hotline.');
        return;
      }
      toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ xác nhận.');
      clear();
      router.push('/dat-hang-thanh-cong');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Có lỗi xảy ra. Vui lòng gọi hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <section className="container-page py-12">
        <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-xl bg-secondary" />
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-page py-12">
        <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">
            Giỏ hàng trống
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hãy thêm sản phẩm vào giỏ để thanh toán.
          </p>
          <Button asChild className="mt-6">
            <Link href="/san-pham">Khám phá sản phẩm</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-8">
      <Link
        href="/san-pham"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Tiếp tục mua sắm
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
        Giỏ hàng & Thanh toán
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Sản phẩm trong giỏ
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.weight}`}
                  className="flex gap-3 rounded-lg border bg-background p-3"
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
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quy cách: {item.weight}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.weight, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.weight, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-primary">
                          {formatVND(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.weight)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Thông tin giao hàng
            </h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    required
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, '') })
                    }
                    placeholder="0931 555 551"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="district">Khu vực (Đà Nẵng)</Label>
                  <select
                    id="district"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {DA_NANG_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                <Textarea
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Số nhà, tên đường, phường – mặc định Đà Nẵng"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="note"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Thời gian giao, lời nhắn..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Truck className="h-5 w-5 text-primary" />
              Phương thức giao hàng
            </h2>
            <div className="space-y-2">
              {SHIPPING_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    shippingId === opt.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={opt.id}
                    checked={shippingId === opt.id}
                    onChange={() => setShippingId(opt.id)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {opt.label}
                      </p>
                      <span className="text-sm font-semibold text-primary">
                        {opt.price === 0 ? 'Miễn phí' : formatVND(opt.price)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Đơn hàng
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-medium">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí giao hàng</span>
                <span className="font-medium">
                  {shipping.price === 0 ? 'Miễn phí' : formatVND(shipping.price)}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">
                  {formatVND(total)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-5 w-full gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>Đang gửi...</>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Xác nhận đặt hàng
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Hotline hỗ trợ: <span className="font-medium text-foreground">{STORE_INFO.phoneDisplay}</span>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}