export function formatVND(amount: number): string {
  if (!Number.isFinite(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function stripNonNumeric(value: string | number): string {
  return String(value ?? '').replace(/[^\d]/g, '');
}

export function parseNumber(value: string | number): number {
  const cleaned = stripNonNumeric(value);
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
}

export function slugify(input: string): string {
  return String(input ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function generateId(prefix = 'P'): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.floor(Math.random() * 1000)
    .toString(36)
    .toUpperCase()
    .padStart(2, '0');
  return `${prefix}${ts}${rand}`;
}

export function toWebpUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace(
    /\/upload\/(v\d+\/)?/,
    '/upload/f_webp,q_auto/$1'
  );
}

export function safeImage(url?: string, fallback?: string): string {
  if (!url) return fallback ?? '';
  return url;
}

export function formatDate(
  input: string | Date | undefined,
  opts: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
): string {
  if (!input) return '';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN', opts).format(d);
}
