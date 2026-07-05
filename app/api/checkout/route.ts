import { NextResponse } from 'next/server';
import { STORE_INFO } from '@/lib/constants';
import type { CheckoutPayload } from '@/lib/types';

export const runtime = 'nodejs';

function buildTelegramMessage(payload: CheckoutPayload): string {
  const lines: string[] = [];
  lines.push('🛒 *ĐƠN HÀNG MỚI – GẠO TRẦN HUY*');
  lines.push('');
  lines.push(`👤 *Khách:* ${payload.customer.fullName}`);
  lines.push(`📞 *SĐT:* ${payload.customer.phone}`);
  lines.push(`📍 *Địa chỉ:* ${payload.customer.address}`);
  if (payload.customer.note) lines.push(`📝 *Ghi chú:* ${payload.customer.note}`);
  lines.push('');
  lines.push('🛍 *Sản phẩm:*');
  payload.items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.name} – ${item.weight} x${item.quantity} = ${new Intl.NumberFormat(
        'vi-VN'
      ).format(item.price * item.quantity)}₫`
    );
  });
  lines.push('');
  lines.push(`🚚 *Giao hàng:* ${payload.shipping.label}`);
  lines.push(`💵 *Tổng cộng:* ${new Intl.NumberFormat('vi-VN').format(payload.total)}₫`);
  lines.push(`🕒 *Thời gian:* ${new Date(payload.createdAt).toLocaleString('vi-VN')}`);
  return lines.join('\n');
}

async function sendTelegram(payload: CheckoutPayload): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return false;
  try {
    const text = buildTelegramMessage(payload);
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as CheckoutPayload;
    if (!payload?.customer?.fullName || !payload?.customer?.phone || !payload?.customer?.address) {
      return NextResponse.json(
        { ok: false, message: 'Thiếu thông tin khách hàng.' },
        { status: 400 }
      );
    }
    if (!payload?.items?.length) {
      return NextResponse.json(
        { ok: false, message: 'Giỏ hàng trống.' },
        { status: 400 }
      );
    }

    let sent = false;
    try {
      sent = await sendTelegram(payload);
    } catch {
      sent = false;
    }
    if (!sent) {
      console.log('[checkout] New order (webhook placeholder):', JSON.stringify(payload, null, 2));
    }

    return NextResponse.json({
      ok: true,
      message: 'Đơn hàng đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận.',
      orderId: `DH${Date.now().toString(36).toUpperCase()}`,
      sentToWebhook: sent,
      hotline: STORE_INFO.phone,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
