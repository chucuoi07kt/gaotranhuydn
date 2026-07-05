# Gạo Trần Huy – Hướng dẫn CMS & Đồng bộ Google Sheet

Tài liệu này hướng dẫn cách:

1. Cấu hình biến môi trường cho CMS Admin.
2. Triển khai Google Apps Script làm webhook nhận CRUD từ Next.js API.
3. Kết nối URL webhook vào dự án để đồng bộ 2 chiều với Google Sheet.

---

## 1. Cấu hình biến môi trường

Tạo file `.env.local` ở thư mục gốc của dự án (đã có mẫu `.env.local.example`):

```bash
# Mật khẩu đăng nhập /admin/login
ADMIN_PASSWORD=admin123

# URL Web App Google Apps Script (làm ở bước 2)
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec

# (Tuỳ chọn) Telegram bot để nhận thông báo đơn hàng
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Khởi động lại `npm run dev` sau khi thay đổi `.env.local`.

Đăng nhập admin tại: `http://localhost:3000/admin/login` với mật khẩu `ADMIN_PASSWORD`.

---

## 2. Google Sheet chuẩn bị

Spreadsheet đã tạo sẵn:
`https://docs.google.com/spreadsheets/d/10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA/edit`

Tạo 2 tab (sheet) có tên chính xác:

- Tab `sp` – Sản phẩm. Hàng đầu tiên là header. Các cột đề xuất:
  `id | ten | danhmuc | gia | quycach | hinh | mota | tinhchat | nguongoc | tonkho | noibat`
- Tab `blog` – Bài viết. Hàng đầu tiên là header. Các cột đề xuất:
  `id | tieude | slug | mota | noidung | hinh | tacgia | danhmuc | trangthai`

> Việc đặt tên cột **không bắt buộc chính xác** – Apps Script và Next.js API
> đều map theo header (order-independent). Hãy giữ tên header gợi ý để
> đồng bộ tự động.

---

## 3. Triển khai Google Apps Script (Webhook receiver)

### Bước 3.1. Mở Apps Script

1. Mở Google Sheet ở trên.
2. Menu **Extensions → Apps Script**.
3. Xóa code mặc định trong `Code.gs`, dán toàn bộ code bên dưới.

### Bước 3.2. Code `Code.gs`

