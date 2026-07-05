export const STORE_INFO = {
  name: 'Gạo Trần Huy',
  tagline: 'Gạo sạch Đà Nẵng – Giao hỏa tốc nội thành',
  phone: '0931555551',
  phoneDisplay: '0931 555 551',
  address: '26 Cầm Bá Thước, Phường Hòa Cường, TP. Đà Nẵng',
  facebook:
    'https://www.facebook.com/profile.php?id=100065591225457',
  googleMap: 'https://maps.app.goo.gl/vUsPQygeY7wXxC1E6?g_st=ic',
  zalo: 'https://zalo.me/0931555551',
  email: 'lienhe@gaotranhuy.vn',
  workingHours: '7:00 – 20:00 (T2 – CN)',
} as const;

export const CATEGORIES = [
  'Gạo Bình Dân – Gạo Quê',
  'Gạo Đặc Sản – Dẻo thơm',
  'Gạo Nếp – Gạo Lứt',
  'Gạo Phổ Thông – thơm dẻo vừa',
  'Nước Mắm Nhĩ NAM Ô – Dầu Lạc Nguyên Chất',
  'Sản phẩm khác',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const WEIGHT_OPTIONS = [
  { value: '5kg', label: '5 kg', multiplier: 1 },
  { value: '10kg', label: '10 kg', multiplier: 2 },
  { value: '25kg', label: '25 kg', multiplier: 4.5 },
] as const;

export const SHIPPING_OPTIONS = [
  {
    id: 'express',
    label: 'Giao hỏa tốc nội thành Đà Nẵng (Nhận trong 1-2 tiếng)',
    price: 25000,
    description: 'Giao nhanh trong 1-2 tiếng tại các quận Hòa Cường, Hải Châu, Thanh Khê, Cẩm Lệ, Sơn Trà, Ngũ Hành Sơn.',
  },
  {
    id: 'standard',
    label: 'Giao tiêu chuẩn (Trong ngày)',
    price: 15000,
    description: 'Giao trong ngày tại Đà Nẵng và các khu vực lân cận.',
  },
  {
    id: 'pickup',
    label: 'Nhận tại cửa hàng (26 Cầm Bá Thước, Hòa Cường)',
    price: 0,
    description: 'Quý khách đến nhận trực tiếp tại cửa hàng.',
  },
] as const;

export const CLOUDINARY = {
  cloudName: 'f9krxetg',
  uploadPreset: 'gaotranhuy',
} as const;

export const GOOGLE_SHEETS = {
  spreadsheetId: '10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA',
  tabs: {
    products: 'sp',
    blog: 'blog',
  },
} as const;

export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmMCIvPjxwYXRoIGQ9Ik0yMDAgMTQwYTMwIDMwIDAgMSAwIDAgNjAgMzAgMzAgMCAwIDAgMC02MHoiIGZpbGw9IiM3ZGJmNjAiLz48cGF0aCBkPSJNMTIwIDI4MHEwLTM0IDQwLTY0aDgwcTM2IDMwIDM2IDY0IiBmaWxsPSIjN2RiZjYwIi8+PC9zdmc+';
