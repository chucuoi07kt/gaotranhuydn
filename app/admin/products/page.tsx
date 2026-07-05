import { AdminShell } from '@/components/admin/admin-shell';
import { ProductsManager } from '@/components/admin/products-manager';
import { getProducts } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';

export const revalidate = 0;

export const metadata = { title: 'Sản phẩm – Admin Gạo Trần Huy' };

export default async function AdminProductsPage() {
  const products = await getProducts();
  return (
    <AdminShell>
      <ProductsManager
        initialProducts={products}
        categories={CATEGORIES as unknown as string[]}
      />
    </AdminShell>
  );
}
