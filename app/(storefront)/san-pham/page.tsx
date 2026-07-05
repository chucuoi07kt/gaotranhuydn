import { ProductGrid } from '@/components/storefront/product-grid';
import { getProducts } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';

export const revalidate = 300;

export const metadata = {
  title: 'Sản phẩm – Gạo Trần Huy',
  description:
    'Tất cả sản phẩm Gạo Trần Huy: gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm Nhĩ NAM Ô, dầu lạc nguyên chất.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const products = await getProducts();
  const category = sp.category || '';
  const query = sp.q || '';

  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="container-page py-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Sản phẩm
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
            Tất cả sản phẩm
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gạo sạch, đặc sản, nước mắm Nhĩ NAM Ô – giao nhanh Đà Nẵng.
          </p>
        </div>
      </section>

      <ProductGrid
        products={products}
        categories={CATEGORIES as unknown as string[]}
        initialCategory={category}
        initialQuery={query}
      />
    </>
  );
}
