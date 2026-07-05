import { Facebook, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { STORE_INFO } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Liên hệ – Gạo Trần Huy' };

export default function ContactPage() {
  return (
    <section className="container-page py-10">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        Liên hệ Gạo Trần Huy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cửa hàng gạo sạch Đà Nẵng – giao hỏa tốc nội thành 1-2 tiếng.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Thông tin liên hệ
          </h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Địa chỉ</p>
                <p className="text-muted-foreground">{STORE_INFO.address}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Hotline / Zalo</p>
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="text-primary hover:underline"
                >
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Giờ làm việc</p>
                <p className="text-muted-foreground">{STORE_INFO.workingHours}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Facebook className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Facebook</p>
                <a
                  href={STORE_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Gạo Trần Huy
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <a href={`tel:${STORE_INFO.phone}`}>
                <Phone className="h-4 w-4" />
                Gọi điện
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={STORE_INFO.googleMap} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4" />
                Xem bản đồ
              </a>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card">
          <iframe
            title="Bản đồ Gạo Trần Huy"
            src="https://www.google.com/maps?q=26+C%C3%A0m+B%C3%A1+Th%E1%BB%A9c,+H%C3%B2a+C%C6%B0%E1%BB%9Dng,+%C4%90%C3%A0+N%E1%BA%B5ng&output=embed"
            className="h-full min-h-[320px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