```javascript
/**
 * Gạo Trần Huy – Webhook receiver cho đồng bộ 2 chiều với Google Sheet.
 * Nhận POST { tab, action, payload } từ Next.js API và ghi/xóa dòng tương ứng.
 *
 * Tab "sp"   -> sản phẩm
 * Tab "blog" -> bài viết
 *
 * Mapping cột (order-independent): dựa vào header của sheet.
 */

const SHEET_TABS = { sp: 'sp', blog: 'blog' };

const FIELD_ALIASES = {
  sp: {
    id: ['id', 'ma', 'mã'],
    name: ['ten', 'tên', 'name', 'tensanpham'],
    category: ['danhmuc', 'danh_muc', 'category', 'loai'],
    price: ['gia', 'giá', 'price', 'giaban'],
    weight: ['quycach', 'quy_cach', 'weight', 'khoiluong'],
    image: ['hinh', 'hình', 'image', 'anh', 'ảnh'],
    description: ['mota', 'mô_tả', 'description', 'mo_ta'],
    traits: ['tinhchat', 'tính_chất', 'traits', 'dacdiem'],
    origin: ['nguongoc', 'nguồn_gốc', 'origin', 'xuatxu'],
    stock: ['tonkho', 'tồn_kho', 'stock', 'soluong'],
    featured: ['noibat', 'nổi_bật', 'featured', 'banchay'],
  },
  blog: {
    id: ['id', 'ma', 'mã'],
    title: ['tieude', 'tiêu_đề', 'title', 'ten'],
    slug: ['slug', 'duongdan'],
    excerpt: ['mota', 'mô_tả', 'excerpt', 'tomtat'],
    content: ['noidung', 'nội_dung', 'content', 'baiviet'],
    image: ['hinh', 'hình', 'image', 'anh', 'ảnh'],
    author: ['tacgia', 'tác_giả', 'author'],
    category: ['danhmuc', 'danh_muc', 'category', 'chude'],
    published: ['trangthai', 'trạng_thái', 'published', 'congkhai'],
  },
};

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function getSheet(tab) {
  const name = SHEET_TABS[tab] || tab;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function getHeaderMap(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return { headers: [], map: {} };
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map = {};
  headers.forEach((h, idx) => {
    const norm = normalizeHeader(h);
    if (norm) map[norm] = idx + 1; // 1-based column
  });
  return { headers, map };
}

function resolveColumn(headerMap, tab, field) {
  const aliases = (FIELD_ALIASES[tab] || {})[field] || [field];
  for (const a of aliases) {
    const norm = normalizeHeader(a);
    if (headerMap.map[norm] != null) return headerMap.map[norm];
  }
  return -1;
}

function ensureHeaders(sheet, tab) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    const fields = Object.keys(FIELD_ALIASES[tab] || {});
    const headers = fields.map((f) => f);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return getHeaderMap(sheet);
  }
  return getHeaderMap(sheet);
}

function rowToPayload(sheet, rowIndex, headerMap, tab) {
  const lastCol = Math.max(headerMap.headers.length, 1);
  const values = sheet.getRange(rowIndex, 1, 1, lastCol).getValues()[0];
  const out = {};
  Object.keys(FIELD_ALIASES[tab] || {}).forEach((field, idx) => {
    const col = resolveColumn(headerMap, tab, field);
    out[field] = col > 0 ? values[col - 1] : '';
  });
  return out;
}

function findRowById(sheet, id, headerMap, tab) {
  const idCol = resolveColumn(headerMap, tab, 'id');
  if (idCol < 1) return -1;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2; // +2: header + 1-based
  }
  return -1;
}

function writeRow(sheet, rowIndex, headerMap, tab, payload) {
  const lastCol = Math.max(headerMap.headers.length, 1);
  const row = new Array(lastCol).fill('');
  Object.keys(payload).forEach((field) => {
    const col = resolveColumn(headerMap, tab, field);
    if (col > 0) row[col - 1] = payload[field];
  });
  // Nếu cột id chưa có trong sheet, ghi vào cột đầu tiên
  const idCol = resolveColumn(headerMap, tab, 'id');
  if (idCol < 1) row[0] = payload.id;
  sheet.getRange(rowIndex, 1, 1, lastCol).setValues([row]);
}

function appendRow(sheet, headerMap, tab, payload) {
  const lastRow = sheet.getLastRow();
  const targetRow = lastRow + 1;
  writeRow(sheet, targetRow, headerMap, tab, payload);
  return targetRow;
}

function doAdd(tab, payload) {
  const sheet = getSheet(tab);
  const headerMap = ensureHeaders(sheet, tab);
  if (!payload.id) {
    payload.id = 'P' + Date.now().toString(36).toUpperCase();
  }
  appendRow(sheet, headerMap, tab, payload);
  return { ok: true, id: payload.id };
}

function doEdit(tab, payload) {
  const sheet = getSheet(tab);
  const headerMap = ensureHeaders(sheet, tab);
  const row = findRowById(sheet, payload.id, headerMap, tab);
  if (row < 0) {
    // Không tìm thấy -> tạo mới
    return doAdd(tab, payload);
  }
  writeRow(sheet, row, headerMap, tab, payload);
  return { ok: true, id: payload.id };
}

function doDelete(tab, payload) {
  const sheet = getSheet(tab);
  const headerMap = ensureHeaders(sheet, tab);
  const row = findRowById(sheet, payload.id, headerMap, tab);
  if (row < 0) return { ok: true, message: 'Không tìm thấy dòng.' };
  sheet.deleteRow(row);
  return { ok: true };
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const tab = body.tab === 'sp' || body.tab === 'blog' ? body.tab : 'sp';
    const action = body.action;
    const payload = body.payload || {};

    let result;
    if (action === 'add') result = doAdd(tab, payload);
    else if (action === 'edit') result = doEdit(tab, payload);
    else if (action === 'delete') result = doDelete(tab, payload);
    else result = { ok: false, message: 'Hành động không hợp lệ.' };

    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: 'Gạo Trần Huy webhook đang chạy.' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### Bước 3.3. Triển khai thành Web App

1. Trong trình soạn Apps Script, bấm **Deploy → New deployment**.
2. Chọn loại **Web app**.
3. Cấu hình:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Bấm **Deploy**. Cấp quyền truy cập Google Sheet khi được hỏi.
5. Sao chép **Web app URL** có dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`

