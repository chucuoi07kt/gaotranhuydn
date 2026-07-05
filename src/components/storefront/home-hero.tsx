import Link from 'next/link';
import { ArrowRight, Phone, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STORE_INFO } from '@/lib/constants';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-secondary/60 via-background to-background">
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div className="animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Cửa hàng gạo sạch Đà Nẵng
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Gạo sạch <span className="text-primary">Gạo Trần Huy</span> – Giao hỏa tốc nội thành Đà Nẵng
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Cung cấp gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm Nhĩ
            NAM Ô và dầu lạc nguyên chất. Cam kết gạo sạch, không pha tạp, giao
            nhanh trong 1-2 tiếng tại Đà Nẵng.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/san-pham">
                Mua gạo ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href={`tel:${STORE_INFO.phone}`}>
                <Phone className="h-4 w-4" />
                {STORE_INFO.phoneDisplay}
              </a>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border bg-card p-3">
              <Truck className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-1 text-xs font-semibold">Giao 1-2 tiếng</p>
              <p className="text-[11px] text-muted-foreground">Nội thành Đà Nẵng</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <ShieldCheck className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-1 text-xs font-semibold">Gạo sạch</p>
              <p className="text-[11px] text-muted-foreground">Không pha tạp</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <Phone className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-1 text-xs font-semibold">Tư vấn</p>
              <p className="text-[11px] text-muted-foreground">7:00 – 20:00</p>
            </div>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-secondary shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.pexels.com/photos/7421200/pexels-photo-7421200.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Kho gạo sạch Gạo Trần Huy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border bg-card p-4 shadow-lg md:block">
            <p className="text-xs text-muted-foreground">Bán chạy nhất</p>
            <p className="text-sm font-bold text-foreground">Gạo ST25 & Lài Miên</p>
            <p className="text-xs text-primary">Dẻo thơm – Giao nhanh</p>
          </div>
        </div>
      </div>
    </section>
  );
}