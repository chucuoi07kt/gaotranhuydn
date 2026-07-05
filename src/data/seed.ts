import type { Product, BlogPost } from '@/lib/types';

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'ST25',
    name: 'Gạo ST25 – Gạo thơm nhất Việt Nam',
    category: 'Gạo Đặc Sản – Dẻo thơm',
    price: 95000,
    weight: '5kg',
    image:
      'https://images.pexels.com/photos/7421200/pexels-photo-7421200.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Gạo ST25 – giống gạo thơm nhất Việt Nam, hạt dài, dẻo, mềm, vị ngọt thanh. Trồng tại Sóc Trăng theo tiêu chuẩn VietGAP. Phù hợp nấu cơm gia đình, đãi khách.',
    traits: 'Dẻo, mềm, thơm ngát, hạt dài',
    origin: 'Sóc Trăng',
    stock: 'Còn hàng',
    featured: true,
  },
  {
    id: 'LAI-MIEN',
    name: 'Gạo Lài Miên – Thơm dẻo vừa',
    category: 'Gạo Phổ Thông – thơm dẻo vừa',
    price: 48000,
    weight: '5kg',
    image:
      'https://images.pexels.com/photos/7421201/pexels-photo-7421201.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Gạo Lài Miên – gạo phổ thông thơm dẻo vừa, hạt trong, cơm tơi, phù hợp dùng hàng ngày cho gia đình, quán ăn, nhà hàng.',
    traits: 'Thơm vừa, dẻo vừa, cơm tơi',
    origin: 'Campuchia / Việt Nam',
    stock: 'Còn hàng',
    featured: true,
  },
  {
    id: 'NEP-THAI',
    name: 'Gạo Nếp Thái – Dẻo thơm',
    category: 'Gạo Nếp – Gạo Lứt',
    price: 52000,
    weight: '5kg',
    image:
      'https://images.pexels.com/photos/7421202/pexels-photo-7421202.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Gạo nếp Thái – hạt tròn đều, dẻo thơm, dùng làm xôi, bánh chưng, bánh ít, các món lễ tết.',
    traits: 'Dẻo, thơm, hạt tròn',
    origin: 'Thái Lan',
    stock: 'Còn hàng',
    featured: false,
  },
  {
    id: 'LUT-DO',
    name: 'Gạo Lứt Đỏ – Ăn kiêng',
    category: 'Gạo Nếp – Gạo Lứt',
    price: 58000,
    weight: '5kg',
    image:
      'https://images.pexels.com/photos/7421203/pexels-photo-7421203.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Gạo lứt đỏ – giàu dinh dưỡng, chất xơ, phù hợp người ăn kiêng, người tiểu đường, giảm cân.',
    traits: 'Giòn, dẻo nhẹ, nhiều chất xơ',
    origin: 'An Giang',
    stock: 'Còn hàng',
    featured: false,
  },
  {
    id: 'GAO-QUE',
    name: 'Gạo Quê – Bình dân',
    category: 'Gạo Bình Dân – Gạo Quê',
    price: 32000,
    weight: '5kg',
    image:
      'https://images.pexels.com/photos/7421204/pexels-photo-7421204.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Gạo quê – gạo bình dân, cơm tơi, dẻo vừa, giá hợp lý, phù hợp gia đình, quán cơm, nhà bếp công nghiệp.',
    traits: 'Cơm tơi, dẻo vừa, giá rẻ',
    origin: 'Đồng bằng sông Cửu Long',
    stock: 'Còn hàng',
    featured: false,
  },
  {
    id: 'NAM-O',
    name: 'Nước Mắm Nhĩ NAM Ô – Nguyên chất',
    category: 'Nước Mắm Nhĩ NAM Ô – Dầu Lạc Nguyên Chất',
    price: 85000,
    weight: '500ml',
    image:
      'https://images.pexels.com/photos/7421205/pexels-photo-7421205.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Nước mắm nhĩ NAM Ô – nước mắm truyền thống Đà Nẵng, ủ chượp tự nhiên, vị mặn hậu, hậu ngọt, màu nâu cánh gián.',
    traits: 'Thơm, mặn hậu, hậu ngọt',
    origin: 'Đà Nẵng (NAM Ô)',
    stock: 'Còn hàng',
    featured: true,
  },
  {
    id: 'DAU-LAC',
    name: 'Dầu Lạc Nguyên Chất',
    category: 'Nước Mắm Nhĩ NAM Ô – Dầu Lạc Nguyên Chất',
    price: 78000,
    weight: '1 lít',
    image:
      'https://images.pexels.com/photos/7421206/pexels-photo-7421206.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Dầu lạc nguyên chất – ép thủ công, vị bùi, thơm đặc trưng, dùng xào, trộn gỏi, chấm phở.',
    traits: 'Thơm bùi, màu vàng óng',
    origin: 'Đà Nẵng',
    stock: 'Còn hàng',
    featured: false,
  },
  {
    id: 'GAO-THOM-DAO',
    name: 'Gạo Thơm Đào – Dẻo thơm',
    category: 'Gạo Đặc Sản – Dẻo thơm',
    price: 65000,
    weight: '5kg',
    image:
      'https://images.pexels.com/photos/7421207/pexels-photo-7421207.jpeg?auto=compress&cs=tinysrgb&w=900',
    description:
      'Gạo thơm Đào – hạt dài, dẻo, thơm nhẹ, cơm mềm, phù hợp nấu cơm gia đình, đãi khách.',
    traits: 'Thơm nhẹ, dẻo, mềm',
    origin: 'Đồng bằng sông Cửu Long',
    stock: 'Còn hàng',
    featured: false,
  },
];

