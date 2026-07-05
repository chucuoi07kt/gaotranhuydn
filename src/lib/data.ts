import 'server-only';

import { fetchSheetRows, mapRowByHeaders } from './sheets';
import { SEED_PRODUCTS, SEED_BLOG } from '@/data/seed';
import type { Product, BlogPost } from './types';
import { toWebpUrl, parseNumber } from './format';

const PRODUCT_FIELD_MAP: Record<string, string[]> = {
  id: ['id', 'ma', 'mã'],
  name: ['ten', 'tên', 'name', 'tensanpham', 'tên_sp'],
  category: ['danhmuc', 'danh_muc', 'category', 'loai', 'loại'],
  price: ['gia', 'giá', 'price', 'giaban', 'giá_bán'],
  weight: ['quycach', 'quy_cach', 'weight', 'khoiluong', 'khối_lượng'],
  image: ['hinh', 'hình', 'image', 'anh', 'ảnh', 'url_hinh'],
  description: ['mota', 'mô_tả', 'description', 'mo_ta'],
  traits: ['tinhchat', 'tính_chất', 'traits', 'dacdiem', 'đặc_điểm'],
  origin: ['nguongoc', 'nguồn_gốc', 'origin', 'xuatxu', 'xuất_xứ'],
  stock: ['tonkho', 'tồn_kho', 'stock', 'soluong', 'số_lượng'],
  featured: ['noibat', 'nổi_bật', 'featured', 'banchay', 'bán_chạy'],
};

const BLOG_FIELD_MAP: Record<string, string[]> = {
  id: ['id', 'ma', 'mã'],
  title: ['tieude', 'tiêu_đề', 'title', 'ten', 'tên'],
  slug: ['slug', 'duongdan', 'đường_dẫn'],
  excerpt: ['mota', 'mô_tả', 'excerpt', 'tomtat', 'tóm_tắt'],
  content: ['noidung', 'nội_dung', 'content', 'baiviet'],
  image: ['hinh', 'hình', 'image', 'anh', 'ảnh'],
  author: ['tacgia', 'tác_giả', 'author'],
  category: ['danhmuc', 'danh_muc', 'category', 'chude', 'chủ_đề'],
  published: ['trangthai', 'trạng_thái', 'published', 'congkhai'],
  createdAt: ['ngaydang', 'ngày_đăng', 'createdat', 'ngaytao', 'ngày_tạo'],
  updatedAt: ['ngaycapnhat', 'ngày_cập_nhật', 'updatedat'],
};

function normalizeProduct(row: Record<string, string>): Product {
  const mapped = mapRowByHeaders(row, PRODUCT_FIELD_MAP);
  return {
    id: mapped.id || `P${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    name: mapped.name || 'Sản phẩm',
    category: mapped.category || 'Sản phẩm khác',
    price: parseNumber(mapped.price),
    weight: mapped.weight || '5kg',
    image: toWebpUrl(mapped.image) || undefined,
    description: mapped.description || undefined,
    traits: mapped.traits || undefined,
    origin: mapped.origin || undefined,
    stock: mapped.stock || 'Còn hàng',
    featured:
      ['true', '1', 'yes', 'có', 'co', 'banchay'].includes(
        String(mapped.featured || '').toLowerCase().trim()
      ),
  };
}

function normalizeBlog(row: Record<string, string>): BlogPost {
  const mapped = mapRowByHeaders(row, BLOG_FIELD_MAP);
  return {
    id: mapped.id || `B${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    title: mapped.title || 'Bài viết',
    slug: mapped.slug || undefined,
    excerpt: mapped.excerpt || undefined,
    content: mapped.content || undefined,
    image: toWebpUrl(mapped.image) || undefined,
    author: mapped.author || 'Gạo Trần Huy',
    category: mapped.category || 'Tin tức',
    published:
      ['true', '1', 'yes', 'có', 'co', 'đăng', 'dang'].includes(
        String(mapped.published || '').toLowerCase().trim()
      ),
    createdAt: mapped.createdAt || undefined,
    updatedAt: mapped.updatedAt || undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { rows } = await fetchSheetRows('sp');
    if (!rows.length) return SEED_PRODUCTS;
    return rows
      .map(normalizeProduct)
      .filter((p) => p.name && p.name !== 'Sản phẩm');
  } catch (err) {
    console.warn('[data] getProducts fallback to seed:', err);
    return SEED_PRODUCTS;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { rows } = await fetchSheetRows('blog');
    if (!rows.length) return SEED_BLOG;
    return rows
      .map(normalizeBlog)
      .filter((b) => b.title && b.title !== 'Bài viết');
  } catch (err) {
    console.warn('[data] getBlogPosts fallback to seed:', err);
    return SEED_BLOG;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((b) => b.slug === slug || b.id === slug);
}
