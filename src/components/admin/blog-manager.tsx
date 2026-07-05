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
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { CloudinaryUploader } from './cloudinary-uploader';
import { RichTextEditor } from './rich-text-editor';
import { toWebpUrl, slugify } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { BlogPost } from '@/lib/types';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const EMPTY: BlogPost = {
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  author: 'Gạo Trần Huy',
  category: 'Tin tức',
  published: true,
};

export function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [posts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openAdd = () => {
    setEditing({ ...EMPTY });
    setOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing({ ...p });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề.');
      return;
    }
    const finalPost: BlogPost = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
    };
    const isEdit = posts.some((p) => p.id === finalPost.id);
    const toastId = toast.loading('Đang đồng bộ...');
    if (isEdit) {
      setPosts((prev) => prev.map((p) => (p.id === finalPost.id ? finalPost : p)));
    } else {
      setPosts((prev) => [finalPost, ...prev]);
    }
    setOpen(false);
    try {
      const url = isEdit
        ? `/api/admin/blog/${finalPost.id}`
        : '/api/admin/blog';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPost),
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (!res.ok || !data.ok) {
        setPosts(initialPosts);
        toast.error(data.message || 'Thất bại.');
      } else {
        if (!isEdit && data.data?.id) {
          setPosts((prev) =>
            prev.map((p) => (p.id === finalPost.id ? data.data : p))
          );
        }
        toast.success('Thành công.');
      }
    } catch (err) {
      toast.dismiss(toastId);
      setPosts(initialPosts);
      toast.error('Có lỗi xảy ra.');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const id = deleting.id;
    const snapshot = posts;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
    const toastId = toast.loading('Đang đồng bộ...');
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      const data = await res.json();
      toast.dismiss(toastId);
      if (!res.ok || !data.ok) {
        setPosts(snapshot);
        toast.error(data.message || 'Thất bại.');
      } else {
        toast.success('Đã xóa.');
      }
    } catch (err) {
      toast.dismiss(toastId);
      setPosts(snapshot);
      toast.error('Có lỗi xảy ra.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Bài viết</h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} bài viết – đồng bộ với Google Sheet
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm bài viết
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm bài viết..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead className="hidden md:table-cell">Danh mục</TableHead>
              <TableHead className="hidden sm:table-cell">Tác giả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[100px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Không có bài viết.
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="h-12 w-16 overflow-hidden rounded-md bg-secondary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toWebpUrl(p.image) || PLACEHOLDER_IMAGE}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {p.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{p.id}</p>
                  </TableCell>
                  <TableCell className="hidden text-xs md:table-cell">
                    {p.category}
                  </TableCell>
                  <TableCell className="hidden text-xs sm:table-cell">
                    {p.author}
                  </TableCell>
                  <TableCell>
                    {p.published ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Đã đăng
                      </Badge>
                    ) : (
                      <Badge variant="outline">Bản nháp</Badge>
                    )}
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
            Trang {current} / {totalPages} – {filtered.length} bài viết
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
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {posts.some((p) => p.id === editing?.id)
                ? 'Sửa bài viết'
                : 'Thêm bài viết'}
            </DialogTitle>
            <DialogDescription>
              Nội dung bài viết sẽ đồng bộ với Google Sheet.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="b-title">Tiêu đề *</Label>
                <Input
                  id="b-title"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="b-slug">Đường dẫn (slug)</Label>
                  <Input
                    id="b-slug"
                    value={editing.slug || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, slug: e.target.value })
                    }
                    placeholder="Tự sinh từ tiêu đề"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="b-category">Danh mục</Label>
                  <Input
                    id="b-category"
                    value={editing.category || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    placeholder="Tin tức, Hướng dẫn..."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="b-author">Tác giả</Label>
                <Input
                  id="b-author"
                  value={editing.author || ''}
                  onChange={(e) =>
                    setEditing({ ...editing, author: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="b-excerpt">Tóm tắt</Label>
                <Textarea
                  id="b-excerpt"
                  rows={2}
                  value={editing.excerpt || ''}
                  onChange={(e) =>
                    setEditing({ ...editing, excerpt: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Ảnh đại diện</Label>
                <CloudinaryUploader
                  value={editing.image}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Nội dung</Label>
                <RichTextEditor
                  value={editing.content}
                  onChange={(html) =>
                    setEditing({ ...editing, content: html })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(editing.published)}
                  onChange={(e) =>
                    setEditing({ ...editing, published: e.target.checked })
                  }
                  className="h-4 w-4 accent-primary"
                />
                Đăng bài (hiển thị trên site)
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
            <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa &quot;{deleting?.title}&quot; khỏi Google Sheet.
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