export const SEED_BLOG: BlogPost[] = [
  {
    id: 'B001',
    title: 'Cách chọn gạo sạch, không pha tạp',
    slug: 'cach-chon-gao-sach',
    excerpt:
      'Hướng dẫn khách hàng cách nhận biết gạo sạch, không pha tạp, không tẩy trắng.',
    content:
      '<h2>Nhận biết gạo sạch</h2><p>Gạo sạch có màu trắng tự nhiên, không quá trắng sáng, hạt đều, không vụn nát. Khi nấu, cơm có mùi thơm nhẹ, dẻo, không dính bết.</p><h3>Dấu hiệu gạo pha tạp</h3><ul><li>Hạt gạo quá trắng, bóng bất thường</li><li>Có mùi lạ, mùi hóa chất</li><li>Cơm nấu xong nhão, không dẻo</li></ul>',
    image:
      'https://images.pexels.com/photos/7421200/pexels-photo-7421200.jpeg?auto=compress&cs=tinysrgb&w=900',
    author: 'Gạo Trần Huy',
    category: 'Hướng dẫn',
    published: true,
    createdAt: '2026-06-28T08:00:00.000Z',
  },
  {
    id: 'B002',
    title: 'Bảo quản gạo không bị mọt, ẩm mốc',
    slug: 'bao-quan-gao',
    excerpt:
      'Mẹo bảo quản gạo trong mùa mưa, tránh mọt, ẩm mốc, giữ gạo luôn thơm ngon.',
    content:
      '<h2>Bảo quản gạo đúng cách</h2><p>Để gạo ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Nên dùng hộp kín hoặc can nhựa có nắp đậy kín.</p><h3>Mẹo chống mọt</h2><ul><li>Đặt vài tép tỏi vào can gạo</li><li>Không trộn lẫn gạo mới và gạo cũ</li><li>Kiểm tra định kỳ mỗi 2 tuần</li></ul>',
    image:
      'https://images.pexels.com/photos/7421201/pexels-photo-7421201.jpeg?auto=compress&cs=tinysrgb&w=900',
    author: 'Gạo Trần Huy',
    category: 'Mẹo vặt',
    published: true,
    createdAt: '2026-06-15T08:00:00.000Z',
  },
  {
    id: 'B003',
    title: 'Gạo ST25 – Vì sao được gọi là gạo thơm nhất Việt Nam?',
    slug: 'gao-st25-thom-nhat-viet-nam',
    excerpt:
      'Tìm hiểu nguồn gốc, đặc điểm và cách nấu gạo ST25 sao cho dẻo thơm nhất.',
    content:
      '<h2>Gạo ST25 là gì?</h2><p>Gạo ST25 là giống lúa thơm do kỹ sư Hồ Quang Cua lai tạo tại Sóc Trăng. Gạo từng đạt giải "Gạo thơm nhất thế giới" tại Hội nghị Gạo thế giới năm 2017.</p><h3>Cách nấu ST25 dẻo thơm</h3><ul><li>Vo gạo nhẹ tay, không vo kỹ</li><li>Tỷ lệ nước 1:1.1 (1 chén gạo : 1.1 chén nước)</li><li>Ngâm gạo 15-20 phút trước khi nấu</li></ul>',
    image:
      'https://images.pexels.com/photos/7421202/pexels-photo-7421202.jpeg?auto=compress&cs=tinysrgb&w=900',
    author: 'Gạo Trần Huy',
    category: 'Tin tức',
    published: true,
    createdAt: '2026-06-05T08:00:00.000Z',
  },
];
