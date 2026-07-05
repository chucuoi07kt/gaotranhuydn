import 'server-only';

export type SyncAction = 'add' | 'edit' | 'delete';

export interface SyncResult {
  ok: boolean;
  message?: string;
}

export async function syncToSheet(
  tab: 'sp' | 'blog',
  action: SyncAction,
  payload: Record<string, unknown> | object
): Promise<SyncResult> {
  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      `[sheet-sync] GOOGLE_APPS_SCRIPT_WEBHOOK_URL not set. Skipping ${action} on ${tab}.`
    );
    return {
      ok: true,
      message: 'Webhook chưa cấu hình – ghi nhận cục bộ.',
    };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab, action, payload }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { ok: false, message: `Webhook trả về ${res.status}` };
    }
    const data = await res.json().catch(() => ({}));
    if (data && data.ok === false) {
      return { ok: false, message: data.message || 'Webhook báo lỗi.' };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : 'Không thể kết nối webhook.',
    };
  }
}
