import Link from 'next/link';
import { Facebook, MapPin, Phone, Clock, Mail } from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-secondary/40">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-lg font-bold">G</span>
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{STORE_INFO.name}</p>
              <p className="text-xs text-muted-foreground">{STORE_INFO.tagline}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Cửa hàng gạo sạch, gạo đặc sản, nước mắm Nhĩ NAM Ô và dầu lạc nguyên
            chất tại Đà Nẵng. Phục vụ tận tâm, giao nhanh nội thành.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Danh mục</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/san-pham?category=${encodeURIComponent(c)}`}
                  className="transition-colors hover:text-primary"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Liên hệ</p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{STORE_INFO.address}</span>
            </li>
            <li>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {STORE_INFO.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              {STORE_INFO.workingHours}
            </li>
            <li>
              <a
                href={STORE_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Facebook className="h-4 w-4 shrink-0 text-primary" />
                Facebook Gạo Trần Huy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Cam kết</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Gạo sạch, không pha tạp, không tẩy trắng.</li>
            <li>Giao hỏa tốc nội thành Đà Nẵng trong 1-2 tiếng.</li>
            <li>Đổi trả trong ngày nếu gạo bị mọt, ẩm mốc.</li>
            <li>Giá hợp lý, nguồn gốc rõ ràng.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 bg-background">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
          </p>
          <p>
            Hotline: <span className="font-medium text-foreground">{STORE_INFO.phoneDisplay}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}