### Bước 3.4. Cấu hình vào Next.js

Dán URL trên vào `.env.local`:

```bash
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

Khởi động lại `npm run dev`. Mọi thao tác Add/Edit/Delete trong
`/admin/products` và `/admin/blog` sẽ tự động gửi POST tới webhook này,
webhook sẽ ghi/xóa dòng tương ứng trong Google Sheet.

---

## 4. Kiểm tra đồng bộ

1. Mở `/admin/products`, bấm **Thêm sản phẩm**, điền thông tin và Lưu.
2. Mở Google Sheet tab `sp` – sẽ thấy dòng mới xuất hiện với các cột
   được map đúng theo header.
3. Sửa/xóa trong CMS – dòng tương ứng trong Sheet cũng được cập nhật/xóa.
4. Đổi tên cột trong Sheet (ví dụ `ten` → `tên sản phẩm`) – CMS vẫn map
   đúng vì map theo alias không phân biệt thứ tự cột.

---

## 5. Cấu trúc dự án

```
app/
  page.tsx                      # Trang chủ (storefront)
  san-pham/page.tsx             # Danh sách sản phẩm
  san-pham/[id]/page.tsx        # Chi tiết sản phẩm
  bai-viet/page.tsx             # Danh sách bài viết
  bai-viet/[slug]/page.tsx      # Chi tiết bài viết
  gio-hang/page.tsx             # Giỏ hàng + thanh toán
  lien-he/page.tsx              # Liên hệ
  dat-hang-thanh-cong/page.tsx  # Trang cảm ơn
  admin/
    layout.tsx                  # Auth guard
    login/page.tsx              # Đăng nhập
    products/page.tsx           # CMS sản phẩm
    blog/page.tsx               # CMS bài viết
  api/
    checkout/route.ts           # POST đơn hàng -> Telegram placeholder
    products/route.ts           # GET sản phẩm (đọc Sheet)
    blog/route.ts               # GET bài viết (đọc Sheet)
    admin/login/route.ts        # POST đăng nhập
    admin/logout/route.ts       # POST đăng xuất
    admin/products/route.ts     # POST tạo sản phẩm -> webhook
    admin/products/[id]/route.ts# PUT/DELETE sản phẩm -> webhook
    admin/blog/route.ts         # POST tạo bài viết -> webhook
    admin/blog/[id]/route.ts    # PUT/DELETE bài viết -> webhook
src/
  components/
    storefront/                  # Header, Footer, CartDrawer, ProductCard...
    admin/                       # AdminShell, ProductsManager, BlogManager...
    ui/                          # shadcn/ui components
  lib/
    constants.ts                 # STORE_INFO, CATEGORIES, CLOUDINARY...
    types.ts                     # Product, BlogPost, CartItem...
    format.ts                    # formatVND, slugify, toWebpUrl, generateId
    cloudinary.ts                # uploadToCloudinary (unsigned)
    sheets.ts                    # Đọc Google Sheet (CSV export)
    sheet-sync.ts                # POST tới Google Apps Script webhook
    admin-auth.ts                # Cookie session, verify ADMIN_PASSWORD
    data.ts                      # getProducts / getBlogPosts (đọc Sheet)
  data/seed.ts                   # Dữ liệu mẫu khi Sheet trống
  store/cart-store.ts            # Zustand + localStorage
```

---

## 6. Cloudinary

- Cloud Name: `f9krxetg`
- Upload Preset (unsigned): `gaotranhuy`
- Ảnh tải lên tự động chuyển sang `.webp` qua `toWebpUrl()` trong `src/lib/format.ts`.
- Nếu ảnh lỗi hoặc trống, hiển thị ảnh placeholder SVG.

---

## 7. Telegram (tuỳ chọn)

Để nhận thông báo đơn hàng qua Telegram:

1. Tạo bot qua **@BotFather**, lấy `TELEGRAM_BOT_TOKEN`.
2. Nhắn tin cho bot, lấy `chat_id` qua **@userinfobot**.
3. Thêm 2 biến vào `.env.local`:

```bash
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=987654321
```

Nếu chưa cấu hình, đơn hàng vẫn được ghi nhận (log ra console server) –
không ảnh hưởng đến trải nghiệm khách hàng.
