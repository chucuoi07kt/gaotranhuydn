import Link from 'next/link';
import { ArrowRight, Wheat, Sparkles, Sprout, Coffee, Droplets, Package } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

const ICONS = [Wheat, Sparkles, Sprout, Coffee, Droplets, Package];

export function HomeCategories() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Danh mục sản phẩm
          </p>
          <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
            Mua theo nhu cầu của bạn
          </h2>
        </div>
        <Link
          href="/san-pham"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          return (
            <Link
              key={cat}
              href={`/san-pham?category=${encodeURIComponent(cat)}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/70 bg-card p-4 text-center transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium leading-tight text-foreground">
                {cat}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}