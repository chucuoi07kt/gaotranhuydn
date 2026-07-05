import { HomeHero } from '@/components/storefront/home-hero';
import { HomeCategories } from '@/components/storefront/home-categories';
import { HomeTopSellers } from '@/components/storefront/home-top-sellers';
import { HomeCommitment } from '@/components/storefront/home-commitment';
import { HomeLatestNews } from '@/components/storefront/home-latest-news';
import { HomeCta } from '@/components/storefront/home-cta';
import { getProducts, getBlogPosts } from '@/lib/data';

export const revalidate = 300;

export default async function Home() {
  const [products, posts] = await Promise.all([
    getProducts(),
    getBlogPosts(),
  ]);
  return (
    <>
      <HomeHero />
      <HomeCategories />
      <HomeTopSellers products={products} />
      <HomeCommitment />
      <HomeLatestNews posts={posts.slice(0, 3)} />
      <HomeCta />
    </>
  );
}
