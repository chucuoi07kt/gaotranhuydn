import { NextResponse } from 'next/server';
import { verifyAdminLogin, setAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { ok: false, message: 'Vui lòng nhập mật khẩu.' },
        { status: 400 }
      );
    }
    const ok = await verifyAdminLogin(String(password));
    if (!ok) {
      return NextResponse.json(
        { ok: false, message: 'Sai mật khẩu.' },
        { status: 401 }
      );
    }
    await setAdminSession();
    return NextResponse.json({ ok: true, message: 'Đăng nhập thành công.' });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Có lỗi xảy ra.' },
      { status: 500 }
    );
  }
}
