import Link from 'next/link';
import { CheckCircle2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STORE_INFO } from '@/lib/constants';

export const metadata = { title: 'Đặt hàng thành công – Gạo Trần Huy' };

export default function SuccessPage() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cảm ơn quý khách đã đặt hàng tại Gạo Trần Huy. Chúng tôi sẽ liên hệ
          xác nhận trong ít phút. Nếu cần gấp, vui lòng gọi hotline.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild size="lg">
            <a href={`tel:${STORE_INFO.phone}`}>
              <Phone className="h-4 w-4" />
              Gọi hotline: {STORE_INFO.phoneDisplay}
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/san-pham">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
