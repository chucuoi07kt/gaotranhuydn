import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/storefront/product-detail';
import { ProductCard } from '@/components/storefront/product-card';
import { getProducts, getProductById } from '@/lib/data';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'Sản phẩm – Gạo Trần Huy' };
  return {
    title: `${product.name} – Gạo Trần Huy`,
    description: product.description || product.traits || product.name,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const all = await getProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="container-page py-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Sản phẩm cùng danh mục
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
