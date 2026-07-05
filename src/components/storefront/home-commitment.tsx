import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const ITEMS = [
  {
    icon: Truck,
    title: 'Giao hỏa tốc 1-2 tiếng',
    desc: 'Nội thành Đà Nẵng – Hòa Cường, Hải Châu, Thanh Khê, Cẩm Lệ, Sơn Trà, Ngũ Hành Sơn.',
  },
  {
    icon: ShieldCheck,
    title: 'Gạo sạch – không pha tạp',
    desc: 'Gạo được kiểm tra nguồn gốc, không tẩy trắng, không pha tạp, an toàn cho gia đình.',
  },
  {
    icon: RefreshCw,
    title: 'Đổi trả trong ngày',
    desc: 'Đổi trả miễn phí trong ngày nếu gạo bị mọt, ẩm mốc, vỡ bao.',
  },
  {
    icon: Headphones,
    title: 'Tư vấn 7:00 – 20:00',
    desc: 'Gọi điện hoặc nhắn Zalo để được tư vấn chọn gạo phù hợp.',
  },
];

export function HomeCommitment() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Cam kết Gạo Trần Huy
          </p>
          <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
            Phục vụ tận tâm – Giao nhanh Đà Nẵng
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}