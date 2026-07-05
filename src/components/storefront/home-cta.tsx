import Link from 'next/link';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STORE_INFO } from '@/lib/constants';

export function HomeCta() {
  return (
    <section className="container-page pb-16">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Cần gạo gấp? Giao trong 1-2 tiếng!
            </h2>
            <p className="mt-2 max-w-xl text-primary-foreground/85">
              Gọi ngay cho Gạo Trần Huy – chúng tôi giao hỏa tốc tận nhà tại Đà Nẵng.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <a href={`tel:${STORE_INFO.phone}`}>
                <Phone className="h-4 w-4" />
                {STORE_INFO.phoneDisplay}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/san-pham">Đặt gạo online</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}