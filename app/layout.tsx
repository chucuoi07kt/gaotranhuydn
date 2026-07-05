import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Gạo Trần Huy – Cửa hàng gạo sạch Đà Nẵng',
  description:
    'Gạo Trần Huy – Cửa hàng gạo sạch, đặc sản và nước mắm Nhĩ NAM Ô tại Đà Nẵng. Giao hỏa tốc nội thành Đà Nẵng trong 1-2 tiếng.',
  keywords: [
    'gạo trần huy',
    'gạo đà nẵng',
    'gạo sạch',
    'gạo st25',
    'lài miên',
    'nước mắm nhĩ nam ô',
    'dầu lạc nguyên chất',
  ],
  openGraph: {
    title: 'Gạo Trần Huy – Cửa hàng gạo sạch Đà Nẵng',
    description:
      'Gạo sạch, đặc sản, nước mắm Nhĩ NAM Ô. Giao hỏa tốc nội thành Đà Nẵng trong 1-2 tiếng.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
