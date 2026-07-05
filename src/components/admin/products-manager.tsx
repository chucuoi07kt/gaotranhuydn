'use client';

import { useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { CloudinaryUploader } from './cloudinary-uploader';
import { formatVND, parseNumber, stripNonNumeric, toWebpUrl } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

interface Props {
  initialProducts: Product[];
  categories: string[];
}

const EMPTY: Product = {
  id: '',
  name: '',
  category: 'Gạo Phổ Thông – thơm dẻo vừa',
  price: 0,
  weight: '5kg',
  image: '',
  description: '',
  traits: '',
  origin: '',
  stock: 'Còn hàng',
  featured: false,
};

export function ProductsManager({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'all' || p.category === category;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [products, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openAdd = () => {
    setEditing({ ...EMPTY });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm.');
      return;
    }
    const isEdit = products.some((p) => p.id === editing.id);
    const toastId = toast.loading('Đang đồng bộ...');
    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? editing : p))
      );
    } else {
      setProducts((prev) => [editing, ...prev]);
    }
    setOpen(false);
    try {
      const url = isEdit
        ? `/api/admin/products/${editing.id}`
        : '/api/admin/products';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (!res.ok || !data.ok) {
        setProducts(initialProducts);
        toast.error(data.message || 'Thất bại.');
      } else {
        if (!isEdit && data.data?.id) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editing.id ? data.data : p))
          );
        }
        toast.success('Thành công.');
      }
    } catch (err) {
      toast.dismiss(toastId);
      setProducts(initialProducts);
      toast.error('Có lỗi xảy ra.');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const id = deleting.id;
    const snapshot = products;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
    const toastId = toast.loading('Đang đồng bộ...');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (!res.ok || !data.ok) {
        setProducts(snapshot);
        toast.error(data.message || 'Thất bại.');
      } else {
        toast.success('Đã xóa.');
      }
    } catch (err) {
      toast.dismiss(toastId);
      setProducts(snapshot);
      toast.error('Có lỗi xảy ra.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Sản phẩm</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} sản phẩm – đồng bộ với Google Sheet
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên hoặc mã..."
            className="pl-9"
          />
        </div>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-[280px]">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Ảnh</TableHead>
              <TableHead>Tên / Mã</TableHead>
              <TableHead className="hidden md:table-cell">Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead className="hidden sm:table-cell">Quy cách</TableHead>
              <TableHead className="hidden md:table-cell">Tồn kho</TableHead>
              <TableHead className="w-[100px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Không có sản phẩm.
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-secondary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toWebpUrl(p.image) || PLACEHOLDER_IMAGE}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="line-clamp-1 text-sm font-medium text-foreground">
                          {p.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{p.id}</p>
                      </div>
                      {p.featured && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3" />
                          Bán chạy
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-xs md:table-cell">
                    {p.category}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-primary">
                    {formatVND(p.price)}
                  </TableCell>
                  <TableCell className="hidden text-xs sm:table-cell">
                    {p.weight}
                  </TableCell>
                  <TableCell className="hidden text-xs md:table-cell">
                    {p.stock}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(p)}
                        aria-label="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(p)}
                        aria-label="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Trang {current} / {totalPages} – {filtered.length} sản phẩm
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={current === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={current === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {products.some((p) => p.id === editing?.id)
                ? 'Sửa sản phẩm'
                : 'Thêm sản phẩm'}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin sản phẩm. Tất cả các trường sẽ đồng bộ với Google Sheet.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="p-name">Tên sản phẩm *</Label>
                <Input
                  id="p-name"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="p-category">Danh mục</Label>
                  <Select
                    value={editing.category}
                    onValueChange={(v) =>
                      setEditing({ ...editing, category: v })
                    }
                  >
                    <SelectTrigger id="p-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="p-price">Giá (VNĐ) *</Label>
                  <Input
                    id="p-price"
                    inputMode="numeric"
                    value={
                      editing.price
                        ? new Intl.NumberFormat('vi-VN').format(editing.price)
                        : ''
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: parseNumber(e.target.value),
                      })
                    }
                    placeholder="VD: 95.000"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Tự động loại bỏ ký tự không phải số:{' '}
                    <code>{stripNonNumeric(String(editing.price || ''))}</code>
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="p-weight">Quy cách</Label>
                  <Input
                    id="p-weight"
                    value={editing.weight || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, weight: e.target.value })
                    }
                    placeholder="5kg, 10kg, 25kg..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="p-stock">Tồn kho</Label>
                  <Input
                    id="p-stock"
                    value={editing.stock || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, stock: e.target.value })
                    }
                    placeholder="Còn hàng / Hết hàng"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="p-traits">Tính chất</Label>
                  <Input
                    id="p-traits"
                    value={editing.traits || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, traits: e.target.value })
                    }
                    placeholder="Dẻo, thơm, mềm..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="p-origin">Nguồn gốc</Label>
                  <Input
                    id="p-origin"
                    value={editing.origin || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, origin: e.target.value })
                    }
                    placeholder="Sóc Trăng, ĐBSCL..."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-desc">Mô tả</Label>
                <Textarea
                  id="p-desc"
                  rows={3}
                  value={editing.description || ''}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Ảnh sản phẩm</Label>
                <CloudinaryUploader
                  value={editing.image}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(editing.featured)}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
                  }
                  className="h-4 w-4 accent-primary"
                />
                Đánh dấu là sản phẩm bán chạy (hiển thị ở trang chủ)
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa &quot;{deleting?.name}&quot; khỏi Google Sheet.
              Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}